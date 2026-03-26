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
    <div className="min-h-screen w-full flex bg-[#F8FAFC] font-sans selection:bg-[#c2e9fb]/40">
      
      {/* Left Side - Interactive Branding Panel */}
      <div className="hidden lg:flex relative w-1/2 bg-[linear-gradient(135deg,#a1c4fd,#c2e9fb,#e0c3fc,#fbc2eb)] overflow-hidden items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute w-[35rem] h-[35rem] bg-white/40 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite] top-[-10%] left-[-15%]"></div>
        <div className="absolute w-[45rem] h-[45rem] bg-[#a1c4fd]/40 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite] bottom-[-20%] right-[-10%]"></div>
        
        {/* Glassmorphism Decorative Card */}
        <div className="relative z-10 flex flex-col items-center text-center px-12 transform hover:scale-105 transition-transform duration-700">
          <div className="w-32 h-32 bg-white/40 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center mb-10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-white/60 animate-bounce" style={{ animationDuration: '4s' }}>
            {/* ADD PATH TO LOGO.PNG HERE IN THE SRC ATTRIBUTE */}
            <img src="/path/to/logo.png" alt="Logo" className="w-16 h-16 object-contain drop-shadow-md" />
          </div>
          <h1 className="text-5xl font-extrabold mb-6 text-[#1E293B] drop-shadow-sm tracking-tight">Connect & Chat</h1>
          <p className="text-xl font-medium text-[#334155] drop-shadow-sm max-w-md leading-relaxed">
            Experience seamless communication in a warm, vibrant workspace designed for you.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative overflow-hidden">
        
        {/* Mobile decorative blobs */}
        <div className="absolute lg:hidden w-72 h-72 bg-[#c2e9fb]/40 rounded-full blur-3xl top-0 right-0 pointer-events-none"></div>
        <div className="absolute lg:hidden w-72 h-72 bg-[#e0c3fc]/40 rounded-full blur-3xl bottom-0 left-0 pointer-events-none"></div>

        <div className="w-full max-w-[440px] relative z-10 bg-white/90 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_-12px_rgba(161,196,253,0.25)] border border-white/60">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-[#1A1A1A] mb-2 tracking-tight">Welcome Back</h2>
            <p className="text-[#666666] font-medium text-sm">Login to your chat workspace</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 rounded-2xl text-center text-sm text-red-500 animate-in fade-in zoom-in duration-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div className="space-y-2 group">
              <label className="block text-sm font-bold text-[#4D4D4D] ml-2 transition-colors group-focus-within:text-[#8ea8d9]">Email</label>
              <input
                type="email"
                name="email"
                placeholder="panda@example.com"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-6 py-4 rounded-[1.5rem] bg-[#F7F7F7] border-2 border-[#E6E6E6] focus:border-[#a1c4fd] focus:bg-white focus:ring-4 focus:ring-[#a1c4fd]/20 transition-all duration-300 outline-none placeholder:text-[#A6A6A6] text-[#1A1A1A] font-medium hover:border-[#D9D9D9]"
              />
            </div>

            {/* Password */}
            <div className="space-y-2 group relative">
              <label className="block text-sm font-bold text-[#4D4D4D] ml-2 transition-colors group-focus-within:text-[#8ea8d9]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-6 py-4 rounded-[1.5rem] bg-[#F7F7F7] border-2 border-[#E6E6E6] focus:border-[#a1c4fd] focus:bg-white focus:ring-4 focus:ring-[#a1c4fd]/20 transition-all duration-300 outline-none placeholder:text-[#A6A6A6] text-[#1A1A1A] font-medium tracking-widest hover:border-[#D9D9D9]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#A6A6A6] hover:text-[#a1c4fd] transition-colors bg-transparent border-none outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 px-6 font-bold rounded-[1.5rem] transition-all duration-300 mt-8 flex items-center justify-center gap-2 shadow-[0_10px_20px_-10px_rgba(161,196,253,0.5)] ${
                loading
                  ? 'bg-[#E6E6E6] text-[#A6A6A6] cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] hover:from-[#c2e9fb] hover:to-[#e0c3fc] text-[#1E293B] hover:-translate-y-1 active:translate-y-0 active:scale-95'
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-[#1E293B]/40 border-t-[#1E293B] rounded-full animate-spin"></div>
              ) : "Login"}
            </button>

          </form>

          <div className="mt-10 text-center text-sm text-[#666666] font-medium">
            Don’t have an account?
            <button
              onClick={() => setShowRegister(true)}
              className="ml-2 text-[#8ea8d9] font-bold hover:text-[#e0c3fc] transition-colors hover:underline underline-offset-4"
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