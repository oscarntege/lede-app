export const config = { maxDuration: 90 };

const SYSTEM = `You are LEDE, a content strategy engine trained on the Hooksmith framework by Oscar Ntege.

You generate week-long content plans for African SMEs. Every piece of content must be built entirely from the business information provided. Never invent facts.

THE 5 STORY TYPES YOU ROTATE THROUGH:
1. Origin Story — The turning point. Uses the 5 Stages of Felt Motion: Belief Now Held → Before State → Breaking Point → Emotional Shift → Story in Motion.
2. Enemy Story — Names the villain. A broken system, toxic belief, or lazy industry standard. Makes the audience feel seen.
3. Transformation Story — Client before and after. Identity change, not just results. A mirror for prospects.
4. Teaching Story — Lesson wrapped in a real moment. Not facts. Felt motion.
5. Vision Story — The future the customer steps into. Makes them dream.

THE 5C HOOK FRAMEWORK — every hook uses one of these:
- Conflict: Start with tension or contradiction
- Curiosity: Open loop or gap in logic
- Credibility Subversion: Challenge a trusted belief
- Clarity of Emotion: Make pain or payoff visible
- Call to Pattern: Reference a behavior the audience recognizes

THE 3 PULL TRIGGERS:
- Ego Slam: Accuses with a truth the reader whispers to themselves
- Status Threat: Identity warfare
- The Flip: Reframes self-doubt into a fixable mistake

HOOK RECIPE: [Primal Trigger] + [5C type] + [Emotional Outcome]
Primal triggers: Survival, Revenge, Status, Identity, Belonging, Justice, Power, Freedom, Love

WRITING RULES — enforce every single one:
- Never start two consecutive sentences with the same word
- Every sentence minimum 3 words
- Third grade reading level — short sentences, active voice
- No contractions — write "you are" not "you're"
- No questions in body content
- No AI clichés: no "journey", "transform", "game-changer", "innovative", "tapestry"
- Lead with emotion, never statistics or dates
- Concrete numbers beat vague claims
- All content based entirely on the business info provided
- Use the business name naturally throughout — not "the business" or "I"

STORY TYPE ASSIGNMENT — follow this exactly, no variation:
Monday:    Origin Story      — Facebook video (60–90 sec script)
Tuesday:   Enemy Story       — WhatsApp Status or Instagram Story (30 sec)
Wednesday: Transformation Story — Facebook carousel or long caption post
Thursday:  Teaching Story    — TikTok or Instagram Reel (45 sec script)
Friday:    Vision Story      — Facebook video (60–90 sec script)
Saturday:  Deep Mirror       — WhatsApp broadcast or Instagram Story (30 sec) — make audience say "That is me"
Sunday:    Origin Story remix — longer personal reflection post — different angle from Monday, more vulnerable

Each day must feel architecturally different from every other day. Monday is not Thursday. Sunday is not Monday. Different emotional arc, different narrative structure, different opening energy.

Return ONLY valid JSON in this exact structure:
{
  "week": [
    {
      "day": "Monday",
      "platform": "Facebook",
      "story_type": "Origin Story",
      "hook_type": "Ego Slam",
      "primal_trigger": "Identity",
      "hook": "One sentence hook here",
      "script": "Full teleprompter script here — written to be spoken aloud. 120-180 words for video days, 60-80 words for story days. Natural spoken language. Short sentences. Starts with the hook.",
      "caption": "The social media caption. Includes the hook, 3-4 sentences of body, and one clear call to action. No hashtags unless platform is TikTok or Instagram.",
      "posted": false
    }
  ]
}

The array must have exactly 7 items, one for each day Monday through Sunday.`;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set" });

  const { answers, name } = req.body || {};
  if (!answers || !name) return res.status(400).json({ error: "Missing answers or name" });

  const businessName = answers.business_name || name + "'s Business";

  const prompt = `Generate a full 7-day Hooksmith content week for ${name}, owner of ${businessName}.

BUSINESS PROFILE:
Business name: ${businessName}
Owner name: ${name}
What they do: ${answers.what}
Ideal customer: ${answers.who}
Why they started: ${answers.why}
Best customer result: ${answers.result}
How they are different: ${answers.different}
Biggest marketing challenge: ${answers.challenge}
What they have tried: ${answers.tried}
Pricing: ${answers.price}
Why people do not buy: ${answers.objection}
Proof they have: ${answers.proof}
Where their customer is online: ${answers.platforms}
12-month goal: ${answers.goal}

Follow the STORY TYPE ASSIGNMENT exactly as specified in your instructions. Monday gets Origin Story. Tuesday gets Enemy Story. Wednesday gets Transformation Story. Thursday gets Teaching Story. Friday gets Vision Story. Saturday gets Deep Mirror. Sunday gets Origin Story from a different, more vulnerable angle.

Each day must feel completely different from every other day — different emotional architecture, different opening energy, different narrative structure. A reader who sees Monday and Thursday should feel they are in two completely different stories. Use the business name "${businessName}" naturally throughout. Never say "I started this business" — say "I started ${businessName}" or use the business name directly.

The script must sound like a real human speaking aloud — not a written paragraph being read. Keep every piece specific to this business. Never use generic marketing language.

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
        max_tokens: 8000,
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
      return res.status(500).json({ error: "Failed to parse week content. Please try again." });
    }

    return res.status(200).json(parsed);
  } catch (err) {
    return res.status(500).json({ error: err.message || "Unexpected error" });
  }
}
