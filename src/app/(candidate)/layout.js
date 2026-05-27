"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./dashboard.css";

import { 
  WorldMapNavIcon, 
  QuestLogNavIcon, 
  SkillsNavIcon, 
  InventoryNavIcon, 
  GuildNavIcon, 
  ProfileNavIcon,
  ScoutNavIcon,
  MessageNavIcon
} from "@/components/game-ui/Icons";

const candidateNavItems = [
  { href: "/profile", icon: <ProfileNavIcon />, label: "Profile" },
  { href: "/world-map", icon: <WorldMapNavIcon />, label: "World Map" },
  { href: "/quest-log", icon: <QuestLogNavIcon />, label: "Quest Log" },
  { href: "/skill-tree", icon: <SkillsNavIcon />, label: "Skills" },
  { href: "/inventory", icon: <InventoryNavIcon />, label: "Inventory" },
  { href: "/messages", icon: <MessageNavIcon />, label: "Guild" },
];

const recruiterNavItems = [
  { href: "/guild-hall", icon: <GuildNavIcon />, label: "Guild Hall" },
  { href: "/scout", icon: <ScoutNavIcon />, label: "Scout" },
  { href: "/post-quest", icon: <QuestLogNavIcon />, label: "Post Quest" },
  { href: "/pipeline", icon: <SkillsNavIcon />, label: "Pipeline" },
  { href: "/messages", icon: <MessageNavIcon />, label: "Messages" },
  { href: "/profile", icon: <ProfileNavIcon />, label: "Profile" },
];

export default function CandidateLayout({ children }) {
  const pathname = usePathname();
  const [role, setRole] = useState("candidate");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = () => setDropdownOpen(false);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  // Determine role based on path and cookie
  useEffect(() => {
    const isRecruiterPath = 
      pathname.startsWith("/guild-hall") ||
      pathname.startsWith("/scout") ||
      pathname.startsWith("/post-quest") ||
      pathname.startsWith("/pipeline");

    const hasRecruiterCookie = document.cookie.includes("user-role=recruiter");
    if (isRecruiterPath || hasRecruiterCookie) {
      setRole("recruiter");
    } else {
      setRole("candidate");
    }
  }, [pathname]);

  const isRecruiter = role === "recruiter";
  const navItems = isRecruiter ? recruiterNavItems : candidateNavItems;

  // Active header details
  const activeLabel = navItems.find((n) => pathname.startsWith(n.href))?.label || "WORLD MAP";
  const activeSubtitle = isRecruiter
    ? pathname.startsWith("/guild-hall")
      ? "Manage active company quests and review achievements."
      : pathname.startsWith("/scout")
      ? "Scout top talent and view candidate battle scores."
      : pathname.startsWith("/post-quest")
      ? "Draft and publish new candidate challenges."
      : pathname.startsWith("/pipeline")
      ? "Coordinate interview arenas and progress hires."
      : pathname.startsWith("/messages")
      ? "Party chat with active candidates."
      : "Inspect character sheets and stats."
    : pathname.startsWith("/world-map")
      ? "Explore opportunities, level up your career."
      : pathname.startsWith("/quest-log")
      ? "Track active quests and boss fights."
      : pathname.startsWith("/skill-tree")
      ? "Ascend your character skill trees."
      : pathname.startsWith("/inventory")
      ? "Manage equipped scrolls and certifications."
      : pathname.startsWith("/messages")
      ? "Party chat with active Recruiters and Guilds."
      : "Inspect character sheets and stats.";

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
        <div className="topbar-right" style={{ position: 'relative' }}>
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

          {isRecruiter ? (
            <>
              <div className="topbar-xp-group">
                <span className="topbar-xp-value" style={{ color: 'var(--accent-gold)' }}>Level 5 Guild</span>
                <span className="topbar-xp-label">12,400 Guild Points</span>
              </div>

              <div className="topbar-level-capsule" style={{ borderColor: 'var(--accent-gold)' }}>
                <span className="lvl-lbl" style={{ color: 'var(--accent-gold)' }}>GM</span>
                <span className="lvl-num" style={{ color: 'var(--accent-gold)' }}>⭐</span>
              </div>

              <div className="topbar-profile-dropdown" onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }} style={{ cursor: 'pointer' }}>
                <div className="profile-avatar" style={{ background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-red))' }}>
                  <span className="online-dot" />
                </div>
                <div className="profile-text">
                  <span className="profile-name">Jean Grey</span>
                  <span className="profile-role">Guild Master</span>
                </div>
                <span className="profile-arrow">▼</span>
              </div>
            </>
          ) : (
            <>
              <div className="topbar-xp-group">
                <span className="topbar-xp-value">3,250 XP</span>
                <span className="topbar-xp-label">to next level</span>
              </div>

              <div className="topbar-level-capsule">
                <span className="lvl-lbl">LVL</span>
                <span className="lvl-num">23</span>
              </div>

              <div className="topbar-profile-dropdown" onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }} style={{ cursor: 'pointer' }}>
                <div className="profile-avatar">
                  <span className="online-dot" />
                </div>
                <div className="profile-text">
                  <span className="profile-name">Arjun Sharma</span>
                  <span className="profile-role">Career Seeker</span>
                </div>
                <span className="profile-arrow">▼</span>
              </div>
            </>
          )}

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
              <Link href="/profile" className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                👤 Character Sheet
              </Link>
              <Link href="/world-map" className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                🗺️ World Job Map
              </Link>
              <Link href="/quest-log" className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                📜 Quest Log
              </Link>
              <Link href="/skill-tree" className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                🛠️ Skill Trees
              </Link>
              <Link href="/inventory" className="topbar-dropdown-item" onClick={() => setDropdownOpen(false)}>
                🎒 Item Inventory
              </Link>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (isRecruiter) {
                    document.cookie = "user-role=candidate; path=/";
                  } else {
                    document.cookie = "user-role=recruiter; path=/";
                  }
                  setDropdownOpen(false);
                  window.location.reload();
                }}
                className="topbar-dropdown-item"
                style={{ color: 'var(--accent-gold)' }}
              >
                🔄 Switch to {isRecruiter ? "Candidate" : "Recruiter"}
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

      {/* Horizontal Floating Bottom Navigation Dock */}
      <nav className="bottom-nav" style={isRecruiter ? { borderColor: 'rgba(245, 158, 11, 0.2)' } : {}}>
        <div className="bottom-nav-inner">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`bottom-nav-link ${isActive ? "active" : ""}`}
                style={isActive && isRecruiter ? { color: 'var(--accent-gold)', background: 'rgba(245, 158, 11, 0.08)' } : {}}
              >
                <span className="bottom-nav-icon" style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                <span className="bottom-nav-label">{item.label}</span>
                {isActive && (
                  <span 
                    className="active-dot-nav" 
                    style={isRecruiter ? { background: 'var(--accent-gold)', boxShadow: '0 0 6px var(--accent-gold)' } : {}} 
                  />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
