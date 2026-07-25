import React, { useState, useEffect } from "react";
import { getDSAStats, getCompanyStats, getStudyStats } from "../utils/api";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = [
  "#6366f1",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#f97316",
  "#64748b",
];

const Analytics = () => {
  const [dsaStats, setDsaStats] = useState(null);
  const [companyStats, setCompanyStats] = useState(null);
  const [studyStats, setStudyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dsa, company, study] = await Promise.all([
          getDSAStats(),
          getCompanyStats(),
          getStudyStats(),
        ]);
        setDsaStats(dsa.data);
        setCompanyStats(company.data);
        setStudyStats(study.data);
      } catch {
        toast.error("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const dsaDifficultyData = dsaStats
    ? [
        { name: "Easy", value: dsaStats.easy, color: "#10b981" },
        { name: "Medium", value: dsaStats.medium, color: "#f59e0b" },
        { name: "Hard", value: dsaStats.hard, color: "#ef4444" },
      ]
    : [];

  // eslint-disable-next-line no-unused-vars
  const dsaStatusData = dsaStats
    ? [
        { name: "Solved", value: dsaStats.solved },
        { name: "Attempted", value: dsaStats.attempted },
        { name: "To Do", value: dsaStats.todo },
      ]
    : [];

  const topicData =
    dsaStats?.topicStats?.slice(0, 8).map((t) => ({
      name: t._id,
      value: t.count,
    })) || [];

  const categoryData =
    studyStats?.categoryStats?.map((c) => ({
      name: c._id,
      value: Math.round((c.total / 60) * 10) / 10,
    })) || [];

  const last7DaysData =
    studyStats?.last7Days?.map((d) => ({
      date: d._id.slice(5),
      minutes: d.total,
    })) || [];

  const companyStatusData =
    companyStats?.statusStats?.map((s) => ({
      name: s._id,
      value: s.count,
    })) || [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            background: "#1a1a2e",
            border: "1px solid #2d3748",
            borderRadius: "10px",
            padding: "10px 14px",
          }}
        >
          <p
            style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "4px" }}
          >
            {label}
          </p>
          {payload.map((p, i) => (
            <p
              key={i}
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: p.color || "#f1f5f9",
              }}
            >
              {p.value} {p.name}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading)
    return (
      <div style={{ minHeight: "100vh", background: "#0f0f1a" }}>
        <Navbar />
        <div
          style={{
            padding: "120px 24px",
            textAlign: "center",
            color: "#64748b",
          }}
        >
          Loading analytics...
        </div>
      </div>
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
        <div style={{ marginBottom: "40px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "800",
              color: "#f1f5f9",
              letterSpacing: "-0.5px",
            }}
          >
            Analytics
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", marginTop: "4px" }}>
            A visual overview of your placement preparation
          </p>
        </div>

        {/* Top Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          {[
            {
              label: "Problems Solved",
              value: dsaStats?.solved || 0,
              color: "#6366f1",
            },
            {
              label: "Total Problems",
              value: dsaStats?.total || 0,
              color: "#06b6d4",
            },
            {
              label: "Companies Tracked",
              value: companyStats?.total || 0,
              color: "#10b981",
            },
            {
              label: "Offers Received",
              value: companyStats?.offers || 0,
              color: "#f59e0b",
            },
            {
              label: "Study Sessions",
              value: studyStats?.totalSessions || 0,
              color: "#8b5cf6",
            },
            {
              label: "Total Hours",
              value: Math.round((studyStats?.totalHours || 0) / 60),
              color: "#f97316",
            },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: "#16213e",
                border: "1px solid #2d3748",
                borderRadius: "14px",
                padding: "20px",
              }}
            >
              <p
                style={{
                  fontSize: "12px",
                  color: "#64748b",
                  marginBottom: "8px",
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  color: stat.color,
                  letterSpacing: "-0.5px",
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {/* DSA by Difficulty Pie */}
          <div
            style={{
              background: "#16213e",
              border: "1px solid #2d3748",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#f1f5f9",
                marginBottom: "20px",
                letterSpacing: "-0.2px",
              }}
            >
              DSA by Difficulty
            </h3>
            {dsaStats?.solved > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={dsaDifficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    dataKey="value"
                    paddingAngle={3}
                  >
                    {dsaDifficultyData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    formatter={(value) => (
                      <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: "220px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p style={{ color: "#374151", fontSize: "13px" }}>
                  No data yet
                </p>
              </div>
            )}
          </div>

          {/* Company Pipeline */}
          <div
            style={{
              background: "#16213e",
              border: "1px solid #2d3748",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#f1f5f9",
                marginBottom: "20px",
                letterSpacing: "-0.2px",
              }}
            >
              Application Pipeline
            </h3>
            {companyStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={companyStatusData}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e2a4a"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {companyStatusData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: "220px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p style={{ color: "#374151", fontSize: "13px" }}>
                  No data yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          {/* Study Hours by Category */}
          <div
            style={{
              background: "#16213e",
              border: "1px solid #2d3748",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#f1f5f9",
                marginBottom: "20px",
                letterSpacing: "-0.2px",
              }}
            >
              Study Hours by Category
            </h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e2a4a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="hours" radius={[4, 4, 0, 0]}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: "220px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p style={{ color: "#374151", fontSize: "13px" }}>
                  No data yet
                </p>
              </div>
            )}
          </div>

          {/* Last 7 Days Activity */}
          <div
            style={{
              background: "#16213e",
              border: "1px solid #2d3748",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#f1f5f9",
                marginBottom: "20px",
                letterSpacing: "-0.2px",
              }}
            >
              Last 7 Days Activity
            </h3>
            {last7DaysData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={last7DaysData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1e2a4a"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#64748b" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="minutes"
                    name="mins"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ fill: "#6366f1", r: 4 }}
                    activeDot={{ r: 6, fill: "#818cf8" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div
                style={{
                  height: "220px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <p style={{ color: "#374151", fontSize: "13px" }}>
                  No data yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* DSA Topics */}
        {topicData.length > 0 && (
          <div
            style={{
              background: "#16213e",
              border: "1px solid #2d3748",
              borderRadius: "16px",
              padding: "24px",
            }}
          >
            <h3
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#f1f5f9",
                marginBottom: "20px",
                letterSpacing: "-0.2px",
              }}
            >
              Top DSA Topics Solved
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topicData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1e2a4a"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="solved" radius={[4, 4, 0, 0]}>
                  {topicData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
