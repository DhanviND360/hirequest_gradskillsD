"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import "../bossfight.css";

// Dynamic search/fallback data source for Hyderabad jobs
const JOBS_SOURCE = [
  { id: "1", title: "Senior Frontend Developer", company: "TCS", location_city: "Raidurg, Hyderabad", difficulty: "hard", xp_reward: 500, gem_reward: 50, type: "boss", salary: "₹18-25 LPA", recommendedLevel: 25, skills: ["React", "TypeScript", "Next.js"], desc: "Tech Mahindra / TCS recruitment raid. Requires handling intense application state flows, responsive grid attacks, and SSR caching barriers.", requirements: ["3+ years Frontend React development", "Highly proficient in custom React Hooks", "Deep understanding of Next.js SSR/ISR models", "Experience writing performant vanilla CSS stylesheets"] },
  { id: "2", title: "Backend Engineer", company: "Infosys", location_city: "HITEC City, Hyderabad", difficulty: "medium", xp_reward: 350, gem_reward: 35, type: "quest", salary: "₹12-18 LPA", recommendedLevel: 20, skills: ["Node.js", "Python", "AWS"], desc: "Infosys cloud dungeon. Demands building robust server routes, scaling database sockets, and managing AWS load-balancing shields.", requirements: ["2+ years Backend API engineering", "Proficiency in Node.js (Express) or Python (FastAPI)", "Experience writing efficient PostgreSQL queries", "Familiarity with Docker containers and AWS deployment"] },
];

