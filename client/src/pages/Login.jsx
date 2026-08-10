import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import logoImg from '../assets/logo.jpg';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setEmail('admin@emptrack.com');
    setPassword('admin123');
  };

  const fillDemoEmployee = () => {
    setEmail('employee@emptrack.com');
    setPassword('employee123');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center lavender-bg px-4 py-8 relative">
      
      {/* Centered Content Container */}
      <div className="relative z-10 w-full max-w-md my-auto">
        <div className="text-center mb-6">
          <img src={logoImg} alt="AuraPulse OS" className="w-16 h-16 rounded-3xl shadow-xl mx-auto mb-3 object-cover border-2 border-purple-200" />
          <h1 className="text-3xl font-extrabold text-purple-950 tracking-tight">AuraPulse <span className="text-purple-600 font-semibold">OS</span></h1>
          <p className="text-purple-800/70 text-sm mt-1 font-medium">Intelligent Workforce & Performance Portal</p>
        </div>

        <div className="bg-white/90 border border-purple-100/90 backdrop-blur-2xl p-8 rounded-3xl shadow-xl shadow-purple-950/5 relative overflow-hidden">
          <h2 className="text-xl font-bold text-purple-950 mb-5">Sign In to Your Workspace</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl mb-5 flex items-center gap-2 font-medium">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/70 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-purple-950 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition"
                required
              />
            </div>

            <div className="mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/70 mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-purple-50/40 border border-purple-100 rounded-2xl text-purple-950 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:bg-white transition"
                required
              />
            </div>

            <div className="text-right mb-6">
              <Link to="/forgot-password" className="text-xs font-semibold text-purple-700 hover:text-purple-900 transition">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 hover:bg-purple-800 active:scale-[0.99] disabled:opacity-50 text-white font-bold py-3 rounded-2xl transition shadow-md shadow-purple-700/25"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Credentials Info & Quick Buttons */}
          <div className="mt-7 pt-5 border-t border-purple-100">
            <p className="text-xs text-purple-800/60 font-bold mb-3 text-center uppercase tracking-wider">
              Quick Demo Credentials
            </p>
            
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="p-3 bg-purple-50 hover:bg-purple-100/80 border border-purple-200/80 text-purple-950 rounded-2xl text-xs transition text-left"
              >
                <div className="font-bold text-purple-900 flex items-center gap-1 mb-0.5">👑 Admin</div>
                <div className="text-[11px] text-purple-800/80 font-medium">admin@emptrack.com</div>
                <div className="text-[10px] text-purple-600 font-semibold">Pass: admin123</div>
              </button>

              <button
                type="button"
                onClick={fillDemoEmployee}
                className="p-3 bg-indigo-50/80 hover:bg-indigo-100/80 border border-indigo-200/80 text-indigo-950 rounded-2xl text-xs transition text-left"
              >
                <div className="font-bold text-indigo-900 flex items-center gap-1 mb-0.5">👤 Employee</div>
                <div className="text-[11px] text-indigo-800/80 font-medium">employee@emptrack.com</div>
                <div className="text-[10px] text-indigo-600 font-semibold">Pass: employee123</div>
              </button>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-purple-100 text-center">
            <p className="text-xs text-purple-900/60 font-medium">
              Don't have an employee account?{' '}
              <Link to="/register" className="text-purple-700 font-extrabold hover:underline">
                Create New Employee Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;