import { useState, useRef } from "react";

const CONFIG = {
  STRIPE_PAYMENT_LINK: "https://buy.stripe.com/YOUR_LINK_HERE",
  MOBILE_MONEY_LINK: "https://flutterwave.com/pay/YOUR_LINK_HERE",
  WHATSAPP_SUPPORT: "https://wa.me/256701690711",
  PRICE: "$49",
  PRICE_UGX: "180,000 UGX",
};

const QUESTIONS = [
  {
    id: "business_name",
    question: "What is your business name?",
    placeholder: "e.g. Primtouch Beauty Studio",
    type: "text",
  },
  {
    id: "business_type",
    question: "What does your business do? Keep it simple.",
    placeholder: "e.g. I sell weight loss supplements / I coach entrepreneurs / I bake custom cakes",
    type: "text",
  },
  {
    id: "location",
    question: "Where is your business based? Or who do you serve if you are online?",
    placeholder: "e.g. Kira, Kampala / Lagos, Nigeria / Online — I serve Africa and diaspora",
    type: "text",
  },
  {
    id: "flagship",
    question: "What is the ONE thing you want to be most known for? Just one.",
    placeholder: "e.g. Weight loss in 90 days / Custom birthday cakes / Same-day business registration",
    type: "text",
  },
  {
    id: "customer_pain",
    question: "What problem does your customer have BEFORE they find you? What makes their life hard?",
    placeholder: "e.g. They have tried every diet and nothing worked. They feel embarrassed and have given up hope...",
    type: "textarea",
  },
  {
    id: "target_customer",
    question: "Who is your best customer? How old are they, what do they do, where do they live?",
    placeholder: "e.g. Women aged 28 to 45. Office workers in Kampala. Busy. Want results without going to gym every day...",
    type: "textarea",
  },
  {
    id: "usp_story",
    question: "Why did you start this business? What happened to you or someone you know that made you do this?",
    placeholder: "e.g. My sister tried 4 different diets and failed. I found a method that helped her lose 22kg. I decided to share it...",
    type: "textarea",
  },
  {
    id: "usp_method",
    question: "How do you do what you do differently from everyone else? What is your special way?",
    placeholder: "e.g. Most coaches just say eat less. I use a 3-step hormone reset that fixes the root cause of weight gain...",
    type: "textarea",
  },
  {
    id: "usp_proof",
    question: "What is the best result a customer ever got from you? Tell the full story. Numbers help.",
    placeholder: "e.g. Grace weighed 94kg. In 90 days she lost 22kg. She had tried 4 programs before mine. Now she runs 5km every weekend...",
    type: "textarea",
  },
  {
    id: "competitors",
    question: "How do your competitors market themselves? What do they all say in their ads?",
    placeholder: "e.g. They all show before and after photos and talk about years of experience. Nobody explains how their method works...",
    type: "textarea",
  },
  {
    id: "budget",
    question: "How much money can you spend on marketing every month? Any amount is okay.",
    placeholder: "e.g. 300,000 UGX / 100 dollars / I have no budget but I can spend time making content",
    type: "text",
  },
  {
    id: "platforms",
    question: "Where do your customers spend time online? Which apps do they use most?",
    placeholder: "e.g. WhatsApp, TikTok, Instagram, Facebook, LinkedIn...",
    type: "text",
  },
];

