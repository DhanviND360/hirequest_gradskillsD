"use client";

import { useState } from "react";

export const CANDIDATES = [
  {
    id: "1",
    name: "Arjun Sharma",
    title: "Novice Explorer",
    level: 23,
    skills: ["React", "TypeScript", "Node.js", "CSS"],
    match: 92,
    avatar: "A",
    traits: "Clear speech, steady eyes, structured solutions.",
    videoAnalysis: {
      thumbnailColor: "linear-gradient(135deg, #7c3aed, #3b82f6)",
      duration: "1:00",
      transcript: "Hi, I'm Arjun Sharma, a passionate Full-Stack Developer with 3 years of experience building modern web applications. I specialize in React and Node.js ecosystems. At my previous role at TechVentures, I led the migration of a legacy jQuery app to a Next.js architecture, reducing page load times by 60%. I'm deeply motivated by challenging problems — the harder the quest, the more engaged I become. I believe my blend of frontend polish and backend robustness makes me a strong fit for any engineering team looking to ship fast without compromising quality. I'm excited to bring my skills to a team that values innovation and craftsmanship.",
      scores: {
        confidence: 88,
        communication: 91,
        enthusiasm: 85,
        grammar: 94,
        eye_contact: 82,
        posture: 79,
        professionalism: 90,
        overall: 87,
      },
      behaviorNotes: [
        "Maintains steady eye contact throughout",
        "Uses clear hand gestures to emphasize points",
        "Speaks at a measured, confident pace",
        "Minor fidgeting observed in last 15 seconds",
      ],
      improvements: [
        "Could improve body posture — slight slouching detected",
        "Add more specific metrics when describing achievements",
        "Consider a more dynamic opening hook",
      ],
    },
    resumeAnalysis: {
      fileName: "arjun_sharma_resume.pdf",
      title: "Full-Stack Developer",
      experienceYears: 3,
      summary: "Seasoned full-stack developer with strong React/Node.js expertise. Has led frontend migrations, built REST APIs, and contributed to open-source projects. Strong communicator with hackathon wins.",
      education: "B.Tech in Computer Science — IIIT Hyderabad (2021)",
      skills: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Next.js", "Docker", "AWS", "Git", "Tailwind CSS"],
      experience: [
        { role: "Frontend Developer", company: "TechVentures", duration: "2022 – Present", highlights: "Led Next.js migration, reduced load times 60%. Built component library used across 4 products." },
        { role: "Intern — Full Stack", company: "CodeCraft Labs", duration: "2021 – 2022", highlights: "Developed REST APIs in Express, integrated Stripe payments. Won internal hackathon." },
      ],
      certifications: ["AWS Cloud Practitioner", "Meta Frontend Developer Professional Certificate"],
      aiStrengthScore: 88,
    },
  },
  {
    id: "2",
    name: "Priya Patel",
    title: "Code Champion",
    level: 47,
    skills: ["React", "TypeScript", "GraphQL", "Next.js"],
    match: 96,
    avatar: "P",
    traits: "Exceptional pacing, fast syntax structuring, fluid layout designs.",
    videoAnalysis: {
      thumbnailColor: "linear-gradient(135deg, #ec4899, #8b5cf6)",
      duration: "0:58",
      transcript: "Hello! I'm Priya Patel, and I'm a frontend engineer who's obsessed with performance and pixel-perfect design. Over the past 5 years, I've shipped production apps used by millions — from e-commerce platforms to real-time collaboration tools. My superpower is turning complex Figma designs into buttery-smooth React components. At my current company, I architected our design system from scratch, which reduced UI inconsistencies by 90% and cut developer onboarding time in half. I'm a strong believer in accessibility-first development and have mentored junior developers on WCAG compliance. I'm looking for my next challenge — a role where I can lead frontend architecture and make products that genuinely delight users.",
      scores: {
        confidence: 95,
        communication: 97,
        enthusiasm: 93,
        grammar: 98,
        eye_contact: 91,
        posture: 88,
        professionalism: 96,
        overall: 94,
      },
      behaviorNotes: [
        "Exceptional verbal clarity and articulation",
        "Natural, engaging conversational tone",
        "Consistent eye contact with camera",
        "Professional background and lighting setup",
        "Uses storytelling to describe achievements",
      ],
      improvements: [
        "Video could benefit from slightly slower pacing in technical sections",
        "Consider adding a brief personal anecdote for relatability",
      ],
    },
    resumeAnalysis: {
      fileName: "priya_patel_resume.pdf",
      title: "Senior Frontend Engineer",
      experienceYears: 5,
      summary: "Elite frontend engineer with 5+ years building scalable, accessible UI systems. Architected design systems used across multi-product organizations. Strong mentor and technical leader.",
      education: "M.Sc. in Software Engineering — BITS Pilani (2019)",
      skills: ["React", "TypeScript", "GraphQL", "Next.js", "Figma", "Storybook", "Jest", "Cypress", "Accessibility (WCAG)", "Performance Optimization"],
      experience: [
        { role: "Senior Frontend Engineer", company: "DesignStack", duration: "2021 – Present", highlights: "Architected company-wide design system. Led team of 6 frontend devs. Reduced UI bugs by 90%." },
        { role: "Frontend Developer", company: "ShopEasy", duration: "2019 – 2021", highlights: "Built e-commerce storefront serving 2M+ monthly users. Improved Core Web Vitals scores to 95+." },
      ],
      certifications: ["Google UX Design Professional Certificate", "Certified Accessible Web Developer"],
      aiStrengthScore: 96,
    },
  },
  {
    id: "3",
    name: "Rahul Kumar",
    title: "Quest Specialist",
    level: 31,
    skills: ["Node.js", "Express", "PostgreSQL", "Docker"],
    match: 88,
    avatar: "R",
    traits: "Strong architectural logic, secure portal setups, clean SQL commands.",
    videoAnalysis: {
      thumbnailColor: "linear-gradient(135deg, #06b6d4, #22c55e)",
      duration: "1:00",
      transcript: "Hey there, I'm Rahul Kumar — a backend engineer who thinks in systems. I've spent the last 4 years designing and scaling microservices that handle millions of requests daily. My bread and butter is Node.js with PostgreSQL, but I'm equally comfortable with Docker and Kubernetes for deployment. At my last role, I redesigned our authentication system to use JWT with refresh token rotation, eliminating a class of security vulnerabilities. I also built a real-time notification pipeline using Redis Pub/Sub that reduced delivery latency from 3 seconds to under 200ms. What drives me is building robust, scalable backend systems that just work. I'm looking for a team that values engineering excellence.",
      scores: {
        confidence: 84,
        communication: 82,
        enthusiasm: 78,
        grammar: 90,
        eye_contact: 76,
        posture: 85,
        professionalism: 88,
        overall: 83,
      },
      behaviorNotes: [
        "Strong technical depth in explanations",
        "Calm and composed delivery",
        "Occasionally looks away from camera",
        "Good use of specific metrics and numbers",
      ],
      improvements: [
        "Improve eye contact — frequently looks at notes off-screen",
        "Add more energy and vocal variation to delivery",
        "Consider starting with a hook rather than direct intro",
      ],
    },
    resumeAnalysis: {
      fileName: "rahul_kumar_resume.pdf",
      title: "Backend Engineer",
      experienceYears: 4,
      summary: "Systems-oriented backend engineer specializing in high-throughput microservices. Strong in security, database optimization, and real-time data pipelines.",
      education: "B.Tech in Information Technology — NIT Warangal (2020)",
      skills: ["Node.js", "Express", "PostgreSQL", "Docker", "Kubernetes", "Redis", "RabbitMQ", "JWT/OAuth", "Nginx", "Grafana"],
      experience: [
        { role: "Backend Engineer", company: "ScaleForge", duration: "2021 – Present", highlights: "Redesigned auth system with JWT rotation. Built real-time notification pipeline handling 50K msgs/sec." },
        { role: "Junior Backend Developer", company: "DataPulse", duration: "2020 – 2021", highlights: "Built REST APIs for analytics dashboard. Optimized SQL queries reducing avg response time by 40%." },
      ],
      certifications: ["AWS Solutions Architect Associate", "Docker Certified Associate"],
      aiStrengthScore: 85,
    },
  },
  {
    id: "4",
    name: "Divya Naidu",
    title: "AI Alchemist",
    level: 29,
    skills: ["Python", "TensorFlow", "FastAPI", "Prompting"],
    match: 85,
    avatar: "D",
    traits: "Prompt engineering precision, fluid landmark configurations.",
    videoAnalysis: {
      thumbnailColor: "linear-gradient(135deg, #f59e0b, #ef4444)",
      duration: "0:55",
      transcript: "Hi! I'm Divya Naidu, an AI/ML engineer who loves turning cutting-edge research into production-ready solutions. I've spent 2 years working at the intersection of NLP and computer vision. My proudest project was building a real-time sentiment analysis pipeline that processes customer feedback across 12 languages using fine-tuned transformer models. At my current role, I designed a prompt engineering framework for our internal GPT integration that improved response accuracy by 35%. I'm also passionate about responsible AI — I've implemented bias detection workflows and model explainability dashboards. I'm looking for a role where I can push the boundaries of applied AI while keeping ethics front and center.",
      scores: {
        confidence: 82,
        communication: 86,
        enthusiasm: 92,
        grammar: 88,
        eye_contact: 80,
        posture: 77,
        professionalism: 84,
        overall: 84,
      },
      behaviorNotes: [
        "High enthusiasm visible through expressive delivery",
        "Passionate tone when discussing AI topics",
        "Good technical vocabulary usage",
        "Slightly rushed in the middle section",
      ],
      improvements: [
        "Slow down during technical explanations for clarity",
        "Improve posture — leaning forward too much",
        "Add pause beats between major points",
      ],
    },
    resumeAnalysis: {
      fileName: "divya_naidu_resume.pdf",
      title: "AI/ML Engineer",
      experienceYears: 2,
      summary: "Emerging AI/ML engineer with deep expertise in NLP, prompt engineering, and responsible AI practices. Strong in turning research papers into production systems.",
      education: "M.Tech in AI & Machine Learning — IIT Madras (2022)",
      skills: ["Python", "TensorFlow", "PyTorch", "FastAPI", "Hugging Face", "LangChain", "Prompt Engineering", "OpenAI API", "Gemini API", "MLflow"],
      experience: [
        { role: "ML Engineer", company: "NeuralWave AI", duration: "2022 – Present", highlights: "Built multi-language sentiment analysis pipeline. Designed prompt engineering framework improving accuracy 35%." },
        { role: "Research Intern", company: "IIT Madras AI Lab", duration: "2021 – 2022", highlights: "Published paper on bias detection in transformer models. Built model explainability dashboard." },
      ],
      certifications: ["DeepLearning.AI TensorFlow Developer", "Google Cloud ML Engineer"],
      aiStrengthScore: 82,
    },
  },
];

