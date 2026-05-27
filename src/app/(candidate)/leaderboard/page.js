"use client";

const LEADERBOARD = [
  { rank: 1, name: "Priya Patel", title: "Code Warrior", level: 47, xp: 47200, quests: 89, badge: "🥇", avatar: "P" },
  { rank: 2, name: "Rahul Kumar", title: "Quest Master", level: 44, xp: 44100, quests: 82, badge: "🥈", avatar: "R" },
  { rank: 3, name: "Ananya Singh", title: "Boss Slayer", level: 41, xp: 41500, quests: 76, badge: "🥉", avatar: "A" },
  { rank: 4, name: "Vikram Reddy", title: "Skill Sage", level: 38, xp: 38900, quests: 71, badge: "4", avatar: "V" },
  { rank: 5, name: "Sneha Sharma", title: "Arena Champion", level: 36, xp: 36200, quests: 68, badge: "5", avatar: "S" },
  { rank: 6, name: "Arjun Sharma", title: "Novice Explorer", level: 23, xp: 3250, quests: 12, badge: "23", avatar: "A", isYou: true },
  { rank: 7, name: "Karthik M", title: "Code Novice", level: 21, xp: 2800, quests: 10, badge: "7", avatar: "K" },
  { rank: 8, name: "Deepika R", title: "Apprentice", level: 19, xp: 2400, quests: 8, badge: "8", avatar: "D" },
  { rank: 9, name: "Suresh B", title: "Beginner", level: 15, xp: 1800, quests: 5, badge: "9", avatar: "S" },
  { rank: 10, name: "Meera K", title: "Newcomer", level: 12, xp: 1200, quests: 3, badge: "10", avatar: "M" },
];

export default function LeaderboardPage() {
  return (
    <div style={{ padding: "var(--space-xl)", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--space-2xl)" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, marginBottom: "var(--space-xs)" }}>
          🏅 Leaderboard
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Top quest hunters ranked by XP and achievements</p>
      </div>

      {/* Top 3 Podium */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "end", gap: "var(--space-md)", marginBottom: "var(--space-2xl)", padding: "0 var(--space-xl)" }}>
        {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((p, i) => {
          const heights = [140, 180, 120];
          const colors = ["#c0c0c0", "#ffd700", "#cd7f32"];
          return (
            <div key={p.rank} style={{ textAlign: "center", flex: 1, maxWidth: 160 }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%", margin: "0 auto var(--space-sm)",
                background: `linear-gradient(135deg, ${colors[i]}40, ${colors[i]}20)`,
                border: `2px solid ${colors[i]}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem",
              }}>
                {p.avatar}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem", marginBottom: 2 }}>{p.name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "var(--space-sm)" }}>Lv. {p.level}</div>
              <div style={{
                height: heights[i],
                background: `linear-gradient(to top, ${colors[i]}20, ${colors[i]}08)`,
                borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                border: `1px solid ${colors[i]}30`,
                borderBottom: "none",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: "2rem" }}>{p.badge}</span>
                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: colors[i], fontSize: "0.85rem" }}>
                  {p.xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full List */}
      <div className="card-static" style={{ overflow: "hidden" }}>
        {LEADERBOARD.map((p) => (
          <div
            key={p.rank}
            style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr auto auto auto",
              alignItems: "center",
              gap: "var(--space-md)",
              padding: "var(--space-md) var(--space-lg)",
              borderBottom: "1px solid var(--border-subtle)",
              background: p.isYou ? "rgba(124,58,237,0.08)" : "transparent",
              transition: "background 0.2s",
            }}
          >
            <span style={{
              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1rem",
              color: p.rank <= 3 ? (p.rank === 1 ? "#ffd700" : p.rank === 2 ? "#c0c0c0" : "#cd7f32") : "var(--text-muted)",
              textAlign: "center",
            }}>
              {p.rank <= 3 ? p.badge : `#${p.rank}`}
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-sm)" }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: p.isYou ? "linear-gradient(135deg, var(--purple-600), var(--purple-800))" : "var(--bg-card)",
                border: `2px solid ${p.isYou ? "var(--purple-400)" : "var(--border-subtle)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.85rem",
              }}>
                {p.avatar}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.9rem" }}>
                  {p.name} {p.isYou && <span style={{ color: "var(--purple-400)", fontSize: "0.75rem" }}>(You)</span>}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.title}</div>
              </div>
            </div>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              Lv. {p.level}
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--accent-green)", fontSize: "0.9rem", minWidth: 90, textAlign: "right" }}>
              {p.xp.toLocaleString()} XP
            </span>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", minWidth: 70, textAlign: "right" }}>
              {p.quests} quests
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
