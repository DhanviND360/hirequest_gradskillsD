"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import "./arena.css";

// ============================================================
// Live Interview Arena — Video Call + Telemetry + Chat
// ============================================================

// Simulated real-time telemetry data that updates over time
const TELEMETRY_PRESETS = {
  confidence: [82, 85, 88, 84, 87, 90, 88, 92, 89, 91, 93, 90],
  communication: [78, 80, 83, 86, 84, 88, 90, 87, 91, 89, 92, 90],
  enthusiasm: [75, 78, 82, 80, 85, 83, 87, 89, 86, 90, 88, 91],
  eye_contact: [70, 74, 78, 76, 80, 82, 79, 84, 81, 85, 83, 86],
  body_language: [72, 76, 79, 82, 80, 84, 86, 83, 88, 85, 87, 89],
  technical_depth: [0, 0, 65, 70, 75, 78, 80, 82, 85, 83, 87, 88],
};

const AI_INSIGHTS_TIMELINE = [
  { time: 5, text: "🎯 Candidate has made direct eye contact. Confidence baseline established." },
  { time: 12, text: "📊 Speech cadence is steady at 142 WPM. Good articulation detected." },
  { time: 20, text: "💡 Technical keyword density increasing — discussing system design patterns." },
  { time: 30, text: "⚡ Enthusiasm spike detected when discussing past project experience." },
  { time: 40, text: "🔍 Body language shift: leaning forward — indicates high engagement." },
  { time: 50, text: "🧠 Strong use of STAR method in behavioral response. Communication score boosted." },
  { time: 60, text: "📈 Overall trajectory: improving. Candidate warming up well." },
  { time: 75, text: "🎓 Technical depth increasing — referencing specific algorithms and tradeoffs." },
  { time: 90, text: "✅ Confidence peak reached. Candidate appears comfortable with topic." },
  { time: 105, text: "📝 Grammar and vocabulary: professional level. No filler words detected." },
  { time: 120, text: "🏆 Session analysis: strong candidate performance. Recommend advancement." },
];

const INITIAL_CHAT = [
  { id: 1, sender: "system", text: "⚔️ Arena session initiated. Good luck, adventurers!", time: "0:00" },
  { id: 2, sender: "candidate", name: "Candidate", text: "Hello! Thank you for the opportunity. I'm excited to discuss this role.", time: "0:05" },
];

