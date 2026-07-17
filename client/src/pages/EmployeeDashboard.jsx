import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';

function EmployeeDashboard() {
  const [profile, setProfile] = useState(null);
  const [githubLink, setGithubLink] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [message, setMessage] = useState('');
  const [attendanceMessage, setAttendanceMessage] = useState('');
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchProfile();
    checkAttendanceStatus();
    fetchNotifications();
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

  const handleMarkAttendance = async () => {
    try {
      await api.post('/employee/mark-attendance');
      setAttendanceMessage('Attendance marked successfully!');
      setAttendanceMarked(true);
    } catch (err) {
      setAttendanceMessage(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    try {
      await api.post('/employee/submit-work', { screenshotUrl, githubLink });
      setMessage('Work submitted successfully!');
      setGithubLink('');
      setScreenshotUrl('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Submission failed');
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const scoreColor =
    profile.performance_score <= 30 ? 'text-red-600' :
    profile.performance_score <= 60 ? 'text-amber-500' :
    'text-emerald-600';

  const scoreRingColor =
    profile.performance_score <= 30 ? 'stroke-red-500' :
    profile.performance_score <= 60 ? 'stroke-amber-400' :
    'stroke-emerald-500';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userName={profile.name} role="employee" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {profile.performance_score <= 60 && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl mb-6 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold">Your performance score is low</p>
              <p className="text-sm text-red-600 mt-0.5">
                Please submit your work regularly to avoid account suspension.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Score Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex items-center gap-5">
            <svg className="w-20 h-20 -rotate-90 shrink-0" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" strokeWidth="10" className="stroke-slate-100" fill="none" />
              <circle
                cx="50" cy="50" r="42" strokeWidth="10" fill="none"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - profile.performance_score / 100)}
                strokeLinecap="round"
                className={scoreRingColor}
              />
            </svg>
            <div>
              <p className="text-sm text-slate-500 mb-1">Performance Score</p>
              <p className={`text-3xl font-bold ${scoreColor}`}>{profile.performance_score}%</p>
              <p className="text-xs text-slate-400 mt-1 capitalize">Status: {profile.status}</p>
            </div>
          </div>

          {/* Attendance Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center">
            <p className="text-sm text-slate-500 mb-3">Today's Attendance</p>
            {attendanceMessage && <p className="text-sm text-indigo-600 mb-2">{attendanceMessage}</p>}
            {attendanceMarked ? (
              <div className="flex items-center gap-2 text-emerald-600 font-medium">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                Marked for today
              </div>
            ) : (
              <button
                onClick={handleMarkAttendance}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors w-fit"
              >
                Mark Attendance
              </button>
            )}
          </div>
        </div>

        {notifications.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Notifications</h2>
            <ul className="space-y-3">
              {notifications.map((notif) => (
                <li key={notif.id} className="flex gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <span className="w-2 h-2 mt-2 bg-indigo-400 rounded-full shrink-0"></span>
                  <div>
                    <p className="text-slate-700 text-sm">{notif.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(notif.created_at).toLocaleString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Submit Today's Work</h2>
          {message && (
            <p className="text-sm text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg mb-4">{message}</p>
          )}
          <form onSubmit={handleSubmitWork} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">Screenshot URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={screenshotUrl}
                onChange={(e) => setScreenshotUrl(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1.5">GitHub Link (optional)</label>
              <input
                type="text"
                placeholder="https://github.com/..."
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Submit Work
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;