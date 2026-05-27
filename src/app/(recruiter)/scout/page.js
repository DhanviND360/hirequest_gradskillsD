"use client";

import { useState } from "react";
import "../recruiter.css";
import {
  CANDIDATES,
  VideoTelemetryPanel,
  ResumeTranscriptPanel,
} from "@/components/VideoTelemetryPanel";

export default function ScoutPage() {
  const [search, setSearch] = useState("");
  const [videoModal, setVideoModal] = useState(null); // candidate object or null
  const [resumeModal, setResumeModal] = useState(null);

  const filtered = CANDIDATES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="recruiter-page">
      <div className="page-header-rec">
        <h2 className="page-title-rec">🔍 Candidate Scout Directory</h2>
        <div className="search-bar" style={{ width: "300px" }}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search candidates or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="scout-grid">
        {filtered.map((c) => (
          <div className="candidate-scout-card" key={c.id}>
            <div className="candidate-scout-header">
              <div
                className="candidate-scout-avatar"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent-purple), var(--accent-cyan))",
                }}
              >
                {c.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                  {c.name}
                </h3>
                <span
                  style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                >
                  {c.title} • Level {c.level}
                </span>
              </div>
              <span className="candidate-score-badge">
                🛡️ {c.match}% Match
              </span>
            </div>

            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                lineHeight: 1.4,
              }}
            >
              <strong>AI Observations:</strong> {c.traits}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                }}
              >
                Equipped Skills
              </span>
              <div className="scout-skills-box">
                {c.skills.map((skill, index) => (
                  <span className="scout-skill-tag" key={index}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "var(--space-sm)",
                marginTop: "auto",
              }}
            >
              <button
                className="btn btn-primary btn-sm"
                style={{ flex: 1 }}
                onClick={() => setVideoModal(c)}
              >
                🎬 View Video Cry
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setResumeModal(c)}
              >
                📄 Scroll
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {videoModal && (
        <VideoTelemetryPanel
          candidate={videoModal}
          onClose={() => setVideoModal(null)}
        />
      )}
      {resumeModal && (
        <ResumeTranscriptPanel
          candidate={resumeModal}
          onClose={() => setResumeModal(null)}
        />
      )}
    </div>
  );
}
