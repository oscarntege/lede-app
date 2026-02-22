import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────
const G  = "#00FF85";
const BK = "#080808";
const CD = "#111111";
const BR = "#1e1e1e";
const MT = "#555555";

const SANS  = "'Roboto', 'Google Sans', Arial, sans-serif";

const RANKS = [
  { days: 0,   title: "Story Seeker",         emoji: "🌱", milestone: false },
  { days: 3,   title: "Spark",                emoji: "⚡", milestone: false },
  { days: 7,   title: "Voice",                emoji: "🎙️", milestone: true  },
  { days: 14,  title: "Builder",              emoji: "🔨", milestone: true  },
  { days: 21,  title: "Storyteller",          emoji: "📖", milestone: false },
  { days: 30,  title: "Hooksmith Apprentice", emoji: "⚒️", milestone: true  },
  { days: 60,  title: "Hooksmith",            emoji: "🔥", milestone: true  },
  { days: 90,  title: "Story Architect",      emoji: "🏛️", milestone: true  },
  { days: 180, title: "Brand Alchemist",      emoji: "🧪", milestone: true  },
  { days: 365, title: "Story Legend",         emoji: "👑", milestone: true  },
];

const getRank    = (n) => RANKS.reduce((r, x) => n >= x.days ? x : r, RANKS[0]);
const getNextRank = (n) => RANKS.find(x => x.days > n) || null;

// ─────────────────────────────────────────────
// COUNTRY CODES — Africa first, then global
// ─────────────────────────────────────────────
const COUNTRIES = [
  { code: "UG", dial: "+256", name: "Uganda"       },
  { code: "KE", dial: "+254", name: "Kenya"        },
  { code: "TZ", dial: "+255", name: "Tanzania"     },
  { code: "NG", dial: "+234", name: "Nigeria"      },
  { code: "GH", dial: "+233", name: "Ghana"        },
  { code: "ZA", dial: "+27",  name: "South Africa" },
  { code: "RW", dial: "+250", name: "Rwanda"       },
  { code: "ET", dial: "+251", name: "Ethiopia"     },
  { code: "SN", dial: "+221", name: "Senegal"      },
  { code: "CI", dial: "+225", name: "Côte d'Ivoire"},
  { code: "CM", dial: "+237", name: "Cameroon"     },
  { code: "ZM", dial: "+260", name: "Zambia"       },
  { code: "ZW", dial: "+263", name: "Zimbabwe"     },
  { code: "MZ", dial: "+258", name: "Mozambique"   },
  { code: "AO", dial: "+244", name: "Angola"       },
  { code: "BW", dial: "+267", name: "Botswana"     },
  { code: "MW", dial: "+265", name: "Malawi"       },
  { code: "EG", dial: "+20",  name: "Egypt"        },
  { code: "MA", dial: "+212", name: "Morocco"      },
  { code: "SD", dial: "+249", name: "Sudan"        },
  { code: "──", dial: "──",   name: "──────────────", disabled: true },
  { code: "GB", dial: "+44",  name: "United Kingdom"},
  { code: "US", dial: "+1",   name: "United States" },
  { code: "CA", dial: "+1",   name: "Canada"        },
  { code: "AU", dial: "+61",  name: "Australia"     },
  { code: "IN", dial: "+91",  name: "India"         },
  { code: "AE", dial: "+971", name: "UAE"           },
  { code: "DE", dial: "+49",  name: "Germany"       },
  { code: "FR", dial: "+33",  name: "France"        },
  { code: "NL", dial: "+31",  name: "Netherlands"   },
  { code: "SE", dial: "+46",  name: "Sweden"        },
  { code: "CN", dial: "+86",  name: "China"         },
  { code: "SG", dial: "+65",  name: "Singapore"     },
];

// ─────────────────────────────────────────────
// STORAGE / DATE HELPERS
// ─────────────────────────────────────────────
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} };
const load = (k, fb = null) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch (_) { return fb; } };

const todayStr  = () => new Date().toISOString().split("T")[0];
const weekStart = () => {
  const d    = new Date();
  const diff = d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1);
  return new Date(new Date().setDate(diff)).toISOString().split("T")[0];
};

const getStreak = () => load("lede_streak", { count: 0, lastPosted: null, best: 0, total: 0 });
const markPosted = () => {
  const s = getStreak();
  const today = todayStr();
  if (s.lastPosted === today) return s;
  const yest = new Date(); yest.setDate(yest.getDate() - 1);
  s.count     = s.lastPosted === yest.toISOString().split("T")[0] ? s.count + 1 : 1;
  s.lastPosted = today;
  s.total      = (s.total || 0) + 1;
  s.best       = Math.max(s.count, s.best || 0);
  save("lede_streak", s);
  return s;
};

