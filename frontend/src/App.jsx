import React, { useContext, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

// Lazy load pages to reduce initial bundle size
const DashBoard = React.lazy(() => import("./pages/DashBoard"));
const Loginform = React.lazy(() => import("./pages/Loginform"));
const Registerform = React.lazy(() => import("./pages/Registerform"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));
const ResetPassword  = React.lazy(() => import("./pages/ResetPassword"));

// Loading fallback component
const PageLoader = () => (
  <div className="auth-splash">
    <div className="auth-spinner" />
    <p className="auth-splash-text">Loading...</p>
  </div>
);

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="auth-splash">
        <div className="auth-spinner" />
        <p className="auth-splash-text">ChitChatCode</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Login Route */}
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Loginform />
              )
            }
          />

          {/* Register Route */}
          <Route
            path="/register"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Registerform />
              )
            }
          />

          {/* Forgot Password — public, redirect if logged in */}
          <Route
            path="/forgot-password"
            element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <ForgotPassword />}
          />

          {/* Reset Password — public, always accessible so the link in the email works */}
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Dashboard Route (Protected) */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <DashBoard /> : <Navigate to="/" replace />
            }
          />

          {/* Fallback Route */}
          <Route
            path="*"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
