import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('employee');

  return (
    <div className="min-h-screen lavender-bg text-purple-950 selection:bg-purple-200 selection:text-purple-900 font-sans">
      
      {/* Top Floating Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-purple-100/80 px-6 py-4">
        <div className="max-w-[1300px] mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-500 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-md shadow-purple-500/25">
              ⚡
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-purple-950">
              EmpTrack <span className="text-purple-600 font-semibold text-lg">Labs</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-purple-900/70">
            <a href="#features" className="hover:text-purple-900 transition">Features</a>
            <a href="#how-it-works" className="hover:text-purple-900 transition">How It Works</a>
            <a href="#analytics" className="hover:text-purple-900 transition">Analytics</a>
            <a href="#tech" className="hover:text-purple-900 transition">Tech Stack</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-xs px-4 py-2.5 rounded-full border border-purple-200/80 transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md shadow-purple-700/25 transition active:scale-95"
            >
              Launch Portal 🚀
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 max-w-[1300px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100/80 border border-purple-200/80 px-4 py-1.5 rounded-full text-xs font-extrabold text-purple-800 mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
            <span>EmpTrack Pro 2.0 • Craftive Workspace System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-purple-950 leading-[1.15] mb-6">
            Next-Gen <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-500 bg-clip-text text-transparent">Employee Tracking</span> & Performance Portal
          </h1>

          <p className="text-base sm:text-lg text-purple-900/70 font-medium leading-relaxed mb-8 max-w-2xl mx-auto">
            Streamline daily attendance check-ins, automated score calculations, work screenshot & GitHub proof verification, and executive admin analytics in one beautiful workspace.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm px-8 py-4 rounded-2xl shadow-xl shadow-purple-700/30 transition hover:-translate-y-0.5 active:scale-95"
            >
              Get Started Now — Login Portal
            </button>
            <a
              href="#features"
              className="w-full sm:w-auto bg-white hover:bg-purple-50/60 text-purple-950 font-bold text-sm px-7 py-4 rounded-2xl border border-purple-200/80 transition text-center shadow-sm"
            >
              Explore Live Demo ↓
            </a>
          </div>
        </div>

        {/* Hero Interactive UI Card Mockup (Craftive Design System Preview) */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-3xl border border-purple-200/80 p-6 sm:p-8 shadow-2xl shadow-purple-950/10 max-w-5xl mx-auto relative overflow-hidden group">
          <div className="flex items-center justify-between border-b border-purple-100 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
              <span className="text-xs font-bold text-purple-900/50 ml-2">emptrack-labs.internal.app</span>
            </div>

            {/* Toggle Preview View */}
            <div className="flex bg-purple-50 p-1 rounded-full border border-purple-100 text-xs font-bold">
              <button
                onClick={() => setActiveTab('employee')}
                className={`px-4 py-1.5 rounded-full transition ${activeTab === 'employee' ? 'bg-purple-700 text-white shadow-sm' : 'text-purple-800/70'}`}
              >
                Employee View
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-1.5 rounded-full transition ${activeTab === 'admin' ? 'bg-purple-700 text-white shadow-sm' : 'text-purple-800/70'}`}
              >
                Admin Executive View
              </button>
            </div>
          </div>

          {activeTab === 'employee' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Profile Card Mock */}
              <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full">⭐ Top Tier Employee</span>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-400 flex items-center justify-center font-extrabold text-xl text-purple-950">
                      J
                    </div>
                    <div>
                      <p className="font-bold text-sm">John Doe</p>
                      <p className="text-[11px] text-purple-300">employee@emptrack.com</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                  <span className="text-purple-200">Performance Score</span>
                  <span className="font-extrabold text-emerald-400">100%</span>
                </div>
              </div>

              {/* Weekly Bar Chart Mock */}
              <div className="bg-purple-50/50 p-5 rounded-2xl border border-purple-100 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-purple-900/60">Weekly Work Progress</p>
                  <p className="text-xl font-extrabold text-purple-950">5.1 h <span className="text-xs text-purple-500 font-medium">/ week</span></p>
                </div>
                <div className="flex items-end justify-between gap-1.5 h-16 mt-3">
                  <div className="w-full bg-purple-200 rounded-md h-8"></div>
                  <div className="w-full bg-purple-200 rounded-md h-12"></div>
                  <div className="w-full bg-purple-200 rounded-md h-6"></div>
                  <div className="w-full bg-purple-700 rounded-md h-16"></div>
                  <div className="w-full bg-purple-200 rounded-md h-10"></div>
                </div>
              </div>

              {/* Today's Check-in Donut Ring Mock */}
              <div className="bg-purple-900 text-white p-5 rounded-2xl flex flex-col justify-between">
                <div className="flex justify-between items-center">
                  <p className="text-xs font-bold">Daily Check-in</p>
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">✓ Marked</span>
                </div>
                <div className="my-3 text-center">
                  <p className="text-3xl font-extrabold text-emerald-400">100%</p>
                  <p className="text-[11px] text-purple-200 mt-0.5">Attendance Recorded</p>
                </div>
                <div className="bg-white/10 p-2 rounded-xl text-center text-xs font-semibold">
                  Proof Submitted: Screenshot + GitHub Link
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
                  <p className="text-[10px] font-bold text-purple-900/60 uppercase">Total Employees</p>
                  <p className="text-2xl font-extrabold text-purple-950">68</p>
                </div>
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
                  <p className="text-[10px] font-bold text-purple-900/60 uppercase">Average Score</p>
                  <p className="text-2xl font-extrabold text-purple-700">94%</p>
                </div>
                <div className="p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
                  <p className="text-[10px] font-bold text-purple-900/60 uppercase">At Risk Employees</p>
                  <p className="text-2xl font-extrabold text-red-600">2</p>
                </div>
              </div>
              <div className="p-4 bg-purple-950 text-white rounded-2xl flex items-center justify-between text-xs">
                <span>📣 Broadcast Announcement System: <strong>"Q3 Performance Review Completed"</strong></span>
                <span className="bg-purple-700 text-white px-3 py-1 rounded-full font-bold">Sent to 68 Employees</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-white/60 border-y border-purple-100 py-10 px-4">
        <div className="max-w-[1300px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-purple-950">99.9%</p>
            <p className="text-xs font-bold text-purple-900/60 uppercase mt-1">Check-in Accuracy</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-purple-700">10k+</p>
            <p className="text-xs font-bold text-purple-900/60 uppercase mt-1">Daily Work Proofs</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-purple-950">100%</p>
            <p className="text-xs font-bold text-purple-900/60 uppercase mt-1">Automated Scoring</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-600">0ms</p>
            <p className="text-xs font-bold text-purple-900/60 uppercase mt-1">Zero-Config Fallback</p>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-[1300px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-950 tracking-tight mb-4">
            Engineered for High-Performing Teams
          </h2>
          <p className="text-sm text-purple-900/70 font-medium">
            Everything you need to automate workforce tracking, score deductions, and work report verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-7 rounded-3xl border border-purple-100/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-700 text-xl font-bold mb-5">
              📅
            </div>
            <h3 className="text-lg font-extrabold text-purple-950 mb-2">Real-Time Attendance</h3>
            <p className="text-xs text-purple-800/70 font-medium leading-relaxed">
              Employees mark daily check-in with duplicate prevention and instant timestamp logging.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-purple-100/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-700 text-xl font-bold mb-5">
              🖼️
            </div>
            <h3 className="text-lg font-extrabold text-purple-950 mb-2">Proof of Work Upload</h3>
            <p className="text-xs text-purple-800/70 font-medium leading-relaxed">
              Upload work screenshots via Cloudinary and link GitHub repositories for instant manager verification.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-purple-100/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-700 text-xl font-bold mb-5">
              ⚡
            </div>
            <h3 className="text-lg font-extrabold text-purple-950 mb-2">Automated Score Logic</h3>
            <p className="text-xs text-purple-800/70 font-medium leading-relaxed">
              Daily cron jobs automatically check work submissions and deduct points for missed reports.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-purple-100/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-700 text-xl font-bold mb-5">
              📣
            </div>
            <h3 className="text-lg font-extrabold text-purple-950 mb-2">Broadcast Notifications</h3>
            <p className="text-xs text-purple-800/70 font-medium leading-relaxed">
              Admins can send high-priority announcements to individual employees or the entire organization.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-purple-100/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-700 text-xl font-bold mb-5">
              👑
            </div>
            <h3 className="text-lg font-extrabold text-purple-950 mb-2">Executive Admin Dashboard</h3>
            <p className="text-xs text-purple-800/70 font-medium leading-relaxed">
              Full employee directory management, manual score overrides with audit trail, and account status controls.
            </p>
          </div>

          <div className="bg-white p-7 rounded-3xl border border-purple-100/90 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-700 text-xl font-bold mb-5">
              🍃
            </div>
            <h3 className="text-lg font-extrabold text-purple-950 mb-2">MongoDB & In-Memory Fallback</h3>
            <p className="text-xs text-purple-800/70 font-medium leading-relaxed">
              Mongoose database persistence with MongoMemoryServer fallback for effortless zero-config local testing.
            </p>
          </div>

        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 px-4 max-w-[1300px] mx-auto">
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Ready to Upgrade Your Team Workspace?
            </h2>
            <p className="text-xs sm:text-sm text-purple-200 mb-8 font-medium">
              Experience seamless employee performance tracking with instant demo accounts.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-white hover:bg-purple-50 text-purple-950 font-extrabold text-sm px-8 py-4 rounded-2xl shadow-lg transition active:scale-95"
            >
              Sign In to EmpTrack Portal ⚡
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white/70 backdrop-blur-md py-8 px-6 text-center text-xs font-semibold text-purple-900/60">
        <div className="max-w-[1300px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-700 text-white rounded-lg flex items-center justify-center font-bold text-xs">⚡</div>
            <span className="font-extrabold text-purple-950 text-sm">EmpTrack Labs</span>
          </div>
          <p>© 2026 EmpTrack Pro System • Craftive Lavender System. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
