import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Registerform from './Registerform';
import { loginUser, googleLogin } from "../services/api";
import { signInWithGoogle } from "../services/firebaseService";

function Loginform() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [prefillEmail, setPrefillEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(form);
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      await login(user);
    } catch (err) {
      if (err.response?.status === 404) {
        setPrefillEmail(form.email);
        setShowRegister(true);
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Sign in with Google popup via Firebase
      const firebaseUser = await signInWithGoogle();

      // 2. Send Firebase user data to your backend
      const res = await googleLogin({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
      });

      // 3. Store token and user — same flow as email login
      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      await login(user);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.message || 
        "Google sign-in failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (showRegister) return <Registerform prefillEmail={prefillEmail} onBack={() => setShowRegister(false)} />;

  return (
    <div className="min-h-screen w-full flex bg-[#F8FAFC] font-sans selection:bg-[#8a1c7c]/30">

      {/* Left Side - Interactive Branding Panel */}
      <div className="hidden lg:flex relative w-1/2 bg-[linear-gradient(135deg,#2a0a5e,#8a1c7c,#11a09d)] overflow-hidden items-center justify-center">

        {/* Animated Background Blobs */}
        <div className="absolute w-[35rem] h-[35rem] bg-white/10 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite] top-[-10%] left-[-15%]"></div>
        <div className="absolute w-[45rem] h-[45rem] bg-[#11a09d]/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite] bottom-[-20%] right-[-10%]"></div>

        {/* Branding Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-10">

          {/* Handshake SVG Illustration */}
          <div className="w-full max-w-sm mb-8">
            <svg viewBox="0 0 340 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto drop-shadow-xl">

              {/* === LEFT PERSON === */}
              {/* Head */}
              <circle cx="68" cy="38" r="22" fill="#FDDBB4" />
              {/* Hair */}
              <ellipse cx="68" cy="22" rx="22" ry="12" fill="#4B2D0A" />
              <rect x="46" y="22" width="44" height="10" fill="#4B2D0A" />
              {/* Body / Jacket */}
              <rect x="44" y="60" width="48" height="65" rx="8" fill="#2a0a5e" />
              {/* Shirt collar */}
              <polygon points="68,62 60,75 76,75" fill="white" />
              {/* Left arm — raised toward center */}
              <path d="M92 78 Q120 88 145 108" stroke="#2a0a5e" strokeWidth="16" strokeLinecap="round" fill="none" />
              {/* Left hand */}
              <ellipse cx="148" cy="110" rx="10" ry="8" fill="#FDDBB4" />
              {/* Legs */}
              <rect x="48" y="122" width="18" height="52" rx="6" fill="#1a1a3e" />
              <rect x="70" y="122" width="18" height="52" rx="6" fill="#1a1a3e" />
              {/* Shoes */}
              <ellipse cx="57" cy="174" rx="13" ry="7" fill="#111" />
              <ellipse cx="79" cy="174" rx="13" ry="7" fill="#111" />

              {/* === RIGHT PERSON === */}
              {/* Head */}
              <circle cx="272" cy="38" r="22" fill="#C68642" />
              {/* Hair */}
              <ellipse cx="272" cy="20" rx="22" ry="14" fill="#1a0a00" />
              <rect x="250" y="20" width="44" height="12" fill="#1a0a00" />
              {/* Body / Jacket */}
              <rect x="248" y="60" width="48" height="65" rx="8" fill="#0e6e5e" />
              {/* Shirt collar */}
              <polygon points="272,62 264,75 280,75" fill="white" />
              {/* Right arm — raised toward center */}
              <path d="M248 78 Q220 88 195 108" stroke="#0e6e5e" strokeWidth="16" strokeLinecap="round" fill="none" />
              {/* Right hand */}
              <ellipse cx="192" cy="110" rx="10" ry="8" fill="#C68642" />
              {/* Legs */}
              <rect x="252" y="122" width="18" height="52" rx="6" fill="#1a1a3e" />
              <rect x="274" y="122" width="18" height="52" rx="6" fill="#1a1a3e" />
              {/* Shoes */}
              <ellipse cx="261" cy="174" rx="13" ry="7" fill="#111" />
              <ellipse cx="283" cy="174" rx="13" ry="7" fill="#111" />

              {/* === HANDSHAKE ZONE (center) === */}
              {/* Clasped hands overlap */}
              <ellipse cx="170" cy="112" rx="24" ry="14" fill="#E8A87C" />

              {/* === LOGO BADGE in the center === */}
              {/* Glow ring */}
              <circle cx="170" cy="112" r="30" fill="rgba(255,255,255,0.15)" />
              {/* White disc */}
              <circle cx="170" cy="112" r="24" fill="white" opacity="0.95" />
              {/* Logo image — UPDATE src to your logo path */}
              <image
                href="/path/to/logo.png"
                x="152"
                y="94"
                width="36"
                height="36"
                preserveAspectRatio="xMidYMid meet"
              />

              {/* Sparkle accents */}
              <g fill="rgba(255,255,255,0.7)">
                <polygon points="170,58 172,64 178,64 173,68 175,74 170,70 165,74 167,68 162,64 168,64" />
              </g>
              <circle cx="130" cy="90" r="3" fill="rgba(255,255,255,0.4)" />
              <circle cx="210" cy="90" r="3" fill="rgba(255,255,255,0.4)" />
              <circle cx="145" cy="150" r="2" fill="rgba(255,255,255,0.3)" />
              <circle cx="195" cy="150" r="2" fill="rgba(255,255,255,0.3)" />

              {/* Ground shadow */}
              <ellipse cx="170" cy="188" rx="100" ry="8" fill="rgba(0,0,0,0.18)" />
            </svg>
          </div>

          {/* Text */}
          <h1 className="text-4xl font-extrabold mb-4 text-white drop-shadow-sm tracking-tight">
            Connect &amp; Chat
          </h1>
          <p className="text-lg font-medium text-white/85 max-w-xs leading-relaxed">
            Experience seamless communication in a fresh, vibrant workspace designed for you.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">

        {/* Mobile decorative blobs */}
        <div className="absolute lg:hidden w-72 h-72 bg-[#8a1c7c]/10 rounded-full blur-3xl top-0 right-0 pointer-events-none"></div>
        <div className="absolute lg:hidden w-72 h-72 bg-[#11a09d]/10 rounded-full blur-3xl bottom-0 left-0 pointer-events-none"></div>

        <div className="w-full max-w-[440px] relative z-10 bg-white/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(42,10,94,0.1)] border border-white/60">

          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#111827] mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-[#6B7280] font-medium text-sm">Login to your chat workspace</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl text-center text-sm text-red-500 animate-in fade-in zoom-in duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Email */}
            <div className="space-y-2 group">
              <label className="block text-sm font-bold text-[#374151] ml-2 transition-colors group-focus-within:text-[#371285]">Email</label>
              <input
                type="email"
                name="email"
                placeholder="panda@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-[1.5rem] bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#371285] focus:bg-white focus:ring-4 focus:ring-[#371285]/10 transition-all duration-300 outline-none placeholder:text-[#9CA3AF] text-[#111827] font-medium hover:border-[#D1D5DB]"
              />
            </div>

            {/* Password */}
            <div className="space-y-2 group relative">
              <label className="block text-sm font-bold text-[#374151] ml-2 transition-colors group-focus-within:text-[#371285]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-[1.5rem] bg-[#F9FAFB] border-2 border-[#E5E7EB] focus:border-[#371285] focus:bg-white focus:ring-4 focus:ring-[#371285]/10 transition-all duration-300 outline-none placeholder:text-[#9CA3AF] text-[#111827] font-medium tracking-widest hover:border-[#D1D5DB]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#9CA3AF] hover:text-[#371285] transition-colors bg-transparent border-none outline-none cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 font-bold rounded-[1.5rem] transition-all duration-300 mt-8 flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(55,18,133,0.5)] ${
                loading
                  ? 'bg-[#E6E6E6] text-[#A6A6A6] cursor-not-allowed shadow-none'
                  : 'bg-[#371285] hover:bg-[#2a0a5e] text-white hover:-translate-y-1 active:translate-y-0 active:scale-95'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#1E293B]/40 border-t-[#1E293B] rounded-full animate-spin"></div>
              ) : "Login"}
            </button>

          </form>

          {/* ── Divider ── */}
          <div className="flex items-center my-6 gap-3">
            <div className="flex-1 h-px bg-[#E5E7EB]" />
            <span className="text-sm text-[#9CA3AF] font-medium">or</span>
            <div className="flex-1 h-px bg-[#E5E7EB]" />
          </div>

          {/* ── Google Sign-In Button ── */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-4 px-6 font-bold rounded-[1.5rem] border-2 border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#374151] transition-all duration-300 flex items-center justify-center gap-3 hover:-translate-y-0.5 active:translate-y-0"
          >
            {/* Google SVG Icon */}
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 13 24 13c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.1-11.3-7.5l-6.5 5C9.5 39.5 16.2 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.2-4.4 5.6l6.2 5.2C36.9 40 44 35 44 24c0-1.2-.1-2.4-.4-3.5z"/>
            </svg>
            Continue with Google
          </button>

          <div className="mt-10 text-center text-sm text-[#6B7280] font-medium">
            Don't have an account?
            <button
              onClick={() => setShowRegister(true)}
              className="ml-2 text-[#371285] font-bold hover:text-[#8a1c7c] transition-colors hover:underline underline-offset-4"
            >
              Register
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Loginform;