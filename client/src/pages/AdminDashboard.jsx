import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Navbar from '../components/Navbar';

function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [notifMessage, setNotifMessage] = useState('');
  const [notifStatus, setNotifStatus] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/admin/employees');
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/employees', { name, email, password, role: 'employee' });
      setMessage('Employee added successfully!');
      setName('');
      setEmail('');
      setPassword('');
      setShowAddForm(false);
      fetchEmployees();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to add employee');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await api.delete(`/admin/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScoreChange = async (id, currentScore) => {
    const newScore = window.prompt('Enter new score (0-100):', currentScore);
    if (newScore === null) return;
    try {
      await api.put(`/admin/employees/${id}/score`, {
        newScore: parseInt(newScore),
        reason: 'Manual adjustment by Admin'
      });
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notifications/send', { message: notifMessage, recipientIds: 'all' });
      setNotifStatus('Notification sent to all employees!');
      setNotifMessage('');
    } catch (err) {
      setNotifStatus(err.response?.data?.message || 'Failed to send notification');
    }
  };

  const statusBadge = (status) => {
    const styles = {
      active: 'bg-emerald-50 text-emerald-700',
      warning: 'bg-amber-50 text-amber-700',
      blocked: 'bg-red-50 text-red-700'
    };
    return `px-2.5 py-1 rounded-full text-xs font-medium capitalize ${styles[status] || 'bg-slate-100 text-slate-600'}`;
  };

  const avgScore = employees.length
    ? Math.round(employees.reduce((sum, e) => sum + e.performance_score, 0) / employees.length)
    : 0;
  const atRiskCount = employees.filter((e) => e.performance_score <= 60).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userName="Admin" role="admin" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors w-fit"
          >
            {showAddForm ? 'Cancel' : '+ Add Employee'}
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <p className="text-sm text-slate-500 mb-1">Total Employees</p>
            <p className="text-3xl font-bold text-slate-800">{employees.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <p className="text-sm text-slate-500 mb-1">Average Score</p>
            <p className="text-3xl font-bold text-indigo-600">{avgScore}%</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <p className="text-sm text-slate-500 mb-1">At Risk (≤60%)</p>
            <p className="text-3xl font-bold text-red-500">{atRiskCount}</p>
          </div>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Add New Employee</h2>
            {message && (
              <p className="text-sm text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg mb-4">{message}</p>
            )}
            <form onSubmit={handleAddEmployee} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text" placeholder="Name" value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="email" placeholder="Email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <input
                type="password" placeholder="Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
              <button
                type="submit"
                className="sm:col-span-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors"
              >
                Add Employee
              </button>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Send Notification to All Employees</h2>
          {notifStatus && (
            <p className="text-sm text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg mb-4">{notifStatus}</p>
          )}
          <form onSubmit={handleSendNotification} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Type your message..."
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Send to All
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-sm">
                <tr>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Score</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-slate-700">{emp.name}</td>
                    <td className="p-4 text-slate-500 text-sm">{emp.email}</td>
                    <td className="p-4">
                      <span className={`font-semibold ${
                        emp.performance_score <= 30 ? 'text-red-600' :
                        emp.performance_score <= 60 ? 'text-amber-500' :
                        'text-emerald-600'
                      }`}>
                        {emp.performance_score}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={statusBadge(emp.status)}>{emp.status}</span>
                    </td>
                    <td className="p-4 space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => handleScoreChange(emp.id, emp.performance_score)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Edit Score
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {employees.length === 0 && (
            <p className="p-10 text-center text-slate-400">No employees yet. Add your first one above.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;