function getScoreColor(score) {
  if (score >= 90) return "#22c55e";
  if (score >= 80) return "#f59e0b";
  if (score >= 70) return "#06b6d4";
  if (score >= 60) return "#a78bfa";
  return "#6b6b9a";
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ArenaSession({ candidate, onClose }) {
  // Video
  const [stream, setStream] = useState(null);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const videoRef = useRef(null);

  // Timer
  const [elapsed, setElapsed] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const timerRef = useRef(null);

  // Telemetry
  const [telemetryIndex, setTelemetryIndex] = useState(0);
  const [scores, setScores] = useState({
    confidence: 0,
    communication: 0,
    enthusiasm: 0,
    eye_contact: 0,
    body_language: 0,
    technical_depth: 0,
  });

  // AI Insights
  const [insights, setInsights] = useState([]);

  // Chat
  const [messages, setMessages] = useState(INITIAL_CHAT);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  // Sidebar tab
  const [sidebarTab, setSidebarTab] = useState("telemetry"); // telemetry | chat | insights

  // Start camera
  useEffect(() => {
    let mounted = true;
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });
        if (mounted) {
          setStream(mediaStream);
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    };
    initCamera();
    return () => {
      mounted = false;
    };
  }, []);

  // Attach stream to video
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stream]);

  // Timer
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  // Update telemetry scores every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetryIndex((prev) => {
        const next = Math.min(prev + 1, 11);
        // Update scores
        const newScores = {};
        for (const key of Object.keys(TELEMETRY_PRESETS)) {
          newScores[key] = TELEMETRY_PRESETS[key][next] || 0;
        }
        setScores(newScores);
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // AI Insights timeline
  useEffect(() => {
    const matched = AI_INSIGHTS_TIMELINE.filter((i) => i.time <= elapsed);
    if (matched.length > insights.length) {
      setInsights(matched);
    }
  }, [elapsed, insights.length]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Simulate candidate chat responses
  useEffect(() => {
    const responses = [
      { at: 15, text: "I've been working with React for about 3 years now, primarily building data-heavy dashboards." },
      { at: 35, text: "Yes, I'm very comfortable with TypeScript. I use it in all my projects." },
      { at: 55, text: "My approach to system design starts with understanding the data flow and identifying bottlenecks." },
      { at: 80, text: "That's a great question! I once optimized a query that reduced response time from 3s to 200ms." },
      { at: 100, text: "I'd love to learn more about your team's tech stack and engineering culture!" },
    ];
    const matched = responses.filter((r) => r.at <= elapsed);
    const newMsgs = matched.filter(
      (r) => !messages.some((m) => m.text === r.text)
    );
    if (newMsgs.length > 0) {
      setMessages((prev) => [
        ...prev,
        ...newMsgs.map((r, i) => ({
          id: prev.length + i + 1,
          sender: "candidate",
          name: candidate.name,
          text: r.text,
          time: formatTime(r.at),
        })),
      ]);
    }
  }, [elapsed, candidate.name, messages]);

  const handleSendChat = useCallback(
    (e) => {
      e.preventDefault();
      if (!chatInput.trim()) return;
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "recruiter",
          name: "You",
          text: chatInput.trim(),
          time: formatTime(elapsed),
        },
      ]);
      setChatInput("");
    },
    [chatInput, elapsed]
  );

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
      setCameraOn(!cameraOn);
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
      setMicOn(!micOn);
    }
  };

  const handleEndCall = () => {
    stream?.getTracks().forEach((t) => t.stop());
    setIsActive(false);
    onClose();
  };

  // Calculate overall score
  const scoreValues = Object.values(scores).filter((v) => v > 0);
  const overallScore = scoreValues.length
    ? Math.round(scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length)
    : 0;

  return (
    <div className="arena-overlay">
      <div className="arena-container">
        {/* ---- TOP BAR WITH CONTROLS ---- */}
        <div className="arena-topbar">
          <div className="arena-topbar-left">
            <span className="arena-rec-dot" />
            <span className="arena-topbar-title">
              ⚔️ Interview with <strong>{candidate.name}</strong>
            </span>
            <span className="arena-badge-class">{candidate.class}</span>
          </div>

          {/* Controls — centered in top bar */}
          <div className="arena-controls">
            <button
              className={`arena-ctrl-btn ${!micOn ? "off" : ""}`}
              onClick={toggleMic}
              title={micOn ? "Mute" : "Unmute"}
            >
              {micOn ? "🎙️" : "🔇"}
            </button>
            <button
              className={`arena-ctrl-btn ${!cameraOn ? "off" : ""}`}
              onClick={toggleCamera}
              title={cameraOn ? "Turn off camera" : "Turn on camera"}
            >
              {cameraOn ? "📹" : "📷"}
            </button>
            <button
              className={`arena-ctrl-btn ${isRecording ? "recording" : ""}`}
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? "Stop recording" : "Start recording"}
            >
              {isRecording ? "⏹️" : "⏺️"}
            </button>
            <button
              className="arena-ctrl-btn screen-share"
              title="Share screen"
            >
              🖥️
            </button>
            <button className="arena-ctrl-btn end-call" onClick={handleEndCall}>
              📞 End
            </button>
          </div>

          <div className="arena-topbar-right">
            <span className="arena-timer">
              {isRecording && <span className="arena-rec-indicator">● REC</span>}
              ⏱️ {formatTime(elapsed)}
            </span>
            <div className="arena-overall-ring" style={{ borderColor: getScoreColor(overallScore) }}>
              <span style={{ color: getScoreColor(overallScore) }}>{overallScore}</span>
            </div>
          </div>
        </div>

        {/* ---- MAIN CONTENT ---- */}
        <div className="arena-main">
          {/* Video Grid */}
          <div className="arena-video-section">
            <div className="arena-video-grid">
              {/* Recruiter (local) feed */}
              <div className="arena-video-card">
                <div className="arena-video-label">🏰 You (Guild Master)</div>
                {cameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="arena-video-feed"
                    style={{ transform: "scaleX(-1)" }}
                  />
                ) : (
                  <div className="arena-video-off">
                    <span>📷</span>
                    <p>Camera Off</p>
                  </div>
                )}
              </div>

              {/* Candidate (remote simulated) feed */}
              <div className="arena-video-card">
                <div className="arena-video-label">⚔️ {candidate.name}</div>
                <div className="arena-candidate-feed">
                  <div className="arena-candidate-avatar-ring">
                    <div className="arena-candidate-avatar">
                      {candidate.name[0]}
                    </div>
                  </div>
                  <p className="arena-candidate-name">{candidate.name}</p>
                  <span className="arena-candidate-status">
                    <span className="arena-pulse-dot" /> Connected • Speaking
                  </span>
                  {/* Simulated audio wave */}
                  <div className="arena-audio-wave">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="arena-wave-bar"
                        style={{
                          animationDelay: `${i * 0.08}s`,
                          height: `${12 + Math.random() * 20}px`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ---- SIDEBAR ---- */}
          <div className="arena-sidebar">
            <div className="arena-sidebar-tabs">
              <button
                className={`arena-tab ${sidebarTab === "telemetry" ? "active" : ""}`}
                onClick={() => setSidebarTab("telemetry")}
              >
                📊 Telemetry
              </button>
              <button
                className={`arena-tab ${sidebarTab === "chat" ? "active" : ""}`}
                onClick={() => setSidebarTab("chat")}
              >
                💬 Chat
              </button>
              <button
                className={`arena-tab ${sidebarTab === "insights" ? "active" : ""}`}
                onClick={() => setSidebarTab("insights")}
              >
                🤖 AI
              </button>
            </div>

            {/* Telemetry Panel */}
            {sidebarTab === "telemetry" && (
              <div className="arena-panel">
                <h4 className="arena-panel-title">Live Behavioral Telemetry</h4>
                <div className="arena-telemetry-list">
                  {Object.entries(scores).map(([key, val]) => (
                    <div className="arena-tele-item" key={key}>
                      <div className="arena-tele-header">
                        <span className="arena-tele-name">
                          {key.replace(/_/g, " ")}
                        </span>
                        <span
                          className="arena-tele-val"
                          style={{ color: getScoreColor(val) }}
                        >
                          {val > 0 ? val : "—"}
                        </span>
                      </div>
                      <div className="arena-tele-bar-bg">
                        <div
                          className="arena-tele-bar-fill"
                          style={{
                            width: `${val}%`,
                            background: getScoreColor(val),
                            transition: "width 1.5s cubic-bezier(0.22, 1, 0.36, 1)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="arena-tele-summary">
                  <div className="arena-tele-overall">
                    <span className="arena-tele-overall-label">Overall Score</span>
                    <span
                      className="arena-tele-overall-val"
                      style={{ color: getScoreColor(overallScore) }}
                    >
                      {overallScore > 0 ? overallScore : "Analyzing..."}
                    </span>
                  </div>
                  <div className="arena-tele-status">
                    {telemetryIndex < 3
                      ? "🔄 Calibrating sensors..."
                      : telemetryIndex < 7
                      ? "📡 Tracking behavioral patterns..."
                      : "✅ Full telemetry lock acquired"}
                  </div>
                </div>
              </div>
            )}

            {/* Chat Panel */}
            {sidebarTab === "chat" && (
              <div className="arena-panel arena-chat-panel">
                <div className="arena-chat-messages">
                  {messages.map((msg) => (
                    <div
                      className={`arena-chat-msg ${msg.sender}`}
                      key={msg.id}
                    >
                      {msg.sender === "system" ? (
                        <div className="arena-chat-system">{msg.text}</div>
                      ) : (
                        <>
                          <div className="arena-chat-meta">
                            <strong>{msg.name || msg.sender}</strong>
                            <span>{msg.time}</span>
                          </div>
                          <p>{msg.text}</p>
                        </>
                      )}
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <form className="arena-chat-input" onSubmit={handleSendChat}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                  />
                  <button type="submit">➤</button>
                </form>
              </div>
            )}

            {/* AI Insights Panel */}
            {sidebarTab === "insights" && (
              <div className="arena-panel">
                <h4 className="arena-panel-title">🤖 Live AI Insights</h4>
                <div className="arena-insights-list">
                  {insights.length === 0 && (
                    <div className="arena-insight-empty">
                      <div className="arena-insight-spinner" />
                      <p>AI is warming up... insights will appear as the interview progresses.</p>
                    </div>
                  )}
                  {insights.map((insight, i) => (
                    <div
                      className="arena-insight-item"
                      key={i}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <span className="arena-insight-time">
                        {formatTime(insight.time)}
                      </span>
                      <span className="arena-insight-text">{insight.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
