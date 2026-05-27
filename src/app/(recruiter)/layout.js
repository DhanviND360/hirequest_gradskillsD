"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "../(candidate)/dashboard.css"; // Reuse identical premium layout styles
import { 
  GuildNavIcon, 
  ScoutNavIcon, 
  QuestLogNavIcon, 
  SkillsNavIcon, 
  MessageNavIcon, 
  ProfileNavIcon
} from "@/components/game-ui/Icons";

const recruiterNavItems = [
  { href: "/guild-hall", icon: <GuildNavIcon />, label: "Guild Hall" },
  { href: "/scout", icon: <ScoutNavIcon />, label: "Scout" },
  { href: "/post-quest", icon: <QuestLogNavIcon />, label: "Post Quest" },
  { href: "/pipeline", icon: <SkillsNavIcon />, label: "Pipeline" },
  { href: "/messages", icon: <MessageNavIcon />, label: "Messages" },
  { href: "/profile", icon: <ProfileNavIcon />, label: "Profile" },
];

export default function RecruiterLayout({ children }) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Recruiter profile gate verification states
  const [profileSetupCompleted, setProfileSetupCompleted] = useState(true); // Default true until check
  const [companyName, setCompanyName] = useState("");
  const [companyDomain, setCompanyDomain] = useState("");
  const [website, setWebsite] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyLoadingText, setVerifyLoadingText] = useState("");
  const [setupError, setSetupError] = useState("");

  useEffect(() => {
    const handleOutsideClick = () => setDropdownOpen(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Verification ledger check on load
  useEffect(() => {
    const completed = localStorage.getItem("recruiter_setup_completed") === "true";
    setProfileSetupCompleted(completed);
  }, []);

  // Find active label for center header
  const activeLabel = recruiterNavItems.find((n) => pathname.startsWith(n.href))?.label || "GUILD HALL";
  const activeSubtitle = pathname.startsWith("/guild-hall") 
    ? "Manage active company quests and review achievements." 
    : pathname.startsWith("/scout") 
    ? "Scout top talent and view candidate battle scores."
    : pathname.startsWith("/post-quest")
    ? "Draft and publish new candidate challenges."
    : pathname.startsWith("/pipeline")
    ? "Coordinate interview arenas and progress hires."
    : pathname.startsWith("/messages")
    ? "Party chat with active candidates."
    : "Inspect character sheets and stats.";

  const handleVerifyKingdom = (e) => {
    e.preventDefault();
    if (!companyName || !companyDomain || !website) {
      setSetupError("Please fill out all credentials to authenticate your Guild.");
      return;
    }
    
    // Domain validator regex
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(companyDomain)) {
      setSetupError("Invalid company domain format (e.g. apple.com).");
      return;
    }

    setSetupError("");
    setVerifyLoading(true);
    
    // RPG-themed authentication logs
    const steps = [
      "🔍 Aligning coordinate matrices...",
      "⚔️ Authenticating domain credentials...",
      "🛡️ Forging Guild ledger indexes...",
      "🔮 Guild Active! Access Granted!"
    ];

    let stepIdx = 0;
    setVerifyLoadingText(steps[0]);

    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setVerifyLoadingText(steps[stepIdx]);
      } else {
        clearInterval(interval);
        localStorage.setItem("recruiter_setup_completed", "true");
        localStorage.setItem("recruiter_company_name", companyName);
        localStorage.setItem("recruiter_company_domain", companyDomain);
        localStorage.setItem("recruiter_company_website", website);
        setProfileSetupCompleted(true);
        setVerifyLoading(false);
      }
    }, 800);
  };

  // Intercept recruiter dashboard view if profile domain and website are not set!
  if (!profileSetupCompleted) {
    return (
      <div className="auth-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <div className="auth-card" style={{ maxWidth: "540px", padding: "var(--space-2xl)", border: "1px solid var(--border-medium)", boxShadow: "0 25px 80px rgba(0, 0, 0, 0.5)", display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3.5rem", filter: "drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))", marginBottom: "12px" }}>🏰</div>
            <h2 className="auth-title" style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--accent-gold)", margin: 0 }}>
              Activate Guild Portal
            </h2>
            <p className="auth-subtitle" style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.45", margin: 0, marginTop: "6px" }}>
              Unlock recruiter tools by registering your company domain and verifying your credentials in the guild ledger.
            </p>
          </div>

          {setupError && <div className="auth-error" style={{ marginBottom: "8px", padding: "10px" }}>{setupError}</div>}

          {verifyLoading ? (
            <div style={{ textAlign: "center", padding: "var(--space-xl) 0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="loading-spinner-rpg" />
              <h3 style={{ fontSize: "1.1rem", fontWeight: "700", color: "var(--purple-300)", marginBottom: "8px", margin: 0 }}>
                {verifyLoadingText}
              </h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0, marginTop: "4px" }}>
                Authenticating domain certificates. Please hold.
              </p>
            </div>
          ) : (
            <form onSubmit={handleVerifyKingdom} className="auth-form" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: "var(--text-muted)", fontSize: "0.72rem", textTransform: "uppercase" }}>Guild Master Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value="Jean Grey" 
                  disabled 
                  style={{ background: "rgba(255,255,255,0.02)", color: "var(--text-muted)", cursor: "not-allowed" }}
                />
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ color: "var(--text-secondary)", fontSize: "0.72rem", textTransform: "uppercase" }}>Company Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Stark Industries" 
                  value={companyName} 
                  onChange={(e) => setCompanyName(e.target.value)} 
                  required 
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ color: "var(--text-secondary)", fontSize: "0.72rem", textTransform: "uppercase" }}>Corporate Domain</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. stark.com" 
                    value={companyDomain} 
                    onChange={(e) => setCompanyDomain(e.target.value)} 
                    required 
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ color: "var(--text-secondary)", fontSize: "0.72rem", textTransform: "uppercase" }}>Website URL</label>
                  <input 
                    type="url" 
                    className="form-input" 
                    placeholder="https://stark.com" 
                    value={website} 
                    onChange={(e) => setWebsite(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: "100%", marginTop: "6px" }}
              >
                📜 Authenticate & Verify Guild
              </button>

              <div style={{ textAlign: "center", marginTop: "4px" }}>
                <button 
                  type="button"
                  onClick={() => {
                    document.cookie = "user-role=candidate; path=/";
                    window.location.href = "/world-map";
                  }}
                  style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "0.8rem", textDecoration: "underline" }}
                >
                  🚪 Return to Seeker Map (Candidate)
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Top Unified Header - Matching Reference Image */}
      <header className="topbar">
        {/* Left Side: Logo + Tagline */}
        <div className="topbar-left">
          <Link href="/" className="topbar-logo-group">
            <div className="topbar-logo">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z" fill="#7c3aed" stroke="#a78bfa" strokeWidth="0.5" />
              </svg>
              Hire<span>Quest</span>
            </div>
            <div className="topbar-tagline">Your Career. Your Quest.</div>
          </Link>
        </div>

        {/* Center: Dynamic Active Tab Header */}
        <div className="topbar-center">
          <h1 className="topbar-page-title">{activeLabel.toUpperCase()}</h1>
          <p className="topbar-page-subtitle">{activeSubtitle}</p>
        </div>

        {/* Right Side: Level, XP, Profile Dropdown */}
        <div className="topbar-right" style={{ position: "relative" }}>
          <style>{`
            .topbar-dropdown-item {
              display: block;
              padding: 10px 14px;
              font-size: 0.85rem;
              color: var(--text-secondary) !important;
              border-radius: var(--radius-sm);
              text-decoration: none;
              transition: all 0.15s ease;
              cursor: pointer;
              background: transparent;
              border: none;
              text-align: left;
              width: 100%;
              font-family: inherit;
            }
            .topbar-dropdown-item:hover {
              background: rgba(124, 58, 237, 0.12) !important;
              color: var(--text-primary) !important;
            }
          `}</style>

          <div className="topbar-xp-group">
            <span className="topbar-xp-value" style={{ color: "var(--accent-gold)" }}>Level 5 Guild</span>
            <span className="topbar-xp-label">12,400 Guild Points</span>
          </div>

          <div className="topbar-level-capsule" style={{ borderColor: 'var(--accent-gold)' }}>
            <span className="lvl-lbl" style={{ color: 'var(--accent-gold)' }}>GM</span>
            <span className="lvl-num" style={{ color: 'var(--accent-gold)' }}>⭐</span>
          </div>

          <div 
            className="topbar-profile-dropdown" 
            onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
            style={{ cursor: "pointer" }}
          >
            <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-red))' }}>
              <span className="online-dot" />
            </div>
            <div className="profile-text">
              <span className="profile-name">Jean Grey</span>
              <span className="profile-role">Guild Master</span>
            </div>
            <span className="profile-arrow">▼</span>
          </div>

          {dropdownOpen && (
            <div className="topbar-dropdown-menu animate-fade-in" style={{
              position: 'absolute',
              top: '56px',
              right: '0px',
              background: 'rgba(13, 13, 35, 0.96)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              width: '220px',
              padding: '6px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
              zIndex: 10000,
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <Link href="/guild-hall" className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                🏰 Guild Hall Dashboard
              </Link>
              <Link href="/scout" className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                🔍 Scout Talent
              </Link>
              <Link href="/post-quest" className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                📝 Post New Quest
              </Link>
              <Link href="/pipeline" className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                ⚔️ Arena Pipeline
              </Link>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  document.cookie = "user-role=candidate; path=/";
                  setDropdownOpen(false);
                  window.location.reload();
                }}
                className="topbar-dropdown-item"
                style={{ color: 'var(--accent-gold)' }}
              >
                🔄 Switch to Seeker (Candidate)
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  document.cookie.split(";").forEach((c) => {
                    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                  });
                  setDropdownOpen(false);
                  window.location.href = "/login";
                }}
                className="topbar-dropdown-item"
                style={{ color: 'var(--accent-red)' }}
              >
                🚪 Exit Party (Logout)
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Page Content Centered */}
      <main className="dashboard-content">
        {children}
      </main>

      {/* Horizontal Floating Bottom Navigation Dock - Active on Desktop & Mobile */}
      <nav className="bottom-nav" style={{ borderColor: 'rgba(245, 158, 11, 0.2)' }}>
        <div className="bottom-nav-inner">
          {recruiterNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`bottom-nav-link ${isActive ? "active" : ""}`}
              >
                <span className="bottom-nav-icon">{item.icon}</span>
                <span className="bottom-nav-label" style={isActive ? { color: 'var(--accent-gold)' } : {}}>{item.label}</span>
                {isActive && <span className="active-dot-nav" style={{ background: 'var(--accent-gold)', boxShadow: '0 0 6px var(--accent-gold)' }} />}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
