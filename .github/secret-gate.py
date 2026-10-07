#!/usr/bin/env python3
"""secret-gate: refuse to publish a directory that contains secrets or files that must not be public.

Usage: secret-gate DIR [--warn-only] [--checkout]
Exit 0 clean (warnings may be printed), 2 blocked. Values are never printed, only file, rule and the last 4 chars.
Run it on the exact directory handed to `wrangler pages deploy` (the staging copy, not the repo)."""
import os, re, sys

BLOCK_NAMES = re.compile(r"""(?ix)^(?:
    \.env(?:\.[\w.-]+)? | \.dev\.vars | \.git-credentials | \.netrc | \.npmrc | \.pypirc | \.pgpass | \.git | \.htpasswd | \.bash_history | \.zsh_history |
    id_(?:rsa|ed25519|ecdsa|dsa) | [\w.-]+\.(?:pem|key|p12|pfx|jks|keystore|kdbx) |
    [\w.-]*credentials[\w.-]*\.json | service[-_]?account[\w.-]*\.json | tokens\.tsv |
    [\w.-]+\.(?:sql|sqlite3?|db|dump|bak|old|orig|swp) | wp-config\.php | \.htpasswd | \.vault[\w.-]*
)$""")
SAFE_NAMES = re.compile(r"(?i)^\.env\.(?:example|sample|template|dist)$")
WARN_NAMES = re.compile(r"(?i)^(?:[\w.-]+\.(?:sh|py|rb|php|ps1|toml|ya?ml|ini|cfg|conf|log|tsv|csv|map)|deploy[\w.-]*|Makefile|Dockerfile|package(?:-lock)?\.json|composer\.json)$")
ALLOWED_DOTS = {".well-known", ".nojekyll"}
HARMLESS_DOTFILES = {".DS_Store", ".gitkeep", ".keep", ".gitattributes"}
BLOCK_DOTDIRS = re.compile(r"(?i)^\.(?:git|ssh|aws|gnupg|config|claude|codex|infisical|vercel|netlify|terraform|docker|kube|azure|gcloud|secrets?)$")
WARN_OK_FILES = {"_headers", "_redirects", "_routes.json", "robots.txt", "sitemap.xml", "manifest.json", "site.webmanifest", "llms.txt", "ads.txt", "security.txt", "browserconfig.xml"}

