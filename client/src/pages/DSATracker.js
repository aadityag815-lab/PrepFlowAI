import React, { useState, useEffect } from "react";
import {
  getDSAProblems,
  addDSAProblem,
  updateDSAProblem,
  deleteDSAProblem,
} from "../utils/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const TOPICS = [
  "Array",
  "String",
  "LinkedList",
  "Tree",
  "Graph",
  "Dynamic Programming",
  "Recursion",
  "Backtracking",
  "Stack",
  "Queue",
  "Heap",
  "Hashing",
  "Sorting",
  "Binary Search",
  "Greedy",
  "Math",
  "Other",
];

const PLATFORMS = [
  "LeetCode",
  "GeeksforGeeks",
  "Codeforces",
  "HackerRank",
  "InterviewBit",
  "Other",
];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const STATUSES = ["To Do", "Attempted", "Solved"];

const difficultyColor = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#ef4444" };
const statusColor = {
  Solved: "#10b981",
  Attempted: "#f59e0b",
  "To Do": "#64748b",
};

const emptyForm = {
  title: "",
  platform: "LeetCode",
  difficulty: "Medium",
  topic: "Array",
  status: "To Do",
  notes: "",
  url: "",
  timeSpent: "",
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

const selectStyle = { ...inputStyle };

const DSATracker = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    difficulty: "",
    topic: "",
  });
  const [search, setSearch] = useState("");

  const fetchProblems = async () => {
    try {
      const { data } = await getDSAProblems(filters);
      setProblems(data);
    } catch {
      toast.error("Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProblems();
  }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateDSAProblem(editId, form);
        toast.success("Problem updated");
      } else {
        await addDSAProblem(form);
        toast.success("Problem added");
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchProblems();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (problem) => {
    setForm({
      title: problem.title,
      platform: problem.platform,
      difficulty: problem.difficulty,
      topic: problem.topic,
      status: problem.status,
      notes: problem.notes,
      url: problem.url,
      timeSpent: problem.timeSpent,
    });
    setEditId(problem._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this problem?")) return;
    try {
      await deleteDSAProblem(id);
      toast.success("Problem deleted");
      fetchProblems();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = problems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

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
            marginBottom: "32px",
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
              DSA Tracker
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
              {problems.length} problems logged
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
            Add Problem
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, width: "220px" }}
          />
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            style={{ ...selectStyle, width: "140px" }}
          >
            <option value="">All Status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({ ...filters, difficulty: e.target.value })
            }
            style={{ ...selectStyle, width: "140px" }}
          >
            <option value="">All Difficulty</option>
            {DIFFICULTIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={filters.topic}
            onChange={(e) => setFilters({ ...filters, topic: e.target.value })}
            style={{ ...selectStyle, width: "160px" }}
          >
            <option value="">All Topics</option>
            {TOPICS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
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
                maxWidth: "520px",
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
                {editId ? "Edit Problem" : "Add Problem"}
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
                      Problem Title *
                    </label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="Two Sum"
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
                        Platform
                      </label>
                      <select
                        value={form.platform}
                        onChange={(e) =>
                          setForm({ ...form, platform: e.target.value })
                        }
                        style={selectStyle}
                      >
                        {PLATFORMS.map((p) => (
                          <option key={p} value={p}>
                            {p}
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
                        Difficulty
                      </label>
                      <select
                        value={form.difficulty}
                        onChange={(e) =>
                          setForm({ ...form, difficulty: e.target.value })
                        }
                        style={selectStyle}
                      >
                        {DIFFICULTIES.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
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
                        Topic
                      </label>
                      <select
                        value={form.topic}
                        onChange={(e) =>
                          setForm({ ...form, topic: e.target.value })
                        }
                        style={selectStyle}
                      >
                        {TOPICS.map((t) => (
                          <option key={t} value={t}>
                            {t}
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
                        Status
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                        style={selectStyle}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
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
                      Problem URL
                    </label>
                    <input
                      value={form.url}
                      onChange={(e) =>
                        setForm({ ...form, url: e.target.value })
                      }
                      placeholder="https://leetcode.com/problems/..."
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
                      Time Spent (mins)
                    </label>
                    <input
                      type="number"
                      value={form.timeSpent}
                      onChange={(e) =>
                        setForm({ ...form, timeSpent: e.target.value })
                      }
                      placeholder="30"
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
                      Notes
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      placeholder="Approach, key insight..."
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
                    {editId ? "Update" : "Add Problem"}
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

        {/* Problems Table */}
        <div
          style={{
            background: "#16213e",
            border: "1px solid #2d3748",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div
              style={{ padding: "48px", textAlign: "center", color: "#64748b" }}
            >
              Loading...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: "64px", textAlign: "center" }}>
              <p style={{ color: "#64748b", fontSize: "15px" }}>
                No problems found
              </p>
              <p
                style={{ color: "#374151", fontSize: "13px", marginTop: "8px" }}
              >
                Add your first problem to get started
              </p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #2d3748" }}>
                  {[
                    "Title",
                    "Platform",
                    "Topic",
                    "Difficulty",
                    "Status",
                    "Time",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "12px 16px",
                        textAlign: "left",
                        fontSize: "11px",
                        fontWeight: "600",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={p._id}
                    style={{
                      borderBottom:
                        i < filtered.length - 1 ? "1px solid #1e2a4a" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "#1a1f3e")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "14px 16px" }}>
                      {p.url ? (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            color: "#f1f5f9",
                            fontSize: "13px",
                            fontWeight: "500",
                            textDecoration: "none",
                          }}
                          onMouseEnter={(e) =>
                            (e.target.style.color = "#818cf8")
                          }
                          onMouseLeave={(e) =>
                            (e.target.style.color = "#f1f5f9")
                          }
                        >
                          {p.title}
                        </a>
                      ) : (
                        <span
                          style={{
                            color: "#f1f5f9",
                            fontSize: "13px",
                            fontWeight: "500",
                          }}
                        >
                          {p.title}
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      {p.platform}
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      {p.topic}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: difficultyColor[p.difficulty],
                          background: `${difficultyColor[p.difficulty]}18`,
                          padding: "3px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        {p.difficulty}
                      </span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: "600",
                          color: statusColor[p.status],
                          background: `${statusColor[p.status]}18`,
                          padding: "3px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "14px 16px",
                        fontSize: "12px",
                        color: "#64748b",
                      }}
                    >
                      {p.timeSpent ? `${p.timeSpent}m` : "-"}
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => handleEdit(p)}
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
                          onClick={() => handleDelete(p._id)}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DSATracker;
