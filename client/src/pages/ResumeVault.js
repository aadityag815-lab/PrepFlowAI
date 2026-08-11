import React, { useState, useEffect } from "react";
import {
  getResumes,
  uploadResume,
  deleteResume,
  setDefaultResume,
} from "../utils/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

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

const ResumeVault = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    version: "v1",
    targetRole: "",
    targetCompany: "",
    notes: "",
  });
  const [file, setFile] = useState(null);

  const fetchResumes = async () => {
    try {
      const { data } = await getResumes();
      setResumes(data);
    } catch {
      toast.error("Failed to load resumes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a PDF file");
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("title", form.title);
      formData.append("version", form.version);
      formData.append("targetRole", form.targetRole);
      formData.append("targetCompany", form.targetCompany);
      formData.append("notes", form.notes);
      await uploadResume(formData);
      toast.success("Resume uploaded");
      setForm({
        title: "",
        version: "v1",
        targetRole: "",
        targetCompany: "",
        notes: "",
      });
      setFile(null);
      setShowForm(false);
      fetchResumes();
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await deleteResume(id);
      toast.success("Resume deleted");
      fetchResumes();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await setDefaultResume(id);
      toast.success("Set as default");
      fetchResumes();
    } catch {
      toast.error("Failed to update");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

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
              Resume Vault
            </h1>
            <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
              {resumes.length} resume{resumes.length !== 1 ? "s" : ""} stored
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
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
            Upload Resume
          </button>
        </div>

        {/* Upload Modal */}
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
                Upload Resume
              </h2>
              <form onSubmit={handleUpload}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  {/* File Upload */}
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
                      PDF File *
                    </label>
                    <div
                      style={{
                        border: "2px dashed #2d3748",
                        borderRadius: "10px",
                        padding: "24px",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "border-color 0.2s",
                        background: file
                          ? "rgba(99,102,241,0.05)"
                          : "transparent",
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = "#6366f1";
                      }}
                      onDragLeave={(e) =>
                        (e.currentTarget.style.borderColor = "#2d3748")
                      }
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.style.borderColor = "#2d3748";
                        const dropped = e.dataTransfer.files[0];
                        if (dropped?.type === "application/pdf")
                          setFile(dropped);
                        else toast.error("Only PDF files allowed");
                      }}
                      onClick={() =>
                        document.getElementById("resumeFile").click()
                      }
                    >
                      <input
                        id="resumeFile"
                        type="file"
                        accept=".pdf"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const f = e.target.files[0];
                          if (f?.type === "application/pdf") setFile(f);
                          else toast.error("Only PDF files allowed");
                        }}
                      />
                      {file ? (
                        <div>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#818cf8",
                              fontWeight: "500",
                            }}
                          >
                            {file.name}
                          </p>
                          <p
                            style={{
                              fontSize: "11px",
                              color: "#64748b",
                              marginTop: "4px",
                            }}
                          >
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p style={{ fontSize: "13px", color: "#64748b" }}>
                            Drop PDF here or click to browse
                          </p>
                          <p
                            style={{
                              fontSize: "11px",
                              color: "#374151",
                              marginTop: "4px",
                            }}
                          >
                            PDF only
                          </p>
                        </div>
                      )}
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
                        Title *
                      </label>
                      <input
                        required
                        value={form.title}
                        onChange={(e) =>
                          setForm({ ...form, title: e.target.value })
                        }
                        placeholder="SDE Resume"
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
                        Version
                      </label>
                      <input
                        value={form.version}
                        onChange={(e) =>
                          setForm({ ...form, version: e.target.value })
                        }
                        placeholder="v1"
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
                        Target Role
                      </label>
                      <input
                        value={form.targetRole}
                        onChange={(e) =>
                          setForm({ ...form, targetRole: e.target.value })
                        }
                        placeholder="SDE-1"
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
                        Target Company
                      </label>
                      <input
                        value={form.targetCompany}
                        onChange={(e) =>
                          setForm({ ...form, targetCompany: e.target.value })
                        }
                        placeholder="Google"
                        style={inputStyle}
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
                      Notes
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) =>
                        setForm({ ...form, notes: e.target.value })
                      }
                      placeholder="What is this version tailored for?"
                      rows={2}
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
                    disabled={uploading}
                    style={{
                      flex: 1,
                      padding: "11px",
                      background: uploading
                        ? "#374151"
                        : "linear-gradient(135deg, #6366f1, #06b6d4)",
                      border: "none",
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "13px",
                      fontWeight: "600",
                      cursor: uploading ? "not-allowed" : "pointer",
                    }}
                  >
                    {uploading ? "Uploading..." : "Upload Resume"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
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

        {/* Resume Grid */}
        {loading ? (
          <div
            style={{ padding: "48px", textAlign: "center", color: "#64748b" }}
          >
            Loading...
          </div>
        ) : resumes.length === 0 ? (
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
              No resumes uploaded yet
            </p>
            <p style={{ color: "#374151", fontSize: "13px", marginTop: "8px" }}>
              Upload your first resume to get started
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            {resumes.map((resume) => (
              <div
                key={resume._id}
                style={{
                  background: "#16213e",
                  border: `1px solid ${resume.isDefault ? "#6366f1" : "#2d3748"}`,
                  borderRadius: "16px",
                  padding: "24px",
                  transition: "border-color 0.2s",
                  position: "relative",
                }}
              >
                {resume.isDefault && (
                  <span
                    style={{
                      position: "absolute",
                      top: "14px",
                      right: "14px",
                      fontSize: "10px",
                      fontWeight: "600",
                      color: "#6366f1",
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      padding: "2px 8px",
                      borderRadius: "100px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Default
                  </span>
                )}

                {/* PDF Icon */}
                <div
                  style={{
                    width: "44px",
                    height: "52px",
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "16px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "#ef4444",
                    }}
                  >
                    PDF
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#f1f5f9",
                    letterSpacing: "-0.2px",
                    marginBottom: "4px",
                  }}
                >
                  {resume.title}
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#64748b",
                    marginBottom: "12px",
                  }}
                >
                  {resume.version}
                  {resume.targetRole && ` · ${resume.targetRole}`}
                  {resume.targetCompany && ` · ${resume.targetCompany}`}
                </p>

                {resume.notes && (
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid #1e2a4a",
                      borderRadius: "8px",
                      padding: "8px 10px",
                      marginBottom: "12px",
                      lineHeight: "1.5",
                    }}
                  >
                    {resume.notes}
                  </p>
                )}

                <p
                  style={{
                    fontSize: "11px",
                    color: "#374151",
                    marginBottom: "16px",
                  }}
                >
                  Uploaded {formatDate(resume.createdAt)}
                </p>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <a
                    href={resume.fileUrl.replace(
                      "/upload/",
                      `/upload/fl_attachment:${resume.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf/`,
                    )}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.2)",
                      borderRadius: "7px",
                      color: "#818cf8",
                      textDecoration: "none",
                    }}
                  >
                    View
                  </a>
                  {!resume.isDefault && (
                    <button
                      onClick={() => handleSetDefault(resume._id)}
                      style={{
                        padding: "6px 14px",
                        fontSize: "12px",
                        fontWeight: "500",
                        background: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.2)",
                        borderRadius: "7px",
                        color: "#10b981",
                        cursor: "pointer",
                      }}
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(resume._id)}
                    style={{
                      padding: "6px 14px",
                      fontSize: "12px",
                      fontWeight: "500",
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.2)",
                      borderRadius: "7px",
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
        )}
      </div>
    </div>
  );
};

export default ResumeVault;
