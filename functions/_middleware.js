// Older deployments published repo internals from output/ (.github, .wrangler). After a redeploy
// Pages can keep serving a cached copy of them at the apex, so answer 404 for these paths here.
// output/_routes.json sends only these paths and /api/* to Functions; everything else stays static.
const BLOCKED = [/^\/\.github(\/|$)/, /^\/\.wrangler(\/|$)/];

export async function onRequest({ request, next }) {
  const { pathname } = new URL(request.url);
  if (BLOCKED.some((re) => re.test(pathname))) {
    return new Response("Not found", {
      status: 404,
      headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
    });
  }
  return next();
}
