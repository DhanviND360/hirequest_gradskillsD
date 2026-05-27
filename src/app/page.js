"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "./landing.css";


/* =============== SVG ICONS =============== */
const StarIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
    <path
      d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z"
      fill="#7c3aed"
      stroke="#a78bfa"
      strokeWidth="0.5"
    />
    <circle cx="14" cy="14" r="3" fill="#a78bfa" opacity="0.6" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

const UserGroupIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const ExploreIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 11 22 2 13 21 11 13 3 11" />
  </svg>
);

const QuestIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LevelUpIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

const CrownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
    <path d="M3 20h18" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

/* =============== STAR BACKGROUND =============== */
function StarBackground() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const arr = [];
    for (let i = 0; i < 60; i++) {
      arr.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 1,
        dur: Math.random() * 3 + 2,
        delay: Math.random() * 3,
      });
    }
    setStars(arr);
  }, []);

  return (
    <div className="hero-stars">
      {stars.map((s) => (
        <div
          key={s.id}
          className="star"
          style={{
            left: s.left,
            top: s.top,
            width: `${s.size}px`,
            height: `${s.size}px`,
            "--dur": `${s.dur}s`,
            "--delay": `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* =============== ANIMATED COUNTER =============== */
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const startTime = performance.now();
          const numTarget =
            typeof target === "string"
              ? parseFloat(target.replace(/[^0-9.]/g, ""))
              : target;

          function animate(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * numTarget));
            if (progress < 1) requestAnimationFrame(animate);
          }
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

/* =============== SCROLLING TRUSTED LOGOS =============== */
function TrustedLogos() {
  const logos = [
    { name: "Google", style: { fontWeight: 400, letterSpacing: "0.01em" } },
    { name: "Microsoft", style: { fontWeight: 600, letterSpacing: "0" } },
    { name: "stripe", style: { fontWeight: 900, letterSpacing: "-0.03em", textTransform: "lowercase" } },
    { name: "Notion", style: { fontWeight: 600, letterSpacing: "-0.02em" } },
    { name: "airbnb", style: { fontWeight: 700, letterSpacing: "0", textTransform: "lowercase" } },
    { name: "Uber", style: { fontWeight: 700, letterSpacing: "-0.02em" } },
    { name: "Slack", style: { fontWeight: 700, letterSpacing: "-0.01em" } },
    { name: "Figma", style: { fontWeight: 600, letterSpacing: "0" } },
  ];

  // Double the logos for seamless infinite scroll
  const doubled = [...logos, ...logos];

  return (
    <div className="trusted-carousel-wrapper">
      <div className="trusted-carousel-fade-left" />
      <div className="trusted-carousel-track">
        {doubled.map((logo, i) => (
          <span key={`${logo.name}-${i}`} className="trusted-logo" style={logo.style}>
            {logo.name}
          </span>
        ))}
      </div>
      <div className="trusted-carousel-fade-right" />
    </div>
  );
}

/* =============== RESOURCES DROPDOWN =============== */
function ResourcesDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="nav-dropdown" ref={ref}>
      <button
        className="nav-dropdown-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        Resources <ChevronDownIcon />
      </button>
      {open && (
        <div className="nav-dropdown-menu">
          <Link href="#how-it-works" onClick={() => setOpen(false)}>Career Guide</Link>
          <Link href="#features" onClick={() => setOpen(false)}>Platform Overview</Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>API Docs</a>
          <Link href="#stats" onClick={() => setOpen(false)}>Success Stories</Link>
        </div>
      )}
    </div>
  );
}

/* =============== NAVBAR =============== */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`} id="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-logo" id="logo">
          <span className="navbar-logo-icon">
            <StarIcon />
          </span>
          Hire<span>Quest</span>
        </Link>

        <div className="navbar-links hide-mobile">
          <a href="#seekers" onClick={(e) => { e.preventDefault(); scrollTo("seekers"); }}>For Job Seekers</a>
          <a href="#employers" onClick={(e) => { e.preventDefault(); scrollTo("employers"); }}>For Employers</a>
          <a href="#how-it-works" onClick={(e) => { e.preventDefault(); scrollTo("how-it-works"); }}>How It Works</a>
          <a href="#stats" onClick={(e) => { e.preventDefault(); scrollTo("stats"); }}>Pricing</a>
          <ResourcesDropdown />
        </div>

        <div className="navbar-actions">
          <Link href="/login" className="login-link hide-mobile">
            Log in
          </Link>
          <Link href="/signup" className="btn btn-primary btn-sm" id="get-started-nav">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* =============== MAIN LANDING PAGE =============== */
export default function LandingPage() {
  return (
    <>
      <Navbar />

      {/* ========== HERO ========== */}
      <section className="hero" id="hero">
        <div className="hero-bg" />
        <StarBackground />

        <div className="hero-content">
          <h1 className="hero-title">
            Your Career<span className="dot">.</span>
            <br />
            Your Quest<span className="dot">.</span>
          </h1>

          <p className="hero-subtitle">
            HireQuest turns your job search into an adventure.
            <br />
            Explore opportunities, level up your skills, and build a legacy.
          </p>

          <div className="hero-ctas">
            <Link href="/signup?role=candidate" className="btn btn-primary btn-lg" id="cta-start-quest">
              Start Your Quest <ArrowIcon />
            </Link>
            <Link href="/signup?role=recruiter" className="btn btn-ghost btn-lg" id="cta-hiring">
              I&apos;m Hiring <UserGroupIcon />
            </Link>
          </div>
        </div>

        <div className="hero-globe-container">
          <div className="globe-fade-top" />
          <img 
            src="/hero-globe.png" 
            alt="Hero Globe Background" 
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              opacity: 0.85,
              mixBlendMode: "lighten",
              pointerEvents: "none",
              userSelect: "none"
            }} 
          />
          <div className="globe-fade-bottom" />
        </div>
      </section>

      {/* ========== TRUSTED BY — Scrolling Carousel ========== */}
      <section className="trusted-section" id="trusted">
        <div className="container">
          <p className="trusted-label">Trusted by innovative companies worldwide</p>
          <TrustedLogos />
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section className="features-section section" id="features">
        <div className="container">
          <p className="section-label">Built for Every Step of Your Journey</p>
          <h2 className="section-title" style={{ maxWidth: "600px", margin: "0 auto var(--space-sm)" }}>
            Everything you need to grow
          </h2>

          <div className="features-grid">
            <div className="feature-card" id="feature-explore">
              <div className="feature-icon purple">
                <ExploreIcon />
              </div>
              <h3>Explore Opportunities</h3>
              <p>
                Discover roles across the globe with our interactive world map and smart matching.
              </p>
            </div>

            <div className="feature-card" id="feature-quests">
              <div className="feature-icon gold">
                <QuestIcon />
              </div>
              <h3>Complete Quests</h3>
              <p>
                Turn applications and interviews into meaningful quests and earn XP as you progress.
              </p>
            </div>

            <div className="feature-card" id="feature-levelup">
              <div className="feature-icon green">
                <LevelUpIcon />
              </div>
              <h3>Level Up</h3>
              <p>
                Build in-demand skills, unlock achievements, and advance your career.
              </p>
            </div>

            <div className="feature-card" id="feature-legacy">
              <div className="feature-icon cyan">
                <CrownIcon />
              </div>
              <h3>Build Your Legacy</h3>
              <p>
                Climb leaderboards, earn recognition, and become a legend in your field.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== DUAL EXPERIENCE ========== */}
      <section className="dual-section section" id="seekers">
        <div className="container">
          <div className="dual-grid">
            <div className="dual-content">
              <p className="section-label">A Platform That Adapts to You</p>
              <h2 className="section-title">
                One platform.
                <br />
                Two powerful experiences.
              </h2>
              <p className="section-subtitle">
                Whether you&apos;re seeking your next challenge or building the perfect
                team, HireQuest gives you the tools to succeed.
              </p>

              <div className="dual-roles">
                <Link href="/signup?role=candidate" className="role-card" id="role-seeker">
                  <div className="role-icon seeker">
                    <ExploreIcon />
                  </div>
                  <div>
                    <h4>For Job Seekers</h4>
                    <p>Find quests, build skills, and grow your career.</p>
                  </div>
                  <span className="arrow">›</span>
                </Link>

                <Link href="/signup?role=recruiter" className="role-card" id="role-employer">
                  <div className="role-icon employer">
                    <CrownIcon />
                  </div>
                  <div>
                    <h4>For Employers</h4>
                    <p>Post quests, discover talent, and build winning teams.</p>
                  </div>
                  <span className="arrow">›</span>
                </Link>
              </div>
            </div>

            <div className="dual-preview" id="employers">
              <div className="dual-preview-glow" />
              <DashboardPreview />
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="how-section section" id="how-it-works">
        <div className="container" style={{ textAlign: "center" }}>
          <p className="section-label">Your Journey Begins</p>
          <h2
            className="section-title"
            style={{ maxWidth: "500px", margin: "0 auto var(--space-sm)" }}
          >
            How HireQuest Works
          </h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number s1">01</div>
              <h3>Create Your Character</h3>
              <p>Sign up, verify your identity, and build your character sheet with skills and a video resume.</p>
            </div>
            <div className="step-card">
              <div className="step-number s2">02</div>
              <h3>Explore the World Map</h3>
              <p>Discover jobs as quests and boss fights on an interactive globe. Find nearby opportunities.</p>
            </div>
            <div className="step-card">
              <div className="step-number s3">03</div>
              <h3>Challenge Bosses</h3>
              <p>Apply to quests, record video resumes, and enter the arena for AI-analyzed interviews.</p>
            </div>
            <div className="step-card">
              <div className="step-number s4">04</div>
              <h3>Level Up &amp; Get Hired</h3>
              <p>Earn XP, climb leaderboards, get matched by AI, and land your dream role.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS ========== */}
      <section className="stats-section" id="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon purple">
                <UserGroupIcon />
              </div>
              <div>
                <div className="stat-value">
                  <AnimatedCounter target={250} suffix="K+" />
                </div>
                <div className="stat-label">Active Players</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon gold">
                <QuestIcon />
              </div>
              <div>
                <div className="stat-value">
                  <AnimatedCounter target={50} suffix="K+" />
                </div>
                <div className="stat-label">Active Quests</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon green">
                <LevelUpIcon />
              </div>
              <div>
                <div className="stat-value">
                  <AnimatedCounter target={98} suffix="%" />
                </div>
                <div className="stat-label">Quest Success Rate</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon cyan">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
              </div>
              <div>
                <div className="stat-value">
                  <AnimatedCounter target={120} suffix="+" />
                </div>
                <div className="stat-label">Countries</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <div>
                <div className="stat-value">4.9/5</div>
                <div className="stat-label">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="cta-section section" id="cta">
        <div className="container">
          <h2 className="cta-title">
            Ready to begin your quest<span style={{ color: "var(--purple-400)" }}>?</span>
          </h2>
          <p className="cta-subtitle">
            Join thousands of players already leveling up their careers on HireQuest.
          </p>
          <div style={{ display: "flex", gap: "var(--space-md)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/signup?role=candidate" className="btn btn-primary btn-lg" id="cta-bottom-quest">
              Start Your Quest <ArrowIcon />
            </Link>
            <Link href="/signup?role=recruiter" className="btn btn-ghost btn-lg" id="cta-bottom-hiring">
              I&apos;m Hiring <UserGroupIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="footer" id="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="navbar-logo" style={{ marginBottom: "4px" }}>
                <span className="navbar-logo-icon">
                  <StarIcon />
                </span>
                Hire<span>Quest</span>
              </div>
              <p>
                Turning job search into an adventure. Explore, quest, level up,
                and build your career legacy.
              </p>
            </div>

            <div className="footer-column">
              <h4>Platform</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#seekers">For Job Seekers</a>
              <a href="#employers">For Employers</a>
            </div>

            <div className="footer-column">
              <h4>Contact</h4>
              <a href="mailto:team@hirequest.io">team@hirequest.io</a>
              <a href="#stats">Stats &amp; Impact</a>
              <a href="#">Hyderabad, India</a>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-credit">
              Made with <span className="heart">♥</span> by{" "}
              <strong>Dhanvi</strong> for{" "}
              <strong>Gradskills Hackathon</strong>
            </p>
            <div className="footer-bottom-links">
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

/* =============== MINIMAL DASHBOARD PREVIEW =============== */
function DashboardPreview() {
  return (
    <div className="dash-preview">
      {/* Sidebar */}
      <div className="dash-sidebar">
        <div className="dash-sidebar-logo">✦ HireQuest</div>
        {["World Map", "Quest Log", "Skill Tree", "Inventory", "Leaderboard", "Messages", "Profile", "Settings"].map(
          (item, i) => (
            <div key={item} className={`dash-sidebar-item ${i === 0 ? "active" : ""}`}>
              {item}
            </div>
          )
        )}
      </div>

      {/* Map area */}
      <div className="dash-map-area">
        <div className="dash-map-tabs">
          <span className="dash-tab active">All Quests</span>
          <span className="dash-tab">Boss Fights</span>
          <span className="dash-tab">Side Quests</span>
          <span className="dash-tab">Guilds</span>
        </div>
        <div className="dash-map-canvas">
          {/* Glowing dots representing job pins */}
          {[
            { top: "28%", left: "58%", color: "#22c55e", size: 8 },
            { top: "42%", left: "63%", color: "#ef4444", size: 10 },
            { top: "52%", left: "52%", color: "#7c3aed", size: 8 },
            { top: "38%", left: "22%", color: "#22c55e", size: 7 },
            { top: "32%", left: "45%", color: "#f59e0b", size: 9 },
            { top: "58%", left: "72%", color: "#22c55e", size: 7 },
            { top: "22%", left: "78%", color: "#22c55e", size: 8 },
            { top: "48%", left: "38%", color: "#7c3aed", size: 7 },
          ].map((dot, i) => (
            <div
              key={i}
              className="dash-map-dot"
              style={{
                top: dot.top,
                left: dot.left,
                width: `${dot.size}px`,
                height: `${dot.size}px`,
                background: dot.color,
                boxShadow: `0 0 ${dot.size + 4}px ${dot.color}60`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Right info card */}
      <div className="dash-right-card">
        <div className="dash-card-label">BOSS FIGHT</div>
        <div className="dash-card-title">Senior Product Designer</div>
        <div className="dash-card-company">San Francisco, USA • Remote</div>
        <div className="dash-card-stats">
          <span style={{ color: "#22c55e" }}>92%</span>
          <span style={{ color: "#f59e0b" }}>1,250 XP</span>
          <span style={{ color: "var(--text-muted)" }}>24 apps</span>
        </div>
        <div className="dash-card-skills">
          {["Figma", "Product Design", "UX Research"].map(s => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <div className="dash-card-btn">View Quest Details</div>
      </div>
    </div>
  );
}
