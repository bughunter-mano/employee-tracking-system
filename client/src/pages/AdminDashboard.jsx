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
    setMessage('');
    try {
      const res = await api.post('/admin/employees', { name, email, password, role: 'employee' });
      setMessage('✅ Employee registered successfully!');
      setName('');
      setEmail('');
      setPassword('');
      if (res.data?.employee) {
        setEmployees((prev) => [res.data.employee, ...prev]);
      }
      fetchEmployees();
      setTimeout(() => {
        setShowAddForm(false);
        setMessage('');
      }, 1200);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Failed to add employee'}`);
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
      const empId = scoreEditEmployee.id || scoreEditEmployee._id;
      await api.put(`/admin/employees/${empId}/score`, {
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
      const empId = editingEmployee.id || editingEmployee._id;
      await api.put(`/admin/employees/${empId}`, { name: editName, email: editEmail });
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
      active: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
      warning: 'bg-amber-100 text-amber-800 border border-amber-200',
      blocked: 'bg-red-100 text-red-800 border border-red-200'
    };
    return `px-3 py-1 rounded-full text-xs font-bold capitalize ${styles[status] || 'bg-purple-50 text-purple-700'}`;
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
    <div className="min-h-screen lavender-bg pb-12">
      <Navbar userName="System Admin" role="admin" />

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8">
        
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-950 tracking-tight">Admin Executive Workspace</h1>
            <p className="text-xs text-purple-800/60 font-medium mt-1">Employee performance tracking & operations portal</p>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-5 py-3 rounded-2xl transition shadow-md shadow-purple-700/25 w-fit"
          >
            {showAddForm ? '✕ Cancel' : '+ Add New Employee'}
          </button>
        </div>

        {/* Stats Row (Matching Top Right 3 Cards in Screenshot) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-900/60 uppercase">Total Employees</p>
              <p className="text-3xl font-extrabold text-purple-950 mt-1">{employees.length}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-700 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-purple-700/20">
              👥
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-900/60 uppercase">Average Score</p>
              <p className="text-3xl font-extrabold text-purple-700 mt-1">{avgScore}%</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-indigo-600/20">
              📊
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-purple-900/60 uppercase">At Risk (≤60%)</p>
              <p className="text-3xl font-extrabold text-red-600 mt-1">{atRiskCount}</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-red-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-red-500/20">
              ⚠️
            </div>
          </div>
        </div>

        {/* Add Employee Form */}
        {showAddForm && (
          <div className="bg-white rounded-3xl border border-purple-100 p-6 mb-8 shadow-sm">
            <h2 className="text-lg font-extrabold text-purple-950 mb-4">Register New Employee</h2>
            {message && (
              <p className="text-xs font-bold text-purple-700 bg-purple-50 p-3 rounded-2xl mb-4">{message}</p>
            )}
            <form onSubmit={handleAddEmployee} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <input
                type="text" placeholder="Full Name" value={name}
                onChange={(e) => setName(e.target.value)}
                className="px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
              <input
                type="email" placeholder="Email Address" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
              <input
                type="password" placeholder="Account Password" value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
              <button
                type="submit"
                className="sm:col-span-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs py-3 rounded-2xl transition shadow-md shadow-purple-700/25"
              >
                Save & Create Employee Account
              </button>
            </form>
          </div>
        )}

        {/* Send Broadcast Notification Box */}
        <div className="bg-white rounded-3xl border border-purple-100 p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-extrabold text-purple-950 mb-2">Send Broadcast Announcement</h2>
          <p className="text-xs text-purple-800/60 mb-4">Send a high-priority notification message to selected employees or entire team.</p>

          {notifStatus && (
            <p className="text-xs font-bold text-purple-700 bg-purple-50 p-3 rounded-2xl mb-4">{notifStatus}</p>
          )}

          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="sendToAll"
              checked={sendToAll}
              onChange={(e) => setSendToAll(e.target.checked)}
              className="w-4 h-4 rounded text-purple-700 focus:ring-purple-600"
            />
            <label htmlFor="sendToAll" className="text-xs font-bold text-purple-950">Send to all employees ({employees.length})</label>
          </div>

          {!sendToAll && (
            <div className="flex flex-wrap gap-2 mb-4">
              {employees.map((emp) => {
                const empId = emp.id || emp._id;
                return (
                  <label
                    key={empId}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer border transition ${
                      selectedIds.includes(empId) ? 'bg-purple-700 text-white border-purple-700' : 'bg-purple-50 border-purple-200 text-purple-900'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(empId)}
                      onChange={() => toggleSelect(empId)}
                      className="w-3.5 h-3.5"
                    />
                    {emp.name}
                  </label>
                );
              })}
            </div>
          )}

          <form onSubmit={handleSendNotification} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Type notification message..."
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              className="flex-1 px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-6 py-3 rounded-2xl transition shadow-md shadow-purple-700/25"
            >
              Send Notification
            </button>
          </form>
        </div>

        {/* Employee Directory Section Header + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-xl font-extrabold text-purple-950">Employee Directory ({filteredEmployees.length})</h2>
          <input
            type="text"
            placeholder="🔍 Search employee by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-80 px-4 py-2.5 bg-white border border-purple-100 rounded-2xl text-xs text-purple-950 placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-600 shadow-sm"
          />
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-3xl border border-purple-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-purple-50/70 text-purple-900/60 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 border-b border-purple-100">Employee Name</th>
                  <th className="p-4 border-b border-purple-100">Email Address</th>
                  <th className="p-4 border-b border-purple-100">Score</th>
                  <th className="p-4 border-b border-purple-100">Status</th>
                  <th className="p-4 border-b border-purple-100 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-100/60 text-xs">
                {filteredEmployees.map((emp) => {
                  const empId = emp.id || emp._id;
                  return (
                    <tr key={empId} className="hover:bg-purple-50/40 transition">
                      <td className="p-4">
                        <button
                          onClick={() => viewEmployeeDetail(empId)}
                          className="font-bold text-purple-950 hover:text-purple-700 hover:underline flex items-center gap-2"
                        >
                          <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                            {emp.name.charAt(0)}
                          </span>
                          {emp.name}
                        </button>
                      </td>
                      <td className="p-4 font-medium text-purple-900/70">{emp.email}</td>
                      <td className="p-4">
                        <span className={`font-extrabold text-sm ${
                          emp.performance_score <= 30 ? 'text-red-600' :
                          emp.performance_score <= 60 ? 'text-amber-600' :
                          'text-purple-700'
                        }`}>
                          {emp.performance_score}%
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={statusBadge(emp.status)}>{emp.status}</span>
                      </td>
                      <td className="p-4 space-x-2 whitespace-nowrap text-right">
                        <button
                          onClick={() => openEditModal(emp)}
                          className="bg-purple-50 hover:bg-purple-100 text-purple-900 px-3 py-1.5 rounded-xl font-bold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openScoreEdit(emp)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-1.5 rounded-xl font-bold transition"
                        >
                          Update Score
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(empId)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 rounded-xl font-bold transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filteredEmployees.length === 0 && (
            <p className="p-10 text-center text-purple-900/50 text-xs font-semibold">No employees matched your search.</p>
          )}
        </div>
      </main>

      {/* Edit Name/Email Modal */}
      {editingEmployee && (
        <div className="fixed inset-0 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md border border-purple-100">
            <h3 className="text-lg font-extrabold text-purple-950 mb-4">Edit Employee Information</h3>
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/70 mb-2">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/70 mb-2">Email Address</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-xs text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingEmployee(null)}
                  className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-900 py-3 rounded-2xl font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-2xl font-bold text-xs transition shadow-md shadow-purple-700/25"
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
        <div className="fixed inset-0 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto border border-purple-100">
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-purple-100">
              <div>
                <h3 className="text-xl font-extrabold text-purple-950">{viewingEmployee.user.name}</h3>
                <p className="text-xs text-purple-800/60 font-medium">{viewingEmployee.user.email}</p>
              </div>
              <button onClick={() => setViewingEmployee(null)} className="w-8 h-8 rounded-full bg-purple-50 text-purple-700 font-bold hover:bg-purple-100 flex items-center justify-center text-sm">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-purple-50/60 rounded-2xl p-3.5 border border-purple-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-900/60">Performance Score</p>
                <p className="text-2xl font-extrabold text-purple-700">{viewingEmployee.user.performance_score}%</p>
              </div>
              <div className="bg-purple-50/60 rounded-2xl p-3.5 border border-purple-100">
                <p className="text-[10px] font-bold uppercase tracking-wider text-purple-900/60">Status</p>
                <p className="text-2xl font-extrabold text-purple-950 capitalize">{viewingEmployee.user.status}</p>
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-950 mb-3">Recent Work Submissions ({viewingEmployee.workHistory.length})</h4>
            <div className="space-y-2 mb-6">
              {viewingEmployee.workHistory.length === 0 && <p className="text-purple-800/50 text-xs py-2">No work submissions found.</p>}
              {viewingEmployee.workHistory.map((w) => (
                <div key={w.id || w._id} className="text-xs p-3 bg-purple-50/40 rounded-2xl border border-purple-100 flex justify-between items-center">
                  <span className="font-bold text-purple-950">{new Date(w.date).toLocaleDateString()}</span>
                  {w.github_link && <a href={w.github_link} target="_blank" rel="noreferrer" className="text-purple-700 font-bold hover:underline text-xs">View Repo ↗</a>}
                </div>
              ))}
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-950 mb-3">Recent Attendance ({viewingEmployee.attendanceHistory.length})</h4>
            <div className="space-y-2">
              {viewingEmployee.attendanceHistory.length === 0 && <p className="text-purple-800/50 text-xs py-2">No attendance logs found.</p>}
              {viewingEmployee.attendanceHistory.map((a) => (
                <div key={a.id || a._id} className="text-xs p-3 bg-purple-50/40 rounded-2xl border border-purple-100 flex justify-between items-center">
                  <span className="font-bold text-purple-950">{new Date(a.date).toLocaleDateString()}</span>
                  <span className="text-purple-600 font-semibold text-[11px]">✓ Check-in Marked</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm text-center border border-purple-100">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto mb-3">
              🗑️
            </div>
            <h3 className="text-lg font-extrabold text-purple-950 mb-1">Delete Employee Account?</h3>
            <p className="text-xs text-purple-800/60 mb-6 font-medium">This operation will permanently remove this employee and all associated records.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-900 py-3 rounded-2xl font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl font-bold text-xs transition shadow-md shadow-red-600/25"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Score Edit Modal */}
      {scoreEditEmployee && (
        <div className="fixed inset-0 bg-purple-950/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-purple-100">
            <h3 className="text-lg font-extrabold text-purple-950 mb-1">
              Update Score
            </h3>
            <p className="text-xs text-purple-800/60 font-medium mb-4">{scoreEditEmployee.name}</p>
            
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-900/70 mb-2">New Score (0 - 100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={newScoreValue}
              onChange={(e) => setNewScoreValue(e.target.value)}
              className="w-full px-4 py-3 bg-purple-50/50 border border-purple-100 rounded-2xl text-sm font-extrabold text-purple-950 focus:outline-none focus:ring-2 focus:ring-purple-600 mb-6"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setScoreEditEmployee(null)}
                className="flex-1 bg-purple-50 hover:bg-purple-100 text-purple-900 py-3 rounded-2xl font-bold text-xs transition"
              >
                Cancel
              </button>
              <button
                onClick={saveScoreChange}
                className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-2xl font-bold text-xs transition shadow-md shadow-purple-700/25"
              >
                Update Score
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;