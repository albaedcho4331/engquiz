export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/v1/messages' && request.method === 'POST') {
      const apiKey = env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key not configured' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const body = await request.text();
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body,
      });

      const data = await res.text();
      return new Response(data, {
        status: res.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return env.ASSETS.fetch(request);
  }
};
