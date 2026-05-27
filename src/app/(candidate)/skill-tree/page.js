"use client";

const SKILLS = [
  {
    category: "Frontend",
    color: "#7c3aed",
    skills: [
      { name: "HTML/CSS", level: 5, maxLevel: 5, unlocked: true },
      { name: "JavaScript", level: 5, maxLevel: 5, unlocked: true },
      { name: "React", level: 4, maxLevel: 5, unlocked: true },
      { name: "Next.js", level: 3, maxLevel: 5, unlocked: true },
      { name: "TypeScript", level: 3, maxLevel: 5, unlocked: true },
      { name: "Vue.js", level: 1, maxLevel: 5, unlocked: false },
    ],
  },
  {
    category: "Backend",
    color: "#22c55e",
    skills: [
      { name: "Node.js", level: 4, maxLevel: 5, unlocked: true },
      { name: "Python", level: 3, maxLevel: 5, unlocked: true },
      { name: "PostgreSQL", level: 3, maxLevel: 5, unlocked: true },
      { name: "MongoDB", level: 2, maxLevel: 5, unlocked: true },
      { name: "Go", level: 0, maxLevel: 5, unlocked: false },
      { name: "Rust", level: 0, maxLevel: 5, unlocked: false },
    ],
  },
  {
    category: "DevOps",
    color: "#f59e0b",
    skills: [
      { name: "Git", level: 4, maxLevel: 5, unlocked: true },
      { name: "Docker", level: 2, maxLevel: 5, unlocked: true },
      { name: "AWS", level: 2, maxLevel: 5, unlocked: true },
      { name: "CI/CD", level: 1, maxLevel: 5, unlocked: false },
      { name: "Kubernetes", level: 0, maxLevel: 5, unlocked: false },
    ],
  },
  {
    category: "AI/ML",
    color: "#06b6d4",
    skills: [
      { name: "Machine Learning", level: 2, maxLevel: 5, unlocked: true },
      { name: "TensorFlow", level: 1, maxLevel: 5, unlocked: false },
      { name: "NLP", level: 1, maxLevel: 5, unlocked: false },
      { name: "Computer Vision", level: 0, maxLevel: 5, unlocked: false },
    ],
  },
];

export default function SkillTreePage() {
  return (
    <div style={{ padding: "var(--space-xl)", maxWidth: 1000, margin: "0 auto" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 700, marginBottom: "var(--space-xs)" }}>
          📊 Skill Tree
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
          Level up your skills to unlock higher-tier quests and boss fights.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(440px, 1fr))", gap: "var(--space-xl)" }}>
        {SKILLS.map((cat) => (
          <div key={cat.category} className="card-static" style={{ padding: "var(--space-lg)" }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
              fontWeight: 700,
              marginBottom: "var(--space-lg)",
              display: "flex",
              alignItems: "center",
              gap: "var(--space-sm)",
            }}>
              <span style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: cat.color,
                boxShadow: `0 0 8px ${cat.color}`,
                display: "inline-block",
              }} />
              {cat.category}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
              {cat.skills.map((skill) => (
                <div key={skill.name} style={{ opacity: skill.unlocked ? 1 : 0.4 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}>
                      {!skill.unlocked && "🔒 "}
                      {skill.name}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                      Lv. {skill.level}/{skill.maxLevel}
                    </span>
                  </div>
                  <div style={{
                    display: "flex",
                    gap: 3,
                  }}>
                    {Array.from({ length: skill.maxLevel }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 8,
                          borderRadius: 4,
                          background: i < skill.level ? cat.color : "rgba(255,255,255,0.08)",
                          boxShadow: i < skill.level ? `0 0 6px ${cat.color}40` : "none",
                          transition: "all 0.3s",
                        }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
