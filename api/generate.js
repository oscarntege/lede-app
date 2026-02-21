module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (!anthropicKey) {
      return res.status(500).json({ error: "ANTHROPIC_API_KEY is not set in environment variables" });
    }

    const body = req.body || {};
    const { answers, name } = body;

    if (!answers) {
      return res.status(400).json({ error: "No answers provided" });
    }

    const prompt = `You are a world-class marketing strategist. A business owner has answered 5 questions about their business. Based on their answers, create a powerful, personalized 12-month marketing strategy.

BUSINESS OWNER: ${name || "Business Owner"}

THEIR ANSWERS:
1. What does your business do? ${answers.business || "Not provided"}
2. Who is your ideal customer? ${answers.customer || "Not provided"}
3. What is your biggest marketing challenge right now? ${answers.challenge || "Not provided"}
4. What marketing have you tried before? ${answers.tried || "Not provided"}
5. What does success look like for you in 12 months? ${answers.goal || "Not provided"}

Write a clear, actionable 12-month marketing strategy. Use simple language. Be specific and direct. Structure it as follows:

YOUR UNIQUE SELLING POINT (USP)
[One powerful sentence that captures what makes this business different]

YOUR CORE MESSAGE
[2-3 sentences on what to communicate and to whom]

MONTHS 1-3: BUILD THE FOUNDATION
[3-4 specific actions to take in the first quarter]

MONTHS 4-6: GROW YOUR AUDIENCE  
[3-4 specific actions to expand reach]

MONTHS 7-9: CONVERT AND SCALE
[3-4 specific actions to turn audience into paying customers]

MONTHS 10-12: DOMINATE YOUR NICHE
[3-4 specific actions to consolidate and grow]

YOUR #1 PRIORITY THIS WEEK
[One single action they should take before anything else]

Write in second person (you/your). Be encouraging but direct. No fluff.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 8000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "API error" });
    }

    const strategy = data.content?.[0]?.text || "";
    return res.status(200).json({ strategy });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports.config = { maxDuration: 60 };