// ─────────────────────────────────────────────
// QUESTIONS
// ─────────────────────────────────────────────
const QUESTIONS = [
  { id: "what", label: "QUESTION 1 OF 12", q: "What does your business do?",
    hint: `Be specific. Not "I do marketing." Say what actually happens.\n\nExample: "We help small restaurants in Kampala fill tables on weekdays using short videos posted on Facebook and WhatsApp. We script, film, and post for them."\n\nYour answer:` },
  { id: "who", label: "QUESTION 2 OF 12", q: "Who is your ideal customer?",
    hint: `Describe one real person, not a category.\n\nExample: "Her name is probably Aisha. She is 34, runs a beauty salon in Ntinda, has been in business 3 years, and is frustrated that her Instagram looks good but her bookings have not changed."\n\nYour answer:` },
  { id: "why", label: "QUESTION 3 OF 12", q: "Why did you start this business?",
    hint: `This is your origin story. Be honest about what broke you open.\n\nExample: "I watched my father run a great shop for 20 years. When he got sick and I took over, I realized all customers were loyal to him personally. When he was gone, so were they."\n\nYour answer:` },
  { id: "result", label: "QUESTION 4 OF 12", q: "What is the best result you have ever gotten for a customer?",
    hint: `Give a before and after. Use real numbers.\n\nExample: "A salon owner was spending 200,000 shillings on flyers with zero results. We ran one Facebook video campaign. Within 6 weeks she had 40 new clients and had to hire a second stylist."\n\nYour answer:` },
  { id: "different", label: "QUESTION 5 OF 12", q: "How do you do things differently from your competitors?",
    hint: `Name the thing you do that most in your industry refuse to do.\n\nExample: "Most photographers hand you a USB drive and disappear. We stay involved 60 days after the shoot and help clients use the photos to build trust online."\n\nYour answer:` },
  { id: "challenge", label: "QUESTION 6 OF 12", q: "What is your biggest marketing challenge right now?",
    hint: `Be honest about where you are stuck.\n\nExample: "People say they love my work but go with someone cheaper. I get enquiries but few bookings. I think I am not communicating my value clearly enough."\n\nYour answer:` },
  { id: "tried", label: "QUESTION 7 OF 12", q: "What marketing have you tried before and what happened?",
    hint: `Tell me what worked and what failed. Both matter.\n\nExample: "I tried boosting Facebook posts. Wasted 300,000 shillings, got 200 likes, zero sales. WhatsApp statuses brought 3 clients in one month with no money spent."\n\nYour answer:` },
  { id: "price", label: "QUESTION 8 OF 12", q: "What does your product or service cost?",
    hint: `Give actual numbers.\n\nExample: "Starter package is 350,000 shillings for one session. Full brand package is 1.2 million and includes 3 shoots, 60 photos, and a 30-day posting plan."\n\nYour answer:` },
  { id: "objection", label: "QUESTION 9 OF 12", q: "What do people say when they do not buy from you?",
    hint: `Write the actual words they use.\n\nExample: "They say it is too expensive. But I think what they really mean is they do not yet believe the result is worth it."\n\nYour answer:` },
  { id: "proof", label: "QUESTION 10 OF 12", q: "What proof do you have that your business works?",
    hint: `Testimonials, results, time in business, anything real.\n\nExample: "I have been doing this 6 years. Over 200 weddings. One bride messaged me 2 years later saying every time she looked at the photos on her wall she remembered why she chose her husband."\n\nYour answer:` },
  { id: "platforms", label: "QUESTION 11 OF 12", q: "Where does your ideal customer spend their time online?",
    hint: `Be specific about which platforms and what they do there.\n\nExample: "She is on Facebook every morning watching videos. She is on WhatsApp all day. She discovers businesses through Facebook video ads and recommendations in women entrepreneur groups."\n\nYour answer:` },
  { id: "goal", label: "QUESTION 12 OF 12", q: "What does success look like for you in 12 months?",
    hint: `Be specific. What exactly would have changed?\n\nExample: "I want to be fully booked 3 months in advance. Raise prices by 40 percent. Have content that brings in enquiries while I sleep."\n\nYour answer:` },
];

// ─────────────────────────────────────────────
// ANIMATED DOG LOADER
// ─────────────────────────────────────────────
const LOADER_MESSAGES = [
  "Digging through your story…",
  "Sniffing out your USP…",
  "Unearthing your hook engine…",
  "Applying Hooksmith frameworks…",
  "Crafting your origin story…",
  "Building your content week…",
  "Almost there — one more bone…",
];

