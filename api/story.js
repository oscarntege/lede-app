export const config = { maxDuration: 60 };

const SYSTEM = `You are LEDE, a content strategy engine trained on the Hooksmith framework by Oscar Ntege.

You generate single daily story prompts for Instagram Stories, WhatsApp Status, and 60-second reels. These are on-demand — generated fresh every time someone asks.

STORY TYPES YOU ROTATE (pick based on the date/day):
1. Origin Story fragment — A single moment from their origin. Emotional, specific, visual.
2. Enemy Story — Names what they stand against. Makes followers feel seen.
3. Transformation fragment — One client's before and after moment.
4. Teaching moment — One insight wrapped in a real story. Short, stealable, retellable.
5. Vision flash — 20 seconds of showing the customer their future self.

THE FLIP TRIGGER is perfect for story format:
"Your [thing] is not [what they think]. Your [thing] is [reframe]."

EGO SLAM for story:
A truth the viewer already whispers to themselves. Confronts without insulting.

STATUS THREAT for story:
Makes them question their current position in a way that demands action.

STORY FORMAT RULES:
- Stories are 15–30 seconds when spoken aloud
- That is 60–90 words maximum for the teleprompter script
- Must open with something visual — something the camera can show
- Must end with an action or a feeling, not a question
- No questions anywhere
- No contractions
- Active voice only
- The hook must work as the first frame the viewer sees

Return ONLY valid JSON:
{
  "story_type": "Teaching Story",
  "hook_type": "The Flip",
  "primal_trigger": "Identity",
  "hook": "One-sentence hook — the first words spoken or shown on screen",
  "prompt": "2-3 sentences describing what to film and what to say. Tell them where to stand, what to show, what emotion to lead with. Specific to their business.",
  "script": "Full teleprompter script. 60-90 words. Spoken language. Starts with the hook. Ends with a feeling or action."
}`;

const STORY_TYPES = [
  "Origin Story",
  "Enemy Story",
  "Transformation Story",
  "Teaching Story",
  "Vision Story",
];

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set" });

  const { answers, name, date } = req.body || {};
  if (!answers || !name) return res.status(400).json({ error: "Missing answers or name" });

  // Rotate story type based on day of week so daily prompts feel varied
  const dayOfWeek = new Date(date || Date.now()).getDay();
  const storyType = STORY_TYPES[dayOfWeek % STORY_TYPES.length];

  const prompt = `Generate one daily story prompt for ${name}. Today's story type is: ${storyType}.

BUSINESS PROFILE:
What they do: ${answers.what}
Ideal customer: ${answers.who}
Why they started: ${answers.why}
Best customer result: ${answers.result}
How they are different: ${answers.different}
Proof they have: ${answers.proof}
Pricing: ${answers.price}
Why people do not buy: ${answers.objection}
Where their customer is online: ${answers.platforms}

This is for a 15–30 second Instagram Story or WhatsApp Status. It must feel immediate, personal, and real. Not polished. Not corporate. Like they picked up their phone and said something true.

The prompt section must tell them EXACTLY what to film — where to stand, what to hold, what face to make, what the first visual is. This is for someone who is not a professional filmmaker.

Use ${storyType} framework. Make the hook land in under 3 seconds.

Return only the JSON object. No markdown, no explanation.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1200,
        system: SYSTEM,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const t = await response.text();
      return res.status(response.status).json({ error: `Anthropic error: ${t}` });
    }

    const data = await response.json();
    const raw = data.content?.[0]?.text || "";

    let parsed;
    try {
      const match = raw.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON found");
      parsed = JSON.parse(match[0]);
    } catch {
      return res.status(500).json({ error: "Failed to parse story prompt. Please try again." });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Unexpected error" });
  }
}
