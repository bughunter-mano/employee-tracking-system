import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

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
      await api.post('/notifications/send', {
        message: notifMessage,
        recipientIds: 'all'
      });
      setNotifStatus('Notification sent to all employees!');
      setNotifMessage('');
    } catch (err) {
      setNotifStatus(err.response?.data?.message || 'Failed to send notification');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showAddForm ? 'Cancel' : '+ Add Employee'}
        </button>
      </div>

      <div className="bg-white shadow p-4 rounded-lg mb-6">
        <p className="text-lg">Total Employees: <span className="font-bold">{employees.length}</span></p>
      </div>

      {showAddForm && (
        <div className="bg-white shadow p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Add New Employee</h2>
          {message && <p className="mb-4 text-blue-600">{message}</p>}
          <form onSubmit={handleAddEmployee}>
            <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded mb-4" required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded mb-4" required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded mb-4" required />
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Add Employee
            </button>
          </form>
        </div>
      )}

      <div className="bg-white shadow p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Send Notification to All Employees</h2>
        {notifStatus && <p className="mb-4 text-blue-600">{notifStatus}</p>}
        <form onSubmit={handleSendNotification} className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={notifMessage}
            onChange={(e) => setNotifMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
            required
          />
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            Send
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Score</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="p-3">{emp.name}</td>
                <td className="p-3">{emp.email}</td>
                <td className={`p-3 font-bold ${emp.performance_score <= 60 ? 'text-red-500' : 'text-green-600'}`}>
                  {emp.performance_score}%
                </td>
                <td className="p-3 capitalize">{emp.status}</td>
                <td className="p-3 space-x-2">
                  <button onClick={() => handleScoreChange(emp.id, emp.performance_score)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">
                    Edit Score
                  </button>
                  <button onClick={() => handleDelete(emp.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {employees.length === 0 && <p className="p-6 text-center text-gray-500">No employees yet.</p>}
      </div>
    </div>
  );
}

export default AdminDashboard;