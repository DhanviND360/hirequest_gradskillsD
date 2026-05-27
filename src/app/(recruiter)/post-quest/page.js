"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "../recruiter.css";

export default function PostQuestPage() {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [xpReward, setXpReward] = useState(300);
  const [gemsReward, setGemsReward] = useState(30);
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handlePostQuest = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="recruiter-page">
      <div className="page-header-rec">
        <h2 className="page-title-rec">📝 Draft New Quest (Post a Job)</h2>
      </div>

      <div className="form-card-rec">
        <form onSubmit={handlePostQuest} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          
          <div className="form-group">
            <label className="form-label">Quest Title (Job Title)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Senior Frontend Developer" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">Raid Difficulty</label>
              <select 
                className="form-input" 
                value={difficulty} 
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="legendary">Legendary</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Raid Coordinates (Location)</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. HITEC City, Hyderabad" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
            <div className="form-group">
              <label className="form-label">XP Reward</label>
              <input 
                type="number" 
                className="form-input" 
                value={xpReward} 
                onChange={(e) => setXpReward(parseInt(e.target.value) || 0)} 
                required 
              />
            </div>
            <div className="form-group">
              <label className="form-label">Gem Reward</label>
              <input 
                type="number" 
                className="form-input" 
                value={gemsReward} 
                onChange={(e) => setGemsReward(parseInt(e.target.value) || 0)} 
                required 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Weapons (Skills, comma-separated)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. React, Next.js, CSS, JavaScript" 
              value={skills} 
              onChange={(e) => setSkills(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quest Scroll (Raid description and requirements)</label>
            <textarea 
              className="form-input" 
              rows="5"
              placeholder="Draft the details of the raid challenges, scaling barriers, and daily team dungeon explorations..."
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              required
              style={{ fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-sm)' }} disabled={loading}>
            {loading ? "Publishing quest..." : "📜 Pin Quest to the Realm"}
          </button>
        </form>
      </div>

      {/* Magical Loading Dialog Box Overlay */}
      {loading && (
        <div className="scout-modal-overlay" style={{ zIndex: 10000 }}>
          <div className="scout-modal-content animate-fade-in-up" style={{ maxWidth: '460px', padding: 'var(--space-2xl)', textAlign: 'center', background: 'rgba(10, 10, 20, 0.9)', backdropFilter: 'blur(16px)', border: '1px solid var(--border-medium)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div className="loading-spinner-rpg" />
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--purple-300)', marginBottom: '10px', textShadow: '0 0 10px rgba(124, 58, 237, 0.4)' }}>
              🔮 Forging Quest Scroll...
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>
              Engraving coordinate runes on the World Map and aligning reward tokens for adventurers.
            </p>
          </div>
        </div>
      )}

      {/* Quest Submission Success Dialog Box Modal Overlay */}
      {success && (
        <div className="scout-modal-overlay" style={{ zIndex: 10000 }}>
          <div className="scout-modal-content animate-fade-in-up" style={{ maxWidth: '560px', background: 'rgba(13, 13, 26, 0.95)', border: '1px solid var(--accent-green)', boxShadow: '0 20px 80px rgba(34, 197, 94, 0.15)', display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-sm)' }}>
              <div style={{ fontSize: '3.5rem', filter: 'drop-shadow(0 0 15px rgba(245, 158, 11, 0.4))', marginBottom: '10px' }}>📜✨</div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold)' }}>
                Quest Posted to the Realm!
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px', margin: 0 }}>
                Your recruitment challenge is live and pinned to the World Map coordinates.
              </p>
            </div>

            {/* Quest Preview Details Card */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>Quest Name</span>
                <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>{title || "Untitled Quest"}</strong>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>Raid Difficulty</span>
                <span style={{ 
                  color: difficulty === 'legendary' ? 'var(--accent-gold)' : difficulty === 'hard' ? 'var(--accent-red)' : difficulty === 'medium' ? 'var(--accent-cyan)' : 'var(--accent-green)', 
                  fontSize: '0.82rem', 
                  fontWeight: 700, 
                  textTransform: 'uppercase',
                  background: difficulty === 'legendary' ? 'rgba(245, 158, 11, 0.08)' : difficulty === 'hard' ? 'rgba(239, 68, 68, 0.08)' : difficulty === 'medium' ? 'rgba(6, 182, 212, 0.08)' : 'rgba(34, 197, 94, 0.08)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: difficulty === 'legendary' ? '1px solid rgba(245, 158, 11, 0.2)' : difficulty === 'hard' ? '1px solid rgba(239, 68, 68, 0.2)' : difficulty === 'medium' ? '1px solid rgba(6, 182, 212, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)'
                }}>
                  💀 {difficulty}
                </span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>Coordinates</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>📍 {location}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '6px', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>Rewards</span>
                <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 700 }}>
                  💎 {gemsReward} Gems • ⭐ {xpReward} XP
                </span>
              </div>

              {skills && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', fontWeight: 600 }}>Required Weapons</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '2px' }}>
                    {skills.split(',').map((skill, i) => (
                      <span key={i} style={{ background: 'rgba(167, 139, 250, 0.08)', border: '1px solid rgba(167, 139, 250, 0.2)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', color: 'var(--purple-300)', fontWeight: 600 }}>
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', marginTop: 'var(--space-sm)' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setSuccess(false); setTitle(""); setDesc(""); setSkills(""); setLocation(""); }}>
                Draft Another Quest
              </button>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => router.push("/guild-hall")}>
                Guild Hall Dashboard →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
