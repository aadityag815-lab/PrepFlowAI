import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    college: "",
    graduationYear: "",
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(
        form.name,
        form.email,
        form.password,
        form.college,
        form.graduationYear,
      );
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    background: "#0f0f1a",
    border: "1px solid #2d3748",
    borderRadius: "10px",
    color: "#f1f5f9",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: "500",
    color: "#94a3b8",
    marginBottom: "8px",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f1a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: "20px",
                fontWeight: "700",
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              PrepFlow
            </span>
          </Link>
        </div>

        {/* Card */}
        <div
          style={{
            background: "#16213e",
            border: "1px solid #2d3748",
            borderRadius: "20px",
            padding: "36px",
          }}
        >
          <h1
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#f1f5f9",
              marginBottom: "6px",
              letterSpacing: "-0.5px",
            }}
          >
            Create your account
          </h1>
          <p
            style={{ fontSize: "14px", color: "#64748b", marginBottom: "28px" }}
          >
            Start your placement preparation today
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Full name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Aaditya Gupta"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#2d3748")}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#2d3748")}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#2d3748")}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={labelStyle}>
                College <span style={{ color: "#374151" }}>(optional)</span>
              </label>
              <input
                type="text"
                name="college"
                value={form.college}
                onChange={handleChange}
                placeholder="IIT Delhi"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#2d3748")}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={labelStyle}>
                Graduation year{" "}
                <span style={{ color: "#374151" }}>(optional)</span>
              </label>
              <input
                type="number"
                name="graduationYear"
                value={form.graduationYear}
                onChange={handleChange}
                placeholder="2026"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                onBlur={(e) => (e.target.style.borderColor = "#2d3748")}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                background: loading
                  ? "#374151"
                  : "linear-gradient(135deg, #6366f1, #06b6d4)",
                border: "none",
                borderRadius: "10px",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
                letterSpacing: "-0.1px",
              }}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: "24px",
              fontSize: "13px",
              color: "#64748b",
            }}
          >
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#818cf8",
                fontWeight: "500",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
