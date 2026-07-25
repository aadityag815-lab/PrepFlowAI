import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/dsa", label: "DSA" },
    { path: "/companies", label: "Companies" },
    { path: "/resumes", label: "Resumes" },
    { path: "/study", label: "Study" },
    { path: "/analytics", label: "Analytics" },
    { path: "/ai-tools", label: "AI Tools" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "rgba(15, 15, 26, 0.97)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid #2d3748",
          padding: "0 32px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
              fontSize: "17px",
              fontWeight: "700",
              letterSpacing: "-0.3px",
              background: "linear-gradient(135deg, #6366f1, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            PrepFlow
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2px",
          }}
          className="desktop-nav"
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: "7px 14px",
                  borderRadius: "8px",
                  fontSize: "13.5px",
                  fontWeight: isActive ? "600" : "500",
                  color: isActive ? "#818cf8" : "#64748b",
                  background: isActive ? "rgba(99,102,241,0.1)" : "transparent",
                  border: isActive
                    ? "1px solid rgba(99,102,241,0.25)"
                    : "1px solid transparent",
                  transition: "all 0.15s ease",
                  textDecoration: "none",
                  letterSpacing: "-0.1px",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "5px 10px 5px 6px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "10px",
              border: "1px solid #2d3748",
            }}
          >
            <div
              style={{
                width: "26px",
                height: "26px",
                background: "linear-gradient(135deg, #6366f1, #06b6d4)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "11px",
                fontWeight: "700",
                color: "white",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span
              style={{ fontSize: "13px", fontWeight: "500", color: "#cbd5e1" }}
            >
              {user?.name?.split(" ")[0]}
            </span>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "7px 14px",
              background: "transparent",
              border: "1px solid #2d3748",
              borderRadius: "8px",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#ef4444";
              e.target.style.color = "#ef4444";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#2d3748";
              e.target.style.color = "#64748b";
            }}
          >
            Sign out
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            style={{
              display: "none",
              background: "transparent",
              border: "1px solid #2d3748",
              borderRadius: "8px",
              color: "#f1f5f9",
              width: "36px",
              height: "36px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {mobileOpen ? "✕" : "≡"}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 999,
            background: "#1a1a2e",
            borderBottom: "1px solid #2d3748",
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              style={{
                padding: "11px 14px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
                color: location.pathname === item.path ? "#818cf8" : "#94a3b8",
                background:
                  location.pathname === item.path
                    ? "rgba(99,102,241,0.1)"
                    : "transparent",
                textDecoration: "none",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; align-items: center; justify-content: center; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
