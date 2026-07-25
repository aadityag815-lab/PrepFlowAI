import React, { useState, useEffect } from "react";
import {
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany,
} from "../utils/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const STATUSES = [
  "Wishlist",
  "Applied",
  "OA Received",
  "OA Done",
  "Interview Scheduled",
  "Interview Done",
  "Offer Received",
  "Rejected",
];

const statusColor = {
  Wishlist: "#64748b",
  Applied: "#6366f1",
  "OA Received": "#06b6d4",
  "OA Done": "#8b5cf6",
  "Interview Scheduled": "#f59e0b",
  "Interview Done": "#f97316",
  "Offer Received": "#10b981",
  Rejected: "#ef4444",
};

const emptyForm = {
  companyName: "",
  role: "",
  status: "Wishlist",
  ctc: "",
  location: "",
  jobLink: "",
  appliedDate: "",
  notes: "",
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

const CompanyTracker = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [search, setSearch] = useState("");

  const fetchCompanies = async () => {
    try {
      const { data } = await getCompanies(
        filterStatus ? { status: filterStatus } : {},
      );
      setCompanies(data);
    } catch {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [filterStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCompany(editId, form);
        toast.success("Application updated");
      } else {
        await addCompany(form);
        toast.success("Application added");
      }
      setForm(emptyForm);
      setEditId(null);
      setShowForm(false);
      fetchCompanies();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (company) => {
    setForm({
      companyName: company.companyName,
      role: company.role,
      status: company.status,
      ctc: company.ctc,
      location: company.location,
      jobLink: company.jobLink,
      appliedDate: company.appliedDate ? company.appliedDate.split("T")[0] : "",
      notes: company.notes,
    });
    setEditId(company._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    try {
      await deleteCompany(id);
      toast.success("Application deleted");
      fetchCompanies();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = companies.filter(
    (c) =>
      c.companyName.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()),
  );

  // Group by status
  const grouped = STATUSES.reduce((acc, status) => {
    const items = filtered.filter((c) => c.status === status);
    if (items.length > 0) acc[status] = items;
    return acc;
  }, {});

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
              Company Tracker
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
              {companies.length} applications tracked
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
            Add Application
          </button>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Search company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, width: "240px" }}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ ...inputStyle, width: "180px" }}
          >
            <option value="">All Status</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Status pills summary */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "28px",
            flexWrap: "wrap",
          }}
        >
          {STATUSES.map((s) => {
            const count = companies.filter((c) => c.status === s).length;
            if (count === 0) return null;
            return (
              <div
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? "" : s)}
                style={{
                  padding: "5px 12px",
                  background:
                    filterStatus === s
                      ? `${statusColor[s]}22`
                      : "rgba(255,255,255,0.03)",
                  border: `1px solid ${filterStatus === s ? statusColor[s] : "#2d3748"}`,
                  borderRadius: "100px",
                  fontSize: "12px",
                  fontWeight: "500",
                  color: filterStatus === s ? statusColor[s] : "#64748b",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {s} · {count}
              </div>
            );
          })}
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
                {editId ? "Edit Application" : "Add Application"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
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
                        Company Name *
                      </label>
                      <input
                        required
                        value={form.companyName}
                        onChange={(e) =>
                          setForm({ ...form, companyName: e.target.value })
                        }
                        placeholder="Google"
                        style={inputStyle}
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
                        Role *
                      </label>
                      <input
                        required
                        value={form.role}
                        onChange={(e) =>
                          setForm({ ...form, role: e.target.value })
                        }
                        placeholder="SDE-1"
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
                        Status
                      </label>
                      <select
                        value={form.status}
                        onChange={(e) =>
                          setForm({ ...form, status: e.target.value })
                        }
                        style={inputStyle}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
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
                        CTC
                      </label>
                      <input
                        value={form.ctc}
                        onChange={(e) =>
                          setForm({ ...form, ctc: e.target.value })
                        }
                        placeholder="12 LPA"
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
                        Location
                      </label>
                      <input
                        value={form.location}
                        onChange={(e) =>
                          setForm({ ...form, location: e.target.value })
                        }
                        placeholder="Bangalore"
                        style={inputStyle}
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
                        Applied Date
                      </label>
                      <input
                        type="date"
                        value={form.appliedDate}
                        onChange={(e) =>
                          setForm({ ...form, appliedDate: e.target.value })
                        }
                        style={{ ...inputStyle, colorScheme: "dark" }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#6366f1")
                        }
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
                      Job Link
                    </label>
                    <input
                      value={form.jobLink}
                      onChange={(e) =>
                        setForm({ ...form, jobLink: e.target.value })
                      }
                      placeholder="https://careers.google.com/..."
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
                      placeholder="Referral contact, recruiter name..."
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
                    {editId ? "Update" : "Add Application"}
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

        {/* Companies List */}
        {loading ? (
          <div
            style={{ padding: "48px", textAlign: "center", color: "#64748b" }}
          >
            Loading...
          </div>
        ) : filtered.length === 0 ? (
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
              No applications found
            </p>
            <p style={{ color: "#374151", fontSize: "13px", marginTop: "8px" }}>
              Add your first company application
            </p>
          </div>
        ) : (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {Object.entries(grouped).map(([status, items]) => (
              <div key={status}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "600",
                      color: statusColor[status],
                      background: `${statusColor[status]}18`,
                      padding: "3px 10px",
                      borderRadius: "6px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {status}
                  </span>
                  <span style={{ fontSize: "12px", color: "#374151" }}>
                    {items.length}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {items.map((company) => (
                    <div
                      key={company._id}
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
                      <div>
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: "#f1f5f9",
                            letterSpacing: "-0.2px",
                          }}
                        >
                          {company.companyName}
                        </p>
                        <p
                          style={{
                            fontSize: "13px",
                            color: "#64748b",
                            marginTop: "2px",
                          }}
                        >
                          {company.role}
                          {company.location && ` · ${company.location}`}
                          {company.ctc && ` · ${company.ctc}`}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {company.jobLink && (
                          <a
                            href={company.jobLink}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: "5px 12px",
                              fontSize: "11px",
                              fontWeight: "500",
                              background: "rgba(6,182,212,0.1)",
                              border: "1px solid rgba(6,182,212,0.2)",
                              borderRadius: "6px",
                              color: "#06b6d4",
                              textDecoration: "none",
                            }}
                          >
                            Link
                          </a>
                        )}
                        <button
                          onClick={() => handleEdit(company)}
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
                          onClick={() => handleDelete(company._id)}
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
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyTracker;
