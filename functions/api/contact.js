// Cloudflare Pages Function — /api/contact
// Sends via Resend (FROM info@cryptolicenses.net → TO info@goldblum.ch)
// Parallel Telegram notification (when TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID are set)
//
// Required env vars (Cloudflare Pages → Settings → Environment variables):
//   RESEND_API_KEY       — Resend API key
//   TELEGRAM_BOT_TOKEN   — optional
//   TELEGRAM_CHAT_ID     — optional

// --- attribution-layer v1.0.0 (inlined; do not import) — see ROLLBACK.md ---
// Additive: never throws, never blocks delivery; '' when snippet absent.
function classifyChannel(t) {
  if (t.gclid || t.gbraid || t.wbraid) return 'Google Ads';
  if (t.msclkid) return 'Microsoft Ads';
  if (t.ttclid) return 'TikTok Ads';
  if (t.li_fat_id) return 'LinkedIn Ads';
  if (t.fbclid) return 'Meta (Facebook/Instagram)';
  if (t.source || t.medium) return (t.source || '?') + ' / ' + (t.medium || '?');
  if (t.referrer) { try { return 'Referral: ' + new URL(t.referrer).hostname; } catch (e) { return 'Referral'; } }
  return 'Direct';
}
function readAttribution(body) {
  try {
    if (!body) return '';
    const g = (k) => { const v = body[k]; return v == null ? '' : ('' + v).slice(0, 300); };
    const ft = { source: g('af_ft_source'), medium: g('af_ft_medium'), campaign: g('af_ft_campaign'), gclid: g('af_ft_gclid'), gbraid: g('af_ft_gbraid'), wbraid: g('af_ft_wbraid'), fbclid: g('af_ft_fbclid'), msclkid: g('af_ft_msclkid'), ttclid: g('af_ft_ttclid'), li_fat_id: g('af_ft_li_fat_id'), referrer: g('af_ft_referrer'), landing: g('af_ft_landing'), ts: g('af_ft_ts') };
    const lt = { source: g('af_lt_source'), medium: g('af_lt_medium'), campaign: g('af_lt_campaign'), referrer: g('af_lt_referrer'), landing: g('af_lt_landing'), ts: g('af_lt_ts') };
    const pages = g('af_pages_viewed'), visit = g('af_session_count'), current = g('af_current_url');
    const anyFt = ft.source || ft.medium || ft.campaign || ft.gclid || ft.gbraid || ft.wbraid || ft.fbclid || ft.msclkid || ft.ttclid || ft.li_fat_id || ft.referrer || ft.landing;
    const anyLt = lt.source || lt.medium || lt.referrer || lt.landing;
    if (!anyFt && !anyLt && !pages && !visit) return '';
    const date = (iso) => iso ? iso.slice(0, 10) : '';
    const L = ['— Attribution —'];
    let f = 'First touch: ' + classifyChannel(ft);
    if (ft.campaign) f += ' · campaign "' + ft.campaign + '"';
    if (ft.ts) f += ' · ' + date(ft.ts);
    L.push(f);
    const fs = []; if (ft.landing) fs.push('landing ' + ft.landing); if (ft.referrer) fs.push('ref ' + ft.referrer);
    if (fs.length) L.push('  ' + fs.join(' · '));
    let l = 'Last touch: ' + classifyChannel(lt);
    if (lt.campaign) l += ' · campaign "' + lt.campaign + '"';
    if (lt.ts) l += ' · ' + date(lt.ts);
    L.push(l);
    const ls = []; if (lt.landing) ls.push('landing ' + lt.landing); if (lt.referrer) ls.push('ref ' + lt.referrer);
    if (ls.length) L.push('  ' + ls.join(' · '));
    const ss = []; if (pages) ss.push(pages + ' page' + (pages === '1' ? '' : 's')); if (visit) ss.push('visit #' + visit); if (current) ss.push('on ' + current);
    if (ss.length) L.push('Session: ' + ss.join(' · '));
    return L.join('\n');
  } catch (e) { return ''; }
}

