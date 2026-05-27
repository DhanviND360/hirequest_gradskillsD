"use client";

import { useState } from "react";

const DEMO_QUESTS = [
  { id: 1, title: "Senior Frontend Developer", company: "TCS", location: "Raidurg, Hyderabad", status: "applied", match: 92, xp: 500, date: "2 hours ago", difficulty: "Hard", type: "boss" },
  { id: 2, title: "Full Stack Developer", company: "Wipro", location: "Gachibowli", status: "screening", match: 85, xp: 400, date: "1 day ago", difficulty: "Medium", type: "quest" },
  { id: 3, title: "Backend Engineer", company: "Infosys", location: "HITEC City", status: "arena", match: 88, xp: 350, date: "3 days ago", difficulty: "Medium", type: "quest" },
  { id: 4, title: "ML Engineer", company: "Microsoft", location: "Gachibowli", status: "offer", match: 78, xp: 700, date: "1 week ago", difficulty: "Very Hard", type: "boss" },
  { id: 5, title: "Data Analyst Intern", company: "Accenture", location: "Raidurg", status: "hired", match: 95, xp: 150, date: "2 weeks ago", difficulty: "Easy", type: "side-quest" },
  { id: 6, title: "React Native Developer", company: "Deloitte", location: "HITEC City", status: "rejected", match: 90, xp: 0, date: "3 weeks ago", difficulty: "Medium", type: "quest" },
];

import { 
  SuitcaseIcon, 
  MainQuestIcon, 
  SideQuestIcon, 
  GoldStarIcon 
} from "@/components/game-ui/Icons";

const STATUS_CONFIG = {
  applied: { label: "Applied", color: "#3b82f6", icon: "📩", step: 1 },
  screening: { label: "Screening", color: "#f59e0b", icon: "🔍", step: 2 },
  arena: { label: "Arena", color: "#7c3aed", icon: "⚔️", step: 3 },
  offer: { label: "Offer", color: "#22c55e", icon: "🎉", step: 4 },
  hired: { label: "Hired!", color: "#22c55e", icon: "🏆", step: 5 },
  rejected: { label: "Rejected", color: "#ef4444", icon: "💀", step: -1 },
};

const FILTERS = ["All", "Applied", "Screening", "Arena", "Offer", "Hired"];

export default function QuestLogPage() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? DEMO_QUESTS : DEMO_QUESTS.filter((q) => q.status === filter.toLowerCase());

  return (
    <div style={{ padding: "var(--space-xl)", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, marginBottom: "var(--space-xs)", display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SuitcaseIcon size={28} /> Quest Log
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Track all your active quests, boss fights, and application statuses.
        </p>
      </div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: "var(--space-sm)", marginBottom: "var(--space-xl)", flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`badge ${filter === f ? "badge-purple" : ""}`}
            style={{
              padding: "6px 16px",
              fontSize: "0.82rem",
              cursor: "pointer",
              background: filter === f ? "rgba(124,58,237,0.15)" : "var(--bg-card)",
              border: `1px solid ${filter === f ? "rgba(124,58,237,0.3)" : "var(--border-subtle)"}`,
              borderRadius: "var(--radius-full)",
              color: filter === f ? "var(--purple-400)" : "var(--text-secondary)",
              transition: "all 0.2s",
            }}
          >
            {f} {f !== "All" && `(${DEMO_QUESTS.filter((q) => q.status === f.toLowerCase()).length})`}
          </button>
        ))}
      </div>

      {/* Quest Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
        {filtered.map((quest) => {
          const config = STATUS_CONFIG[quest.status];
          return (
            <div
              key={quest.id}
              className="card-static"
              style={{
                padding: "var(--space-lg)",
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: "var(--space-md)",
                borderLeft: `3px solid ${config.color}`,
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)", marginBottom: 4 }}>
                  <span style={{ display: "flex" }}>
                    {quest.type === "boss" ? <MainQuestIcon size={24} /> : quest.type === "side-quest" ? <SideQuestIcon size={24} /> : <SuitcaseIcon size={24} />}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.05rem", paddingLeft: '4px' }}>
                    {quest.title}
                  </h3>
                  <span style={{
                    padding: "2px 10px",
                    borderRadius: "var(--radius-full)",
                    background: `${config.color}20`,
                    color: config.color,
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    border: `1px solid ${config.color}30`,
                    marginLeft: '8px'
                  }}>
                    {config.icon} {config.label}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "var(--space-sm)" }}>
                  {quest.company} • {quest.location} • {quest.date}
                </p>

                {/* Progress bar */}
                {config.step > 0 && (
                  <div style={{ display: "flex", gap: 4, marginTop: "var(--space-sm)" }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <div
                        key={s}
                        style={{
                          flex: 1,
                          height: 4,
                          borderRadius: 2,
                          background: s <= config.step ? config.color : "rgba(255,255,255,0.1)",
                          transition: "background 0.3s",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div style={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <span style={{ color: "var(--accent-green)", fontWeight: 700, fontFamily: "var(--font-display)" }}>
                    {quest.match}% Match
                  </span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                  <span style={{ color: "var(--accent-gold)", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <GoldStarIcon size={12} /> {quest.xp} XP
                  </span>
                  <span>{quest.difficulty}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
