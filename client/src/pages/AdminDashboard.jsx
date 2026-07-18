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
  const [searchTerm, setSearchTerm] = useState('');

  const [sendToAll, setSendToAll] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const [viewingEmployee, setViewingEmployee] = useState(null);

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [scoreEditEmployee, setScoreEditEmployee] = useState(null);
  const [newScoreValue, setNewScoreValue] = useState('');

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

  // Delete
  const confirmDelete = async () => {
    try {
      await api.delete(`/admin/employees/${deleteConfirmId}`);
      setDeleteConfirmId(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  // Score edit
  const openScoreEdit = (emp) => {
    setScoreEditEmployee(emp);
    setNewScoreValue(emp.performance_score);
  };

  const saveScoreChange = async () => {
    try {
      await api.put(`/admin/employees/${scoreEditEmployee.id}/score`, {
        newScore: parseInt(newScoreValue),
        reason: 'Manual adjustment by Admin'
      });
      setScoreEditEmployee(null);
      fetchEmployees();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit name/email
  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setEditName(emp.name);
    setEditEmail(emp.email);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/employees/${editingEmployee.id}`, { name: editName, email: editEmail });
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update employee');
    }
  };

  // Detail view
  const viewEmployeeDetail = async (id) => {
    try {
      const res = await api.get(`/admin/employees/${id}`);
      setViewingEmployee(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Notifications
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notifications/send', {
        message: notifMessage,
        recipientIds: sendToAll ? 'all' : selectedIds
      });
      setNotifStatus('Notification sent successfully!');
      setNotifMessage('');
      setSelectedIds([]);
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

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        {/* Add Employee Form */}
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

        {/* Notifications */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Send Notification</h2>
          {notifStatus && (
            <p className="text-sm text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg mb-4">{notifStatus}</p>
          )}

          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="sendToAll"
              checked={sendToAll}
              onChange={(e) => setSendToAll(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="sendToAll" className="text-sm text-slate-600">Send to all employees</label>
          </div>

          {!sendToAll && (
            <div className="flex flex-wrap gap-2 mb-4">
              {employees.map((emp) => (
                <label
                  key={emp.id}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer border ${
                    selectedIds.includes(emp.id) ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(emp.id)}
                    onChange={() => toggleSelect(emp.id)}
                    className="w-3.5 h-3.5"
                  />
                  {emp.name}
                </label>
              ))}
            </div>
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
              Send
            </button>
          </form>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search employees by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Employee Table */}
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
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <button
                        onClick={() => viewEmployeeDetail(emp.id)}
                        className="font-medium text-indigo-600 hover:underline"
                      >
                        {emp.name}
                      </button>
                    </td>
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
                        onClick={() => openEditModal(emp)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openScoreEdit(emp)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        Edit Score
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(emp.id)}
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
          {filteredEmployees.length === 0 && (
            <p className="p-10 text-center text-slate-400">No employees found.</p>
          )}
        </div>
      </div>

      {/* Edit Name/Email Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Edit Employee</h3>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1.5">Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Detail Modal */}
      {viewingEmployee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">{viewingEmployee.user.name}</h3>
                <p className="text-sm text-slate-500">{viewingEmployee.user.email}</p>
              </div>
              <button onClick={() => setViewingEmployee(null)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Score</p>
                <p className="text-xl font-bold text-slate-800">{viewingEmployee.user.performance_score}%</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-500">Status</p>
                <p className="text-xl font-bold text-slate-800 capitalize">{viewingEmployee.user.status}</p>
              </div>
            </div>

            <h4 className="text-sm font-semibold text-slate-700 mb-2">Recent Work Submissions</h4>
            <div className="space-y-2 mb-5">
              {viewingEmployee.workHistory.length === 0 && <p className="text-slate-400 text-sm">No submissions.</p>}
              {viewingEmployee.workHistory.map((w) => (
                <div key={w.id} className="text-sm border-b border-slate-50 pb-2 flex justify-between">
                  <span>{new Date(w.date).toLocaleDateString()}</span>
                  {w.github_link && <a href={w.github_link} target="_blank" rel="noreferrer" className="text-indigo-600 underline text-xs">Link</a>}
                </div>
              ))}
            </div>

            <h4 className="text-sm font-semibold text-slate-700 mb-2">Recent Attendance</h4>
            <div className="space-y-2">
              {viewingEmployee.attendanceHistory.length === 0 && <p className="text-slate-400 text-sm">No records.</p>}
              {viewingEmployee.attendanceHistory.map((a) => (
                <div key={a.id} className="text-sm border-b border-slate-50 pb-2 flex justify-between">
                  <span>{new Date(a.date).toLocaleDateString()}</span>
                  <span className="text-slate-400 text-xs">{new Date(a.check_in_time).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Delete Employee?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Score Edit Modal */}
      {scoreEditEmployee && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">
              Update Score — {scoreEditEmployee.name}
            </h3>
            <input
              type="number"
              min="0"
              max="100"
              value={newScoreValue}
              onChange={(e) => setNewScoreValue(e.target.value)}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setScoreEditEmployee(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveScoreChange}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;