const ALLOWED_ORIGINS = ['https://cryptolicenses.net', 'https://cryptolicenses-net.pages.dev'];

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const headers = corsHeaders(request.headers.get('origin') || '');

  let data = {};
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      data = await request.json();
    } else {
      const fd = await request.formData();
      for (const [k, v] of fd.entries()) data[k] = v;
    }
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Invalid request body' }), { status: 400, headers });
  }

  // Honeypot
  if (data._honey) {
    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const token = data['cf-turnstile-response'] || '';
    if (!token) return new Response(JSON.stringify({ success: false, error: 'Captcha missing' }), { status: 400, headers });
    try {
      const tsBody = new FormData();
      tsBody.append('secret', env.TURNSTILE_SECRET_KEY);
      tsBody.append('response', token);
      const ip = request.headers.get('CF-Connecting-IP');
      if (ip) tsBody.append('remoteip', ip);
      const tsResp = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: tsBody });
      const tsData = await tsResp.json();
      if (!tsData.success) return new Response(JSON.stringify({ success: false, error: 'Captcha verification failed' }), { status: 400, headers });
    } catch (e) {
      console.error('Turnstile verify error:', e);
      return new Response(JSON.stringify({ success: false, error: 'Captcha unavailable' }), { status: 500, headers });
    }
  }

  const firstName = (data.first_name || '').trim();
  const lastName = (data.last_name || '').trim();
  const fullName = [firstName, lastName].filter(Boolean).join(' ');
  const email = (data.email || '').trim();
  const company = (data.company || '').trim();
  const service = (data.service || '').trim();
  const jurisdiction = (data.jurisdiction || '').trim();
  const budget = (data.budget || '').trim();
  const message = (data.message || '').trim();
  const pageUrl = (data.page_url || '').trim();

  if (!email || !message) {
    return new Response(JSON.stringify({ success: false, error: 'Email and message are required.' }), { status: 400, headers });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ success: false, error: 'Please enter a valid email address.' }), { status: 400, headers });
  }

  if (!env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return new Response(JSON.stringify({ success: false, error: 'Server configuration error.' }), { status: 500, headers });
  }

  const subject = fullName
    ? `New enquiry: ${fullName}${company ? ` — ${company}` : ''}`
    : `New enquiry from ${email}`;

  // Attribution (additive — never blocks delivery; '' when snippet absent).
  const attrBlock = readAttribution(data);

  const textBody = [
    'Source: cryptolicenses.net',
    `Page: ${pageUrl || '—'}`,
    '',
    `Name: ${fullName || '—'}`,
    `Email: ${email}`,
    `Company: ${company || '—'}`,
    `Service: ${service || '—'}`,
    `Jurisdiction: ${jurisdiction || '—'}`,
    `Budget: ${budget || '—'}`,
    '',
    'Message:',
    message,
    ...(attrBlock ? ['', attrBlock] : []),
  ].join('\n');

  // --- Resend ---
  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'CryptoLicenses <info@cryptolicenses.net>',
      to: ['info@goldblum.ch'],
      reply_to: email,
      subject,
      text: textBody,
    }),
  });

  if (!resendRes.ok) {
    const errBody = await resendRes.text();
    console.error('Resend error:', resendRes.status, errBody);
    return new Response(JSON.stringify({ success: false, error: 'Failed to send your message. Please try again or email us directly.' }), { status: 502, headers });
  }

  // --- Telegram (parallel, non-fatal) ---
  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    const tgText = [
      '📩 New CryptoLicenses Enquiry',
      '',
      `Name: ${fullName || '—'}`,
      `Email: ${email}`,
      `Company: ${company || '—'}`,
      `Service: ${service || '—'}`,
      `Jurisdiction: ${jurisdiction || '—'}`,
      `Budget: ${budget || '—'}`,
      `Page: ${pageUrl || '—'}`,
      '',
      `Message: ${message.length > 500 ? message.slice(0, 500) + '…' : message}`,
      ...(attrBlock ? ['', attrBlock] : []),
    ].join('\n');

    context.waitUntil(
      fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: tgText }),
      }).catch(err => console.error('Telegram error:', err))
    );
  }

  return new Response(JSON.stringify({ success: true }), { status: 200, headers });
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(context.request.headers.get('origin') || ''),
  });
}
