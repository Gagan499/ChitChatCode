import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";

function ResetPassword() {
  const { token }                     = useParams();
  const navigate                      = useNavigate();
  const [password, setPassword]       = useState("");
  const [confirm, setConfirm]         = useState("");
  const [showPass, setShowPass]       = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [success, setSuccess]         = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters.");
    }
    if (password !== confirm) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    try {
      await API.post(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
      // Redirect to login after 3 seconds
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Reset failed. The link may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] font-sans selection:bg-[#8a1c7c]/30">

      {/* Left branding panel */}
      <div className="hidden lg:flex relative w-1/2 bg-[linear-gradient(135deg,#2a0a5e,#8a1c7c,#11a09d)] overflow-hidden items-center justify-center">
        <div className="relative z-10 text-center px-12">
          <div className="text-7xl mb-6">🔐</div>
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Create a new<br />password
          </h1>
          <p className="text-purple-200 text-lg leading-relaxed max-w-sm mx-auto">
            Choose a strong password to keep your ChitChatCode account secure.
          </p>
        </div>
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        <div className="absolute lg:hidden w-72 h-72 bg-[#8a1c7c]/10 rounded-full blur-3xl top-0 right-0 pointer-events-none" />
        <div className="absolute lg:hidden w-72 h-72 bg-[#11a09d]/10 rounded-full blur-3xl bottom-0 left-0 pointer-events-none" />

        <div className="w-full max-w-[440px] relative z-10 bg-white/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(42,10,94,0.1)] border border-white/60">

          {success ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="text-6xl mb-6">✅</div>
              <h2 className="text-2xl font-extrabold text-[#111827] mb-3">Password Reset!</h2>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-2">
                Your password has been updated successfully.
              </p>
              <p className="text-[#9CA3AF] text-xs mb-8">Redirecting you to login in a moment…</p>
              <Link
                to="/"
                className="inline-block w-full py-4 px-6 font-bold rounded-[1.5rem] bg-[#371285] hover:bg-[#2a0a5e] text-white text-center transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_20px_-10px_rgba(55,18,133,0.5)]"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-[#111827] mb-2 tracking-tight">New Password</h2>
                <p className="text-[#6B7280] font-medium text-sm">Enter and confirm your new password</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl text-center text-sm text-red-500">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Password */}
                <div className="space-y-2 group relative">
                  <label className="block text-sm font-bold text-[#374151] ml-2 group-focus-within:text-[#371285] transition-colors">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError(""); }}
                      required
                      className="w-full px-6 py-4 rounded-[1.5rem] bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#371285] focus:bg-white focus:ring-4 focus:ring-[#371285]/10 transition-all duration-300 outline-none placeholder:text-[#9CA3AF] text-[#111827] font-medium tracking-widest hover:border-[#D1D5DB]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#9CA3AF] hover:text-[#371285] transition-colors bg-transparent border-none outline-none cursor-pointer"
                    >
                      {showPass ? "Hide" : "Show"}
                    </button>
                  </div>
                  {password && password.length < 6 && (
                    <p className="text-xs text-amber-500 ml-2">At least 6 characters required</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2 group relative">
                  <label className="block text-sm font-bold text-[#374151] ml-2 group-focus-within:text-[#371285] transition-colors">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                      required
                      className="w-full px-6 py-4 rounded-[1.5rem] bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#371285] focus:bg-white focus:ring-4 focus:ring-[#371285]/10 transition-all duration-300 outline-none placeholder:text-[#9CA3AF] text-[#111827] font-medium tracking-widest hover:border-[#D1D5DB]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#9CA3AF] hover:text-[#371285] transition-colors bg-transparent border-none outline-none cursor-pointer"
                    >
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                  {confirm && password !== confirm && (
                    <p className="text-xs text-red-400 ml-2">Passwords don't match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 px-6 font-bold rounded-[1.5rem] transition-all duration-300 mt-4 flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(55,18,133,0.5)] ${
                    loading
                      ? "bg-[#E6E6E6] text-[#A6A6A6] cursor-not-allowed shadow-none"
                      : "bg-[#371285] hover:bg-[#2a0a5e] text-white hover:-translate-y-1 active:translate-y-0 active:scale-95"
                  }`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-[#1E293B]/40 border-t-[#1E293B] rounded-full animate-spin" />
                  ) : "Reset Password"}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-[#6B7280] font-medium">
                <Link
                  to="/forgot-password"
                  className="text-[#371285] font-bold hover:text-[#8a1c7c] transition-colors hover:underline underline-offset-4"
                >
                  Request a new link
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