// Score color helper
export function getScoreColor(score) {
  if (score >= 90) return "var(--accent-green)";
  if (score >= 80) return "var(--accent-gold)";
  if (score >= 70) return "var(--accent-cyan)";
  return "var(--accent-red)";
}

// Modal overlay component
export function ModalOverlay({ onClose, children }) {
  return (
    <div
      className="scout-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="scout-modal-content animate-fade-in-up">
        <button className="scout-modal-close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}

// Video Telemetry Panel
export function VideoTelemetryPanel({ candidate, onClose }) {
  const { videoAnalysis: v } = candidate;
  const scoreEntries = Object.entries(v.scores).filter(([k]) => k !== "overall");

  return (
    <ModalOverlay onClose={onClose}>
      <div className="telemetry-header">
        <div className="telemetry-avatar" style={{ background: v.thumbnailColor }}>
          {candidate.avatar}
        </div>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>{candidate.name}</h2>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{candidate.title} • Level {candidate.level} • Duration: {v.duration}</span>
        </div>
        <div className="telemetry-overall-score" style={{ borderColor: getScoreColor(v.scores.overall) }}>
          <span className="telemetry-overall-num" style={{ color: getScoreColor(v.scores.overall) }}>{v.scores.overall}</span>
          <span className="telemetry-overall-label">Overall</span>
        </div>
      </div>

      {/* Video Placeholder */}
      <div className="telemetry-video-placeholder" style={{ background: v.thumbnailColor }}>
        <div className="telemetry-video-play">▶</div>
        <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", marginTop: "0.5rem" }}>🎬 1-Min Battle Cry Video Resume</span>
      </div>

      {/* Score Grid */}
      <h3 className="telemetry-section-title">📊 AI Behavioral Telemetry</h3>
      <div className="telemetry-scores-grid">
        {scoreEntries.map(([key, val]) => (
          <div className="telemetry-score-item" key={key}>
            <div className="telemetry-score-header">
              <span className="telemetry-score-name">{key.replace(/_/g, " ")}</span>
              <span className="telemetry-score-val" style={{ color: getScoreColor(val) }}>{val}</span>
            </div>
            <div className="telemetry-bar-bg">
              <div
                className="telemetry-bar-fill"
                style={{
                  width: `${val}%`,
                  background: `linear-gradient(90deg, ${getScoreColor(val)}, ${getScoreColor(val)}88)`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Behavior Notes */}
      <div className="telemetry-two-col">
        <div>
          <h3 className="telemetry-section-title">✅ Behavior Observations</h3>
          <ul className="telemetry-list positive">
            {v.behaviorNotes.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="telemetry-section-title">🔧 Areas for Improvement</h3>
          <ul className="telemetry-list improvement">
            {v.improvements.map((note, i) => (
              <li key={i}>{note}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Transcript */}
      <h3 className="telemetry-section-title">📝 AI-Generated Transcript</h3>
      <div className="telemetry-transcript">
        <p>"{v.transcript}"</p>
      </div>
    </ModalOverlay>
  );
}

// Resume Transcript Panel
export function ResumeTranscriptPanel({ candidate, onClose }) {
  const { resumeAnalysis: r } = candidate;

  return (
    <ModalOverlay onClose={onClose}>
      <div className="telemetry-header">
        <div className="telemetry-avatar" style={{ background: "linear-gradient(135deg, var(--accent-gold), var(--accent-green))" }}>
          📜
        </div>
        <div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>{candidate.name}</h2>
          <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{r.fileName} • AI Parsed Resume</span>
        </div>
        <div className="telemetry-overall-score" style={{ borderColor: getScoreColor(r.aiStrengthScore) }}>
          <span className="telemetry-overall-num" style={{ color: getScoreColor(r.aiStrengthScore) }}>{r.aiStrengthScore}</span>
          <span className="telemetry-overall-label">AI Fit</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="resume-quick-stats">
        <div className="resume-stat-chip">
          <span className="resume-stat-icon">🎯</span>
          <div>
            <span className="resume-stat-val">{r.title}</span>
            <span className="resume-stat-label">Detected Title</span>
          </div>
        </div>
        <div className="resume-stat-chip">
          <span className="resume-stat-icon">⏳</span>
          <div>
            <span className="resume-stat-val">{r.experienceYears} years</span>
            <span className="resume-stat-label">Experience</span>
          </div>
        </div>
        <div className="resume-stat-chip">
          <span className="resume-stat-icon">🎓</span>
          <div>
            <span className="resume-stat-val">{r.education}</span>
            <span className="resume-stat-label">Education</span>
          </div>
        </div>
      </div>

      {/* AI Summary */}
      <h3 className="telemetry-section-title">🤖 AI Summary</h3>
      <div className="telemetry-transcript" style={{ fontStyle: "normal" }}>
        <p>{r.summary}</p>
      </div>

      {/* Skills */}
      <h3 className="telemetry-section-title">⚔️ Detected Skills</h3>
      <div className="resume-skills-grid">
        {r.skills.map((skill) => (
          <span className="resume-skill-tag" key={skill}>{skill}</span>
        ))}
      </div>

      {/* Experience */}
      <h3 className="telemetry-section-title">🗡️ Experience Timeline</h3>
      <div className="resume-experience-list">
        {r.experience.map((exp, i) => (
          <div className="resume-experience-item" key={i}>
            <div className="resume-exp-header">
              <strong>{exp.role}</strong>
              <span className="resume-exp-company">@ {exp.company}</span>
              <span className="resume-exp-duration">{exp.duration}</span>
            </div>
            <p className="resume-exp-highlights">{exp.highlights}</p>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <h3 className="telemetry-section-title">🏅 Certifications</h3>
      <div className="resume-certs">
        {r.certifications.map((cert, i) => (
          <span className="resume-cert-badge" key={i}>✓ {cert}</span>
        ))}
      </div>
    </ModalOverlay>
  );
}
