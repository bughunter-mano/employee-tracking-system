import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';

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
  const [activeTab, setActiveTab] = useState('work');
  const [submitting, setSubmitting] = useState(false);

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
          <p className="text-purple-950 font-semibold text-sm">Loading Employee Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lavender-bg pb-12">
      <Navbar userName={profile.name} role="employee" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8">
        
        {/* Header Greeting & Quick Stat Badges Row (Matches Image Top Header) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-950 tracking-tight">
              Welcome Back, <span className="text-purple-700">{profile.name}</span> 👋
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs font-semibold bg-purple-100 text-purple-800 px-3 py-1 rounded-full border border-purple-200">
                Score: {profile.performance_score}%
              </span>
              <span className="text-xs font-semibold bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full border border-indigo-200 capitalize">
                Status: {profile.status}
              </span>
              <span className="text-xs font-medium text-purple-900/60 hidden sm:inline-block">
                Employee Workspace • Craftive Design System
              </span>
            </div>
          </div>

          {/* Right Metrics Cards (Matching Top Right 3 Cards in Screenshot) */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-purple-700/20">
                ⚡
              </div>
              <div>
                <p className="text-[11px] font-semibold text-purple-900/60 uppercase">Score</p>
                <p className="text-xl font-extrabold text-purple-950">{profile.performance_score}%</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-600/20">
                📊
              </div>
              <div>
                <p className="text-[11px] font-semibold text-purple-900/60 uppercase">Task</p>
                <p className="text-xl font-extrabold text-purple-950">{workHistory.length}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-purple-100 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-900 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-purple-900/20">
                📅
              </div>
              <div>
                <p className="text-[11px] font-semibold text-purple-900/60 uppercase">Attended</p>
                <p className="text-xl font-extrabold text-purple-950">{attendanceHistory.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Banner if score <= 60 */}
        {profile.performance_score <= 60 && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-700 p-4 rounded-3xl mb-8 flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-bold">Performance Alert: Score is low ({profile.performance_score}%)</p>
              <p className="text-xs text-red-600">Please mark attendance and submit daily proof of work to maintain active status.</p>
            </div>
          </div>
        )}

        {/* Main Grid Section (Matching Reference Image Grid Layout) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Left Column (8 cols): Profile Card, Time Tracker & Work Submission */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Top Cards Row: Profile Card + Progress + Time Tracker */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Profile Highlight Card (Matches Left Card in Screenshot) */}
              <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                    EmpTrack Pro
                  </span>
                  <span className="text-xs text-purple-200">Active</span>
                </div>
                <div className="mt-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-400 to-pink-400 flex items-center justify-center text-white font-extrabold text-2xl mb-3 shadow-md">
                    {profile.name.charAt(0)}
                  </div>
                  <h3 className="font-bold text-lg leading-tight">{profile.name}</h3>
                  <p className="text-xs text-purple-300 mt-0.5">{profile.email}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-purple-200 font-medium">Performance Tier</span>
                  <span className="font-bold bg-purple-500/40 text-purple-100 px-2.5 py-0.5 rounded-full border border-purple-400/30">
                    {profile.performance_score >= 80 ? '⭐ Top Tier' : 'Standard'}
                  </span>
                </div>
              </div>

              {/* Progress Bar Chart Component (Matches Screenshot Center Bar Chart) */}
              <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-purple-900/60 uppercase">Progress</span>
                    <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">↗</span>
                  </div>
                  <p className="text-2xl font-extrabold text-purple-950">5.1 h <span className="text-xs font-medium text-purple-900/50">/ week</span></p>
                </div>
                <div className="flex items-end justify-between gap-1.5 h-20 mt-4 px-2">
                  <div className="w-full bg-purple-100 rounded-lg h-10"></div>
                  <div className="w-full bg-purple-100 rounded-lg h-14"></div>
                  <div className="w-full bg-purple-100 rounded-lg h-8"></div>
                  <div className="w-full bg-purple-100 rounded-lg h-12"></div>
                  <div className="w-full bg-purple-700 rounded-lg h-20 relative group">
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] bg-purple-900 text-white px-1.5 py-0.5 rounded font-bold">5h 25m</span>
                  </div>
                  <div className="w-full bg-purple-100 rounded-lg h-9"></div>
                  <div className="w-full bg-purple-100 rounded-lg h-6"></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-purple-900/40 mt-2 px-1">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span className="text-purple-700">F</span><span>S</span>
                </div>
              </div>

              {/* Time Tracker Donut Ring Component (Matches Screenshot Donut Gauge) */}
              <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-purple-900/60 uppercase">Attendance</span>
                    <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold">↗</span>
                  </div>
                  <p className="text-2xl font-extrabold text-purple-950">Today</p>
                </div>

                <div className="my-2 flex items-center justify-center relative">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="38" strokeWidth="9" className="stroke-purple-100" fill="none" />
                    <circle
                      cx="50" cy="50" r="38" strokeWidth="9" fill="none"
                      strokeDasharray={2 * Math.PI * 38}
                      strokeDashoffset={attendanceMarked ? 0 : 2 * Math.PI * 38 * 0.4}
                      strokeLinecap="round"
                      className="stroke-purple-700 transition-all duration-700"
                    />
                  </svg>
                  <span className="absolute text-xs font-extrabold text-purple-950">
                    {attendanceMarked ? '100%' : 'Pending'}
                  </span>
                </div>

                {attendanceMessage && <p className="text-[11px] font-semibold text-purple-700 text-center mb-1">{attendanceMessage}</p>}

                {attendanceMarked ? (
                  <div className="bg-purple-50 text-purple-700 text-xs font-bold py-2 rounded-2xl text-center border border-purple-200 flex items-center justify-center gap-1.5">
                    <span>✓</span> Marked for Today
                  </div>
                ) : (
                  <button
                    onClick={handleMarkAttendance}
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs py-2.5 rounded-2xl transition shadow-md shadow-purple-700/20"
                  >
                    Mark Attendance Now
                  </button>
                )}
              </div>

            </div>

            {/* Work Submission Form Card */}
            <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-lg font-extrabold text-purple-950">Submit Daily Proof of Work</h3>
                  <p className="text-xs text-purple-800/60">Upload your work screenshot or GitHub repository link</p>
                </div>
                <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                  Daily Requirement
                </span>
              </div>

              {message && (
                <div className="bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold p-3.5 rounded-2xl mb-4">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmitWork} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/70 mb-2">
                    Work Screenshot Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setScreenshotFile(e.target.files[0])}
                    className="w-full px-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/70 mb-2">
                    GitHub Link (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="https://github.com/org/repo"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="w-full px-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs text-purple-950 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-sm py-3 rounded-2xl transition shadow-md shadow-purple-700/25"
                  >
                    {submitting ? 'Submitting...' : 'Submit Work Report'}
                  </button>
                </div>
              </form>
            </div>

          </div>

          {/* Right Column (4 cols): Dark Onboarding Task Checklist Card (Matches Right Card in Screenshot) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Dark Purple Checklist Box (Matches Right Card in Screenshot) */}
            <div className="bg-purple-900 text-white p-6 rounded-3xl shadow-xl flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-extrabold tracking-tight">Onboarding & Daily Tasks</h3>
                  <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full backdrop-blur-md">
                    {attendanceMarked ? '2/2 Done' : '1/2 Pending'}
                  </span>
                </div>
                
                <p className="text-xs text-purple-200 mb-6">Complete daily tracking steps to maintain a high performance score.</p>

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between p-3.5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${attendanceMarked ? 'bg-emerald-500 text-white' : 'bg-white/20 text-purple-200'}`}>
                        {attendanceMarked ? '✓' : '1'}
                      </div>
                      <div>
                        <p className="text-xs font-bold">Daily Attendance</p>
                        <p className="text-[10px] text-purple-300">Mark check-in for today</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                      {attendanceMarked ? 'Completed' : 'Required'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white/20 text-purple-200 flex items-center justify-center text-xs font-bold">
                        2
                      </div>
                      <div>
                        <p className="text-xs font-bold">Submit Work Proof</p>
                        <p className="text-[10px] text-purple-300">Screenshot or GitHub link</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-200">
                      Daily
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                      <div>
                        <p className="text-xs font-bold">Maintain Score &gt; 60%</p>
                        <p className="text-[10px] text-purple-300">Current score: {profile.performance_score}%</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 text-center">
                <p className="text-[11px] text-purple-300 font-medium">Craftive Performance Guarantee System</p>
              </div>
            </div>

            {/* Notifications Box */}
            {notifications.length > 0 && (
              <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm">
                <h3 className="text-base font-extrabold text-purple-950 mb-4 flex items-center justify-between">
                  <span>Notifications</span>
                  <span className="text-xs font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{notifications.length}</span>
                </h3>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                  {notifications.map((notif) => (
                    <div key={notif.id || notif._id} className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100/80">
                      <p className="text-xs font-semibold text-purple-950">{notif.message}</p>
                      <p className="text-[10px] text-purple-800/50 mt-1">
                        {new Date(notif.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Tabbed History Section (Work History & Attendance History) */}
        <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-purple-100 pb-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('work')}
                className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'work'
                    ? 'bg-purple-700 text-white shadow-md shadow-purple-700/25'
                    : 'bg-purple-50 text-purple-800/70 hover:text-purple-950'
                }`}
              >
                Work History ({workHistory.length})
              </button>

              <button
                onClick={() => setActiveTab('attendance')}
                className={`px-5 py-2 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'attendance'
                    ? 'bg-purple-700 text-white shadow-md shadow-purple-700/25'
                    : 'bg-purple-50 text-purple-800/70 hover:text-purple-950'
                }`}
              >
                Attendance Records ({attendanceHistory.length})
              </button>
            </div>
          </div>

          {activeTab === 'work' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workHistory.length === 0 && <p className="text-purple-800/50 text-xs font-medium col-span-full py-4 text-center">No submissions recorded yet.</p>}
              {workHistory.map((item) => (
                <div key={item.id || item._id} className="p-4 bg-purple-50/40 rounded-2xl border border-purple-100 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-purple-950">
                        {new Date(item.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                        Submitted
                      </span>
                    </div>
                    {item.github_link && (
                      <p className="text-xs text-purple-700 truncate font-mono mt-1">
                        🔗 {item.github_link}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 pt-2 border-t border-purple-100/60 flex gap-3 text-xs">
                    {item.screenshot_url && (
                      <a href={item.screenshot_url} target="_blank" rel="noreferrer" className="text-purple-700 font-semibold hover:underline">
                        View Screenshot ↗
                      </a>
                    )}
                    {item.github_link && (
                      <a href={item.github_link} target="_blank" rel="noreferrer" className="text-purple-700 font-semibold hover:underline">
                        GitHub ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {attendanceHistory.length === 0 && <p className="text-purple-800/50 text-xs font-medium col-span-full py-4 text-center">No attendance records found.</p>}
              {attendanceHistory.map((item) => (
                <div key={item.id || item._id} className="p-3.5 bg-purple-50/40 rounded-2xl border border-purple-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-purple-950">
                      {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    <p className="text-[10px] text-purple-600 font-medium">Marked Check-in</p>
                  </div>
                  <span className="w-7 h-7 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                </div>
              ))}
            </div>
          )}

        </div>

      </main>
    </div>
  );
}

export default EmployeeDashboard;