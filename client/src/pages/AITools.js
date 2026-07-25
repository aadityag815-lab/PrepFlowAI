import React, { useState } from "react";
import { generateStudyPlan, analyzeInterviewExperience } from "../utils/api";
import { getDSAStats, getStudyStats } from "../utils/api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const AITools = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("planner");

  // Study Planner
  const [plannerForm, setPlannerForm] = useState({
    availableHours: "4",
    targetDate: "",
    targetCompanies: "",
  });
  const [studyPlan, setStudyPlan] = useState("");
  const [planLoading, setPlanLoading] = useState(false);

  // Interview Analyzer
  const [experience, setExperience] = useState("");
  const [summary, setSummary] = useState("");
  const [analyzeLoading, setAnalyzeLoading] = useState(false);

  const handleGeneratePlan = async () => {
    setPlanLoading(true);
    setStudyPlan("");
    try {
      const [dsaStats, studyStats] = await Promise.all([
        getDSAStats(),
        getStudyStats(),
      ]);
      const { data } = await generateStudyPlan({
        dsaStats: dsaStats.data,
        studyStats: studyStats.data,
        targetCompanies: plannerForm.targetCompanies
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        availableHours: plannerForm.availableHours,
        targetDate: plannerForm.targetDate,
      });
      setStudyPlan(data.plan);
      toast.success("Study plan generated");
    } catch {
      toast.error("Failed to generate plan");
    } finally {
      setPlanLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!experience.trim())
      return toast.error("Please paste an interview experience");
    setAnalyzeLoading(true);
    setSummary("");
    try {
      const { data } = await analyzeInterviewExperience({ experience });
      setSummary(data.summary);
      toast.success("Analysis complete");
    } catch {
      toast.error("Failed to analyze");
    } finally {
      setAnalyzeLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    background: "#0f0f1a",
    border: "1px solid #2d3748",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: "13px",
    outline: "none",
    boxSizing: "border-box",
  };

  const formatOutput = (text) => {
    return text.split("\n").map((line, i) => {
      if (
        line.startsWith("### ") ||
        line.startsWith("## ") ||
        line.startsWith("# ")
      ) {
        return (
          <p
            key={i}
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "#f1f5f9",
              marginTop: "20px",
              marginBottom: "8px",
              letterSpacing: "-0.3px",
            }}
          >
            {line.replace(/^#+\s/, "")}
          </p>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p
            key={i}
            style={{
              fontSize: "13px",
              fontWeight: "600",
              color: "#cbd5e1",
              marginTop: "12px",
              marginBottom: "4px",
            }}
          >
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (
        line.startsWith("- ") ||
        line.startsWith("* ") ||
        line.startsWith("+ ")
      ) {
        return (
          <div
            key={i}
            style={{ display: "flex", gap: "8px", marginBottom: "4px" }}
          >
            <span
              style={{
                color: "#6366f1",
                fontSize: "13px",
                flexShrink: 0,
                marginTop: "1px",
              }}
            >
              —
            </span>
            <p
              style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" }}
            >
              {line.replace(/^[-*+]\s/, "").replace(/\*\*/g, "")}
            </p>
          </div>
        );
      }
      if (line.match(/^\d+\./)) {
        return (
          <div
            key={i}
            style={{ display: "flex", gap: "8px", marginBottom: "4px" }}
          >
            <span
              style={{
                color: "#6366f1",
                fontSize: "13px",
                flexShrink: 0,
                fontWeight: "600",
              }}
            >
              {line.match(/^\d+/)[0]}.
            </span>
            <p
              style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.6" }}
            >
              {line.replace(/^\d+\.\s/, "").replace(/\*\*/g, "")}
            </p>
          </div>
        );
      }
      if (line.trim() === "") return <div key={i} style={{ height: "8px" }} />;
      return (
        <p
          key={i}
          style={{
            fontSize: "13px",
            color: "#94a3b8",
            lineHeight: "1.7",
            marginBottom: "4px",
          }}
        >
          {line.replace(/\*\*/g, "")}
        </p>
      );
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "88px 24px 48px",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#f1f5f9",
              letterSpacing: "-0.5px",
            }}
          >
            AI Tools
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
            Powered by Llama 3.3 — built to accelerate your prep
          </p>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            gap: "4px",
            background: "#16213e",
            border: "1px solid #2d3748",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "28px",
            width: "fit-content",
          }}
        >
          {[
            { id: "planner", label: "Study Planner" },
            { id: "analyzer", label: "Interview Analyzer" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "9px 20px",
                background:
                  activeTab === tab.id
                    ? "linear-gradient(135deg, #6366f1, #06b6d4)"
                    : "transparent",
                border: "none",
                borderRadius: "9px",
                color: activeTab === tab.id ? "white" : "#64748b",
                fontSize: "13px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: "-0.1px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Study Planner Tab */}
        {activeTab === "planner" && (
          <div>
            <div
              style={{
                background: "#16213e",
                border: "1px solid #2d3748",
                borderRadius: "16px",
                padding: "28px",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#f1f5f9",
                  marginBottom: "6px",
                  letterSpacing: "-0.3px",
                }}
              >
                Personalized Study Plan
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  marginBottom: "24px",
                }}
              >
                AI will analyze your DSA progress and study history to generate
                a tailored weekly plan.
              </p>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "16px",
                  }}
                >
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        fontWeight: "500",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Available Hours per Day
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="16"
                      value={plannerForm.availableHours}
                      onChange={(e) =>
                        setPlannerForm({
                          ...plannerForm,
                          availableHours: e.target.value,
                        })
                      }
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                      onBlur={(e) => (e.target.style.borderColor = "#2d3748")}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        fontSize: "12px",
                        color: "#94a3b8",
                        fontWeight: "500",
                        display: "block",
                        marginBottom: "6px",
                      }}
                    >
                      Target Date
                    </label>
                    <input
                      type="date"
                      value={plannerForm.targetDate}
                      onChange={(e) =>
                        setPlannerForm({
                          ...plannerForm,
                          targetDate: e.target.value,
                        })
                      }
                      style={{ ...inputStyle, colorScheme: "dark" }}
                      onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                      onBlur={(e) => (e.target.style.borderColor = "#2d3748")}
                    />
                  </div>
                </div>
                <div>
                  <label
                    style={{
                      fontSize: "12px",
                      color: "#94a3b8",
                      fontWeight: "500",
                      display: "block",
                      marginBottom: "6px",
                    }}
                  >
                    Target Companies{" "}
                    <span style={{ color: "#374151" }}>(comma separated)</span>
                  </label>
                  <input
                    value={plannerForm.targetCompanies}
                    onChange={(e) =>
                      setPlannerForm({
                        ...plannerForm,
                        targetCompanies: e.target.value,
                      })
                    }
                    placeholder="Google, Microsoft, Amazon"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.target.style.borderColor = "#2d3748")}
                  />
                </div>

                <button
                  onClick={handleGeneratePlan}
                  disabled={planLoading}
                  style={{
                    padding: "12px 24px",
                    background: planLoading
                      ? "#374151"
                      : "linear-gradient(135deg, #6366f1, #06b6d4)",
                    border: "none",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: planLoading ? "not-allowed" : "pointer",
                    width: "fit-content",
                    letterSpacing: "-0.1px",
                  }}
                >
                  {planLoading ? "Generating plan..." : "Generate Study Plan"}
                </button>
              </div>
            </div>

            {/* Plan Output */}
            {planLoading && (
              <div
                style={{
                  background: "#16213e",
                  border: "1px solid #2d3748",
                  borderRadius: "16px",
                  padding: "40px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "3px solid #6366f1",
                    borderTop: "3px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 16px",
                  }}
                />
                <p style={{ color: "#64748b", fontSize: "14px" }}>
                  Analyzing your progress and generating plan...
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {studyPlan && !planLoading && (
              <div
                style={{
                  background: "#16213e",
                  border: "1px solid #2d3748",
                  borderRadius: "16px",
                  padding: "28px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#f1f5f9",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    Your Personalized Plan
                  </h3>
                  <button
                    onClick={() =>
                      navigator.clipboard
                        .writeText(studyPlan)
                        .then(() => toast.success("Copied"))
                    }
                    style={{
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      borderRadius: "7px",
                      color: "#818cf8",
                      cursor: "pointer",
                    }}
                  >
                    Copy
                  </button>
                </div>
                <div style={{ lineHeight: "1.7" }}>
                  {formatOutput(studyPlan)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Interview Analyzer Tab */}
        {activeTab === "analyzer" && (
          <div>
            <div
              style={{
                background: "#16213e",
                border: "1px solid #2d3748",
                borderRadius: "16px",
                padding: "28px",
                marginBottom: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#f1f5f9",
                  marginBottom: "6px",
                  letterSpacing: "-0.3px",
                }}
              >
                Interview Experience Analyzer
              </h2>
              <p
                style={{
                  fontSize: "13px",
                  color: "#64748b",
                  marginBottom: "24px",
                }}
              >
                Paste any interview experience and AI will extract key rounds,
                topics, difficulty, and tips.
              </p>

              <div>
                <label
                  style={{
                    fontSize: "12px",
                    color: "#94a3b8",
                    fontWeight: "500",
                    display: "block",
                    marginBottom: "8px",
                  }}
                >
                  Paste Interview Experience
                </label>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Paste the full interview experience here — from any source like GeeksForGeeks, LeetCode Discuss, or your own notes..."
                  rows={10}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                    lineHeight: "1.6",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#2d3748")}
                />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "12px",
                  }}
                >
                  <p style={{ fontSize: "12px", color: "#374151" }}>
                    {experience.length} characters
                  </p>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzeLoading}
                    style={{
                      padding: "11px 24px",
                      background: analyzeLoading
                        ? "#374151"
                        : "linear-gradient(135deg, #6366f1, #06b6d4)",
                      border: "none",
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: analyzeLoading ? "not-allowed" : "pointer",
                      letterSpacing: "-0.1px",
                    }}
                  >
                    {analyzeLoading ? "Analyzing..." : "Analyze Experience"}
                  </button>
                </div>
              </div>
            </div>

            {/* Analysis Output */}
            {analyzeLoading && (
              <div
                style={{
                  background: "#16213e",
                  border: "1px solid #2d3748",
                  borderRadius: "16px",
                  padding: "40px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    border: "3px solid #6366f1",
                    borderTop: "3px solid transparent",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto 16px",
                  }}
                />
                <p style={{ color: "#64748b", fontSize: "14px" }}>
                  Analyzing interview experience...
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            )}

            {summary && !analyzeLoading && (
              <div
                style={{
                  background: "#16213e",
                  border: "1px solid #2d3748",
                  borderRadius: "16px",
                  padding: "28px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      color: "#f1f5f9",
                      letterSpacing: "-0.2px",
                    }}
                  >
                    Analysis Summary
                  </h3>
                  <button
                    onClick={() =>
                      navigator.clipboard
                        .writeText(summary)
                        .then(() => toast.success("Copied"))
                    }
                    style={{
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      borderRadius: "7px",
                      color: "#818cf8",
                      cursor: "pointer",
                    }}
                  >
                    Copy
                  </button>
                </div>
                <div style={{ lineHeight: "1.7" }}>{formatOutput(summary)}</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AITools;
