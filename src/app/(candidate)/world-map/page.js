"use client";

import { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import "./worldmap.css";

// Import premium outlined vector SVG icons
import { 
  GoldStarIcon, 
  GreenHeartIcon, 
  PurpleGemIcon, 
  TargetQuestIcon, 
  RedSkullIcon,
  SuitcaseIcon,
  MainQuestIcon,
  SideQuestIcon,
  LocationIcon,
  RadarIcon
} from "@/components/game-ui/Icons";

/* Lazy-load interactive Leaflet Map (SSR incompatible due to window access in leaflet) */
const MapWithNoSSR = dynamic(() => import("@/components/map/LeafletMap"), {
  ssr: false,
  loading: () => (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at center, #0a0a20 0%, #03030b 100%)",
    }}>
      <div className="animate-pulse" style={{ color: "var(--accent-green)", fontFamily: "monospace", fontSize: "0.95rem" }}>
        🔮 Attuning Space Coordinates... [Initializing Interactive Map]
      </div>
    </div>
  ),
});

// Haversine distance calculator in km
function getDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function WorldMapPage() {
  const [userLocation, setUserLocation] = useState({ lat: 17.3850, lng: 78.4867 }); // Default Hyderabad center
  const [locationCity, setLocationCity] = useState("Hyderabad, India (Locating...)");
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [isMatching, setIsMatching] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [showAllJobsModal, setShowAllJobsModal] = useState(false);

  // 1. Geolocation using IP-based API for accurate desktop results
  useEffect(() => {
    async function fetchRealLocation() {
      try {
        const res = await fetch('https://ipapi.co/json/');
        if (res.ok) {
          const data = await res.json();
          setUserLocation({ lat: data.latitude, lng: data.longitude });
          setLocationCity(`${data.city}, ${data.country_name}`);
        } else {
          throw new Error("IP Geolocation failed");
        }
      } catch (e) {
        console.warn("Failed to fetch IP location, falling back to Hyderabad", e);
        setLocationCity("Hyderabad, India");
      }
    }
    fetchRealLocation();
  }, []);

  // 2. Fetch Real jobs from API
  useEffect(() => {
    async function loadJobs() {
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
      } finally {
        setLoadingJobs(false);
      }
    }
    loadJobs();
  }, []);

  // 3. Process jobs with real distances based on geolocated user coordinates
  const processedJobs = useMemo(() => {
    return jobs.map(job => {
      const distanceVal = getDistance(userLocation.lat, userLocation.lng, job.lat, job.lng);
      return {
        ...job,
        distanceVal,
        distance: distanceVal < 50 ? `${distanceVal.toFixed(1)} km` : `${Math.round(distanceVal)} km`
      };
    });
  }, [jobs, userLocation]);

  // 4. Search and Filter logic
  const filteredJobs = useMemo(() => {
    return processedJobs.filter(job => {
      const matchesSearch = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (job.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesDifficulty = difficultyFilter === "all" || job.difficulty === difficultyFilter;
      return matchesSearch && matchesDifficulty;
    });
  }, [processedJobs, searchQuery, difficultyFilter]);

  // Closest jobs sorted by physical proximity
  const nearbyJobs = useMemo(() => {
    return [...filteredJobs]
      .sort((a, b) => a.distanceVal - b.distanceVal)
      .slice(0, 5);
  }, [filteredJobs]);

  // AI Matchmaker integration through OpenRouter gemini-2.5-flash
  const handleAIMatch = async () => {
    setIsMatching(true);
    try {
      // Fetch user's profile from localStorage or use a comprehensive fallback
      const localProfile = localStorage.getItem("candidate_profile_data");
      const candidateProfile = localProfile ? JSON.parse(localProfile) : {
        name: "Arjun Sharma",
        title: "Career Seeker",
        skills: ["React", "JavaScript", "TypeScript", "Next.js", "Node.js"],
        experience_years: 3
      };
      
      const updatedJobs = [...jobs];
      // Run matchmaker on the 3 nearest jobs to conserve tokens and provide immediate realistic response
      const jobsToMatch = filteredJobs.slice(0, 3);

      for (const job of jobsToMatch) {
        const res = await fetch("/api/ai/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ candidateProfile, jobRequirements: job })
        });
        if (res.ok) {
          const matchData = await res.json();
          const index = updatedJobs.findIndex(j => j.id === job.id);
          if (index > -1) {
            updatedJobs[index].match = matchData.matchScore || updatedJobs[index].match;
            updatedJobs[index].reasoning = matchData.reasoning;
          }
        }
      }
      setJobs(updatedJobs);
      alert("🤖 AI Matchmaking attunement complete! Check your nearby opportunities for personalized match percentages and recruiting insights.");
    } catch (e) {
      console.error(e);
      alert("AI matching attunement failed. Check OpenRouter key.");
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <div className="world-map-page">
      {/* ===== LEFT PANEL ===== */}
      <div className="map-left-panel">
        {/* Player Status */}
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Player Status</span>
          </div>
          <div className="player-status-main">
            <div className="player-level-circle">23</div>
            <div style={{ flex: 1 }}>
              <div className="player-title">Novice Explorer</div>
              <div className="player-xp-text">3,250 / 4,500 XP</div>
              <div className="xp-bar-container">
                <div className="xp-bar-fill" style={{ width: "72%" }} />
              </div>
            </div>
          </div>
          <div className="player-stats-row">
            <div className="player-stat">
              <span className="stat-icon-sm" style={{ display: 'flex', alignItems: 'center' }}>
                <GoldStarIcon size={16} />
              </span>
              <span className="stat-value-sm">2,450</span>
              <span className="stat-label-sm">Gold (XP)</span>
            </div>
            <div className="player-stat">
              <span className="stat-icon-sm" style={{ display: 'flex', alignItems: 'center' }}>
                <GreenHeartIcon size={16} />
              </span>
              <span className="stat-value-sm">87%</span>
              <span className="stat-label-sm">HP</span>
            </div>
            <div className="player-stat">
              <span className="stat-icon-sm" style={{ display: 'flex', alignItems: 'center' }}>
                <PurpleGemIcon size={16} />
              </span>
              <span className="stat-value-sm">12</span>
              <span className="stat-label-sm">Gems</span>
            </div>
          </div>
        </div>

        {/* Active Quest */}
        <div className="panel-card">
          <div className="panel-card-header">
            <span className="panel-card-title">Active Quest</span>
            <span className="panel-card-meta">2 / 3</span>
          </div>
          <div className="quest-progress">
            <div className="quest-icon" style={{ display: 'flex', alignItems: 'center' }}>
              <TargetQuestIcon size={30} />
            </div>
            <div className="quest-info" style={{ paddingLeft: '8px' }}>
              <h4>Apply to 5 Matching Jobs</h4>
              <div className="xp-bar-container" style={{ marginTop: '4px' }}>
                <div className="xp-bar-fill" style={{ width: "40%", background: "linear-gradient(90deg, var(--accent-green), #4ade80)" }} />
              </div>
            </div>
          </div>
          <div className="quest-rewards">
            <span className="quest-reward" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <GoldStarIcon size={14} /> 150 XP
            </span>
            <span className="quest-reward" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <PurpleGemIcon size={14} /> 15 Gems
            </span>
          </div>
        </div>

        {/* Next Boss Fight */}
        <div className="panel-card" style={{ borderColor: "rgba(239, 68, 68, 0.2)" }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Next Boss Fight</span>
            <span className="badge badge-red">BOSS</span>
          </div>
          <div className="boss-card-inner">
            <div className="boss-avatar" style={{ display: 'flex', alignItems: 'center' }}>
              <RedSkullIcon size={44} />
            </div>
            <div style={{ paddingLeft: '8px' }}>
              <div className="boss-name">TechCorp Recruiter</div>
              <div className="boss-subtitle">AI Screening Round</div>
            </div>
          </div>
          <div className="boss-meta">
            <span>Difficulty <strong className="difficulty" style={{ color: 'var(--accent-red)' }}>Hard</strong></span>
            <span>Recommended Level <strong>25</strong></span>
          </div>
          <div className="quest-rewards">
            <span className="quest-reward" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GoldStarIcon size={14} /> 500 XP</span>
            <span className="quest-reward" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><PurpleGemIcon size={14} /> 50 Gems</span>
          </div>
          <button className="view-details-btn" style={{ marginTop: "var(--space-sm)" }} onClick={() => alert("TechCorp Recruiter AI Screen Boss Fight is prepared! Equip your virtual resume in the Profile tab and begin the interview from a job listing to challenge the boss.")}>
            View Details
          </button>
        </div>
      </div>

      {/* ===== CENTER MAP Leaflet ===== */}
      <div className="map-center">
        <div className="map-location-bar" style={{ zIndex: 1001 }}>
          <div className="location-pin" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <LocationIcon size={18} />
            Your Location
          </div>
          <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{locationCity}</span>
          <div className="radar-badge" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RadarIcon size={16} />
            Radar Active
          </div>
        </div>

        <MapWithNoSSR
          userLocation={userLocation}
          jobs={filteredJobs}
          onJobSelect={setSelectedJob}
          activeJob={selectedJob}
        />
      </div>

      {/* ===== RIGHT PANEL ===== */}
      <div className="map-right-panel">
        {/* Search */}
        <div style={{ display: "flex", gap: "var(--space-sm)" }}>
          <div className="search-bar" style={{ flex: 1 }}>
            <span className="search-icon">🔍</span>
            <input 
              type="text" 
              placeholder="Search jobs, tags, guilds..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            value={difficultyFilter} 
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="filter-btn"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', borderRadius: 'var(--radius-md)', padding: '0 8px', fontSize: '0.75rem', cursor: 'pointer' }}
          >
            <option value="all">All levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
            <option value="very_hard">Very Hard</option>
          </select>
        </div>

        {/* Nearby Opportunities */}
        <div className="panel-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="panel-card-header">
            <span className="panel-card-title">Nearby Opportunities</span>
            <button className="btn btn-primary btn-sm" onClick={handleAIMatch} disabled={isMatching}>
              {isMatching ? "Processing..." : "🤖 Match AI"}
            </button>
          </div>
          
          <div className="nearby-list" style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
            {loadingJobs ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                🔮 Summoning real-world opportunities...
              </div>
            ) : nearbyJobs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No active quests found matching filters.
              </div>
            ) : (
              nearbyJobs.map((job) => {
                const isActive = selectedJob?.id === job.id;
                return (
                  <div 
                    className={`nearby-item ${isActive ? "active" : ""}`} 
                    key={job.id} 
                    onClick={() => setSelectedJob(job)}
                    style={isActive ? { borderColor: 'var(--accent-purple)', background: 'rgba(124, 58, 237, 0.08)' } : {}}
                  >
                    <div className="nearby-icon green" style={{ display: 'flex', alignItems: 'center' }}>
                      {job.type === "boss" ? <MainQuestIcon size={24} /> : job.type === "side-quest" ? <SideQuestIcon size={24} /> : <SuitcaseIcon size={24} />}
                    </div>
                    <div className="nearby-info" style={{ paddingLeft: '8px', flex: 1, overflow: 'hidden' }}>
                      <div className="nearby-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.title}</div>
                      <div className="nearby-company">{job.company_name}</div>
                      {job.reasoning && (
                        <div style={{ fontSize: "0.75rem", color: "var(--accent-gold)", marginTop: "4px", fontStyle: 'italic', lineHeight: '1.2' }}>
                          💬 {job.reasoning}
                        </div>
                      )}
                    </div>
                    <div className="nearby-meta" style={{ textAlign: 'right', minWidth: '65px' }}>
                      <span className="nearby-distance">{job.distance}</span>
                      <span className="nearby-match" style={{ color: job.match > 85 ? 'var(--accent-green)' : 'var(--accent-cyan)' }}>{job.match}% Match</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div 
            className="view-all-link" 
            style={{ cursor: 'pointer', textAlign: 'center', color: 'var(--accent-purple-light)', fontWeight: 600, fontSize: '0.85rem', marginTop: 'var(--space-md)' }}
            onClick={() => setShowAllJobsModal(true)}
          >
            View all opportunities ({filteredJobs.length}) →
          </div>
        </div>

        {/* Map Legend */}
        <div className="panel-card" style={{ padding: '12px var(--space-lg)' }}>
          <div className="panel-card-header" style={{ marginBottom: '8px' }}>
            <span className="panel-card-title" style={{ fontSize: '0.68rem' }}>Map Legend</span>
          </div>
          <div className="legend-items" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem' }}>
            <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SuitcaseIcon size={18} /> Opportunity
            </div>
            <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MainQuestIcon size={18} /> Boss Fight
            </div>
            <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SideQuestIcon size={18} /> Side Quest
            </div>
            <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LocationIcon size={18} /> Your Spot
            </div>
          </div>
        </div>
      </div>

      {/* ===== ALL OPPORTUNITIES FULL SCREEN MODAL ===== */}
      {showAllJobsModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3, 3, 11, 0.95)',
          backdropFilter: 'blur(20px)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px'
        }}>
          <div className="animate-fade-in" style={{
            background: 'var(--bg-card)',
            border: '1.5px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '1000px',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                  ⚔️ ACTIVE REAL-WORLD OPPORTUNITIES ARRAY
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Showing {filteredJobs.length} active tech job postings sorted by proximity to your coordinates.
                </p>
              </div>
              <button 
                onClick={() => setShowAllJobsModal(false)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', cursor: 'pointer', padding: '8px 16px', borderRadius: 'var(--radius-md)', fontWeight: 'bold' }}
              >
                Close Array
              </button>
            </div>

            {/* Modal Content - List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {filteredJobs.map((job) => (
                  <div 
                    key={job.id} 
                    onClick={() => {
                      setSelectedJob(job);
                      setShowAllJobsModal(false);
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-purple)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: job.type === 'boss' ? '#ef4444' : '#22c55e', textTransform: 'uppercase' }}>
                          {job.type.replace('-', ' ')}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📍 {job.distance} away</span>
                      </div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '6px 0 2px 0', color: 'var(--text-primary)' }}>{job.title}</h3>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>🏢 {job.company_name} • {job.location}</div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {job.description ? job.description.replace(/<[^>]*>/g, '') : "No description available."}
                      </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {job.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{ background: 'rgba(124, 58, 237, 0.1)', color: 'var(--accent-purple-light)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem' }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>{job.salary}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
