// api/track.js
// Drop this file into your api/ folder alongside generate.js, weekly.js, story.js
//
// HOW TO SET UP AIRTABLE (free, 5 minutes):
// 1. Go to airtable.com — create a free account
// 2. Create a new Base called "LEDE Signups"
// 3. Rename the default table to "Signups"
// 4. Add these columns: Name (text), Email (text), WhatsApp (text), Business (long text), SignedUpAt (text), Source (text)
// 5. Go to airtable.com/create/tokens — create a Personal Access Token
//    Give it: data.records:write scope, access to your "LEDE Signups" base
// 6. In Vercel dashboard → your project → Settings → Environment Variables, add:
//    AIRTABLE_PAT  = your token (starts with pat...)
//    AIRTABLE_BASE_ID = your base ID (find it in your base URL: airtable.com/appXXXXXXXX/...)
// 7. Redeploy. Every signup now appears in your Airtable instantly.

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")    return res.status(405).json({ error: "Method not allowed" });

  const { name, email, whatsapp, business, date } = req.body || {};

  const pat      = process.env.AIRTABLE_PAT;
  const baseId   = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_TABLE_NAME || "Signups";

  // If Airtable is not configured yet, silently succeed — never break the user flow
  if (!pat || !baseId) {
    console.warn("LEDE track: Airtable env vars not set. Skipping.");
    return res.status(200).json({ ok: true, note: "tracking_disabled" });
  }

  try {
    const airtableRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${pat}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Name:       name     || "Unknown",
            Email:      email    || "",
            WhatsApp:   whatsapp || "",
            Business:   business || "",
            SignedUpAt: date     || new Date().toISOString(),
            Source:     "LEDE Web App",
          },
        }),
      }
    );

    const data = await airtableRes.json();

    if (!airtableRes.ok) {
      // Log the error but still return 200 — never block the user
      console.error("Airtable error:", JSON.stringify(data));
      return res.status(200).json({ ok: true, note: "airtable_error" });
    }

    return res.status(200).json({ ok: true, airtable_id: data.id });

  } catch (err) {
    // Network or parse error — log it, never break the app
    console.error("LEDE track exception:", err.message);
    return res.status(200).json({ ok: true, note: "exception" });
  }
}