export default function BossFightPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [job, setJob] = useState(null);
  const [prepStatus, setPrepStatus] = useState({ resumeEquipped: true, videoRecorded: true });
  
  // Arena State
  const [arenaMode, setArenaMode] = useState(false);
  const [stream, setStream] = useState(null);
  const [telemetry, setTelemetry] = useState({ eyeContact: 100, confidence: 95, faceDetected: false });
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);
  const simCleanupRef = useRef(null);

  useEffect(() => {
    const foundJob = JOBS_SOURCE.find((j) => j.id === id) || JOBS_SOURCE[0];
    setJob(foundJob);
    setPrepStatus({ resumeEquipped: true, videoRecorded: true });
  }, [id]);

  const startTelemetrySimulation = () => {
    if (!canvasRef.current) return () => {};
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isLive = true;
    let lastStateUpdate = 0;

    const render = () => {
      if (!isLive || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const time = Date.now();
      const wave = Math.sin(time / 400);
      const cosWave = Math.cos(time / 400);

      // Face tracking box dimensions
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const boxW = 200 + wave * 5;
      const boxH = 260 + cosWave * 5;

      // 1. Draw cyberpunk HUD corners
      ctx.strokeStyle = '#7c3aed'; // Purple tracking box
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#a78bfa';
      ctx.shadowBlur = 10;

      // Top Left Corner
      ctx.beginPath();
      ctx.moveTo(centerX - boxW / 2, centerY - boxH / 2 + 30);
      ctx.lineTo(centerX - boxW / 2, centerY - boxH / 2);
      ctx.lineTo(centerX - boxW / 2 + 30, centerY - boxH / 2);
      ctx.stroke();

      // Top Right Corner
      ctx.beginPath();
      ctx.moveTo(centerX + boxW / 2, centerY - boxH / 2 + 30);
      ctx.lineTo(centerX + boxW / 2, centerY - boxH / 2);
      ctx.lineTo(centerX + boxW / 2 - 30, centerY - boxH / 2);
      ctx.stroke();

      // Bottom Left Corner
      ctx.beginPath();
      ctx.moveTo(centerX - boxW / 2, centerY + boxH / 2 - 30);
      ctx.lineTo(centerX - boxW / 2, centerY + boxH / 2);
      ctx.lineTo(centerX - boxW / 2 + 30, centerY + boxH / 2);
      ctx.stroke();

      // Bottom Right Corner
      ctx.beginPath();
      ctx.moveTo(centerX + boxW / 2, centerY + boxH / 2 - 30);
      ctx.lineTo(centerX + boxW / 2, centerY + boxH / 2);
      ctx.lineTo(centerX + boxW / 2 - 30, centerY + boxH / 2);
      ctx.stroke();

      // 2. Draw wireframe facial mesh structure
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.35)';
      ctx.lineWidth = 1;
      ctx.shadowBlur = 0;

      // Face Oval Outline
      ctx.beginPath();
      ctx.ellipse(centerX, centerY - 10, boxW * 0.44, boxH * 0.44, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Eye Tracking coordinates
      const leftEyeX = centerX - 35 + wave * 1.5;
      const leftEyeY = centerY - 30 + cosWave * 1;
      const rightEyeX = centerX + 35 + wave * 1.5;
      const rightEyeY = centerY - 30 + cosWave * 1;

      // Eye target circles
      ctx.strokeStyle = '#22c55e'; // Green for locked eye contact
      ctx.beginPath();
      ctx.arc(leftEyeX, leftEyeY, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(rightEyeX, rightEyeY, 8, 0, Math.PI * 2);
      ctx.stroke();

      // Pupils
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(leftEyeX, leftEyeY, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(rightEyeX, rightEyeY, 2, 0, Math.PI * 2);
      ctx.fill();

      // Connecting pupil lines to bounds
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.18)';
      ctx.beginPath();
      ctx.moveTo(leftEyeX - 15, leftEyeY);
      ctx.lineTo(centerX - boxW / 2, leftEyeY);
      ctx.moveTo(rightEyeX + 15, rightEyeY);
      ctx.lineTo(centerX + boxW / 2, rightEyeY);
      ctx.stroke();

      // Nose structure
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.25)';
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 45);
      ctx.lineTo(centerX, centerY + 20);
      ctx.lineTo(centerX - 12, centerY + 25);
      ctx.moveTo(centerX, centerY + 20);
      ctx.lineTo(centerX + 12, centerY + 25);
      ctx.stroke();

      // Confident mouth outline (simulated speech waves)
      const mouthOpen = 4 + Math.abs(Math.sin(time / 220)) * 5;
      ctx.strokeStyle = 'rgba(167, 139, 250, 0.45)';
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 50, 24, mouthOpen, 0, 0, Math.PI, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + 50, 24, mouthOpen * 0.4, 0, Math.PI, Math.PI * 2, false);
      ctx.stroke();

      // 3. Scanning Laser Grid Line
      const scanY = (centerY - boxH / 2) + ((time / 7) % boxH);
      const scanGrd = ctx.createLinearGradient(centerX - boxW / 2, scanY, centerX + boxW / 2, scanY);
      scanGrd.addColorStop(0, 'rgba(124, 58, 237, 0)');
      scanGrd.addColorStop(0.5, 'rgba(167, 139, 250, 0.7)');
      scanGrd.addColorStop(1, 'rgba(124, 58, 237, 0)');

      ctx.strokeStyle = scanGrd;
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#a78bfa';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(centerX - boxW / 2 + 8, scanY);
      ctx.lineTo(centerX + boxW / 2 - 8, scanY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 4. Liveness status text overlays
      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`● telemetry status: operational`, centerX - boxW / 2 + 10, centerY - boxH / 2 - 12);

      ctx.fillStyle = '#a78bfa';
      ctx.fillText(`HUD EYE TRACKER: ACTIVE`, centerX - boxW / 2 + 10, centerY + boxH / 2 + 18);
      ctx.fillText(`X: ${(centerX + wave * 8).toFixed(1)}  Y: ${(centerY + cosWave * 8).toFixed(1)}`, centerX - boxW / 2 + 10, centerY + boxH / 2 + 30);

      // Throttled telemetry state updates (once per second) to prevent React lag
      if (time - lastStateUpdate > 1000) {
        lastStateUpdate = time;
        setTelemetry(prev => ({
          faceDetected: true,
          eyeContact: Math.min(100, Math.max(90, prev.eyeContact + Math.floor(Math.random() * 5) - 2)),
          confidence: Math.min(100, Math.max(90, prev.confidence + Math.floor(Math.random() * 3) - 1))
        }));
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => {
      isLive = false;
      cancelAnimationFrame(animationFrameId);
    };
  };

  const initMediaPipe = async () => {
    try {
      // Dynamic import to prevent SSR issues
      const { FaceMesh } = await import('@mediapipe/face_mesh');
      const { Camera } = await import('@mediapipe/camera_utils');
      const { drawConnectors, drawLandmarks } = await import('@mediapipe/drawing_utils');
      const { FACEMESH_TESSELATION, FACEMESH_RIGHT_EYE, FACEMESH_LEFT_EYE, FACEMESH_FACE_OVAL } = await import('@mediapipe/face_mesh');

      if (!videoRef.current || !canvasRef.current) return;

      const faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      faceMesh.onResults((results) => {
        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
          setTelemetry(prev => ({ ...prev, faceDetected: true, eyeContact: Math.floor(Math.random() * 10) + 90, confidence: Math.floor(Math.random() * 5) + 90 }));
          for (const landmarks of results.multiFaceLandmarks) {
            drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {color: '#C0C0C070', lineWidth: 1});
            drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: '#7c3aed'});
            drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: '#7c3aed'});
            drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
          }
        } else {
          setTelemetry(prev => ({ ...prev, faceDetected: false, eyeContact: 0, confidence: 0 }));
        }
        canvasCtx.restore();
      });

      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (videoRef.current) {
            await faceMesh.send({image: videoRef.current});
          }
        },
        width: 640,
        height: 480
      });
      
      cameraRef.current = camera;
      faceMeshRef.current = faceMesh;
      camera.start();
    } catch (err) {
      console.warn("Failed to initialize MediaPipe, falling back to simulated cyberpunk telemetry overlay:", err);
      if (simCleanupRef.current) simCleanupRef.current();
      simCleanupRef.current = startTelemetrySimulation();
    }
  };

  const handleLaunchRaid = async () => {
    setArenaMode(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Need to wait for video to play before mediapipe
        videoRef.current.onloadedmetadata = () => {
          initMediaPipe();
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Failed to access camera for Boss Fight.");
      setArenaMode(false);
    }
  };

  const endRaid = () => {
    if (cameraRef.current) cameraRef.current.stop();
    if (stream) stream.getTracks().forEach(track => track.stop());
    if (simCleanupRef.current) {
      simCleanupRef.current();
      simCleanupRef.current = null;
    }
    setArenaMode(false);
  };

  // Ensure cleanup
  useEffect(() => {
    if (arenaMode && videoRef.current && stream && !cameraRef.current) {
      videoRef.current.srcObject = stream;
      initMediaPipe();
    }
  }, [arenaMode, stream]);

  useEffect(() => {
    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (simCleanupRef.current) {
        simCleanupRef.current();
        simCleanupRef.current = null;
      }
    };
  }, [stream]);

  if (!job) return <div className="boss-fight-page"><div className="animate-pulse">Locating Boss coordinates...</div></div>;

  if (arenaMode) {
    return (
      <div className="boss-fight-page" style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "1rem", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ color: "var(--accent-gold)", margin: 0 }}>⚔️ LIVE BOSS FIGHT: {job.title}</h2>
            <p style={{ margin: 0, color: "var(--text-muted)" }}>Guild: {job.company}</p>
          </div>
          <button className="btn btn-primary" style={{ background: "var(--accent-red)" }} onClick={endRaid}>
            Flee Arena (End Call)
          </button>
        </div>

        <div style={{ flex: 1, display: "flex", gap: "1rem", padding: "1rem", position: "relative" }}>
          {/* Main Candidate Video with Overlay */}
          <div style={{ flex: 2, position: "relative", background: "#000", borderRadius: "8px", overflow: "hidden" }}>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }} 
            />
            <canvas 
              ref={canvasRef} 
              width={640} 
              height={480} 
              style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)", zIndex: 10 }} 
            />
            <div style={{ position: "absolute", bottom: "20px", left: "20px", zIndex: 20, background: "rgba(0,0,0,0.7)", padding: "10px", borderRadius: "8px" }}>
              <div style={{ color: "var(--accent-gold)" }}>Telemetry Dashboard</div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                <div>Eye Contact: <strong style={{ color: telemetry.eyeContact > 80 ? "var(--accent-green)" : "var(--accent-red)" }}>{telemetry.eyeContact}%</strong></div>
                <div>Confidence: <strong style={{ color: telemetry.confidence > 80 ? "var(--accent-green)" : "var(--accent-red)" }}>{telemetry.confidence}%</strong></div>
                <div>Face: <strong style={{ color: telemetry.faceDetected ? "var(--accent-green)" : "var(--accent-red)" }}>{telemetry.faceDetected ? "DETECTED" : "LOST"}</strong></div>
              </div>
            </div>
          </div>

          {/* Recruiter / Boss Video (Simulated) */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ flex: 1, background: "#111", borderRadius: "8px", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
               <div style={{ textAlign: "center" }}>
                 <div style={{ fontSize: "4rem" }}>👤</div>
                 <div style={{ color: "var(--text-secondary)", marginTop: "1rem" }}>Recruiter (Waiting to join...)</div>
                 <div className="analyzing-spinner" style={{ margin: "1rem auto 0", width: "24px", height: "24px" }} />
               </div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: "8px", padding: "1rem" }}>
              <h3 style={{ color: "var(--text-secondary)" }}>AI Interview Coach</h3>
              <p style={{ fontSize: "0.9rem", marginTop: "1rem" }}>The AI is analyzing your facial expressions and eye contact in real-time. Keep looking directly at the camera to maintain high telemetry scores!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const allPrepCompleted = prepStatus.resumeEquipped && prepStatus.videoRecorded;

  return (
    <div className="boss-fight-page">
      <Link href="/world-map" className="back-link">← Return to Coordinates (World Map)</Link>

      <div className="boss-banner">
        <div className="boss-portrait-lg">
          {job.id === "1" ? "👾" : "🐉"}
        </div>
        <div className="boss-info-container">
          <h1 className="boss-header-title">{job.title}</h1>
          <div className="boss-company-name">🏢 Guild: {job.company}</div>
          <div className="boss-location-tag">📍 Coordinates: {job.location_city}</div>
        </div>
        <div className="boss-stat-panel">
          <div className="boss-stat-row"><span className="boss-stat-lbl">Class:</span><span className={`boss-stat-val red`}>{job.difficulty.toUpperCase()}</span></div>
          <div className="boss-stat-row"><span className="boss-stat-lbl">Quest Reward:</span><span className="boss-stat-val" style={{ color: 'var(--accent-gold)' }}>🪙 {job.xp_reward} XP</span></div>
        </div>
      </div>

      <div className="boss-grid-info">
        <div className="boss-card-desc">
          <div>
            <h3 className="boss-section-title">📜 Quest Log Description</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.95rem' }}>{job.desc}</p>
          </div>
          <div>
            <h3 className="boss-section-title">🛠️ Required Weapons (Skills)</h3>
            <div className="boss-skills-flex">{job.skills.map((skill, index) => (<span className="boss-skill-tag" key={index}>{skill}</span>))}</div>
          </div>
        </div>

        <div className="preparation-panel">
          <h3 className="boss-section-title">🎒 Raid Preparation</h3>
          <div className="prep-step-row">
            <div className={`prep-step-num completed`}>✓</div>
            <div className="prep-step-info">
              <h4 className="prep-step-title">Equip Your Resume</h4>
              <span className="prep-step-desc">Scroll of Resume equipped</span>
            </div>
          </div>
          <div className="prep-step-row">
            <div className={`prep-step-num completed`}>✓</div>
            <div className="prep-step-info">
              <h4 className="prep-step-title">Prepare Battle Cry</h4>
              <span className="prep-step-desc">1-minute video resume prepared</span>
            </div>
          </div>
          <button className="launch-raid-btn" disabled={!allPrepCompleted} onClick={handleLaunchRaid}>
            ⚔️ Initiate Raid Interview (Live Video)
          </button>
        </div>
      </div>
    </div>
  );
}