BLOCK = [
    ("private-key", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
    ("telegram-bot-token", re.compile(r"\b\d{8,10}:AA[A-Za-z0-9_-]{33}\b")),
    ("github-token", re.compile(r"\b(?:github_pat_[A-Za-z0-9_]{60,}|gh[pousr]_[A-Za-z0-9]{36,})\b")),
    ("anthropic-key", re.compile(r"\bsk-ant-[A-Za-z0-9_-]{30,}")),
    ("openai-key", re.compile(r"\bsk-(?:proj|svcacct)-[A-Za-z0-9_-]{30,}")),
    ("openrouter-key", re.compile(r"\bsk-or-v1-[0-9a-f]{64}\b")),
    ("google-oauth-secret", re.compile(r"\bGOCSPX-[A-Za-z0-9_-]{24,}")),
    ("google-refresh-token", re.compile(r"\b1//0[A-Za-z0-9_-]{60,}")),
    ("aws-key-id", re.compile(r"\bAKIA[0-9A-Z]{16}\b")),
    ("stripe-secret", re.compile(r"\b(?:sk|rk)_live_[0-9A-Za-z]{20,}")),
    ("stripe-webhook", re.compile(r"\bwhsec_[A-Za-z0-9]{24,}")),
    ("resend-key", re.compile(r"\bre_[A-Za-z0-9]{8}_[A-Za-z0-9]{16,}")),
    ("sendgrid-key", re.compile(r"\bSG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}\b")),
    ("slack-token", re.compile(r"\bxox[abprs]-[A-Za-z0-9-]{20,}")),
    ("npm-token", re.compile(r"\bnpm_[A-Za-z0-9]{36}\b")),
    ("dockerhub-token", re.compile(r"\bdckr_pat_[A-Za-z0-9_-]{20,}")),
    ("age-secret", re.compile(r"AGE-SECRET-KEY-1[0-9A-Z]{58}")),
    ("supabase-pat", re.compile(r"\bsbp_[0-9a-f]{40}\b")),
    ("infisical-token", re.compile(r"\bst\.[A-Za-z0-9-]{20,}\.[A-Za-z0-9]{20,}\.[A-Za-z0-9]{20,}")),
    ("url-credentials", re.compile(r"(?i)\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|smtps?|imaps?|ftp)://[^\s:/@'\"]{1,64}:[^\s@/'\"$]{6,}@")),
    ("git-url-token", re.compile(r"https://(?:[^\s/@:]+:)?(?:gh[pousr]_|github_pat_)[A-Za-z0-9_]{30,}@")),
    ("turnstile-secret", re.compile(r"(?i)turnstile[_-]?secret[\w-]*['\"]?\s*[:=]\s*['\"]0x4AAAAAAA[A-Za-z0-9_-]{20,}")),
]
WARN = [
    ("google-api-key (public if restricted)", re.compile(r"\bAIza[0-9A-Za-z_-]{35}\b")),
    ("jwt (check: anon/public?)", re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{20,}")),
]
SECRET_ASSIGN = re.compile(r"""(?ix)\b(?P<k>[A-Z0-9_]*(?:API_KEY|_TOKEN|SECRET(?:_KEY)?|PASSWORD|_PASS|ACCESS_KEY|GLOBAL_KEY|PRIVATE_KEY|CLIENT_SECRET))\b
    ['"]?\s*[:=]\s*['"]?(?P<v>[A-Za-z0-9_\-+/=.]{16,})""")
SECRET_ASSIGN_QUOTED = re.compile(r"""(?ix)\b(?P<k>[A-Z0-9_]*(?:API_KEY|_TOKEN|SECRET(?:_KEY)?|PASSWORD|_PASS|ACCESS_KEY|GLOBAL_KEY|PRIVATE_KEY|CLIENT_SECRET))\b
    ['"]?\s*[:=]\s*(?P<q>['"`])(?P<v>[A-Za-z0-9_\-+/=.]{16,})(?P=q)""")
CODE_EXT = (".js", ".mjs", ".cjs", ".ts", ".tsx", ".jsx", ".vue", ".astro", ".json", ".map")
PLACEHOLDER = re.compile(r"(?i)example|your|xxx|changeme|placeholder|dummy|test|sample|^0x4AAAAAAA[A-Za-z0-9_-]{14}$")
TEXT_EXT = re.compile(r"(?i)\.(?:html?|js|mjs|cjs|css|json|txt|xml|md|ya?ml|toml|ini|cfg|conf|env|sh|py|php|map|svg|ts|tsx|jsx|vue|astro|webmanifest|csv|tsv|log)$|^[^.]+$")

def tail(v):
    return "…" + v[-4:] if len(v) >= 12 else f"({len(v)}ch)"

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    warn_only = "--warn-only" in sys.argv
    # --checkout: DIR is a CI checkout deployed with wrangler, which never uploads .git/ (default ignore list)
    checkout = "--checkout" in sys.argv
    if not args or not os.path.isdir(args[0]):
        print("usage: secret-gate DIR [--warn-only] [--checkout]", file=sys.stderr); return 2
    root = os.path.abspath(args[0])
    blocks, warns, nfiles = [], [], 0
    for d, dirs, files in os.walk(root):
        rel_d = os.path.relpath(d, root)
        for x in list(dirs):
            relx = os.path.normpath(os.path.join(rel_d, x)) + "/"
            if x == "node_modules":
                blocks.append((relx, "node_modules in deploy dir", "")); dirs.remove(x); continue
            if checkout and rel_d == "." and x in (".git", ".github"):
                dirs.remove(x); continue
            if x.startswith(".") and x not in ALLOWED_DOTS:
                if BLOCK_DOTDIRS.match(x):
                    blocks.append((relx, "sensitive dot-directory in deploy dir", ""))
                else:
                    warns.append((relx, "dot-directory is public", ""))
                dirs.remove(x)
        for f in files:
            rel = os.path.normpath(os.path.join(rel_d, f)); p = os.path.join(d, f); nfiles += 1
            if BLOCK_NAMES.match(f) and not SAFE_NAMES.match(f):
                blocks.append((rel, "credential/backup file name", ""))
            elif f.startswith(".") and f not in ALLOWED_DOTS and f not in HARMLESS_DOTFILES:
                warns.append((rel, "dotfile is public", ""))
            elif False:
                blocks.append((rel, "credential/backup file name", ""))
            elif WARN_NAMES.match(f) and f not in WARN_OK_FILES and not rel.startswith(".well-known"):
                warns.append((rel, "source/config file is public", ""))
            if not TEXT_EXT.search(f):
                continue
            try:
                if os.path.getsize(p) > 25_000_000: continue
                with open(p, "rb") as fh: raw = fh.read()
            except OSError:
                continue
            if b"\x00" in raw[:4096]: continue
            t = raw.decode("utf-8", "ignore")
            for name, rx in BLOCK:
                for m in rx.finditer(t):
                    v = m.group(0)
                    if PLACEHOLDER.search(v): continue
                    blocks.append((rel, name, tail(v))); break
            for name, rx in WARN:
                m = rx.search(t)
                if m: warns.append((rel, name, tail(m.group(0))))
            if not f.lower().endswith((".html", ".htm", ".css", ".svg")):
                rx_assign = SECRET_ASSIGN_QUOTED if f.lower().endswith(CODE_EXT) else SECRET_ASSIGN
                for m in rx_assign.finditer(t):
                    v = m.group("v")
                    if PLACEHOLDER.search(v) or len(set(v)) < 8 or re.fullmatch(r"[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)+", v) or re.fullmatch(r"[A-Z0-9_]+", v): continue
                    blocks.append((rel, f"secret-like assignment {m.group('k')}", tail(v))); break
    for rel, why, t in warns[:40]:
        print(f"secret-gate WARN  {rel}: {why} {t}".rstrip(), file=sys.stderr)
    if len(warns) > 40: print(f"secret-gate WARN  … {len(warns)-40} more", file=sys.stderr)
    for rel, why, t in blocks[:60]:
        print(f"secret-gate BLOCK {rel}: {why} {t}".rstrip(), file=sys.stderr)
    if blocks:
        print(f"secret-gate: {len(blocks)} blocking finding(s) in {nfiles} files under {root}. Deploy refused."
              " Remove the files/values (secrets belong in Infisical / CF env vars), then rerun.", file=sys.stderr)
        return 0 if warn_only else 2
    print(f"secret-gate: clean ({nfiles} files, {len(warns)} warning(s)) {root}", file=sys.stderr)
    return 0

if __name__ == "__main__":
    sys.exit(main())
