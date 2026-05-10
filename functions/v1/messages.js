// Cloudflare Pages Function — Anthropic API 프록시
// API 키는 Cloudflare Secret (ANTHROPIC_API_KEY) 에서만 읽음
export async function onRequestPost(context) {
    const apiKey = context.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key not configured' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const body = await context.request.text();

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
