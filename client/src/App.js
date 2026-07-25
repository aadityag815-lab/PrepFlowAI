import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DSATracker from "./pages/DSATracker";
import CompanyTracker from "./pages/CompanyTracker";
import ResumeVault from "./pages/ResumeVault";
import StudyTracker from "./pages/StudyTracker";
import Analytics from "./pages/Analytics";
import AITools from "./pages/AITools";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#0f0f1a",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            border: "3px solid #6366f1",
            borderTop: "3px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/dashboard" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Landing />
          </PublicRoute>
        }
      />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dsa"
        element={
          <PrivateRoute>
            <DSATracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/companies"
        element={
          <PrivateRoute>
            <CompanyTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/resumes"
        element={
          <PrivateRoute>
            <ResumeVault />
          </PrivateRoute>
        }
      />
      <Route
        path="/study"
        element={
          <PrivateRoute>
            <StudyTracker />
          </PrivateRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <PrivateRoute>
            <Analytics />
          </PrivateRoute>
        }
      />
      <Route
        path="/ai-tools"
        element={
          <PrivateRoute>
            <AITools />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1a2e",
              color: "#f1f5f9",
              border: "1px solid #2d3748",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#f1f5f9" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" },
            },
          }}
        />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
