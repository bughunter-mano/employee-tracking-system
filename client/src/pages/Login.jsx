import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center font-bold text-2xl text-white mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            E
          </div>
          <h1 className="text-2xl font-bold text-white">EmpTrack</h1>
          <p className="text-slate-400 text-sm mt-1">Employee Performance & Attendance System</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-white/95 backdrop-blur p-8 rounded-2xl shadow-2xl"
        >
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Sign in to your account</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-600 mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium py-2.5 rounded-lg transition-colors shadow-md shadow-indigo-500/20"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-6">
          Contact your Admin if you don't have an account.
        </p>
      </div>
    </div>
  );
}

export default Login;