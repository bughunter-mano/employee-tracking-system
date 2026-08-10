import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import heroBg from '../assets/hero_bg.jpg';
import logoImg from '../assets/logo.jpg';

function LandingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('employee');
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = heroRef.current?.offsetWidth || window.innerWidth);
    let height = (canvas.height = heroRef.current?.offsetHeight || 600);

    const handleResize = () => {
      if (heroRef.current) {
        width = canvas.width = heroRef.current.offsetWidth;
        height = canvas.height = heroRef.current.offsetHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2, isInside: false };

    const handleMouseMove = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isInside = true;
    };

    const handleMouseLeave = () => {
      mouse.isInside = false;
    };

    const heroElem = heroRef.current;
    if (heroElem) {
      heroElem.addEventListener('mousemove', handleMouseMove);
      heroElem.addEventListener('mouseleave', handleMouseLeave);
    }

    const particleCount = 45;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1.5,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    const render = () => {
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      ctx.clearRect(0, 0, width, height);

      // Draw Cursor Glow Spotlight
      if (mouse.isInside) {
        const glowGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        glowGradient.addColorStop(0, 'rgba(126, 34, 206, 0.25)');
        glowGradient.addColorStop(0.4, 'rgba(99, 102, 241, 0.12)');
        glowGradient.addColorStop(1, 'rgba(243, 238, 255, 0)');
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update & Draw Interactive Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120 && mouse.isInside) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(126, 34, 206, ${0.35 * (1 - dist / 120)})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          p.x -= (dx / dist) * 0.5;
          p.y -= (dy / dist) * 0.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(109, 40, 217, ${p.alpha})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (heroElem) {
        heroElem.removeEventListener('mousemove', handleMouseMove);
        heroElem.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="min-h-screen lavender-bg text-purple-950 selection:bg-purple-200 selection:text-purple-900 font-sans">
      
      {/* Top Floating Navbar */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-purple-100/90 px-6 py-3.5 shadow-sm">
        <div className="max-w-[1300px] mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src={logoImg} alt="AuraPulse OS" className="w-10 h-10 rounded-2xl shadow-md object-cover border border-purple-200" />
            <span className="font-extrabold text-2xl tracking-tight text-purple-950">
              AuraPulse <span className="text-purple-600 font-semibold text-lg">OS</span>
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

      {/* Hero Section with Interactive Cursor Movement Canvas & Background Image */}
      <section 
        ref={heroRef}
        className="relative min-h-[calc(100vh-73px)] flex items-center py-12 px-4 sm:px-6 bg-cover bg-center bg-no-repeat overflow-hidden cursor-default"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Interactive Mouse Particle Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10"></canvas>

        {/* Soft Lavender Backdrop Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/80 via-purple-50/70 to-purple-100/90 backdrop-blur-[2px]"></div>

        <div className="relative z-10 max-w-[1300px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-purple-950 leading-[1.15] mb-5 drop-shadow-sm">
              Next-Gen <span className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Employee Tracking</span> & Performance Portal
            </h1>

            <p className="text-sm sm:text-base text-purple-900/80 font-semibold leading-relaxed mb-8 max-w-xl">
              Streamline daily attendance check-ins, automated score calculations, work screenshot & GitHub proof verification, and executive admin analytics in one beautiful workspace.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-6">
              <button
                onClick={() => navigate('/login')}
                className="bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs sm:text-sm px-7 py-4 rounded-2xl shadow-lg shadow-purple-700/30 transition hover:-translate-y-0.5 active:scale-95 text-center"
              >
                Get Started Now — Login Portal
              </button>
              <a
                href="#features"
                className="bg-white/90 hover:bg-white text-purple-950 font-bold text-xs sm:text-sm px-6 py-4 rounded-2xl border border-purple-200 transition text-center shadow-md backdrop-blur-md"
              >
                Explore Features ↓
              </a>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold text-purple-900/60 pt-2 border-t border-purple-200/60">
              <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Free Demo Accounts</span>
              <span className="flex items-center gap-1.5"><span className="text-emerald-500">✓</span> Instant Auto-Seeding</span>
            </div>
          </div>

          {/* Right Column: Interactive UI Card Mockup */}
          <div className="lg:col-span-7 w-full">
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-purple-200/90 p-5 sm:p-7 shadow-2xl shadow-purple-950/15 relative overflow-hidden group">
              <div className="flex items-center justify-between border-b border-purple-100 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-xs font-bold text-purple-900/50 ml-1.5">emptrack-labs.internal.app</span>
                </div>

                {/* Toggle Preview View */}
                <div className="flex bg-purple-50 p-1 rounded-full border border-purple-100 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('employee')}
                    className={`px-3 py-1 rounded-full transition ${activeTab === 'employee' ? 'bg-purple-700 text-white shadow-sm' : 'text-purple-800/70'}`}
                  >
                    Employee View
                  </button>
                  <button
                    onClick={() => setActiveTab('admin')}
                    className={`px-3 py-1 rounded-full transition ${activeTab === 'admin' ? 'bg-purple-700 text-white shadow-sm' : 'text-purple-800/70'}`}
                  >
                    Admin Executive
                  </button>
                </div>
              </div>

              {activeTab === 'employee' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Profile Card Mock */}
                  <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold bg-white/20 px-2 py-0.5 rounded-full">⭐ Top Employee</span>
                      <div className="mt-3 flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-purple-400 flex items-center justify-center font-extrabold text-lg text-purple-950">
                          J
                        </div>
                        <div>
                          <p className="font-bold text-xs">John Doe</p>
                          <p className="text-[10px] text-purple-300">employee@emptrack.com</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 pt-2 border-t border-white/10 flex justify-between items-center text-[11px]">
                      <span className="text-purple-200">Score</span>
                      <span className="font-extrabold text-emerald-400">100%</span>
                    </div>
                  </div>

                  {/* Weekly Bar Chart Mock */}
                  <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 flex flex-col justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase text-purple-900/60">Weekly Work</p>
                      <p className="text-lg font-extrabold text-purple-950">5.1 h <span className="text-[10px] text-purple-500 font-medium">/ week</span></p>
                    </div>
                    <div className="flex items-end justify-between gap-1 h-14 mt-2">
                      <div className="w-full bg-purple-200 rounded-md h-6"></div>
                      <div className="w-full bg-purple-200 rounded-md h-10"></div>
                      <div className="w-full bg-purple-200 rounded-md h-5"></div>
                      <div className="w-full bg-purple-700 rounded-md h-14"></div>
                      <div className="w-full bg-purple-200 rounded-md h-8"></div>
                    </div>
                  </div>

                  {/* Today's Check-in Donut Ring Mock */}
                  <div className="bg-purple-900 text-white p-4 rounded-2xl flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-bold">Check-in</p>
                      <span className="text-[9px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded-full font-bold">✓ Marked</span>
                    </div>
                    <div className="my-2 text-center">
                      <p className="text-2xl font-extrabold text-emerald-400">100%</p>
                      <p className="text-[10px] text-purple-200">Attendance Logged</p>
                    </div>
                    <div className="bg-white/10 p-1.5 rounded-xl text-center text-[10px] font-semibold">
                      Proof: GitHub Link
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100">
                      <p className="text-[9px] font-bold text-purple-900/60 uppercase">Total Employees</p>
                      <p className="text-xl font-extrabold text-purple-950">68</p>
                    </div>
                    <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100">
                      <p className="text-[9px] font-bold text-purple-900/60 uppercase">Average Score</p>
                      <p className="text-xl font-extrabold text-purple-700">94%</p>
                    </div>
                    <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100">
                      <p className="text-[9px] font-bold text-purple-900/60 uppercase">At Risk</p>
                      <p className="text-xl font-extrabold text-red-600">2</p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-purple-950 text-white rounded-2xl flex items-center justify-between text-[11px]">
                    <span>📣 Broadcast: <strong>"Q3 Performance Review"</strong></span>
                    <span className="bg-purple-700 text-white px-2.5 py-0.5 rounded-full font-bold text-[10px]">Sent to 68 Employees</span>
                  </div>
                </div>
              )}
            </div>
          </div>

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

      {/* ================= HOW IT WORKS SECTION (#how-it-works) ================= */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-white/70 border-y border-purple-100/80 backdrop-blur-md">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest bg-purple-100 text-purple-800 px-3.5 py-1 rounded-full border border-purple-200">
              Workflow Guide
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-950 tracking-tight mt-3 mb-4">
              How AuraPulse OS Works
            </h2>
            <p className="text-sm text-purple-900/70 font-medium">
              Four simple steps to automate workforce performance and daily check-in workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm relative group hover:border-purple-300 transition">
              <span className="w-10 h-10 rounded-2xl bg-purple-700 text-white font-extrabold text-sm flex items-center justify-center mb-5 shadow-md shadow-purple-700/20">
                01
              </span>
              <h3 className="text-base font-extrabold text-purple-950 mb-2">Role Sign-In</h3>
              <p className="text-xs text-purple-800/70 font-medium leading-relaxed mb-4">
                Sign in using role-based authentication or click demo buttons for instant access.
              </p>
              <button
                onClick={() => navigate('/login')}
                className="text-xs font-bold text-purple-700 hover:underline flex items-center gap-1"
              >
                Try Portal Login ➔
              </button>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm relative group hover:border-purple-300 transition">
              <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center mb-5 shadow-md shadow-indigo-600/20">
                02
              </span>
              <h3 className="text-base font-extrabold text-purple-950 mb-2">Daily Check-In</h3>
              <p className="text-xs text-purple-800/70 font-medium leading-relaxed mb-4">
                One-click check-in logs exact date and timestamp to verify team attendance.
              </p>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl">✓ Timestamped</span>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm relative group hover:border-purple-300 transition">
              <span className="w-10 h-10 rounded-2xl bg-purple-900 text-white font-extrabold text-sm flex items-center justify-center mb-5 shadow-md shadow-purple-900/20">
                03
              </span>
              <h3 className="text-base font-extrabold text-purple-950 mb-2">Submit Proof</h3>
              <p className="text-xs text-purple-800/70 font-medium leading-relaxed mb-4">
                Upload work screenshots and attach GitHub repository links for manager verification.
              </p>
              <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl">🖼️ Proof Attached</span>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-sm relative group hover:border-purple-300 transition">
              <span className="w-10 h-10 rounded-2xl bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mb-5 shadow-md shadow-emerald-600/20">
                04
              </span>
              <h3 className="text-base font-extrabold text-purple-950 mb-2">Score Analytics</h3>
              <p className="text-xs text-purple-800/70 font-medium leading-relaxed mb-4">
                Automated scoring engine updates performance ratings and team leaderboard rankings.
              </p>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl">⚡ Score Calculated</span>
            </div>

          </div>
        </div>
      </section>

      {/* ================= ANALYTICS SHOWCASE SECTION (#analytics) ================= */}
      <section id="analytics" className="py-20 px-4 sm:px-6 max-w-[1300px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest bg-purple-100 text-purple-800 px-3.5 py-1 rounded-full border border-purple-200">
            Real-Time Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-950 tracking-tight mt-3 mb-4">
            Real-Time Workforce Analytics
          </h2>
          <p className="text-sm text-purple-900/70 font-medium">
            Gain complete visibility into attendance compliance, score trends, and submission verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card A */}
          <div className="bg-white p-7 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-extrabold uppercase text-purple-900/60">Performance Distribution</span>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="my-4 text-center">
                <p className="text-4xl font-extrabold text-purple-700">94%</p>
                <p className="text-xs text-purple-900/60 font-semibold mt-1">Average Team Performance</p>
              </div>
              <div className="space-y-2 text-xs font-semibold pt-2">
                <div className="flex justify-between text-purple-950">
                  <span>Top Performers (&gt;90%)</span>
                  <span className="font-extrabold text-purple-700">82%</span>
                </div>
                <div className="flex justify-between text-purple-950">
                  <span>Standard Performers (60-90%)</span>
                  <span className="font-extrabold text-indigo-600">15%</span>
                </div>
                <div className="flex justify-between text-purple-950">
                  <span>At-Risk (&lt;60%)</span>
                  <span className="font-extrabold text-red-500">3%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card B */}
          <div className="bg-white p-7 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-extrabold uppercase text-purple-900/60">Work Verification Log</span>
                <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Cloudinary + GitHub</span>
              </div>
              <div className="my-4 text-center">
                <p className="text-4xl font-extrabold text-indigo-600">100%</p>
                <p className="text-xs text-purple-900/60 font-semibold mt-1">Screenshot & Link Verification</p>
              </div>
              <p className="text-xs text-purple-800/70 font-medium leading-relaxed pt-2">
                Every work submission is linked to Cloudinary media storage and verified GitHub repositories for audit compliance.
              </p>
            </div>
          </div>

          {/* Card C */}
          <div className="bg-white p-7 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-extrabold uppercase text-purple-900/60">Automated Cron Engine</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Daily Audit</span>
              </div>
              <div className="my-4 text-center">
                <p className="text-4xl font-extrabold text-purple-950">24/7</p>
                <p className="text-xs text-purple-900/60 font-semibold mt-1">Automated Score Logic</p>
              </div>
              <p className="text-xs text-purple-800/70 font-medium leading-relaxed pt-2">
                System automatically checks daily submission records and applies transparent score adjustments when reports are missed.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ================= TECH STACK SECTION (#tech) ================= */}
      <section id="tech" className="py-20 px-4 sm:px-6 bg-white/70 border-y border-purple-100/80 backdrop-blur-md">
        <div className="max-w-[1300px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest bg-purple-100 text-purple-800 px-3.5 py-1 rounded-full border border-purple-200">
              Technology Stack
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-purple-950 tracking-tight mt-3 mb-4">
              Built With Modern Full-Stack Technologies
            </h2>
            <p className="text-sm text-purple-900/70 font-medium">
              Enterprise-grade MERN architecture with high availability and zero-config in-memory fallback.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            <div className="bg-white p-5 rounded-3xl border border-purple-100 text-center shadow-sm hover:border-purple-300 transition">
              <div className="w-10 h-10 rounded-2xl bg-cyan-100 text-cyan-700 font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
                ⚛️
              </div>
              <p className="font-extrabold text-xs text-purple-950">React 19</p>
              <p className="text-[10px] text-purple-900/50 font-semibold mt-0.5">Frontend Client</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 text-center shadow-sm hover:border-purple-300 transition">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
                ⚡
              </div>
              <p className="font-extrabold text-xs text-purple-950">Vite</p>
              <p className="text-[10px] text-purple-900/50 font-semibold mt-0.5">Lightning Build Engine</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 text-center shadow-sm hover:border-purple-300 transition">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
                🎨
              </div>
              <p className="font-extrabold text-xs text-purple-950">Tailwind CSS</p>
              <p className="text-[10px] text-purple-900/50 font-semibold mt-0.5">Glassmorphic Styling</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 text-center shadow-sm hover:border-purple-300 transition">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
                🟢
              </div>
              <p className="font-extrabold text-xs text-purple-950">Node & Express</p>
              <p className="text-[10px] text-purple-900/50 font-semibold mt-0.5">REST API Server</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 text-center shadow-sm hover:border-purple-300 transition">
              <div className="w-10 h-10 rounded-2xl bg-green-100 text-green-700 font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
                🍃
              </div>
              <p className="font-extrabold text-xs text-purple-950">MongoDB Mongoose</p>
              <p className="text-[10px] text-purple-900/50 font-semibold mt-0.5">Database Schemas</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-purple-100 text-center shadow-sm hover:border-purple-300 transition">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
                ⚡
              </div>
              <p className="font-extrabold text-xs text-purple-950">InMemory Fallback</p>
              <p className="text-[10px] text-purple-900/50 font-semibold mt-0.5">Zero-Config DB</p>
            </div>

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
              Launch AuraPulse OS Portal 🚀
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-100 bg-white/70 backdrop-blur-md py-8 px-6 text-center text-xs font-semibold text-purple-900/60">
        <div className="max-w-[1300px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="AuraPulse OS" className="w-7 h-7 rounded-xl object-cover border border-purple-200" />
            <span className="font-extrabold text-purple-950 text-sm">AuraPulse OS</span>
          </div>
          <p>© 2026 AuraPulse OS • Intelligent Workforce & Performance OS. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}

export default LandingPage;
