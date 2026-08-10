import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import logoImg from '../assets/logo.jpg';

function EmployeeDashboard() {
  const [profile, setProfile] = useState(null);
  const [githubLink, setGithubLink] = useState('');
  const [screenshotFile, setScreenshotFile] = useState(null);
  const [message, setMessage] = useState('');
  const [attendanceMessage, setAttendanceMessage] = useState('');
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [workHistory, setWorkHistory] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    fetchProfile();
    checkAttendanceStatus();
    fetchNotifications();
    fetchWorkHistory();
    fetchAttendanceHistory();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/employee/profile');
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const checkAttendanceStatus = async () => {
    try {
      const res = await api.get('/employee/attendance-history');
      const today = new Date().toISOString().split('T')[0];
      const markedToday = res.data.some((record) => {
        const recordDate = new Date(record.date).toISOString().split('T')[0];
        return recordDate === today;
      });
      setAttendanceMarked(markedToday);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/my-notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWorkHistory = async () => {
    try {
      const res = await api.get('/employee/history');
      setWorkHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendanceHistory = async () => {
    try {
      const res = await api.get('/employee/attendance-history');
      setAttendanceHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      await api.post('/employee/mark-attendance');
      setAttendanceMessage('Attendance marked successfully!');
      setAttendanceMarked(true);
      fetchAttendanceHistory();
    } catch (err) {
      setAttendanceMessage(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      if (screenshotFile) formData.append('screenshot', screenshotFile);
      if (githubLink) formData.append('githubLink', githubLink);

      await api.post('/employee/submit-work', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Work submitted successfully!');
      setGithubLink('');
      setScreenshotFile(null);
      setShowSubmitModal(false);
      fetchWorkHistory();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center lavender-bg">
        <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-3xl shadow-sm border border-purple-100">
          <div className="w-6 h-6 border-3 border-purple-700 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-purple-950 font-bold text-sm">Loading AuraPulse Workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lavender-bg p-3 sm:p-6 text-purple-950 font-sans selection:bg-purple-200">
      
      {/* Outer Shell Wrapper (Matching Reference Image Frame) */}
      <div className="max-w-[1600px] mx-auto bg-white/80 backdrop-blur-2xl rounded-[36px] border border-purple-100/90 shadow-2xl p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
        
        {/* ================= LEFT SIDEBAR (AuraPulse OS Navigation) ================= */}
        <aside className="lg:col-span-3 xl:col-span-2 bg-white rounded-3xl p-5 border border-purple-100 shadow-sm flex flex-col justify-between min-h-[750px]">
          <div>
            {/* Top Brand Logo & Collapse Icon */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <img src={logoImg} alt="AuraPulse OS" className="w-10 h-10 rounded-2xl shadow-md object-cover border border-purple-200" />
                <span className="font-extrabold text-base text-purple-950 tracking-tight">AuraPulse OS</span>
              </div>
              <button className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 flex items-center justify-center text-xs border border-purple-100">
                ➔
              </button>
            </div>

            {/* Sidebar Search Bar */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-purple-50/50 border border-purple-100 rounded-2xl py-2.5 pl-9 pr-8 text-xs font-semibold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder:text-purple-900/40"
              />
              <span className="absolute left-3 top-2.5 text-xs text-purple-900/50">🔍</span>
              <span className="absolute right-3 top-2.5 text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">⌘K</span>
            </div>

            {/* Nav Group: MAIN */}
            <div className="mb-6">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900/40 mb-3 px-3">Main</p>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveNav('dashboard')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${activeNav === 'dashboard' ? 'bg-purple-100/80 text-purple-900 border border-purple-200/60 shadow-sm' : 'text-purple-900/70 hover:bg-purple-50'}`}
                >
                  <span>🏠</span> Dashboard
                </button>
                <button
                  onClick={() => setActiveNav('exams')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${activeNav === 'exams' ? 'bg-purple-100/80 text-purple-900 border border-purple-200/60 shadow-sm' : 'text-purple-900/70 hover:bg-purple-50'}`}
                >
                  <span>🏷️</span> Exams & Tasks
                </button>
                <button
                  onClick={() => setActiveNav('lms')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${activeNav === 'lms' ? 'bg-purple-100/80 text-purple-900 border border-purple-200/60 shadow-sm' : 'text-purple-900/70 hover:bg-purple-50'}`}
                >
                  <span>🗂️</span> LMS Reports
                </button>
                <button
                  onClick={() => setActiveNav('questions')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${activeNav === 'questions' ? 'bg-purple-100/80 text-purple-900 border border-purple-200/60 shadow-sm' : 'text-purple-900/70 hover:bg-purple-50'}`}
                >
                  <span>❓</span> Questions
                </button>
                <button
                  onClick={() => setActiveNav('students')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition ${activeNav === 'students' ? 'bg-purple-100/80 text-purple-900 border border-purple-200/60 shadow-sm' : 'text-purple-900/70 hover:bg-purple-50'}`}
                >
                  <span>👥</span> Students Team
                </button>
              </nav>
            </div>

            {/* Nav Group: MANAGEMENT */}
            <div className="mb-6 border-t border-purple-100 pt-5">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900/40 mb-3 px-3">Management</p>
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-bold text-purple-900/70 hover:bg-purple-50 transition">
                  <span>🎛️</span> Results Database
                </button>
                <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-bold text-purple-900/70 hover:bg-purple-50 transition">
                  <span>📊</span> Statistics
                </button>
                <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-bold text-purple-900/70 hover:bg-purple-50 transition">
                  <span>🎓</span> Certificates
                </button>
                <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-bold text-purple-900/70 hover:bg-purple-50 transition">
                  <span>📋</span> Surveys
                </button>
              </nav>
            </div>

            {/* Nav Group: SYSTEM */}
            <div className="border-t border-purple-100 pt-5">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900/40 mb-3 px-3">System</p>
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-bold text-purple-900/70 hover:bg-purple-50 transition">
                  <span>⚙️</span> Settings
                </button>
                <button className="w-full flex items-center gap-3 px-3.5 py-2 rounded-2xl text-xs font-bold text-purple-900/70 hover:bg-purple-50 transition">
                  <span>❓</span> Help Center
                </button>
              </nav>
            </div>
          </div>

          {/* Bottom Sidebar User Profile Box */}
          <div className="pt-4 border-t border-purple-100 mt-6">
            <div className="flex items-center gap-3 bg-purple-50/70 p-2.5 rounded-2xl border border-purple-100">
              <div className="w-9 h-9 rounded-xl bg-purple-700 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="font-extrabold text-xs text-purple-950 truncate">{profile.name}</p>
                <p className="text-[10px] font-medium text-purple-900/50 truncate">{profile.email}</p>
              </div>
            </div>
          </div>
        </aside>

        {/* ================= MAIN DASHBOARD WORKSPACE ================= */}
        <main className="lg:col-span-9 xl:col-span-10 space-y-6">
          
          {/* Top Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-5 border border-purple-100 shadow-sm">
            <div>
              <h1 className="text-2xl font-extrabold text-purple-950 tracking-tight">
                Good Mornings, <span className="text-purple-700">{profile.name}</span>
              </h1>
              <p className="text-xs font-bold text-purple-900/50 mt-0.5">Exam Date: 02 Aug, 2026</p>
            </div>

            {/* Right Header Action Badges & Buttons */}
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm hover:bg-purple-100 transition">
                ✉️
              </button>
              
              {/* Notification Icon with Badge */}
              <div className="relative">
                <button className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm hover:bg-purple-100 transition">
                  🔔
                </button>
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {notifications.length}
                  </span>
                )}
              </div>

              {/* Avatar Stack */}
              <div className="hidden md:flex items-center -space-x-2 bg-purple-50 p-1.5 rounded-2xl border border-purple-100">
                <div className="w-7 h-7 rounded-full bg-purple-400 border-2 border-white flex items-center justify-center font-bold text-[10px] text-purple-950">A</div>
                <div className="w-7 h-7 rounded-full bg-indigo-400 border-2 border-white flex items-center justify-center font-bold text-[10px] text-white">B</div>
                <div className="w-7 h-7 rounded-full bg-emerald-400 border-2 border-white flex items-center justify-center font-bold text-[10px] text-emerald-950">C</div>
                <span className="text-[10px] font-bold text-purple-900/60 pl-3 pr-1">10+</span>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => setShowSubmitModal(!showSubmitModal)}
                className="bg-purple-950 hover:bg-purple-900 text-white px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-md shadow-purple-950/20 transition active:scale-95"
              >
                <span>👤</span> Submit Work Proof
              </button>
            </div>
          </div>

          {/* Submission Modal Form if Toggled */}
          {showSubmitModal && (
            <div className="bg-white rounded-3xl p-6 border border-purple-200 shadow-xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-purple-100">
                <h3 className="text-sm font-extrabold text-purple-950">Submit Daily Work Verification</h3>
                <button onClick={() => setShowSubmitModal(false)} className="text-purple-400 hover:text-purple-600 font-bold">✕</button>
              </div>

              <form onSubmit={handleSubmitWork} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900/60 mb-2">GitHub Repository URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/repository"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="w-full px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs font-semibold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-purple-900/60 mb-2">Work Screenshot Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setScreenshotFile(e.target.files[0])}
                    className="w-full px-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs text-purple-900 file:mr-4 file:py-1 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-700 file:text-white"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="bg-purple-50 hover:bg-purple-100 text-purple-900 px-5 py-2.5 rounded-2xl font-bold text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-purple-700/25"
                  >
                    {submitting ? 'Uploading...' : 'Submit Work Report'}
                  </button>
                </div>
              </form>
              {message && <p className="text-xs font-bold text-emerald-600 pt-2">{message}</p>}
            </div>
          )}

          {/* ================= TOP 3 METRIC CARDS ROW (Exact Tabor Study Design) ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Card 1: Need to grade / Performance Score with Donut SVG */}
            <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm flex flex-col justify-between">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[11px] font-bold text-purple-900/60">Need to grade</p>
                  <p className="text-2xl font-extrabold text-purple-950 mt-1">{profile.performance_score}% <span className="text-xs text-purple-950 font-bold">Grade</span></p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 mt-1">
                    ↗ +4.56%
                  </span>
                </div>

                {/* SVG Donut Ring Gauge */}
                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-purple-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-purple-600"
                      strokeDasharray={`${profile.performance_score}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute font-extrabold text-xs text-purple-950">{profile.performance_score}%</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-purple-100 text-[11px] font-semibold text-purple-900/50">
                <span className="w-5 h-5 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-bold">📑</span>
                <span>yearly student exam test online system</span>
              </div>
            </div>

            {/* Card 2: New Active Student / Attendance Status */}
            <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[11px] font-bold text-purple-900/60">New Active student</p>
                    <p className="text-2xl font-extrabold text-purple-950 mt-1">536</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 mt-1">
                      ↗ +6.354%
                    </span>
                  </div>
                  <div className="w-9 h-9 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                    👥
                  </div>
                </div>

                {/* Vertical Equalizer Bar Graphic */}
                <div className="flex items-end justify-between gap-1.5 h-10 mt-3 px-1">
                  <div className="w-2 bg-purple-300 rounded-full h-4"></div>
                  <div className="w-2 bg-purple-600 rounded-full h-8"></div>
                  <div className="w-2 bg-purple-300 rounded-full h-5"></div>
                  <div className="w-2 bg-purple-600 rounded-full h-9"></div>
                  <div className="w-2 bg-purple-300 rounded-full h-3"></div>
                  <div className="w-2 bg-purple-600 rounded-full h-7"></div>
                  <div className="w-2 bg-purple-300 rounded-full h-4"></div>
                  <div className="w-2 bg-purple-600 rounded-full h-10"></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-purple-100">
                <span className="text-[11px] font-semibold text-purple-900/60">Attendance: {attendanceMarked ? '✓ Logged' : 'Pending'}</span>
                <button
                  onClick={handleMarkAttendance}
                  disabled={attendanceMarked}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition ${attendanceMarked ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-700 hover:bg-purple-800 text-white'}`}
                >
                  {attendanceMarked ? 'Attended' : 'Check-in Now'}
                </button>
              </div>
            </div>

            {/* Card 3: Questions / Work Submissions Count */}
            <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[11px] font-bold text-purple-900/60">Questions & Tasks</p>
                    <p className="text-2xl font-extrabold text-purple-950 mt-1">64</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 mt-1">
                      ↗ +2.56%
                    </span>
                  </div>

                  {/* Soundwave Bar Visual */}
                  <div className="flex items-center gap-1 h-8">
                    <div className="w-1.5 bg-emerald-400 rounded-full h-4"></div>
                    <div className="w-1.5 bg-emerald-500 rounded-full h-7"></div>
                    <div className="w-1.5 bg-emerald-400 rounded-full h-5"></div>
                    <div className="w-1.5 bg-emerald-600 rounded-full h-8"></div>
                    <div className="w-1.5 bg-emerald-400 rounded-full h-4"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-purple-100 text-[11px] font-semibold text-purple-900/50">
                <span className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">❓</span>
                <span>yearly student exam test online system monthly time remaining</span>
              </div>
            </div>

          </div>

          {/* ================= MIDDLE ROW: 2 LARGE ANALYTICS CARDS ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            
            {/* Left 7 Columns: Exam Taken Times (Line Chart with Gradient Fill) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-extrabold text-purple-950">Exam Taken Times</h3>
                  <p className="text-[11px] font-semibold text-purple-900/50 mt-0.5">Taken records of last Years</p>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-purple-900"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Active Exams</span>
                  <span className="flex items-center gap-1.5 text-purple-900/50"><span className="w-2.5 h-2.5 rounded-full bg-purple-200"></span> Active Exam Takers</span>
                  <button className="bg-purple-50 border border-purple-100 px-3 py-1 rounded-xl text-[11px] font-bold text-purple-900">
                    📅 Monthly ▾
                  </button>
                </div>
              </div>

              {/* Line Chart Graphic with Smooth Curve */}
              <div className="relative h-48 w-full mt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7e22ce" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#7e22ce" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  {/* Vertical Month Background Bars */}
                  <rect x="20" y="10" width="12" height="130" fill="#f3eefb" rx="4" />
                  <rect x="60" y="10" width="12" height="130" fill="#f3eefb" rx="4" />
                  <rect x="100" y="10" width="12" height="130" fill="#f3eefb" rx="4" />
                  <rect x="140" y="10" width="12" height="130" fill="#f3eefb" rx="4" />
                  <rect x="180" y="10" width="12" height="130" fill="#f3eefb" rx="4" />
                  <rect x="220" y="10" width="12" height="130" fill="#f3eefb" rx="4" />
                  <rect x="260" y="10" width="12" height="130" fill="#f3eefb" rx="4" />
                  <rect x="300" y="10" width="12" height="130" fill="#f3eefb" rx="4" />
                  <rect x="340" y="10" width="12" height="130" fill="#f3eefb" rx="4" />
                  <rect x="380" y="10" width="12" height="130" fill="#f3eefb" rx="4" />
                  <rect x="420" y="10" width="12" height="130" fill="#f3eefb" rx="4" />
                  <rect x="460" y="10" width="12" height="130" fill="#f3eefb" rx="4" />

                  {/* Smooth Filled Gradient Area */}
                  <path
                    d="M 20 100 Q 60 90, 100 95 T 180 80 T 260 40 T 340 85 T 420 60 T 480 80 L 480 140 L 20 140 Z"
                    fill="url(#purpleGradient)"
                  />

                  {/* Smooth Curve Line */}
                  <path
                    d="M 20 100 Q 60 90, 100 95 T 180 80 T 260 40 T 340 85 T 420 60 T 480 80"
                    fill="none"
                    stroke="#7e22ce"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Glowing Data Dots */}
                  <circle cx="260" cy="40" r="5" fill="#7e22ce" stroke="#ffffff" strokeWidth="2" />
                  <circle cx="340" cy="85" r="4" fill="#7e22ce" />
                  <circle cx="420" cy="60" r="4" fill="#7e22ce" />
                </svg>

                {/* X-Axis Ticks */}
                <div className="flex justify-between text-[10px] font-bold text-purple-900/40 mt-2 px-1">
                  <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                  <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Average Results For Test Questions (Segmented Skill Progress Bars) */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-purple-950 mb-3">Average Results For Test Questions</h3>

                {/* Indicator Badges */}
                <div className="flex flex-wrap gap-3 text-[10px] font-bold mb-5">
                  <span className="flex items-center gap-1 text-purple-900"><span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Easy questions</span>
                  <span className="flex items-center gap-1 text-purple-900"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Medium questions</span>
                  <span className="flex items-center gap-1 text-purple-900"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Difficult</span>
                  <span className="flex items-center gap-1 text-purple-900"><span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span> Hard</span>
                </div>

                {/* Horizontal Segmented Progress Bars */}
                <div className="space-y-4">
                  {/* Subject 1 */}
                  <div>
                    <p className="text-xs font-bold text-purple-950 mb-1.5">Mathematic</p>
                    <div className="flex h-3 rounded-full overflow-hidden bg-purple-50">
                      <div className="bg-purple-600 w-[40%]"></div>
                      <div className="bg-emerald-400 w-[30%] border-l-2 border-white"></div>
                      <div className="bg-amber-400 w-[10%] border-l-2 border-white"></div>
                      <div className="bg-orange-500 w-[20%] border-l-2 border-white"></div>
                    </div>
                  </div>

                  {/* Subject 2 */}
                  <div>
                    <p className="text-xs font-bold text-purple-950 mb-1.5">English 1</p>
                    <div className="flex h-3 rounded-full overflow-hidden bg-purple-50">
                      <div className="bg-purple-600 w-[55%]"></div>
                      <div className="bg-emerald-400 w-[10%] border-l-2 border-white"></div>
                      <div className="bg-amber-400 w-[20%] border-l-2 border-white"></div>
                      <div className="bg-orange-500 w-[15%] border-l-2 border-white"></div>
                    </div>
                  </div>

                  {/* Subject 3 */}
                  <div>
                    <p className="text-xs font-bold text-purple-950 mb-1.5">Science 2</p>
                    <div className="flex h-3 rounded-full overflow-hidden bg-purple-50">
                      <div className="bg-purple-600 w-[15%]"></div>
                      <div className="bg-emerald-400 w-[45%] border-l-2 border-white"></div>
                      <div className="bg-amber-400 w-[25%] border-l-2 border-white"></div>
                      <div className="bg-orange-500 w-[15%] border-l-2 border-white"></div>
                    </div>
                  </div>

                  {/* Subject 4 */}
                  <div>
                    <p className="text-xs font-bold text-purple-950 mb-1.5">Economics</p>
                    <div className="flex h-3 rounded-full overflow-hidden bg-purple-50">
                      <div className="bg-purple-600 w-[35%]"></div>
                      <div className="bg-emerald-400 w-[25%] border-l-2 border-white"></div>
                      <div className="bg-amber-400 w-[30%] border-l-2 border-white"></div>
                      <div className="bg-orange-500 w-[10%] border-l-2 border-white"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pass Mark Scale at Bottom */}
              <div className="flex justify-between text-[10px] font-bold text-purple-900/40 border-t border-purple-100 pt-3 mt-4">
                <span>Pass Mark:</span>
                <span>10</span><span>20</span><span>30</span><span>40</span><span>50</span><span>60</span><span>70</span><span>80</span><span>90</span><span>100</span>
              </div>
            </div>

          </div>

          {/* ================= BOTTOM DATA TABLE: BROWSE TEST RESULTS ================= */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-extrabold text-purple-950">Browse test results</h3>
              <button
                onClick={() => setShowSubmitModal(true)}
                className="bg-purple-50 hover:bg-purple-100 border border-purple-100 text-purple-900 px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition"
              >
                ✉️ Send certificates / Submit Work
              </button>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold">
                <thead>
                  <tr className="border-b border-purple-100 text-purple-900/50 pb-3">
                    <th className="p-3 w-10"><input type="checkbox" className="rounded" /></th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Total score</th>
                    <th className="p-3">Score Reasoning</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Score Analysis</th>
                    <th className="p-3">Start Date</th>
                    <th className="p-3">Score Generic</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50">
                  
                  {/* Row 1: Active User */}
                  <tr className="hover:bg-purple-50/40 transition">
                    <td className="p-3"><input type="checkbox" className="rounded" defaultChecked /></td>
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-700 text-white font-extrabold flex items-center justify-center text-xs">
                        {profile.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-extrabold text-purple-950">{profile.name}</p>
                        <p className="text-[10px] text-purple-900/50">{profile.email}</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-xl text-[11px] font-extrabold">
                        {profile.performance_score}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-purple-50 text-purple-800 border border-purple-100 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                        📊 50% (1/2)
                      </span>
                    </td>
                    <td className="p-3 font-mono text-purple-900/70">00:53</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-purple-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-purple-600 h-full w-[85%]"></div>
                        </div>
                        <span className="text-[10px] font-bold text-purple-900">100%</span>
                      </div>
                    </td>
                    <td className="p-3 text-purple-900/70">Jan 20, 2026</td>
                    <td className="p-3">
                      <span className="bg-pink-50 text-pink-700 border border-pink-100 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                        0% (0/2)
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button className="p-1.5 hover:bg-purple-100 rounded-lg text-purple-700">🗑️</button>
                      <button className="p-1.5 hover:bg-purple-100 rounded-lg text-purple-700">✏️</button>
                      <button className="p-1.5 hover:bg-purple-100 rounded-lg text-purple-700">•••</button>
                    </td>
                  </tr>

                  {/* Row 2: Secondary Employee */}
                  <tr className="hover:bg-purple-50/40 transition">
                    <td className="p-3"><input type="checkbox" className="rounded" /></td>
                    <td className="p-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-teal-600 text-white font-extrabold flex items-center justify-center text-xs">
                        A
                      </div>
                      <div>
                        <p className="font-extrabold text-purple-950">Anwar Hussen</p>
                        <p className="text-[10px] text-purple-900/50">anwar@taborstudy.com</p>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-xl text-[11px] font-extrabold">
                        92.7%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="bg-purple-50 text-purple-800 border border-purple-100 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                        📊 100% (2/2)
                      </span>
                    </td>
                    <td className="p-3 font-mono text-purple-900/70">01:00</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-purple-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[95%]"></div>
                        </div>
                        <span className="text-[10px] font-bold text-purple-900">00%</span>
                      </div>
                    </td>
                    <td className="p-3 text-purple-900/70">Jan 20, 2026</td>
                    <td className="p-3">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-xl text-[11px] font-bold">
                        0% (0/2)
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button className="p-1.5 hover:bg-purple-100 rounded-lg text-purple-700">🗑️</button>
                      <button className="p-1.5 hover:bg-purple-100 rounded-lg text-purple-700">✏️</button>
                      <button className="p-1.5 hover:bg-purple-100 rounded-lg text-purple-700">•••</button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* ================= FLOATING BOTTOM BRIEF BANNER (Matching Reference Image Banner) ================= */}
      {showBanner && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-2xl rounded-3xl border border-purple-200 shadow-2xl p-4 sm:px-6 sm:py-3.5 flex items-center justify-between gap-6 max-w-2xl w-[92vw] text-xs font-bold text-purple-950">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-base shrink-0">
              📝
            </div>
            <div>
              <p className="font-extrabold text-purple-950">
                Start a Project Brief <span className="text-purple-900/60 font-semibold hidden sm:inline">Tell us what you need and find the right talent.</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="bg-white hover:bg-purple-50 text-purple-950 border border-purple-200 px-4 py-2 rounded-2xl text-xs font-extrabold shadow-sm transition active:scale-95"
            >
              Get Started
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="text-purple-400 hover:text-purple-600 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default EmployeeDashboard;