const SYSTEM_PROMPT = `You are LEDE AI — a lead generation strategist for African and global entrepreneurs. You were built on the proven work of Oscar Ntege, Uganda's top marketing strategist. He grew a school from 300 to 1,300 students and took a beauty business from zero to 10,000 dollars a month.

You work for ANY business — coaches, consultants, clinics, agencies, supplement sellers, schools, lawyers, restaurants, online stores, and more.

YOUR FIRST JOB IS USP DISCOVERY.
Find the Unique Selling Proposition hidden in the business owner's answers. Look in three places:
- Why they started (their origin story)
- How they do it differently (their method)
- Their best result (their proof)

Name the USP in one clear sentence. Make it so specific that no competitor can honestly say the same thing.

WRITING RULES — STRICTLY FOLLOW THESE:
- Write at 8th grade reading level
- Maximum 15 words per sentence
- Use simple words only
- Write like you are explaining to a smart friend on WhatsApp
- Never use these words: leverage, synergy, holistic, paradigm, ecosystem, transformative, robust, utilize, empower, groundbreaking
- No corporate language. No big words. Keep it real.

THE TRUST ARCHITECTURE RULES:
1. ONE THING — Known for one service first, not everything
2. PAIN FIRST — Lead with customer's problem, never with business features
3. PAS FORMAT — Hook then Problem then Agitation then Solution
4. TEACH TO TRUST — Education content builds trust before the sale
5. OMNIPRESENCE — Ads create curiosity, teaching content creates certainty
6. REFRESH EVERY 3 MONTHS — Same message, new visuals, prevents fatigue
7. VALUE LADDER — One service brings them in, other services keep them spending
8. BATCH FILMING — Film the whole year in 3 to 4 days

OUTPUT — Use these exact section headers. Nothing else.

## YOUR UNIQUE SELLING PROPOSITION
One powerful sentence that names their USP. Then 3 short sentences explaining why no competitor can say the same thing. The business owner must read this and say: that is exactly what makes me different and I never knew how to say it.

## THE REAL PROBLEM YOU SOLVE
What is actually stopping this business from getting customers. Be direct. Be honest. Name the real problem even if it feels uncomfortable.

## YOUR ONE BIG THING
The one service this business must become famous for first. Why this one. Simple explanation.

## YOUR MAIN AD SCRIPT
Write the full PAS ad script. Use their exact location and customer pain and USP. Write like a real person talking. Make it feel local and real. First line must stop someone from scrolling immediately.

## 15 CONTENT TOPICS PEOPLE ARE SEARCHING FOR
Think about what real people type into TikTok search, Google, and YouTube for this type of business. Include:
- Common fears before buying this service
- Trending topics in this industry across Africa
- Comparison searches like best [service] in [city]
- How-to searches
- Price and value questions
- Before and after content that gets high views
- Myth-busting content that challenges competitors

For each topic write exactly this format:
TOPIC: [Exact video or post title]
WHY PEOPLE SEARCH IT: [One sentence]
BEST PLATFORM: [Platform name]
FORMAT: [60 second reel / 10 minute YouTube / carousel / etc]

## WHERE TO POST WHAT
Which platform gets which content and why. Simple. Practical.

## 12-MONTH PLAN
Four quarters. Three specific actions each quarter. Phone and basic tools only.

## THE VALUE LADDER
Step one brings them in. Step two keeps them spending. Step three is the premium offer. Write it as clear steps.

## FILMING PLAN
How many shoot days needed. What to film each day. How to get a full year of content in minimum time.

## FIRST 30 DAYS — EXACT STEPS
Number every step from 1 to 20. Each step is a specific action on a specific day. Tell them exactly what to do, what app to use, what to say, what result to expect. No vague instructions.

CRITICAL RULES:
- Be specific to their exact business, city, and customer. No generic advice.
- Write real video titles, real captions, real ad hooks they can copy and use tomorrow.
- Always connect the USP back to every section. The USP is the thread that holds everything together.
- If they sell supplements — think about what supplement buyers search for in Africa.
- If they are a coach — think about what coaching clients in Africa search for.
- If they are online — show them how to reach both local and diaspora markets.`;

const C = {
  bg: "#050C0A",
  green: "#00E5A0",
  greenDim: "rgba(0,229,160,0.06)",
  greenBorder: "rgba(0,229,160,0.15)",
  greenMid: "rgba(0,229,160,0.3)",
  white: "#FFFFFF",
  textMid: "#4A7A6A",
  textDim: "#2A5A4A",
  textFaint: "#1A3A2A",
  contentText: "#9ABFB3",
  contentBright: "#C8F0E0",
};

const font = "'Space Grotesk', sans-serif";

