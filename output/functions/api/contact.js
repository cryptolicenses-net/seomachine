export async function onRequestPost(context) {
  const { request } = context;

  try {
    const body = await request.json();
    const { first_name, last_name, email, company, service, jurisdiction, budget, message, page_url } = body;

    if (!first_name || !email || !message) {
      return Response.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const name = `${first_name} ${last_name || ''}`.trim();
    const sourceUrl = page_url || 'Unknown page';

    // Telegram
    const BOT_TOKEN = '8668223825:AAH1LdPXGIXMkNI-gkkG0WmCdFNrs_W90xc';
    const CHAT_ID   = '165281748';

    const tgLines = [
      '\uD83D\uDD14 New Lead \u2014 CryptoLicenses.net',
      '',
      `\uD83D\uDC64 Name: ${name}`,
      `\uD83D\uDCE7 Email: ${email}`,
      company      ? `\uD83C\uDFE2 Company: ${company}`          : '',
      service      ? `\u2699\uFE0F Service: ${service}`          : '',
      jurisdiction ? `\uD83C\uDF0D Jurisdiction: ${jurisdiction}` : '',
      budget       ? `\uD83D\uDCB0 Budget: ${budget}`             : '',
      '',
      `\uD83D\uDCDD Message:\n${message}`,
      '',
      `\uD83D\uDD17 Source: ${sourceUrl}`,
    ].filter(Boolean).join('\n');

    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text: tgLines }),
    });

    // Email via MailChannels (free Cloudflare Workers integration)
    try {
      const textBody = [
        `New lead — CryptoLicenses.net`,
        ``,
        `Name:         ${name}`,
        `Email:        ${email}`,
        `Company:      ${company || '-'}`,
        `Service:      ${service || '-'}`,
        `Jurisdiction: ${jurisdiction || '-'}`,
        `Budget:       ${budget || '-'}`,
        ``,
        `Message:`,
        message,
        ``,
        `Source: ${sourceUrl}`,
      ].join('\n');

      const mcResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: 'info@cryptolicenses.net', name: 'CryptoLicenses.net' }],
            reply_to: { email: email, name: name },
          }],
          from: { email: 'noreply@cryptolicenses.net', name: 'CryptoLicenses Form' },
          subject: `New lead: ${name} — ${service || 'Consultation'}`,
          content: [{ type: 'text/plain', value: textBody }],
        }),
      });

      if (!mcResponse.ok) {
        const errText = await mcResponse.text();
        console.error('MailChannels error:', mcResponse.status, errText);
      }
    } catch (emailErr) {
      console.error('Email send error:', String(emailErr));
    }

    return Response.json({ success: true }, { headers: { 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    return Response.json({ success: false, error: String(err) }, { status: 500, headers: { 'Access-Control-Allow-Origin': '*' } });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
