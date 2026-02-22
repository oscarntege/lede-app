export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, whatsapp, business, date } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "name and email are required" });
  }

  const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE   = process.env.AIRTABLE_TABLE || "Signups";

  if (!AIRTABLE_API_KEY || !AIRTABLE_BASE_ID) {
    console.error("Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID in environment variables");
    return res.status(500).json({ error: "Airtable is not configured on the server" });
  }

  try {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Name:       name,
          Email:      email,
          WhatsApp:   whatsapp  || "",
          Business:   business  || "",
          SignedUpAt: date      || new Date().toISOString(),
          Source:     "LEDE App",
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Airtable returned an error:", JSON.stringify(data));
      return res.status(500).json({
        error: data.error?.message || "Airtable write failed",
        details: data,
      });
    }

    console.log("Contact saved to Airtable successfully. Record ID:", data.id);
    return res.status(200).json({ success: true, id: data.id });

  } catch (err) {
    console.error("Unexpected error in /api/track:", err);
    return res.status(500).json({ error: err.message });
  }
}
