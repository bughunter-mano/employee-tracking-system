import { useNavigate } from 'react-router-dom';

function Navbar({ userName, role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold">
            E
          </div>
          <span className="font-semibold text-lg">EmpTrack</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-300 hidden sm:block">
            {userName} · <span className="capitalize text-indigo-300">{role}</span>
          </span>
          <button
            onClick={handleLogout}
            className="bg-slate-800 hover:bg-red-600 transition-colors text-sm px-4 py-2 rounded-lg font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;