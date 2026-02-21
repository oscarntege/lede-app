import { useState } from "react";

const questions = [
  {
    id: "business",
    label: "STEP 1 OF 5",
    question: "What does your business do?",
    placeholder: "e.g. I run a hotel in Kampala that caters to business travellers...",
    type: "textarea",
  },
  {
    id: "customer",
    label: "STEP 2 OF 5",
    question: "Who is your ideal customer?",
    placeholder: "e.g. Business owners aged 30-50 who want professional accommodation...",
    type: "textarea",
  },
  {
    id: "challenge",
    label: "STEP 3 OF 5",
    question: "What is your biggest marketing challenge right now?",
    placeholder: "e.g. People don't know we exist. We rely on word of mouth and it is not consistent...",
    type: "textarea",
  },
  {
    id: "tried",
    label: "STEP 4 OF 5",
    question: "What marketing have you tried before?",
    placeholder: "e.g. We tried Facebook ads but wasted money. We post on Instagram but get no results...",
    type: "textarea",
  },
  {
    id: "goal",
    label: "STEP 5 OF 5",
    question: "What does success look like for you in 12 months?",
    placeholder: "e.g. I want to be fully booked every weekend and have a waiting list...",
    type: "textarea",
  },
];

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [contactInfo, setContactInfo] = useState({ name: "", email: "", whatsapp: "" });
  const [strategy, setStrategy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentQuestion = questions[currentStep];

  const handleNext = () => {
    if (!answers[currentQuestion.id]?.trim()) return;
    if (currentStep < questions.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setScreen("contact");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    } else {
      setScreen("welcome");
    }
  };

  const handleSubmit = async () => {
    if (!contactInfo.name.trim() || !contactInfo.email.trim()) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, name: contactInfo.name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setStrategy(data.strategy);
      setScreen("result");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatStrategy = (text) => {
    return text.split("\n").map((line, i) => {
      if (!line.trim()) return <br key={i} />;
      const isHeader =
        line.startsWith("YOUR ") ||
        line.startsWith("MONTHS ") ||
        line.includes("PRIORITY");
      if (isHeader) {
        return (
          <p key={i} style={{ color: "#00FF85", fontWeight: "700", marginTop: "28px", marginBottom: "8px", fontSize: "13px", letterSpacing: "1.5px" }}>
            {line}
          </p>
        );
      }
      return (
        <p key={i} style={{ marginBottom: "10px", lineHeight: "1.7", color: "#d4d4d4" }}>
          {line}
        </p>
      );
    });
  };

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#080808",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      padding: "20px",
    },
    card: {
      width: "100%",
      maxWidth: "580px",
      background: "#111",
      border: "1px solid #222",
      borderRadius: "4px",
      padding: "48px",
    },
    logo: {
      fontSize: "22px",
      fontWeight: "800",
      color: "#fff",
      letterSpacing: "4px",
      marginBottom: "8px",
    },
    logoSub: {
      fontSize: "11px",
      color: "#555",
      letterSpacing: "2px",
      marginBottom: "48px",
    },
    label: {
      fontSize: "11px",
      color: "#00FF85",
      letterSpacing: "2px",
      fontWeight: "600",
      marginBottom: "16px",
      display: "block",
    },
    heading: {
      fontSize: "26px",
      fontWeight: "700",
      color: "#fff",
      lineHeight: "1.3",
      marginBottom: "28px",
    },
    textarea: {
      width: "100%",
      background: "#0a0a0a",
      border: "1px solid #2a2a2a",
      borderRadius: "3px",
      padding: "16px",
      color: "#fff",
      fontSize: "15px",
      lineHeight: "1.6",
      resize: "vertical",
      minHeight: "120px",
      fontFamily: "inherit",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
    },
    input: {
      width: "100%",
      background: "#0a0a0a",
      border: "1px solid #2a2a2a",
      borderRadius: "3px",
      padding: "14px 16px",
      color: "#fff",
      fontSize: "15px",
      fontFamily: "inherit",
      outline: "none",
      boxSizing: "border-box",
      marginBottom: "14px",
    },
    btn: {
      width: "100%",
      background: "#00FF85",
      color: "#000",
      border: "none",
      borderRadius: "3px",
      padding: "16px",
      fontSize: "14px",
      fontWeight: "700",
      letterSpacing: "1.5px",
      cursor: "pointer",
      marginTop: "24px",
    },
    btnDisabled: {
      width: "100%",
      background: "#1a1a1a",
      color: "#444",
      border: "none",
      borderRadius: "3px",
      padding: "16px",
      fontSize: "14px",
      fontWeight: "700",
      letterSpacing: "1.5px",
      cursor: "not-allowed",
      marginTop: "24px",
    },
    back: {
      background: "none",
      border: "none",
      color: "#444",
      fontSize: "13px",
      cursor: "pointer",
      padding: "0",
      marginTop: "16px",
      display: "block",
    },
    progress: {
      display: "flex",
      gap: "6px",
      marginBottom: "40px",
    },
    bar: (active) => ({
      height: "2px",
      flex: 1,
      background: active ? "#00FF85" : "#1e1e1e",
    }),
    error: {
      background: "#1a0a0a",
      border: "1px solid #400",
      borderRadius: "3px",
      padding: "12px 16px",
      color: "#ff5555",
      fontSize: "14px",
      marginTop: "16px",
    },
    resultBox: {
      background: "#0a0a0a",
      border: "1px solid #1e1e1e",
      borderRadius: "3px",
      padding: "28px",
      maxHeight: "480px",
      overflowY: "auto",
      fontSize: "15px",
    },
  };

  // WELCOME SCREEN
  if (screen === "welcome") {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>LEDE</div>
          <div style={styles.logoSub}>BY STORY ALCHEMIST</div>
          <span style={styles.label}>FREE STRATEGY SESSION</span>
          <h1 style={{ ...styles.heading, fontSize: "32px" }}>
            Get your personalized 12-month marketing strategy in 5 minutes.
          </h1>
          <p style={{ color: "#555", fontSize: "15px", lineHeight: "1.7", marginBottom: "36px" }}>
            Answer 5 quick questions about your business. Our AI will build you a custom strategy based on your specific situation. No fluff. No generic advice.
          </p>
          <button style={styles.btn} onClick={() => setScreen("questions")}>
            BUILD MY STRATEGY →
          </button>
        </div>
      </div>
    );
  }

  // QUESTIONS SCREEN
  if (screen === "questions") {
    const answered = !!answers[currentQuestion.id]?.trim();
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>LEDE</div>
          <div style={styles.progress}>
            {questions.map((_, i) => (
              <div key={i} style={styles.bar(i <= currentStep)} />
            ))}
          </div>
          <span style={styles.label}>{currentQuestion.label}</span>
          <h2 style={styles.heading}>{currentQuestion.question}</h2>
          <textarea
            style={styles.textarea}
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.id] || ""}
            onChange={(e) =>
              setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))
            }
            onFocus={(e) => (e.target.style.borderColor = "#00FF85")}
            onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
          />
          <button
            style={answered ? styles.btn : styles.btnDisabled}
            onClick={handleNext}
            disabled={!answered}
          >
            {currentStep === questions.length - 1 ? "ALMOST DONE →" : "NEXT QUESTION →"}
          </button>
          <button style={styles.back} onClick={handleBack}>
            ← Back
          </button>
        </div>
      </div>
    );
  }

  // CONTACT SCREEN
  if (screen === "contact") {
    const canSubmit = contactInfo.name.trim() && contactInfo.email.trim() && !loading;
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logo}>LEDE</div>
          <div style={styles.logoSub}>BY STORY ALCHEMIST</div>
          <span style={styles.label}>ALMOST READY</span>
          <h2 style={styles.heading}>Where do we send your strategy?</h2>
          <p style={{ color: "#555", fontSize: "14px", marginBottom: "28px" }}>
            Your first two sections are free. Enter your details to unlock your full strategy now.
          </p>
          <input
            style={styles.input}
            placeholder="Your name"
            value={contactInfo.name}
            onChange={(e) => setContactInfo((p) => ({ ...p, name: e.target.value }))}
            onFocus={(e) => (e.target.style.borderColor = "#00FF85")}
            onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
          />
          <input
            style={styles.input}
            placeholder="Email address"
            type="email"
            value={contactInfo.email}
            onChange={(e) => setContactInfo((p) => ({ ...p, email: e.target.value }))}
            onFocus={(e) => (e.target.style.borderColor = "#00FF85")}
            onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
          />
          <input
            style={{ ...styles.input, marginBottom: "0" }}
            placeholder="WhatsApp number (optional)"
            value={contactInfo.whatsapp}
            onChange={(e) => setContactInfo((p) => ({ ...p, whatsapp: e.target.value }))}
            onFocus={(e) => (e.target.style.borderColor = "#00FF85")}
            onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
          />
          <p style={{ color: "#333", fontSize: "12px", marginTop: "10px" }}>
            We send you implementation tips and workshop invites. No spam. Unsubscribe any time.
          </p>
          {error && <div style={styles.error}>{error}</div>}
          <button
            style={canSubmit ? styles.btn : styles.btnDisabled}
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {loading ? "BUILDING YOUR STRATEGY..." : "BUILD MY STRATEGY →"}
          </button>
          <button style={styles.back} onClick={() => setScreen("questions")}>
            ← Back to questions
          </button>
        </div>
      </div>
    );
  }

  // RESULT SCREEN
  if (screen === "result") {
    return (
      <div style={styles.page}>
        <div style={{ ...styles.card, maxWidth: "680px" }}>
          <div style={styles.logo}>LEDE</div>
          <div style={styles.logoSub}>BY STORY ALCHEMIST</div>
          <span style={styles.label}>YOUR PERSONAL STRATEGY</span>
          <h2 style={{ ...styles.heading, marginBottom: "24px" }}>
            Here is your 12-month marketing strategy, {contactInfo.name.split(" ")[0]}.
          </h2>
          <div style={styles.resultBox}>{formatStrategy(strategy)}</div>
          <div style={{ marginTop: "28px", padding: "20px", background: "#0a0a0a", border: "1px solid #1e1e1e", borderRadius: "3px" }}>
            <p style={{ color: "#555", fontSize: "13px", marginBottom: "10px", letterSpacing: "1px" }}>WANT HELP EXECUTING THIS?</p>
            <p style={{ color: "#fff", fontSize: "15px", lineHeight: "1.6" }}>
              Oscar Ntege and the Brand 4:44 team turn strategies like this into real results. Schools, hotels, and businesses across Uganda have grown using this same system.
            </p>
            <p style={{ color: "#00FF85", fontSize: "14px", marginTop: "14px", fontWeight: "600" }}>
              WhatsApp: +256 752 884 230 &nbsp;·&nbsp; hello@oscarntege.net
            </p>
          </div>
          <button style={{ ...styles.btn, marginTop: "20px" }} onClick={() => { setScreen("welcome"); setAnswers({}); setContactInfo({ name: "", email: "", whatsapp: "" }); setCurrentStep(0); setStrategy(""); }}>
            START OVER
          </button>
        </div>
      </div>
    );
  }

  return null;
}
