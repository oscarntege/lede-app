module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;

  if (!anthropicKey) return res.status(500).json({ error: "API key missing" });

  const { payload, contact, businessName } = req.body;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (resendKey && contact?.email) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "LEDE <oscar@ledehq.com>",
          to: contact.email,
          subject: `Your LEDE Strategy for ${businessName} is ready`,
          html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:2rem;">
            <h1 style="color:#00E5A0;">Your strategy is ready, ${contact.name}.</h1>
            <p>You just took the first step that most business owners never take. You found your real USP.</p>
            <p>Log back into <a href="https://ledehq.com">ledehq.com</a> any time to access your full strategy.</p>
            <p>Over the next few days I will send you implementation tips, real case studies, and an invite to my monthly live workshop where we push your strategy further together.</p>
            <p>If you want to move faster, reply to this email or WhatsApp me directly at +256701690711.</p>
            <p style="margin-top:2rem;">To your story,<br/><strong>Oscar Ntege</strong><br/>The Story Alchemist<br/>Brand 4:44</p>
          </div>`,
        }),
      });

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "LEDE Leads <onboarding@resend.dev>",
          to: "dimesmaker@gmail.com",
          subject: `New LEDE Lead: ${businessName}`,
          html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:2rem;">
            <h2>New lead just came in.</h2>
            <p><strong>Name:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>WhatsApp:</strong> ${contact.whatsapp || "Not provided"}</p>
            <p><strong>Business:</strong> ${businessName}</p>
            <p>Log into <a href="https://supabase.com/dashboard/project/snluesxlcnqkgsvaexzp">Supabase</a> to see their full answers.</p>
          </div>`,
        }),
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
```

Now we also need to update App.jsx to send the contact details to the API. Go to github.com/oscarntege/lede-app/blob/main/src/App.jsx

Click pencil. Press Ctrl+F. Search for this.
```
body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
```

Replace the entire body section with this.
```
body: JSON.stringify({
        payload: {
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: msg }],
        },
        contact: contact,
        businessName: answers.business_name,
      }),