function TopBar({ screen, step, totalSteps, onReset }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0,
      padding: "0.9rem 1.5rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      borderBottom: `1px solid ${C.greenBorder}`,
      background: "rgba(5,12,10,0.96)",
      backdropFilter: "blur(12px)", zIndex: 100
    }}>
      <div onClick={onReset} style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
        <span style={{ fontSize: "1.3rem", fontWeight: "800", color: C.green, letterSpacing: "-0.05em", fontFamily: font }}>LEDE</span>
        <span style={{ fontSize: "0.55rem", color: C.textFaint, letterSpacing: "0.2em", textTransform: "uppercase" }}>by Story Alchemist</span>
      </div>
      {screen === "questions" && (
        <span style={{ color: C.textDim, fontSize: "0.7rem", letterSpacing: "0.1em" }}>
          {step + 1} / {totalSteps}
        </span>
      )}
      {(screen === "full_strategy" || screen === "free_preview") && (
        <button onClick={onReset} style={{
          background: "transparent", border: `1px solid ${C.greenBorder}`,
          color: C.textDim, padding: "0.4rem 0.8rem", cursor: "pointer",
          fontFamily: font, fontSize: "0.7rem", borderRadius: "4px"
        }}>New Business</button>
      )}
    </div>
  );
}

function BgEffects() {
  return (
    <>
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `linear-gradient(rgba(0,229,160,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,160,0.025) 1px, transparent 1px)`,
        backgroundSize: "40px 40px", pointerEvents: "none", zIndex: 0
      }} />
      <div style={{
        position: "fixed", top: "-10%", left: "50%", transform: "translateX(-50%)",
        width: "500px", height: "300px",
        background: "radial-gradient(ellipse, rgba(0,229,160,0.05) 0%, transparent 70%)",
        pointerEvents: "none", zIndex: 0
      }} />
    </>
  );
}

