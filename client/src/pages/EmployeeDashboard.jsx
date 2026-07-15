import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

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

  if (!profile) return <p className="p-8">Loading...</p>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Welcome, {profile.name}</h1>

      {profile.performance_score <= 60 && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          ⚠️ Warning: Your performance score is low. Please submit your work regularly to avoid account suspension.
        </div>
      )}

      <div className="bg-white shadow p-6 rounded-lg mb-6">
        <p className="text-lg">Performance Score:</p>
        <p className={`text-4xl font-bold ${profile.performance_score <= 60 ? 'text-red-500' : 'text-green-600'}`}>
          {profile.performance_score}%
        </p>
      </div>

      <div className="bg-white shadow p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Attendance</h2>
        {attendanceMessage && <p className="mb-4 text-blue-600">{attendanceMessage}</p>}
        {attendanceMarked ? (
          <p className="text-green-600 font-medium">✓ Attendance marked for today</p>
        ) : (
          <button
            onClick={handleMarkAttendance}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Mark Attendance
          </button>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="bg-white shadow p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <ul className="space-y-2">
            {notifications.map((notif) => (
              <li key={notif.id} className="border-b pb-2 text-gray-700">
                {notif.message}
                <span className="block text-xs text-gray-400">
                  {new Date(notif.created_at).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-white shadow p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Submit Today's Work</h2>
        {message && <p className="mb-4 text-blue-600">{message}</p>}
        <form onSubmit={handleSubmitWork}>
          <input
            type="text"
            placeholder="Screenshot URL (link for now)"
            value={screenshotUrl}
            onChange={(e) => setScreenshotUrl(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <input
            type="text"
            placeholder="GitHub Link (optional)"
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmployeeDashboard;