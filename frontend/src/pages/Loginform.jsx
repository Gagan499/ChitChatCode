import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Registerform from './Registerform';
import { loginUser } from "../services/api";

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

  if (showRegister) return <Registerform prefillEmail={prefillEmail} onBack={() => setShowRegister(false)} />;

  return (
    <div className="min-h-screen w-full flex bg-[#F6FDF9] font-sans selection:bg-emerald-200">
      
      {/* Left Side - Interactive Branding Panel */}
      <div className="hidden lg:flex relative w-1/2 bg-gradient-to-br from-teal-400 via-emerald-400 to-cyan-400 overflow-hidden items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute w-[35rem] h-[35rem] bg-white/25 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite] top-[-10%] left-[-15%]"></div>
        <div className="absolute w-[45rem] h-[45rem] bg-cyan-200/30 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite] bottom-[-20%] right-[-10%]"></div>
        
        {/* Glassmorphism Decorative Card */}
        <div className="relative z-10 flex flex-col items-center text-center px-12 transform hover:scale-105 transition-transform duration-700">
          <div className="w-32 h-32 bg-white/20 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center mb-10 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border border-white/40 animate-bounce" style={{ animationDuration: '4s' }}>
            <span className="text-7xl drop-shadow-lg">🌿</span>
          </div>
          <h1 className="text-5xl font-extrabold mb-6 text-white drop-shadow-md tracking-tight">Connect & Chat</h1>
          <p className="text-xl font-medium text-white/90 drop-shadow max-w-md leading-relaxed">
            Experience seamless communication in a fresh, vibrant workspace designed for you.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        
        {/* Mobile decorative blobs */}
        <div className="absolute lg:hidden w-72 h-72 bg-emerald-200/40 rounded-full blur-3xl top-0 right-0 pointer-events-none"></div>
        <div className="absolute lg:hidden w-72 h-72 bg-cyan-200/40 rounded-full blur-3xl bottom-0 left-0 pointer-events-none"></div>

        <div className="w-full max-w-[440px] relative z-10 bg-white/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(16,185,129,0.15)] border border-white/80">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 font-medium text-sm">Login to your chat workspace</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl text-center text-sm text-red-600 animate-in fade-in zoom-in duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div className="space-y-2 group">
              <label className="block text-sm font-bold text-slate-700 ml-2 transition-colors group-focus-within:text-emerald-500">Email</label>
              <input
                type="email"
                name="email"
                placeholder="panda@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 border-2 border-slate-200 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-400/10 transition-all duration-300 outline-none placeholder:text-slate-400 text-slate-800 font-medium hover:border-slate-300"
              />
            </div>

            {/* Password */}
            <div className="space-y-2 group relative">
              <label className="block text-sm font-bold text-slate-700 ml-2 transition-colors group-focus-within:text-emerald-500">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-[1.5rem] bg-slate-50 border-2 border-slate-200 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-400/10 transition-all duration-300 outline-none placeholder:text-slate-400 text-slate-800 font-medium tracking-widest hover:border-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 hover:text-emerald-500 transition-colors bg-transparent border-none outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 font-bold rounded-[1.5rem] transition-all duration-300 mt-8 flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(16,185,129,0.5)] ${
                loading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-teal-400 hover:to-cyan-400 text-white hover:-translate-y-1 active:translate-y-0 active:scale-95'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
              ) : "Login"}
            </button>

          </form>

          <div className="mt-10 text-center text-sm text-slate-500 font-medium">
            Don’t have an account?
            <button
              onClick={() => setShowRegister(true)}
              className="ml-2 text-emerald-500 font-bold hover:text-teal-600 transition-colors hover:underline underline-offset-4"
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