function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800&display=swap');
      @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
      @keyframes pulse { 0%,100% { opacity:0.3; transform:scale(0.8); } 50% { opacity:1; transform:scale(1.1); } }
      * { box-sizing:border-box; margin:0; padding:0; }
      textarea::placeholder, input::placeholder { color:#1A3A2A; }
      ::-webkit-scrollbar { width:4px; }
      ::-webkit-scrollbar-track { background:#050C0A; }
      ::-webkit-scrollbar-thumb { background:#0A2A1A; border-radius:4px; }
    `}</style>
  );
}

function formatStrategy(text) {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    if (line.startsWith("## ")) return (
      <h2 key={i} style={{
        color: C.green, fontSize: "0.82rem", fontFamily: font, fontWeight: "700",
        marginTop: "2.2rem", marginBottom: "0.7rem", letterSpacing: "0.1em",
        textTransform: "uppercase", borderLeft: `3px solid ${C.green}`,
        paddingLeft: "0.8rem", lineHeight: 1.4
      }}>{line.replace("## ", "")}</h2>
    );
    if (line.startsWith("TOPIC:")) return (
      <p key={i} style={{ color: C.white, fontWeight: "700", marginTop: "1.4rem", marginBottom: "0.15rem", fontSize: "0.87rem", fontFamily: font }}>{line}</p>
    );
    if (line.startsWith("WHY PEOPLE SEARCH IT:") || line.startsWith("BEST PLATFORM:") || line.startsWith("FORMAT:")) return (
      <p key={i} style={{ color: C.textMid, fontSize: "0.78rem", marginBottom: "0.1rem", fontFamily: font }}>{line}</p>
    );
    if (line.match(/^\d+\./)) return (
      <p key={i} style={{
        color: C.contentBright, fontSize: "0.86rem", lineHeight: "1.9",
        marginBottom: "0.5rem", fontFamily: font,
        paddingLeft: "0.5rem", borderLeft: `1px solid ${C.greenBorder}`
      }}>{line}</p>
    );
    if (line.trim() === "") return <div key={i} style={{ height: "0.3rem" }} />;
    return (
      <p key={i} style={{ color: C.contentText, lineHeight: "1.9", marginBottom: "0.15rem", fontSize: "0.86rem", fontFamily: font }}>{line}</p>
    );
  });
}

export default function LedeApp() {
  const [screen, setScreen] = useState("welcome");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [contact, setContact] = useState({ name: "", email: "", whatsapp: "" });
  const [fullStrategy, setFullStrategy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const strategyRef = useRef(null);

  const currentQuestion = QUESTIONS[step];
  const progress = (step / QUESTIONS.length) * 100;

  const getFreePreview = (text) => {
    if (!text) return "";
    const sections = text.split("## ");
    const free = sections.filter(s =>
      s.startsWith("YOUR UNIQUE SELLING PROPOSITION") || s.startsWith("THE REAL PROBLEM YOU SOLVE")
    );
    return free.map(s => "## " + s).join("\n");
  };

  const handleNext = () => {
    if (!currentAnswer.trim()) return;
    const updated = { ...answers, [currentQuestion.id]: currentAnswer };
    setAnswers(updated);
    setCurrentAnswer("");
    step === QUESTIONS.length - 1 ? setScreen("contact") : setStep(step + 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && currentQuestion?.type === "text") {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSkip = () => {
    const updated = { ...answers, [currentQuestion.id]: "Not provided" };
    setAnswers(updated);
    setCurrentAnswer("");
    step === QUESTIONS.length - 1 ? setScreen("contact") : setStep(step + 1);
  };

  const generateStrategy = async () => {
    setScreen("generating");
    setLoading(true);

    const msg = `Business Name: ${answers.business_name}
What They Do: ${answers.business_type}
Location: ${answers.location}
Flagship Offer: ${answers.flagship}
Customer Pain: ${answers.customer_pain}
Target Customer: ${answers.target_customer}
Why They Started: ${answers.usp_story}
How They Do It Differently: ${answers.usp_method}
Best Customer Result: ${answers.usp_proof}
How Competitors Market: ${answers.competitors}
Monthly Budget: ${answers.budget}
Active Platforms: ${answers.platforms}
Owner Name: ${contact.name}

Find their real USP. Build the complete 12-month LEDE strategy. Write real scripts, real video titles, real ad hooks they can copy and use tomorrow.`;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json",
      },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: msg }],
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);

      const text = data.content?.[0]?.text || "";
      setFullStrategy(text);
      setLoading(false);
      setScreen(paid ? "full_strategy" : "free_preview");
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      setScreen("contact");
    }
  };

  const handleReset = () => {
    setScreen("welcome"); setStep(0); setAnswers({}); setCurrentAnswer("");
    setContact({ name: "", email: "", whatsapp: "" }); setFullStrategy("");
    setError(""); setCopied(false); setPaid(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullStrategy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([fullStrategy], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${answers.business_name || "LEDE"}-Strategy.txt`;
    a.click();
  };

  const wrap = (children, maxW = "600px") => (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "5rem 1.2rem 3rem", fontFamily: font, position: "relative", overflowX: "hidden"
    }}>
      <BgEffects />
      <TopBar screen={screen} step={step} totalSteps={QUESTIONS.length} onReset={handleReset} />
      <div style={{ maxWidth: maxW, width: "100%", position: "relative", zIndex: 1 }}>
        {children}
      </div>
      <Styles />
    </div>
  );

  if (screen === "welcome") return wrap(
    <div style={{ textAlign: "center", animation: "fadeUp 0.7s ease" }}>
      <div style={{
        display: "inline-block", background: C.greenDim,
        border: `1px solid ${C.greenBorder}`, borderRadius: "100px",
        padding: "0.3rem 1rem", marginBottom: "2rem"
      }}>
        <span style={{ color: C.green, fontSize: "0.65rem", letterSpacing: "0.25em", textTransform: "uppercase" }}>
          AI Lead Generation Engine
        </span>
      </div>

      <h1 style={{
        fontSize: "clamp(2.8rem, 9vw, 5rem)", fontWeight: "800",
        color: C.white, letterSpacing: "-0.04em", lineHeight: 1,
        marginBottom: "1.5rem", fontFamily: font
      }}>
        Your story.<br /><span style={{ color: C.green }}>Their money.</span>
      </h1>

      <p style={{ color: C.textMid, fontSize: "1rem", lineHeight: "1.9", marginBottom: "0.6rem", maxWidth: "400px", margin: "0 auto 0.6rem" }}>
        Answer 12 short questions about your business.
      </p>
      <p style={{ color: C.textDim, fontSize: "0.9rem", lineHeight: "1.8", maxWidth: "380px", margin: "0 auto 0.8rem" }}>
        Get your Unique Selling Proposition plus a complete 12-month lead generation plan.
      </p>
      <p style={{ color: C.textFaint, fontSize: "0.75rem", marginBottom: "2.5rem" }}>
        Works for any business — coaches, clinics, agencies, supplement sellers, online stores, and more.
      </p>

      <button
        onClick={() => setScreen("questions")}
        style={{
          background: C.green, color: C.bg, border: "none",
          padding: "1rem 2.5rem", fontSize: "0.9rem", fontWeight: "800",
          letterSpacing: "0.1em", textTransform: "uppercase",
          cursor: "pointer", borderRadius: "6px", fontFamily: font,
          boxShadow: "0 0 40px rgba(0,229,160,0.25)",
          width: "100%", maxWidth: "320px", transition: "all 0.2s ease"
        }}
        onMouseEnter={e => e.target.style.boxShadow = "0 0 60px rgba(0,229,160,0.45)"}
        onMouseLeave={e => e.target.style.boxShadow = "0 0 40px rgba(0,229,160,0.25)"}
      >
        Find My USP — It is Free
      </button>

      <div style={{ display: "flex", justifyContent: "center", gap: "2.5rem", marginTop: "3.5rem", flexWrap: "wrap" }}>
        {[
          { n: "1,300", l: "Students for Stone Ridge" },
          { n: "$10K/mo", l: "Revenue for Primtouch" },
          { n: "35K+", l: "Students taught globally" },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ color: C.green, fontSize: "1.3rem", fontWeight: "800", letterSpacing: "-0.02em" }}>{s.n}</div>
            <div style={{ color: C.textFaint, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: "0.2rem" }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );

  if (screen === "questions") return wrap(
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ height: "3px", background: "#0A1A14", borderRadius: "3px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${progress}%`,
            background: `linear-gradient(90deg, #00805A, ${C.green})`,
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)", borderRadius: "3px"
          }} />
        </div>
      </div>

      {["usp_story", "usp_method", "usp_proof"].includes(currentQuestion?.id) && (
        <div style={{
          display: "inline-block", background: C.greenDim,
          border: `1px solid ${C.greenBorder}`, borderRadius: "100px",
          padding: "0.25rem 0.8rem", marginBottom: "1rem"
        }}>
          <span style={{ color: C.green, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>USP Discovery</span>
        </div>
      )}

      <h2 style={{
        fontSize: "clamp(1.3rem, 4vw, 1.9rem)", fontWeight: "700",
        color: C.white, marginBottom: "1.8rem", lineHeight: 1.4,
        letterSpacing: "-0.02em", fontFamily: font
      }}>
        {currentQuestion?.question}
      </h2>

      {currentQuestion?.type === "textarea" ? (
        <textarea autoFocus value={currentAnswer}
          onChange={e => setCurrentAnswer(e.target.value)}
          placeholder={currentQuestion.placeholder} rows={4}
          style={{
            width: "100%", background: C.greenDim, border: `1px solid ${C.greenBorder}`,
            borderRadius: "8px", color: C.contentBright, fontSize: "1rem",
            padding: "1.1rem", fontFamily: font, resize: "none", outline: "none",
            lineHeight: "1.7", boxSizing: "border-box", transition: "border-color 0.2s"
          }}
          onFocus={e => e.target.style.borderColor = "rgba(0,229,160,0.45)"}
          onBlur={e => e.target.style.borderColor = C.greenBorder}
        />
      ) : (
        <input autoFocus type="text" value={currentAnswer}
          onChange={e => setCurrentAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={currentQuestion?.placeholder}
          style={{
            width: "100%", background: "transparent", border: "none",
            borderBottom: `2px solid ${C.greenMid}`,
            color: C.contentBright, fontSize: "1.15rem", padding: "0.7rem 0",
            fontFamily: font, outline: "none", boxSizing: "border-box", transition: "border-color 0.2s"
          }}
          onFocus={e => e.target.style.borderBottomColor = C.green}
          onBlur={e => e.target.style.borderBottomColor = C.greenMid}
        />
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem", gap: "0.8rem", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          {step > 0 && (
            <button onClick={() => { setStep(step - 1); setCurrentAnswer(answers[QUESTIONS[step - 1]?.id] || ""); }}
              style={{ background: "transparent", border: `1px solid ${C.greenBorder}`, color: C.textDim, padding: "0.7rem 1.1rem", cursor: "pointer", fontFamily: font, fontSize: "0.8rem", borderRadius: "6px" }}>
              Back
            </button>
          )}
          {["usp_story", "usp_method", "competitors"].includes(currentQuestion?.id) && (
            <button onClick={handleSkip}
              style={{ background: "transparent", border: `1px solid ${C.greenBorder}`, color: C.textFaint, padding: "0.7rem 1.1rem", cursor: "pointer", fontFamily: font, fontSize: "0.8rem", borderRadius: "6px" }}>
              Skip
            </button>
          )}
        </div>
        <button onClick={handleNext} disabled={!currentAnswer.trim()}
          style={{
            background: currentAnswer.trim() ? C.green : C.greenDim,
            color: currentAnswer.trim() ? C.bg : C.textFaint,
            border: "none", padding: "0.85rem 2rem",
            cursor: currentAnswer.trim() ? "pointer" : "not-allowed",
            fontFamily: font, fontSize: "0.85rem", fontWeight: "800",
            letterSpacing: "0.08em", textTransform: "uppercase",
            borderRadius: "6px", transition: "all 0.2s ease", flexShrink: 0
          }}>
          {step === QUESTIONS.length - 1 ? "Continue" : "Next"}
        </button>
      </div>
      {currentQuestion?.type === "text" && (
        <p style={{ color: C.textFaint, fontSize: "0.65rem", marginTop: "1rem", textAlign: "right", letterSpacing: "0.1em" }}>Press Enter to continue</p>
      )}
    </div>
  );

  if (screen === "contact") return wrap(
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={{
        display: "inline-block", background: C.greenDim,
        border: `1px solid ${C.greenBorder}`, borderRadius: "100px",
        padding: "0.3rem 0.9rem", marginBottom: "1.5rem"
      }}>
        <span style={{ color: C.green, fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Almost ready</span>
      </div>

      <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2rem)", fontWeight: "700", color: C.white, marginBottom: "0.8rem", lineHeight: 1.3, letterSpacing: "-0.02em", fontFamily: font }}>
        Where do we send your strategy?
      </h2>
      <p style={{ color: C.textMid, fontSize: "0.9rem", lineHeight: "1.8", marginBottom: "2rem" }}>
        Your USP and first two sections are free. Enter your details to unlock them now.
      </p>

      {error && (
        <div style={{ background: "rgba(255,107,107,0.08)", border: "1px solid rgba(255,107,107,0.2)", borderRadius: "6px", padding: "0.8rem 1rem", marginBottom: "1.5rem", color: "#FF6B6B", fontSize: "0.8rem" }}>
          {error}
        </div>
      )}

      {[
        { key: "name", label: "Your Name", placeholder: "e.g. Sarah Nakato", type: "text" },
        { key: "email", label: "Email Address", placeholder: "e.g. sarah@gmail.com", type: "email" },
        { key: "whatsapp", label: "WhatsApp Number (optional)", placeholder: "e.g. +256 700 000000", type: "tel" },
      ].map(f => (
        <div key={f.key} style={{ marginBottom: "1.3rem" }}>
          <label style={{ color: C.textMid, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>{f.label}</label>
          <input type={f.type} value={contact[f.key]}
            onChange={e => setContact({ ...contact, [f.key]: e.target.value })}
            placeholder={f.placeholder}
            style={{
              width: "100%", background: C.greenDim, border: `1px solid ${C.greenBorder}`,
              borderRadius: "6px", color: C.contentBright, fontSize: "1rem",
              padding: "0.9rem 1rem", fontFamily: font, outline: "none",
              boxSizing: "border-box", transition: "border-color 0.2s"
            }}
            onFocus={e => e.target.style.borderColor = "rgba(0,229,160,0.45)"}
            onBlur={e => e.target.style.borderColor = C.greenBorder}
          />
        </div>
      ))}

      <p style={{ color: C.textFaint, fontSize: "0.7rem", lineHeight: "1.6", marginBottom: "1.5rem" }}>
        We send you implementation tips and workshop invites. No spam. Unsubscribe any time.
      </p>

      <button onClick={generateStrategy}
        disabled={!contact.name.trim() || !contact.email.trim()}
        style={{
          width: "100%",
          background: (contact.name.trim() && contact.email.trim()) ? C.green : C.greenDim,
          color: (contact.name.trim() && contact.email.trim()) ? C.bg : C.textFaint,
          border: "none", padding: "1rem", fontSize: "0.9rem", fontWeight: "800",
          letterSpacing: "0.1em", textTransform: "uppercase",
          cursor: (contact.name.trim() && contact.email.trim()) ? "pointer" : "not-allowed",
          borderRadius: "6px", fontFamily: font, transition: "all 0.2s ease"
        }}>
        Build My Strategy
      </button>

      <button onClick={() => { setScreen("questions"); setStep(QUESTIONS.length - 1); }}
        style={{ width: "100%", background: "transparent", border: "none", color: C.textDim, padding: "0.8rem", cursor: "pointer", fontFamily: font, fontSize: "0.8rem", marginTop: "0.5rem" }}>
        Back to questions
      </button>
    </div>
  );

  if (screen === "generating") return wrap(
    <div style={{ textAlign: "center", padding: "5rem 0", animation: "fadeUp 0.5s ease" }}>
      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginBottom: "2.5rem" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: "10px", height: "10px", borderRadius: "50%", background: C.green, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
        ))}
      </div>
      <p style={{ color: C.green, letterSpacing: "0.3em", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.6rem" }}>Finding your USP</p>
      <p style={{ color: C.textDim, fontSize: "0.85rem", marginBottom: "0.4rem" }}>Building your 12-month strategy...</p>
      <p style={{ color: C.textFaint, fontSize: "0.75rem" }}>This takes about 30 seconds</p>
    </div>
  );

  if (screen === "free_preview") {
    const freeText = getFreePreview(fullStrategy);
    return wrap(
      <div style={{ animation: "fadeUp 0.5s ease" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ color: C.white, fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.3rem", fontFamily: font }}>{answers.business_name}</h2>
          <p style={{ color: C.textDim, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>{answers.location} · LEDE Strategy</p>
        </div>

        <div style={{ background: C.greenDim, border: `1px solid ${C.greenBorder}`, borderRadius: "8px", padding: "1.5rem 1.5rem 1rem", marginBottom: "1rem" }}>
          {formatStrategy(freeText)}
        </div>

        <div style={{
          background: "linear-gradient(135deg, rgba(0,229,160,0.06), rgba(0,229,160,0.02))",
          border: `1px solid ${C.greenMid}`, borderRadius: "12px",
          padding: "2rem 1.5rem", textAlign: "center", marginTop: "1.5rem"
        }}>
          <div style={{ display: "inline-block", background: C.greenDim, border: `1px solid ${C.greenBorder}`, borderRadius: "100px", padding: "0.3rem 0.9rem", marginBottom: "1.2rem" }}>
            <span style={{ color: C.green, fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Full Strategy Locked</span>
          </div>

          <h3 style={{ color: C.white, fontSize: "1.3rem", fontWeight: "700", marginBottom: "1rem", lineHeight: 1.3, fontFamily: font }}>
            Your full 12-month plan is ready.
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem", textAlign: "left" }}>
            {[
              "Your main ad script (PAS format)",
              "15 content topics people search for",
              "Platform strategy for your business",
              "Full 12-month content calendar",
              "Your value ladder mapped out",
              "Filming plan (minimum shoot days)",
              "First 30 days — exact steps",
              "Where to post what and why",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
                <span style={{ color: C.green, fontSize: "0.85rem", flexShrink: 0 }}>✓</span>
                <span style={{ color: C.contentText, fontSize: "0.82rem", lineHeight: "1.5" }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "0.5rem" }}>
            <span style={{ color: C.white, fontSize: "1.8rem", fontWeight: "800" }}>{CONFIG.PRICE}</span>
            <span style={{ color: C.textDim, fontSize: "0.8rem" }}>/month · Cancel any time</span>
          </div>
          <p style={{ color: C.textFaint, fontSize: "0.7rem", marginBottom: "1.5rem" }}>
            Also {CONFIG.PRICE_UGX}/month · Includes monthly live workshop with Oscar Ntege
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <a href={CONFIG.STRIPE_PAYMENT_LINK} target="_blank" rel="noreferrer"
              style={{
                display: "block", background: C.green, color: C.bg,
                padding: "1rem", fontSize: "0.9rem", fontWeight: "800",
                letterSpacing: "0.08em", textTransform: "uppercase",
                textDecoration: "none", borderRadius: "8px", fontFamily: font,
              }}>
              Pay with Card (Visa / Mastercard)
            </a>
            <a href={CONFIG.MOBILE_MONEY_LINK} target="_blank" rel="noreferrer"
              style={{
                display: "block", background: "transparent",
                border: `2px solid ${C.greenMid}`, color: C.green,
                padding: "1rem", fontSize: "0.9rem", fontWeight: "800",
                letterSpacing: "0.08em", textTransform: "uppercase",
                textDecoration: "none", borderRadius: "8px", fontFamily: font
              }}>
              Pay with Mobile Money (MTN / Airtel)
            </a>
          </div>

          <button onClick={() => { setPaid(true); setScreen("full_strategy"); }}
            style={{
              background: "transparent", border: `1px solid ${C.textFaint}`,
              color: C.textFaint, padding: "0.5rem 1rem", cursor: "pointer",
              fontFamily: font, fontSize: "0.68rem", borderRadius: "4px",
              marginTop: "1.2rem", letterSpacing: "0.08em"
            }}>
            TEST ONLY — Simulate Payment — Remove Before Launch
          </button>

          <p style={{ color: C.textFaint, fontSize: "0.68rem", marginTop: "1.2rem" }}>
            Need help? <a href={CONFIG.WHATSAPP_SUPPORT} style={{ color: C.textDim, textDecoration: "underline" }}>WhatsApp us</a>
          </p>
        </div>
      </div>,
      "760px"
    );
  }

  if (screen === "full_strategy") return wrap(
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem", borderBottom: `1px solid ${C.greenBorder}`, paddingBottom: "1.5rem" }}>
        <div>
          <div style={{ display: "inline-block", background: C.greenDim, border: `1px solid ${C.greenBorder}`, borderRadius: "100px", padding: "0.2rem 0.7rem", marginBottom: "0.5rem" }}>
            <span style={{ color: C.green, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Full Strategy Unlocked</span>
          </div>
          <h2 style={{ color: C.white, fontSize: "1.2rem", fontWeight: "700", marginBottom: "0.2rem", fontFamily: font }}>{answers.business_name}</h2>
          <p style={{ color: C.textDim, fontSize: "0.68rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>{contact.name} · {answers.location} · LEDE Strategy</p>
        </div>
      </div>

      <div ref={strategyRef} style={{
        background: C.greenDim, border: `1px solid ${C.greenBorder}`,
        borderRadius: "8px", padding: "1.8rem",
        maxHeight: "55vh", overflowY: "auto",
        scrollbarWidth: "thin", scrollbarColor: `#0A2A1A ${C.bg}`
      }}>
        {formatStrategy(fullStrategy)}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "1.5rem" }}>
        <button onClick={handleDownload}
          style={{ background: C.green, color: C.bg, border: "none", padding: "1rem 1.8rem", cursor: "pointer", fontFamily: font, fontSize: "0.85rem", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "6px", width: "100%" }}>
          Download My Strategy
        </button>
        <button onClick={handleCopy}
          style={{ background: "transparent", border: `1px solid ${C.greenMid}`, color: copied ? C.green : C.textMid, padding: "1rem 1.8rem", cursor: "pointer", fontFamily: font, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "6px", transition: "all 0.2s", width: "100%" }}>
          {copied ? "Copied" : "Copy Text"}
        </button>
        <a href={CONFIG.WHATSAPP_SUPPORT} target="_blank" rel="noreferrer"
          style={{ background: "transparent", border: `1px solid ${C.greenBorder}`, color: C.textDim, padding: "1rem 1.8rem", fontFamily: font, fontSize: "0.85rem", letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: "6px", textDecoration: "none", display: "block", textAlign: "center" }}>
          Get Help on WhatsApp
        </a>
      </div>

      <div style={{
        marginTop: "2rem", background: C.greenDim, border: `1px solid ${C.greenBorder}`,
        borderRadius: "8px", padding: "1.2rem 1.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem"
      }}>
        <div>
          <p style={{ color: C.white, fontSize: "0.9rem", fontWeight: "700", marginBottom: "0.2rem", fontFamily: font }}>Monthly LEDE Workshop</p>
          <p style={{ color: C.textMid, fontSize: "0.77rem", lineHeight: "1.6" }}>Join Oscar Ntege live every month. We review real businesses and push your strategy further.</p>
        </div>
        <a href={CONFIG.WHATSAPP_SUPPORT} target="_blank" rel="noreferrer"
          style={{ background: C.green, color: C.bg, padding: "0.7rem 1.4rem", fontFamily: font, fontSize: "0.78rem", fontWeight: "800", textDecoration: "none", borderRadius: "6px", whiteSpace: "nowrap" }}>
          Join Workshop
        </a>
      </div>
    </div>,
    "780px"
  );

  return null;
}