function DogLoader({ message }) {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setMsgIdx(i => (i + 1) % LOADER_MESSAGES.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <style>{`
        @keyframes digBody {
          0%,100% { transform: translateY(0px) rotate(-4deg); }
          50%      { transform: translateY(-10px) rotate(4deg); }
        }
        @keyframes tailWag {
          0%,100% { transform: rotate(-30deg); }
          50%      { transform: rotate(30deg); }
        }
        @keyframes flyPaper1 {
          0%        { transform: translate(0,0) rotate(0deg);   opacity: 1; }
          100%      { transform: translate(-55px,-50px) rotate(-50deg); opacity: 0; }
        }
        @keyframes flyPaper2 {
          0%        { transform: translate(0,0) rotate(0deg);   opacity: 1; }
          100%      { transform: translate(45px,-60px) rotate(40deg);  opacity: 0; }
        }
        @keyframes flyPaper3 {
          0%        { transform: translate(0,0) rotate(0deg);   opacity: 1; }
          100%      { transform: translate(-30px,-70px) rotate(-30deg); opacity: 0; }
        }
        @keyframes dirt1 {
          0%        { transform: translate(0,0) scale(1); opacity: 0.8; }
          100%      { transform: translate(-40px,-30px) scale(0); opacity: 0; }
        }
        @keyframes dirt2 {
          0%        { transform: translate(0,0) scale(1); opacity: 0.8; }
          100%      { transform: translate(35px,-25px) scale(0); opacity: 0; }
        }
        @keyframes dirt3 {
          0%        { transform: translate(0,0) scale(1); opacity: 0.6; }
          100%      { transform: translate(-20px,-45px) scale(0); opacity: 0; }
        }
        @keyframes msgFade {
          0%   { opacity: 0; transform: translateY(6px); }
          15%  { opacity: 1; transform: translateY(0); }
          80%  { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-6px); }
        }
        @keyframes groundPulse {
          0%,100% { opacity: 0.4; }
          50%      { opacity: 0.7; }
        }
        .dog-body  { animation: digBody  0.5s ease-in-out infinite; transform-origin: center bottom; }
        .dog-tail  { animation: tailWag  0.35s ease-in-out infinite; transform-origin: left center; }
        .paper1    { animation: flyPaper1 1.1s ease-out infinite; animation-delay: 0s;    }
        .paper2    { animation: flyPaper2 1.1s ease-out infinite; animation-delay: 0.37s; }
        .paper3    { animation: flyPaper3 1.1s ease-out infinite; animation-delay: 0.72s; }
        .d1        { animation: dirt1 0.9s ease-out infinite; animation-delay: 0.1s; }
        .d2        { animation: dirt2 0.9s ease-out infinite; animation-delay: 0.3s; }
        .d3        { animation: dirt3 0.9s ease-out infinite; animation-delay: 0.6s; }
        .ldr-msg   { animation: msgFade 2.8s ease-in-out infinite; }
        .ground-ln { animation: groundPulse 1s ease-in-out infinite; }
      `}</style>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px 40px" }}>

        {/* Scene container */}
        <div style={{ position: "relative", width: 160, height: 120, marginBottom: 28 }}>

          {/* Flying papers */}
          <div className="paper1" style={{ position: "absolute", left: 68, top: 38, fontSize: 18, zIndex: 3 }}>📄</div>
          <div className="paper2" style={{ position: "absolute", left: 72, top: 42, fontSize: 16, zIndex: 3 }}>✉️</div>
          <div className="paper3" style={{ position: "absolute", left: 65, top: 35, fontSize: 15, zIndex: 3 }}>📋</div>

          {/* Dirt particles */}
          <div className="d1" style={{ position: "absolute", left: 62, top: 72, width: 8, height: 8, borderRadius: "50%", background: "#5a3a1a", zIndex: 2 }} />
          <div className="d2" style={{ position: "absolute", left: 80, top: 70, width: 6, height: 6, borderRadius: "50%", background: "#6b4a2a", zIndex: 2 }} />
          <div className="d3" style={{ position: "absolute", left: 55, top: 65, width: 5, height: 5, borderRadius: "50%", background: "#4a2e10", zIndex: 2 }} />

          {/* Dog */}
          <div className="dog-body" style={{ position: "absolute", left: 40, top: 50, zIndex: 4, lineHeight: 1 }}>
            {/* Dog face + body */}
            <div style={{ position: "relative", display: "inline-block" }}>
              <span style={{ fontSize: 48 }}>🐕</span>
              {/* Tail (emoji overlay won't work well, skip) */}
            </div>
          </div>

          {/* Hole in ground */}
          <div style={{
            position: "absolute", left: 52, top: 96,
            width: 56, height: 14, borderRadius: "50%",
            background: "radial-gradient(ellipse, #1a0e06 0%, #0a0a0a 100%)",
            border: "1px solid #2a1a0a",
          }} />

          {/* Ground line */}
          <div className="ground-ln" style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            height: 2, background: `linear-gradient(90deg, transparent, ${G}44, transparent)`,
          }} />
        </div>

        {/* Rotating message */}
        <div key={msgIdx} className="ldr-msg" style={{
          color: "#aaa",
          fontSize: "15px",
          fontFamily: SANS,
          fontStyle: "italic",
          letterSpacing: "0.3px",
          textAlign: "center",
          minHeight: 28,
        }}>
          {message || LOADER_MESSAGES[msgIdx]}
        </div>

        {/* Green pulse dots */}
        <div style={{ display: "flex", gap: 6, marginTop: 18 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: "50%", background: G,
              opacity: 0.4,
              animation: `digBody 0.8s ease-in-out ${i * 0.25}s infinite`,
              boxShadow: `0 0 6px ${G}`,
            }} />
          ))}
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// PHONE INPUT WITH COUNTRY CODE
// ─────────────────────────────────────────────
function PhoneInput({ value, onChange, style = {} }) {
  const [dialCode, setDialCode] = useState("+256");
  const [number, setNumber]     = useState("");

  useEffect(() => {
    const combined = dialCode + number;
    onChange(combined);
  }, [dialCode, number]);

  return (
    <div style={{ display: "flex", gap: 0, marginBottom: 4 }}>
      {/* Country code dropdown */}
      <select
        value={dialCode}
        onChange={e => setDialCode(e.target.value)}
        style={{
          background: "#f5f5f5",
          border: "1px solid #ccc",
          borderRight: "none",
          borderRadius: "2px 0 0 2px",
          padding: "12px 8px",
          fontSize: "14px",
          color: "#000",
          fontFamily: SANS,
          outline: "none",
          cursor: "pointer",
          minWidth: 86,
          flexShrink: 0,
        }}
      >
        {COUNTRIES.map((c, i) =>
          c.disabled
            ? <option key={i} disabled value="">──────</option>
            : <option key={c.code} value={c.dial}>{c.dial} {c.name}</option>
        )}
      </select>

      {/* Number field */}
      <input
        type="tel"
        placeholder="WhatsApp number"
        value={number}
        onChange={e => setNumber(e.target.value)}
        onFocus={e => { e.target.style.borderColor = G; e.target.style.outline = `1px solid ${G}`; }}
        onBlur={e  => { e.target.style.borderColor = "#ccc"; e.target.style.outline = "none"; }}
        style={{
          flex: 1,
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "0 2px 2px 0",
          padding: "12px 14px",
          fontSize: "14px",
          color: "#000",
          fontFamily: SANS,
          outline: "none",
          ...style,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────
// TELEPROMPTER
// ─────────────────────────────────────────────
function Teleprompter({ script, onClose }) {
  const vidRef    = useRef(null);
  const txtRef    = useRef(null);
  const animRef   = useRef(null);
  const streamRef = useRef(null);
  const posRef    = useRef(0);

  const [playing, setPlaying] = useState(false);
  const [speed,   setSpeed]   = useState(38);
  const [camOn,   setCamOn]   = useState(false);
  const [camErr,  setCamErr]  = useState("");

  useEffect(() => {
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
        if (vidRef.current) { vidRef.current.srcObject = s; streamRef.current = s; setCamOn(true); }
      } catch { setCamErr("Camera unavailable — script only mode."); }
    })();
    return () => {
      streamRef.current?.getTracks().forEach(t => t.stop());
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  useEffect(() => {
    if (playing && txtRef.current) {
      let last = null;
      const max = txtRef.current.scrollHeight - window.innerHeight * 0.5;
      const tick = (ts) => {
        if (last !== null) {
          posRef.current = Math.min(posRef.current + speed * (ts - last) / 1000, max);
          if (txtRef.current) txtRef.current.style.transform = `translateY(-${posRef.current}px)`;
          if (posRef.current >= max) { setPlaying(false); return; }
        }
        last = ts;
        animRef.current = requestAnimationFrame(tick);
      };
      animRef.current = requestAnimationFrame(tick);
    } else {
      if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    }
    return () => { if (animRef.current) { cancelAnimationFrame(animRef.current); animRef.current = null; } };
  }, [playing, speed]);

  const reset = () => {
    posRef.current = 0;
    if (txtRef.current) txtRef.current.style.transform = "translateY(0)";
    setPlaying(false);
  };

  const lines = script.split("\n").filter(l => l.trim());

  return (
    <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999, overflow: "hidden" }}>
      {camOn && (
        <video ref={vidRef} autoPlay playsInline muted
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", opacity: 0.28 }} />
      )}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "200px", background: "linear-gradient(transparent, #000)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "38%", left: 0, right: 0, height: "2px", background: "rgba(0,255,133,0.15)", pointerEvents: "none" }} />

      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: "160px", overflow: "hidden", padding: "56px 28px 0" }}>
        <div ref={txtRef}>
          {lines.map((line, i) => {
            const isH = line.startsWith("##") || (line === line.toUpperCase() && line.length > 4 && line.length < 40);
            return (
              <p key={i} style={{
                color: isH ? G : "#fff",
                fontSize: isH ? "12px" : "30px",
                lineHeight: isH ? 1.4 : 1.55,
                marginBottom: isH ? "4px" : "26px",
                fontFamily: SANS,
                fontWeight: isH ? 700 : 400,
                letterSpacing: isH ? "2.5px" : "0.4px",
                textShadow: "0 2px 20px rgba(0,0,0,0.95)",
              }}>
                {line.replace(/^##\s*/, "")}
              </p>
            );
          })}
          <div style={{ height: "70vh" }} />
        </div>
      </div>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 20px 32px", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", background: "rgba(0,0,0,0.9)" }}>
        <button onClick={() => setPlaying(p => !p)} style={{ background: G, color: "#000", border: "none", borderRadius: "2px", padding: "14px 28px", fontSize: "11px", fontWeight: 800, letterSpacing: "2px", cursor: "pointer", minWidth: 90, fontFamily: SANS }}>
          {playing ? "⏸ PAUSE" : "▶ START"}
        </button>
        <div style={{ display: "flex", alignItems: "center", background: "#0a0a0a", border: `1px solid ${BR}`, borderRadius: "2px" }}>
          <button onClick={() => setSpeed(s => Math.max(12, s - 8))} style={{ background: "none", border: "none", color: "#fff", padding: "10px 16px", fontSize: "20px", cursor: "pointer" }}>−</button>
          <span style={{ color: MT, fontSize: "9px", letterSpacing: "1px", padding: "0 6px", fontFamily: SANS }}>SPEED</span>
          <button onClick={() => setSpeed(s => Math.min(120, s + 8))} style={{ background: "none", border: "none", color: "#fff", padding: "10px 16px", fontSize: "20px", cursor: "pointer" }}>+</button>
        </div>
        <button onClick={reset} style={{ background: "#0a0a0a", border: `1px solid ${BR}`, color: MT, borderRadius: "2px", padding: "12px 14px", fontSize: "14px", cursor: "pointer" }}>↺</button>
        <button onClick={() => { streamRef.current?.getTracks().forEach(t => t.stop()); onClose(); }}
          style={{ marginLeft: "auto", background: "none", border: `1px solid ${BR}`, color: MT, borderRadius: "2px", padding: "12px 16px", fontSize: "10px", letterSpacing: "1.5px", cursor: "pointer", fontFamily: SANS }}>
          ✕ CLOSE
        </button>
      </div>
      {camErr && (
        <div style={{ position: "absolute", top: 12, right: 12, background: "#1a0000", border: "1px solid #330000", borderRadius: "2px", padding: "6px 12px", color: "#ff8888", fontSize: "10px" }}>
          {camErr}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const [screen,       setScreen]       = useState("loading");
  const [step,         setStep]         = useState(0);
  const [answers,      setAnswers]      = useState({});
  const [contact,      setContact]      = useState({ name: "", email: "", whatsapp: "" });
  const [streak,       setStreak]       = useState({ count: 0, lastPosted: null, best: 0, total: 0 });
  const [weekContent,  setWeekContent]  = useState(null);
  const [activeDay,    setActiveDay]    = useState(0);
  const [storyPrompt,  setStoryPrompt]  = useState(null);
  const [teleScript,   setTeleScript]   = useState("");
  const [showTele,     setShowTele]     = useState(false);
  const [milestone,    setMilestone]    = useState(null);
  const [tab,          setTab]          = useState("week");
  const [loading,      setLoading]      = useState(false);
  const [loadingWeek,  setLoadingWeek]  = useState(false);
  const [loadingStory, setLoadingStory] = useState(false);
  const [error,        setError]        = useState("");

  // ── Load premium fonts ──
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap";
    link.rel  = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const profile = load("lede_profile");
    const s       = getStreak();
    setStreak(s);
    if (profile?.answers && profile?.contact) {
      setAnswers(profile.answers);
      setContact(profile.contact);
      const saved = load("lede_week");
      if (saved?.weekStart === weekStart()) {
        setWeekContent(saved.days);
        setActiveDay(todayDayIdx(saved.days));
      } else {
        genWeek(profile.answers, profile.contact.name);
      }
      setScreen("dashboard");
      askNotifPermission();
    } else {
      setScreen("welcome");
    }
  }, []);

  const askNotifPermission = () => {
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
  };

  const todayDayIdx = (days) => {
    const names = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const t = names[new Date().getDay()];
    const i = (days || []).findIndex(d => d.day === t);
    return i >= 0 ? i : 0;
  };

  const genWeek = async (ans, name) => {
    setLoadingWeek(true);
    try {
      const res  = await fetch("/api/weekly", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers: ans, name, weekStart: weekStart() }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWeekContent(data.week);
      setActiveDay(todayDayIdx(data.week));
      save("lede_week", { weekStart: weekStart(), days: data.week });
    } catch (e) { console.error(e); }
    finally { setLoadingWeek(false); }
  };

  const genStory = async () => {
    setLoadingStory(true); setStoryPrompt(null);
    try {
      const profile = load("lede_profile");
      const res  = await fetch("/api/story", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers: profile.answers, name: profile.contact.name, date: todayStr() }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStoryPrompt(data);
    } catch (e) { console.error(e); }
    finally { setLoadingStory(false); }
  };

  const handlePosted = (idx) => {
    const newS = markPosted();
    const prev = getRank(newS.count - 1);
    const curr = getRank(newS.count);
    setStreak(newS);
    if (curr.milestone && curr.title !== prev.title) setMilestone(curr);
    if (weekContent) {
      const updated = weekContent.map((d, i) => i === idx ? { ...d, posted: true } : d);
      setWeekContent(updated);
      save("lede_week", { weekStart: weekStart(), days: updated });
    }
  };

  const handleOnboard = async () => {
    if (!contact.name.trim() || !contact.email.trim() || !contact.whatsapp.trim()) return;
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers, name: contact.name }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      save("lede_strategy", data);
      save("lede_profile", { answers, contact });
      setScreen("dashboard");
      genWeek(answers, contact.name);
      askNotifPermission();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  // ── SHARED STYLES ──
  const sh = {
    page: { minHeight: "100vh", background: BK, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, padding: "20px 16px" },
    card: { width: "100%", maxWidth: "520px", background: CD, border: `1px solid ${BR}`, borderRadius: "4px", overflow: "hidden" },
    hdr:  { padding: "20px 30px", borderBottom: `1px solid ${BR}`, display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { fontSize: "15px", fontWeight: 800, color: "#fff", letterSpacing: "6px", fontFamily: SANS },
    sub:  { fontSize: "8px", color: "#2a2a2a", letterSpacing: "3px", marginTop: "3px", fontFamily: SANS },
    dot:  { width: 8, height: 8, borderRadius: "50%", background: G, boxShadow: `0 0 10px ${G}` },
    body: { padding: "30px 30px 40px" },
    tag:  { display: "inline-block", fontSize: "9px", letterSpacing: "2.5px", fontWeight: 700, color: G, background: "#0a0a0a", padding: "5px 11px", borderRadius: "2px", marginBottom: "18px", fontFamily: SANS },
    h1:   { fontSize: "30px", fontWeight: 900, color: "#fff", lineHeight: 1.15, marginBottom: "10px", fontFamily: SANS, letterSpacing: "-0.5px" },
    h2:   { fontSize: "22px", fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: "18px", fontFamily: SANS, letterSpacing: "-0.2px" },
    para: { fontSize: "15px", color: MT, lineHeight: 1.7, marginBottom: "24px", fontFamily: SANS, fontWeight: 400 },
    prog: { display: "flex", gap: 3, marginBottom: 28 },
    bar:  (on) => ({ height: 2, flex: 1, background: on ? G : "#1e1e1e", borderRadius: 2 }),
    ta:   { width: "100%", boxSizing: "border-box", background: "#fff", border: "1px solid #ccc", borderRadius: 2, padding: "14px", color: "#000", fontSize: "15px", lineHeight: 1.75, resize: "vertical", minHeight: "152px", fontFamily: SANS, outline: "none" },
    inp:  { width: "100%", boxSizing: "border-box", background: "#fff", border: "1px solid #ccc", borderRadius: 2, padding: "13px 14px", color: "#000", fontSize: "15px", fontFamily: SANS, outline: "none", marginBottom: "10px" },
    btn:  { width: "100%", background: G, color: "#000", border: "none", borderRadius: 2, padding: "16px", fontSize: "11px", fontWeight: 800, letterSpacing: "2.5px", cursor: "pointer", marginTop: "20px", fontFamily: SANS },
    btnX: { width: "100%", background: "#141414", color: "#2a2a2a", border: "none", borderRadius: 2, padding: "16px", fontSize: "11px", fontWeight: 800, letterSpacing: "2.5px", cursor: "not-allowed", marginTop: "20px", fontFamily: SANS },
    sm:   { background: G, color: "#000", border: "none", borderRadius: 2, padding: "11px 20px", fontSize: "10px", fontWeight: 800, letterSpacing: "1.5px", cursor: "pointer", fontFamily: SANS },
    gh:   { background: "none", border: `1px solid ${BR}`, color: MT, borderRadius: 2, padding: "11px 18px", fontSize: "10px", letterSpacing: "1.5px", cursor: "pointer", fontFamily: SANS },
    bk:   { background: "none", border: "none", color: "#2a2a2a", fontSize: "12px", cursor: "pointer", padding: 0, marginTop: 12, display: "block", fontFamily: SANS },
    err:  { background: "#1a0000", border: "1px solid #440000", borderRadius: 2, padding: "10px 14px", color: "#ff5555", fontSize: "13px", marginTop: 10, fontFamily: SANS },
  };

  // ── OVERLAYS ──
  if (showTele)  return <Teleprompter script={teleScript} onClose={() => setShowTele(false)} />;

  if (milestone) return (
    <div style={sh.page}>
      <div style={{ ...sh.card, textAlign: "center" }}>
        <div style={{ padding: "52px 30px" }}>
          <div style={{ fontSize: "64px", marginBottom: 18 }}>{milestone.emoji}</div>
          <div style={{ fontSize: "9px", color: G, letterSpacing: "3px", marginBottom: 12, fontFamily: SANS }}>NEW RANK UNLOCKED</div>
          <div style={{ fontSize: "28px", fontWeight: 600, color: "#fff", fontFamily: SANS, marginBottom: 16 }}>{milestone.title}</div>
          <p style={sh.para}>You have earned this title through consistent action. Persistence turns dust to gold.</p>
          <button style={sh.btn} onClick={() => setMilestone(null)}>KEEP GOING →</button>
        </div>
      </div>
    </div>
  );

  if (screen === "loading") return (
    <div style={sh.page}><div style={{ color: G, fontSize: "10px", letterSpacing: "3px", fontFamily: SANS }}>LOADING...</div></div>
  );

  // ── WELCOME ──
  if (screen === "welcome") return (
    <div style={sh.page}>
      <div style={sh.card}>
        <div style={sh.hdr}><div><div style={sh.logo}>LEDE</div><div style={sh.sub}>BY STORY ALCHEMIST</div></div><div style={sh.dot} /></div>
        <div style={sh.body}>
          <span style={sh.tag}>FREE · 12 QUESTIONS · 30 MINUTES</span>
          <h1 style={sh.h1}>Get your First 10 Clients in 30 Days.</h1>
          <p style={{ ...sh.para, fontSize: "18px", color: "#888", fontWeight: 300, marginBottom: 8 }}>Your 1-year marketing plan created instantly.</p>
          <p style={{ ...sh.para, fontSize: "14px", marginBottom: 0 }}>Answer 12 questions. LEDE finds your USP, builds your weekly content queue, and becomes the teleprompter you film with every day.</p>
          <button style={sh.btn} onClick={() => setScreen("questions")}>FIND MY USP — FREE →</button>
          <p style={{ color: "#1e1e1e", fontSize: "12px", marginTop: 16, textAlign: "center", fontFamily: SANS, fontStyle: "italic" }}>
            Stone Ridge School: 300 → 1,300 students &nbsp;·&nbsp; Primtouch: $0 → $10K/month
          </p>
        </div>
      </div>
    </div>
  );

  // ── QUESTIONS ──
  if (screen === "questions") {
    const q  = QUESTIONS[step];
    const ok = !!answers[q.id]?.trim();
    return (
      <div style={sh.page}>
        <div style={sh.card}>
          <div style={sh.hdr}><div><div style={sh.logo}>LEDE</div><div style={sh.sub}>BY STORY ALCHEMIST</div></div><div style={sh.dot} /></div>
          <div style={sh.body}>
            <div style={sh.prog}>{QUESTIONS.map((_, i) => <div key={i} style={sh.bar(i <= step)} />)}</div>
            <span style={sh.tag}>{q.label}</span>
            <h2 style={sh.h2}>{q.q}</h2>
            <textarea style={sh.ta} placeholder={q.hint} value={answers[q.id] || ""}
              onChange={e => setAnswers(p => ({ ...p, [q.id]: e.target.value }))}
              onFocus={e => (e.target.style.borderColor = G)} onBlur={e => (e.target.style.borderColor = "#ccc")} />
            <button style={ok ? sh.btn : sh.btnX} disabled={!ok}
              onClick={() => { if (!ok) return; if (step < QUESTIONS.length - 1) setStep(s => s + 1); else setScreen("contact"); }}>
              {step === QUESTIONS.length - 1 ? "ALMOST DONE →" : "NEXT →"}
            </button>
            <button style={sh.bk} onClick={() => { if (step > 0) setStep(s => s - 1); else setScreen("welcome"); }}>← Back</button>
          </div>
        </div>
      </div>
    );
  }

  // ── CONTACT ──
  if (screen === "contact") {
    const waFilled = contact.whatsapp && contact.whatsapp !== "+256" && contact.whatsapp.replace(/\D/g, "").length > 6;
    const ok = contact.name.trim() && contact.email.trim() && waFilled && !loading;

    return (
      <div style={sh.page}>
        <div style={sh.card}>
          <div style={sh.hdr}><div><div style={sh.logo}>LEDE</div><div style={sh.sub}>BY STORY ALCHEMIST</div></div><div style={sh.dot} /></div>
          <div style={{ ...sh.body, paddingBottom: loading ? 0 : 40 }}>

            {loading ? (
              <DogLoader />
            ) : (
              <>
                <span style={sh.tag}>ONE LAST STEP</span>
                <h2 style={sh.h2}>Where do we reach you?</h2>
                <p style={{ ...sh.para, marginBottom: 22 }}>
                  Your strategy appears instantly. Daily story reminders go to your WhatsApp every morning.
                </p>

                <input style={sh.inp} placeholder="Your full name" value={contact.name}
                  onChange={e => setContact(p => ({ ...p, name: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = G)} onBlur={e => (e.target.style.borderColor = "#ccc")} />

                <input style={sh.inp} placeholder="Email address" type="email" value={contact.email}
                  onChange={e => setContact(p => ({ ...p, email: e.target.value }))}
                  onFocus={e => (e.target.style.borderColor = G)} onBlur={e => (e.target.style.borderColor = "#ccc")} />

                {/* Phone with country code */}
                <PhoneInput
                  value={contact.whatsapp}
                  onChange={val => setContact(p => ({ ...p, whatsapp: val }))}
                />
                {!waFilled && (
                  <p style={{ color: "#ff5555", fontSize: "11px", marginBottom: 10, fontFamily: SANS }}>
                    WhatsApp is required — this is where your daily prompts arrive.
                  </p>
                )}

                {error && <div style={sh.err}>{error}</div>}

                <button style={ok ? sh.btn : sh.btnX} disabled={!ok} onClick={handleOnboard}>
                  BUILD MY CONTENT ENGINE →
                </button>
                <button style={sh.bk} onClick={() => setScreen("questions")}>← Back to questions</button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── DASHBOARD ──
  if (screen === "dashboard") {
    const rank    = getRank(streak.count);
    const next    = getNextRank(streak.count);
    const posted  = streak.lastPosted === todayStr();
    const dayItem = weekContent?.[activeDay];
    const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
      <div style={{ minHeight: "100vh", background: BK, fontFamily: SANS, paddingBottom: 60 }}>

        {/* HEADER */}
        <div style={{ background: CD, borderBottom: `1px solid ${BR}`, padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20 }}>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 800, color: "#fff", letterSpacing: "5px", fontFamily: SANS }}>LEDE</div>
            <div style={{ fontSize: "7px", color: "#222", letterSpacing: "2.5px", fontFamily: SANS }}>BY STORY ALCHEMIST</div>
          </div>
          <button onClick={() => setTab("profile")} style={{ display: "flex", alignItems: "center", gap: 8, background: "#0a0a0a", border: `1px solid ${BR}`, borderRadius: 2, padding: "7px 12px", cursor: "pointer" }}>
            <span style={{ fontSize: 16 }}>{rank.emoji}</span>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "9px", color: G, letterSpacing: "1px", fontWeight: 700, fontFamily: SANS }}>{rank.title}</div>
              <div style={{ fontSize: "9px", color: MT, fontFamily: SANS }}>🔥 {streak.count} day{streak.count !== 1 ? "s" : ""}</div>
            </div>
          </button>
        </div>

        {/* NOT POSTED BANNER */}
        {!posted && (
          <div style={{ background: "#0c0c00", borderBottom: "1px solid #252500", padding: "10px 20px" }}>
            <p style={{ color: "#bbbb00", fontSize: "13px", margin: 0, fontFamily: SANS, fontStyle: "italic" }}>
              You have not posted today. Open a day below and film something.
            </p>
          </div>
        )}

        {/* TABS */}
        <div style={{ display: "flex", borderBottom: `1px solid ${BR}`, background: CD, overflowX: "auto", padding: "0 16px" }}>
          {[["week","THIS WEEK"],["story","STORY PROMPT"],["profile","MY RANK"]].map(([id, lbl]) => (
            <button key={id} onClick={() => setTab(id)} style={{ background: "none", border: "none", cursor: "pointer", padding: "13px 16px", fontSize: "9px", fontWeight: 700, letterSpacing: "2px", color: tab === id ? G : "#333", borderBottom: tab === id ? `2px solid ${G}` : "2px solid transparent", whiteSpace: "nowrap", fontFamily: SANS }}>
              {lbl}
            </button>
          ))}
        </div>

        {/* ── WEEK TAB ── */}
        {tab === "week" && (
          <div style={{ padding: "20px 16px" }}>
            {loadingWeek ? (
              <DogLoader message="Building your week of Hooksmith content…" />
            ) : weekContent ? (
              <>
                <div style={{ display: "flex", gap: 6, marginBottom: 18, overflowX: "auto", paddingBottom: 4 }}>
                  {weekContent.map((d, i) => (
                    <button key={i} onClick={() => setActiveDay(i)} style={{
                      background: activeDay === i ? G : "#0a0a0a",
                      color: activeDay === i ? "#000" : d.posted ? G : MT,
                      border: `1px solid ${activeDay === i ? G : d.posted ? "#1a3a1a" : BR}`,
                      borderRadius: 2, padding: "8px 12px", fontSize: "10px", fontWeight: 700,
                      letterSpacing: "1px", cursor: "pointer", minWidth: 48, position: "relative", fontFamily: SANS,
                    }}>
                      {d.posted && <span style={{ position: "absolute", top: -5, right: -5, fontSize: "11px" }}>✓</span>}
                      {DAY_LABELS[i]}
                    </button>
                  ))}
                </div>

                {dayItem && (
                  <div style={{ background: "#0a0a0a", border: `1px solid ${BR}`, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ padding: "14px 18px", borderBottom: `1px solid ${BR}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontSize: "9px", color: G, letterSpacing: "2px", marginBottom: 3, fontFamily: SANS }}>
                          {(dayItem.story_type || "").toUpperCase()} · {(dayItem.platform || "").toUpperCase()}
                        </div>
                        <div style={{ fontSize: "17px", color: "#fff", fontWeight: 600, fontFamily: SANS }}>{dayItem.day}</div>
                      </div>
                      {dayItem.posted && <span style={{ fontSize: "10px", color: G, letterSpacing: "1px", fontFamily: SANS }}>✓ POSTED</span>}
                    </div>

                    <div style={{ padding: "18px 18px 0" }}>
                      <div style={{ fontSize: "8px", color: MT, letterSpacing: "2px", marginBottom: 7, fontFamily: SANS }}>HOOK</div>
                      <p style={{ color: "#fff", fontSize: "17px", fontFamily: SANS, lineHeight: 1.6, fontStyle: "italic", marginBottom: 18 }}>
                        "{dayItem.hook}"
                      </p>
                    </div>

                    <div style={{ padding: "0 18px" }}>
                      <div style={{ fontSize: "8px", color: MT, letterSpacing: "2px", marginBottom: 7, fontFamily: SANS }}>SCRIPT PREVIEW</div>
                      <p style={{ color: "#555", fontSize: "14px", fontFamily: SANS, lineHeight: 1.75, marginBottom: 18 }}>
                        {(dayItem.script || "").substring(0, 220)}…
                      </p>
                    </div>

                    <div style={{ padding: "0 18px" }}>
                      <div style={{ fontSize: "8px", color: MT, letterSpacing: "2px", marginBottom: 7, fontFamily: SANS }}>CAPTION</div>
                      <p style={{ color: "#555", fontSize: "14px", fontFamily: SANS, lineHeight: 1.75, marginBottom: 18 }}>
                        {dayItem.caption}
                      </p>
                    </div>

                    <div style={{ padding: "14px 18px", borderTop: `1px solid ${BR}`, display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button style={sh.sm} onClick={() => { setTeleScript(dayItem.script || dayItem.hook); setShowTele(true); }}>
                        🎙️ FILM WITH TELEPROMPTER
                      </button>
                      {!dayItem.posted && (
                        <button style={sh.gh} onClick={() => handlePosted(activeDay)}>✓ MARK AS POSTED</button>
                      )}
                    </div>
                  </div>
                )}

                <button style={{ ...sh.gh, marginTop: 14, display: "block", width: "100%", textAlign: "center" }}
                  onClick={() => genWeek(answers, contact.name)}>
                  ↺ REGENERATE THIS WEEK
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: "60px 16px" }}>
                <button style={{ ...sh.btn, marginTop: 0 }} onClick={() => genWeek(answers, contact.name)}>
                  GENERATE THIS WEEK →
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── STORY TAB ── */}
        {tab === "story" && (
          <div style={{ padding: "20px 16px" }}>
            <div style={{ fontSize: "8px", color: MT, letterSpacing: "2px", marginBottom: 6, fontFamily: SANS }}>ON-DEMAND · AI GENERATED</div>
            <h2 style={{ ...sh.h2, marginBottom: 8 }}>Today's Story</h2>
            <p style={{ color: MT, fontSize: "14px", lineHeight: 1.75, marginBottom: 22, fontFamily: SANS }}>
              A fresh story angle built from your answers. Use for Instagram Stories, WhatsApp Status, or a 60-second reel.
            </p>

            {!storyPrompt && !loadingStory && (
              <button style={{ ...sh.btn, marginTop: 0 }} onClick={genStory}>GENERATE TODAY'S STORY →</button>
            )}

            {loadingStory && <DogLoader message="Sniffing out today's story angle…" />}

            {storyPrompt && !loadingStory && (
              <div style={{ background: "#0a0a0a", border: `1px solid ${BR}`, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ padding: "18px", borderBottom: `1px solid ${BR}` }}>
                  <div style={{ fontSize: "9px", color: G, letterSpacing: "2px", marginBottom: 8, fontFamily: SANS }}>
                    {(storyPrompt.story_type || "").toUpperCase()}
                  </div>
                  <p style={{ color: "#fff", fontSize: "19px", fontFamily: SANS, fontStyle: "italic", lineHeight: 1.55 }}>
                    "{storyPrompt.hook}"
                  </p>
                </div>
                <div style={{ padding: "18px" }}>
                  <div style={{ fontSize: "8px", color: MT, letterSpacing: "2px", marginBottom: 7, fontFamily: SANS }}>STORY DIRECTION</div>
                  <p style={{ color: "#aaa", fontSize: "14px", fontFamily: SANS, lineHeight: 1.75, marginBottom: 18 }}>{storyPrompt.prompt}</p>
                  <div style={{ fontSize: "8px", color: MT, letterSpacing: "2px", marginBottom: 7, fontFamily: SANS }}>TELEPROMPTER SCRIPT</div>
                  <p style={{ color: "#555", fontSize: "14px", fontFamily: SANS, lineHeight: 1.75 }}>
                    {(storyPrompt.script || "").substring(0, 300)}…
                  </p>
                </div>
                <div style={{ padding: "14px 18px", borderTop: `1px solid ${BR}`, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button style={sh.sm} onClick={() => { setTeleScript(storyPrompt.script || storyPrompt.hook); setShowTele(true); }}>🎙️ FILM THIS</button>
                  <button style={sh.gh} onClick={genStory}>↺ NEW PROMPT</button>
                  {!posted && <button style={sh.gh} onClick={() => handlePosted(activeDay)}>✓ MARK AS POSTED</button>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <div style={{ padding: "20px 16px" }}>
            <div style={{ background: "#0a0a0a", border: `1px solid ${BR}`, borderRadius: 4, padding: "34px 20px", textAlign: "center", marginBottom: 14 }}>
              <div style={{ fontSize: "60px", marginBottom: 14 }}>{rank.emoji}</div>
              <div style={{ fontSize: "9px", color: G, letterSpacing: "3px", marginBottom: 8, fontFamily: SANS }}>YOUR CURRENT RANK</div>
              <div style={{ fontSize: "26px", fontWeight: 600, color: "#fff", fontFamily: SANS, marginBottom: 22 }}>{rank.title}</div>

              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {[["🔥", streak.count, "STREAK"], ["⭐", streak.best || 0, "BEST"], ["📝", streak.total || 0, "TOTAL"]].map(([e, v, l]) => (
                  <div key={l} style={{ textAlign: "center", background: "#111", border: `1px solid ${BR}`, borderRadius: 2, padding: "14px 16px", flex: 1 }}>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{e}</div>
                    <div style={{ fontSize: "22px", fontWeight: 600, color: "#fff", fontFamily: SANS }}>{v}</div>
                    <div style={{ fontSize: "8px", color: MT, letterSpacing: "1.5px", fontFamily: SANS }}>{l}</div>
                  </div>
                ))}
              </div>

              {next && (
                <div style={{ marginTop: 22, textAlign: "left" }}>
                  <div style={{ fontSize: "11px", color: MT, marginBottom: 6, fontFamily: SANS }}>
                    {next.days - streak.count} more day{next.days - streak.count !== 1 ? "s" : ""} to reach&nbsp;
                    <span style={{ color: "#ccc" }}>{next.title} {next.emoji}</span>
                  </div>
                  <div style={{ background: "#1a1a1a", borderRadius: 2, height: 4 }}>
                    <div style={{ background: G, height: "100%", borderRadius: 2, width: `${Math.min(100, Math.round(((streak.count - rank.days) / Math.max(1, next.days - rank.days)) * 100))}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: "9px", color: MT, letterSpacing: "2px", marginBottom: 10, fontFamily: SANS }}>ALL RANKS</div>
            {RANKS.map(r => {
              const earned = streak.count >= r.days;
              return (
                <div key={r.title} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 14px", background: "#0a0a0a", border: `1px solid ${earned ? "#1a3a1a" : BR}`, borderRadius: 2, marginBottom: 5, opacity: earned ? 1 : 0.35 }}>
                  <span style={{ fontSize: 20, minWidth: 26 }}>{r.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", color: earned ? "#fff" : MT, fontWeight: 500, fontFamily: SANS }}>{r.title}</div>
                    <div style={{ fontSize: "10px", color: MT, fontFamily: SANS }}>{r.days === 0 ? "Starting rank" : `Post for ${r.days} consecutive days`}</div>
                  </div>
                  {earned && <span style={{ color: G, fontSize: "12px" }}>✓</span>}
                </div>
              );
            })}

            <button style={{ ...sh.gh, marginTop: 18, display: "block", width: "100%", textAlign: "center" }}
              onClick={() => { if (window.confirm("This clears all your data. Are you sure?")) { localStorage.clear(); window.location.reload(); } }}>
              RESTART FROM SCRATCH
            </button>
          </div>
        )}
      </div>
    );
  }

  return null;
}
