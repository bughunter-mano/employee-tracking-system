import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';
import logoImg from '../assets/logo.jpg';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      await api.post('/auth/signup', { name, email, password, role: 'employee' });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center lavender-bg px-4 py-8 relative">
      <div className="relative z-10 w-full max-w-md my-auto">
        <div className="text-center mb-6">
          <img src={logoImg} alt="AuraPulse OS" className="w-16 h-16 rounded-3xl shadow-xl mx-auto mb-3 object-cover border-2 border-purple-200" />
          <h1 className="text-3xl font-extrabold text-purple-950 tracking-tight">AuraPulse <span className="text-purple-600 font-semibold">OS</span></h1>
          <p className="text-purple-800/70 text-sm mt-1 font-medium">Create Employee Account</p>
        </div>

        <div className="bg-white/90 border border-purple-100/90 backdrop-blur-2xl p-8 rounded-3xl shadow-xl shadow-purple-950/5 relative overflow-hidden">
          <h2 className="text-xl font-bold text-purple-950 mb-5">Register New Employee</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-2xl mb-5 flex items-center gap-2 font-medium">
              <span>⚠️</span> {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-2xl mb-5 flex items-center gap-2 font-medium">
              <span>✅</span> {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/60 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs font-semibold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/60 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="employee@emptrack.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs font-semibold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/60 mb-2">Account Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs font-semibold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs py-3.5 rounded-2xl transition shadow-md shadow-purple-700/25 mt-2"
            >
              {loading ? 'Creating Account...' : 'Register Employee Account'}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-purple-100 text-center">
            <p className="text-xs text-purple-900/60 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-purple-700 font-extrabold hover:underline">
                Sign In Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
