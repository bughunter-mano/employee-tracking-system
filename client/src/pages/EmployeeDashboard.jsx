import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

function EmployeeDashboard() {
  const [profile, setProfile] = useState(null);
  const [githubLink, setGithubLink] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/employee/profile');
      setProfile(res.data);
    } catch (err) {
      console.error(err);
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

      <div className="bg-white shadow p-6 rounded-lg mb-6">
        <p className="text-lg">Performance Score:</p>
        <p className={`text-4xl font-bold ${profile.performance_score <= 60 ? 'text-red-500' : 'text-green-600'}`}>
          {profile.performance_score}%
        </p>
      </div>

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