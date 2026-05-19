import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function ForgotPassword() {
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await API.post("/auth/forgot-password", { email });
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] font-sans selection:bg-[#8a1c7c]/30">

      {/* Left branding panel — same gradient as Login */}
      <div className="hidden lg:flex relative w-1/2 bg-[linear-gradient(135deg,#2a0a5e,#8a1c7c,#11a09d)] overflow-hidden items-center justify-center">
        <div className="relative z-10 text-center px-12">
          <div className="text-7xl mb-6">🔑</div>
          <h1 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Forgot your<br />password?
          </h1>
          <p className="text-purple-200 text-lg leading-relaxed max-w-sm mx-auto">
            No worries — we'll send a secure reset link straight to your inbox.
          </p>
        </div>
        {/* decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Right form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        <div className="absolute lg:hidden w-72 h-72 bg-[#8a1c7c]/10 rounded-full blur-3xl top-0 right-0 pointer-events-none" />
        <div className="absolute lg:hidden w-72 h-72 bg-[#11a09d]/10 rounded-full blur-3xl bottom-0 left-0 pointer-events-none" />

        <div className="w-full max-w-[440px] relative z-10 bg-white/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(42,10,94,0.1)] border border-white/60">

          {submitted ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="text-6xl mb-6">📬</div>
              <h2 className="text-2xl font-extrabold text-[#111827] mb-3">Check your inbox</h2>
              <p className="text-[#6B7280] text-sm leading-relaxed mb-8">
                If an account is associated with <strong className="text-[#371285]">{email}</strong>, a password reset link has been sent. Check your spam folder if you don't see it.
              </p>
              <Link
                to="/"
                className="inline-block w-full py-4 px-6 font-bold rounded-[1.5rem] bg-[#371285] hover:bg-[#2a0a5e] text-white text-center transition-all duration-300 hover:-translate-y-1 shadow-[0_10px_20px_-10px_rgba(55,18,133,0.5)]"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-[#111827] mb-2 tracking-tight">Reset Password</h2>
                <p className="text-[#6B7280] font-medium text-sm">Enter your email and we'll send a reset link</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl text-center text-sm text-red-500">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                  <label className="block text-sm font-bold text-[#374151] ml-2 transition-colors group-focus-within:text-[#371285]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    required
                    className="w-full px-6 py-4 rounded-[1.5rem] bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#371285] focus:bg-white focus:ring-4 focus:ring-[#371285]/10 transition-all duration-300 outline-none placeholder:text-[#9CA3AF] text-[#111827] font-medium hover:border-[#D1D5DB]"
                  />
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
                  ) : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-8 text-center text-sm text-[#6B7280] font-medium">
                Remember your password?{" "}
                <Link
                  to="/"
                  className="ml-1 text-[#371285] font-bold hover:text-[#8a1c7c] transition-colors hover:underline underline-offset-4"
                >
                  Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
