"use client";

import { useState } from "react";
import Link from "next/link";
import "../recruiter.css";

const INITIAL_QUESTS = [
  { id: "1", title: "Senior Frontend Developer", difficulty: "hard", applicants: 34, location: "Raidurg, Hyderabad", reward: "500 XP" },
  { id: "2", title: "Backend Engineer", difficulty: "medium", applicants: 22, location: "HITEC City, Hyderabad", reward: "350 XP" },
  { id: "3", title: "Full Stack Developer", difficulty: "medium", applicants: 45, location: "Gachibowli, Hyderabad", reward: "400 XP" },
];

const RECENT_APPLICATIONS = [
  { candidate: "Arjun Sharma", quest: "Senior Frontend Developer", score: 86, time: "2 hours ago", status: "screening" },
  { candidate: "Priya Patel", quest: "Senior Frontend Developer", score: 92, time: "5 hours ago", status: "applied" },
  { candidate: "Rahul Kumar", quest: "Backend Engineer", score: 88, time: "Yesterday", status: "arena" }
];

export default function GuildHallPage() {
  const [quests, setQuests] = useState(INITIAL_QUESTS);

  return (
    <div className="recruiter-page">
      {/* Header */}
      <div className="page-header-rec">
        <h2 className="page-title-rec">🏰 Guild Hall Dashboard</h2>
        <Link href="/post-quest" className="btn btn-primary">
          📝 Draft New Quest
        </Link>
      </div>

      {/* Guild Stats Grid */}
      <div className="guild-stats-grid">
        <div className="guild-stat-card">
          <span className="guild-stat-num">{quests.length}</span>
          <span className="guild-stat-label">Active Quests</span>
        </div>
        <div className="guild-stat-card gold">
          <span className="guild-stat-num gold">101</span>
          <span className="guild-stat-label">Candidates Scouted</span>
        </div>
        <div className="guild-stat-card green">
          <span className="guild-stat-num green">14</span>
          <span className="guild-stat-label">Arena Rounds Complete</span>
        </div>
        <div className="guild-stat-card red">
          <span className="guild-stat-num red">8</span>
          <span className="guild-stat-label">Guild Hires Made</span>
        </div>
      </div>

      {/* Content Columns */}
      <div className="quest-management-section">
        {/* Left Side: Active Quests list */}
        <div className="guild-main-panel">
          <h3 className="guild-panel-title">🛡️ Active Quests (Posted Jobs)</h3>
          <div className="active-quests-list">
            {quests.map((quest) => (
              <div className="active-quest-row" key={quest.id}>
                <div className="quest-details-group">
                  <span className="quest-title-rec">{quest.title}</span>
                  <span className="quest-meta-rec">📍 {quest.location} • Difficulty: {quest.difficulty.toUpperCase()}</span>
                </div>
                <div className="applicants-badge-rec">
                  👤 {quest.applicants} Applicants
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                  <Link href={`/pipeline?jobId=${quest.id}`} className="btn btn-sm btn-ghost">
                    ⚔️ View Arena
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Recent Candidates */}
        <div className="guild-main-panel">
          <h3 className="guild-panel-title">📡 Live Coordinates (Recent Signs)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {RECENT_APPLICATIONS.map((app, i) => (
              <div 
                key={i} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.01)', 
                  border: '1px solid var(--border-subtle)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: 'var(--space-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong style={{ color: 'var(--text-primary)' }}>{app.candidate}</strong>
                  <span className="candidate-score-badge">🔥 {app.score}% Match</span>
                </div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Quest: {app.quest}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sign time: {app.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
