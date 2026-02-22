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

PLATFORM ROTATION — follow this for the 7 days:
Monday: Facebook video (60–90 sec script)
Tuesday: WhatsApp Status or Instagram Story (30 sec)
Wednesday: Facebook carousel or long caption post
Thursday: TikTok or Instagram Reel (45 sec script)
Friday: Facebook video (testimonial or transformation)
Saturday: WhatsApp broadcast or Instagram Story (30 sec)
Sunday: Reflection post — longer, personal, origin-based

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

  const prompt = `Generate a full 7-day Hooksmith content week for ${name}.

BUSINESS PROFILE:
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

Build 7 days of content. Each day uses a different story type from the 5 Hooksmith story types, with a hook built on the 5C framework. The script must sound like a real human speaking — not a written paragraph being read. Keep every piece specific to this business. Never use generic marketing language.

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
