import React, { useState, useEffect } from "react";
import {
  getStudySessions,
  addStudySession,
  updateStudySession,
  deleteStudySession,
} from "../utils/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const CATEGORIES = [
  "DSA",
  "System Design",
  "Core Subjects",
  "Aptitude",
  "Company Research",
  "Mock Interview",
  "Resume",
  "Other",
];

const categoryColor = {
  DSA: "#6366f1",
  "System Design": "#06b6d4",
  "Core Subjects": "#f59e0b",
  Aptitude: "#8b5cf6",
  "Company Research": "#10b981",
  "Mock Interview": "#f97316",
  Resume: "#ef4444",
  Other: "#64748b",
};

const emptyForm = {
  topic: "",
  category: "DSA",
  duration: "",
  date: new Date().toISOString().split("T")[0],
  notes: "",
  productivity: 3,
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

const StudyTracker = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [filterCategory, setFilterCategory] = useState("");

  const fetchSessions = async () => {
    try {
      const { data } = await getStudySessions(
        filterCategory ? { category: filterCategory } : {},
      );
      setSessions(data);
    } catch {
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [filterCategory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateStudySession(editId, form);
        toast.success("Session updated");
      } else {
        await addStudySession(form);
        toast.success("Session logged");
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchSessions();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (session) => {
    setForm({
      topic: session.topic,
      category: session.category,
      duration: session.duration,
      date: session.date.split("T")[0],
      notes: session.notes,
      productivity: session.productivity,
    });
    setEditId(session._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this session?")) return;
    try {
      await deleteStudySession(id);
      toast.success("Session deleted");
      fetchSessions();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });

  const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f1a" }}>
      <Navbar />
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "88px 24px 48px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: "800",
                color: "#f1f5f9",
                letterSpacing: "-0.5px",
              }}
            >
              Study Tracker
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
              {sessions.length} sessions · {Math.round(totalHours / 60)}h{" "}
              {totalHours % 60}m total
            </p>
          </div>
          <button
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setForm(emptyForm);
            }}
            style={{
              padding: "10px 20px",
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontSize: "13px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Log Session
          </button>
        </div>

        {/* Category Filter */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setFilterCategory("")}
            style={{
              padding: "5px 14px",
              fontSize: "12px",
              fontWeight: "500",
              background:
                filterCategory === "" ? "rgba(99,102,241,0.15)" : "transparent",
              border: `1px solid ${filterCategory === "" ? "#6366f1" : "#2d3748"}`,
              borderRadius: "100px",
              color: filterCategory === "" ? "#818cf8" : "#64748b",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setFilterCategory(cat === filterCategory ? "" : cat)
              }
              style={{
                padding: "5px 14px",
                fontSize: "12px",
                fontWeight: "500",
                background:
                  filterCategory === cat
                    ? `${categoryColor[cat]}18`
                    : "transparent",
                border: `1px solid ${filterCategory === cat ? categoryColor[cat] : "#2d3748"}`,
                borderRadius: "100px",
                color: filterCategory === cat ? categoryColor[cat] : "#64748b",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Modal Form */}
        {showForm && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
            }}
          >
            <div
              style={{
                background: "#16213e",
                border: "1px solid #2d3748",
                borderRadius: "20px",
                padding: "32px",
                width: "100%",
                maxWidth: "480px",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <h2
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#f1f5f9",
                  marginBottom: "24px",
                  letterSpacing: "-0.3px",
                }}
              >
                {editId ? "Edit Session" : "Log Study Session"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
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
                      Topic *
                    </label>
                    <input
                      required
                      value={form.topic}
                      onChange={(e) =>
                        setForm({ ...form, topic: e.target.value })
                      }
                      placeholder="Binary Trees"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                      onBlur={(e) => (e.target.style.borderColor = "#2d3748")}
                    />
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
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
                        Category
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) =>
                          setForm({ ...form, category: e.target.value })
                        }
                        style={inputStyle}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
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
                        Duration (mins) *
                      </label>
                      <input
                        required
                        type="number"
                        value={form.duration}
                        onChange={(e) =>
                          setForm({ ...form, duration: e.target.value })
                        }
                        placeholder="60"
                        style={inputStyle}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#6366f1")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#2d3748")}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "12px",
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
                        Date
                      </label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) =>
                          setForm({ ...form, date: e.target.value })
                        }
                        style={{ ...inputStyle, colorScheme: "dark" }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#6366f1")
                        }
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
                        Productivity: {form.productivity}/5
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={form.productivity}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            productivity: Number(e.target.value),
                          })
                        }
                        style={{
                          width: "100%",
                          marginTop: "8px",
                          accentColor: "#6366f1",
                        }}
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
                      Notes
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      placeholder="What did you cover today?"
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical" }}
                      onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                      onBlur={(e) => (e.target.style.borderColor = "#2d3748")}
                    />
                  </div>
                </div>
                <div
                  style={{ display: "flex", gap: "10px", marginTop: "24px" }}
                >
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "11px",
                      background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                      border: "none",
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    {editId ? "Update" : "Log Session"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditId(null);
                    }}
                    style={{
                      padding: "11px 20px",
                      background: "transparent",
                      border: "1px solid #2d3748",
                      borderRadius: "10px",
                      color: "#64748b",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Sessions List */}
        {loading ? (
          <div
            style={{ padding: "48px", textAlign: "center", color: "#64748b" }}
          >
            Loading...
          </div>
        ) : sessions.length === 0 ? (
          <div
            style={{
              background: "#16213e",
              border: "1px solid #2d3748",
              borderRadius: "16px",
              padding: "64px",
              textAlign: "center",
            }}
          >
            <p style={{ color: "#64748b", fontSize: "15px" }}>
              No sessions logged yet
            </p>
            <p style={{ color: "#374151", fontSize: "13px", marginTop: "8px" }}>
              Start tracking your study sessions
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {sessions.map((session) => (
              <div
                key={session._id}
                style={{
                  background: "#16213e",
                  border: "1px solid #2d3748",
                  borderRadius: "12px",
                  padding: "18px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "12px",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "#374151")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "#2d3748")
                }
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "14px" }}
                >
                  <div
                    style={{
                      width: "4px",
                      height: "40px",
                      background: categoryColor[session.category] || "#64748b",
                      borderRadius: "2px",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        color: "#f1f5f9",
                        letterSpacing: "-0.2px",
                      }}
                    >
                      {session.topic}
                    </p>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "2px",
                      }}
                    >
                      {session.category} · {formatDate(session.date)}
                    </p>
                  </div>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <div style={{ textAlign: "right" }}>
                    <p
                      style={{
                        fontSize: "15px",
                        fontWeight: "700",
                        color: "#f1f5f9",
                      }}
                    >
                      {Math.floor(session.duration / 60)}h{" "}
                      {session.duration % 60}m
                    </p>
                    <p style={{ fontSize: "11px", color: "#64748b" }}>
                      {"★".repeat(session.productivity)}
                      {"☆".repeat(5 - session.productivity)}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleEdit(session)}
                      style={{
                        padding: "5px 12px",
                        fontSize: "11px",
                        fontWeight: "500",
                        background: "rgba(99,102,241,0.1)",
                        border: "1px solid rgba(99,102,241,0.2)",
                        borderRadius: "6px",
                        color: "#818cf8",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(session._id)}
                      style={{
                        padding: "5px 12px",
                        fontSize: "11px",
                        fontWeight: "500",
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.2)",
                        borderRadius: "6px",
                        color: "#ef4444",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyTracker;
