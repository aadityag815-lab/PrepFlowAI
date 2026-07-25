import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDSAStats, getCompanyStats, getStudyStats } from "../utils/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const StatCard = ({ title, value, subtitle, color }) => (
  <div
    style={{
      background: "#16213e",
      border: "1px solid #2d3748",
      borderRadius: "16px",
      padding: "24px",
      transition: "border-color 0.2s",
    }}
    onMouseEnter={(e) =>
      (e.currentTarget.style.borderColor = color || "#6366f1")
    }
    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2d3748")}
  >
    <p
      style={{
        fontSize: "13px",
        color: "#64748b",
        fontWeight: "500",
        marginBottom: "8px",
      }}
    >
      {title}
    </p>
    <p
      style={{
        fontSize: "32px",
        fontWeight: "800",
        color: color || "#f1f5f9",
        letterSpacing: "-1px",
        lineHeight: "1",
        marginBottom: "6px",
      }}
    >
      {value}
    </p>
    <p style={{ fontSize: "12px", color: "#374151" }}>{subtitle}</p>
  </div>
);

const QuickLink = ({ to, title, description }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <div
      style={{
        background: "#16213e",
        border: "1px solid #2d3748",
        borderRadius: "14px",
        padding: "20px",
        transition: "all 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#6366f1";
        e.currentTarget.style.background = "#1a1f3e";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#2d3748";
        e.currentTarget.style.background = "#16213e";
      }}
    >
      <p
        style={{
          fontSize: "14px",
          fontWeight: "600",
          color: "#f1f5f9",
          marginBottom: "4px",
        }}
      >
        {title}
      </p>
      <p style={{ fontSize: "13px", color: "#64748b" }}>{description}</p>
    </div>
  </Link>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [dsaStats, setDsaStats] = useState(null);
  const [companyStats, setCompanyStats] = useState(null);
  const [studyStats, setStudyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dsa, company, study] = await Promise.all([
          getDSAStats(),
          getCompanyStats(),
          getStudyStats(),
        ]);
        setDsaStats(dsa.data);
        setCompanyStats(company.data);
        setStudyStats(study.data);
      } catch (err) {
        toast.error("Failed to load stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

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
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "800",
              color: "#f1f5f9",
              letterSpacing: "-0.8px",
              marginBottom: "6px",
            }}
          >
            {getGreeting()}, {user?.name?.split(" ")[0]}
          </h1>
          <p style={{ fontSize: "15px", color: "#64748b" }}>
            Here's where your preparation stands today.
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  height: "120px",
                  borderRadius: "16px",
                  background: "#16213e",
                  border: "1px solid #2d3748",
                }}
                className="shimmer"
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginBottom: "32px",
            }}
          >
            <StatCard
              title="Problems Solved"
              value={dsaStats?.solved || 0}
              subtitle={`of ${dsaStats?.total || 0} total`}
              color="#6366f1"
            />
            <StatCard
              title="Companies Tracked"
              value={companyStats?.total || 0}
              subtitle={`${companyStats?.offers || 0} offers received`}
              color="#06b6d4"
            />
            <StatCard
              title="Study Hours"
              value={Math.round((studyStats?.totalHours || 0) / 60)}
              subtitle={`${studyStats?.totalSessions || 0} sessions logged`}
              color="#10b981"
            />
            <StatCard
              title="Avg Productivity"
              value={`${(studyStats?.avgProductivity || 0).toFixed(1)}/5`}
              subtitle="across all sessions"
              color="#f59e0b"
            />
          </div>
        )}

        {/* DSA Breakdown */}
        {dsaStats && (
          <div
            style={{
              background: "#16213e",
              border: "1px solid #2d3748",
              borderRadius: "16px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <h2
              style={{
                fontSize: "15px",
                fontWeight: "600",
                color: "#f1f5f9",
                marginBottom: "20px",
                letterSpacing: "-0.2px",
              }}
            >
              DSA Breakdown
            </h2>
            <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
              {[
                { label: "Easy", value: dsaStats.easy, color: "#10b981" },
                { label: "Medium", value: dsaStats.medium, color: "#f59e0b" },
                { label: "Hard", value: dsaStats.hard, color: "#ef4444" },
                {
                  label: "Attempted",
                  value: dsaStats.attempted,
                  color: "#6366f1",
                },
                { label: "To Do", value: dsaStats.todo, color: "#64748b" },
              ].map((item) => (
                <div key={item.label}>
                  <p
                    style={{
                      fontSize: "24px",
                      fontWeight: "700",
                      color: item.color,
                      letterSpacing: "-0.5px",
                    }}
                  >
                    {item.value}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#64748b",
                      marginTop: "2px",
                    }}
                  >
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Links */}
        <h2
          style={{
            fontSize: "15px",
            fontWeight: "600",
            color: "#f1f5f9",
            marginBottom: "16px",
            letterSpacing: "-0.2px",
          }}
        >
          Quick access
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "12px",
          }}
        >
          <QuickLink
            to="/dsa"
            title="DSA Tracker"
            description="Log and track your problem solving"
          />
          <QuickLink
            to="/companies"
            title="Company Tracker"
            description="Manage your application pipeline"
          />
          <QuickLink
            to="/resumes"
            title="Resume Vault"
            description="Store and organize resume versions"
          />
          <QuickLink
            to="/study"
            title="Study Log"
            description="Record your study sessions"
          />
          <QuickLink
            to="/ai-tools"
            title="AI Study Planner"
            description="Get a personalized weekly plan"
          />
          <QuickLink
            to="/analytics"
            title="Analytics"
            description="Visualize your prep progress"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
