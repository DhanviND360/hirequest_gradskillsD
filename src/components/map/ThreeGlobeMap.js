"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, OrbitControls, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Helper to translate GPS Lat/Lng to 3D Sphere coordinates
function getCoords(lat, lng, radius = 1.6) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

// 3D Radar Wave circle around the user location on the globe surface
function UserRadarSweep({ position }) {
  const meshRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      // Create a radar scale pulse effect
      const scale = 1 + (t % 2) * 1.5;
      meshRef.current.scale.set(scale, scale, scale);
      meshRef.current.material.opacity = 0.6 * (1 - (t % 2) / 2);
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.02, 0.12, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// 3D Pin Component
function GlobePin({ job, onSelect, userLocation }) {
  const pinPosition = useMemo(() => getCoords(job.lat, job.lng), [job.lat, job.lng]);
  const [hovered, setHovered] = useState(false);

  // Pin colors based on job type
  const color = job.type === "boss" 
    ? "#ef4444" // red for main boss
    : job.type === "side-quest"
    ? "#a78bfa" // purple for side quest
    : "#22c55e"; // green for job opportunity

  return (
    <group 
      position={pinPosition}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => { e.stopPropagation(); onSelect(job); }}
    >
      {/* Pulse circle around selected/hovered pin */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </mesh>
      )}

      {/* Main interactive 3D pin sphere */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>

      {/* Glowing pin marker halo */}
      <mesh scale={[1.5, 1.5, 1.5]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

// Complete 3D Globe Mesh with Grid Lines & Floating Stars
function GlobeModel({ jobs, onJobSelect, userLocation }) {
  const globeRef = useRef();
  const pointsRef = useRef();

  // Create starfield coordinates
  const starPositions = useMemo(() => {
    const arr = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      const radius = 3.5 + Math.random() * 2;
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, []);

  // Compute user position
  const userPos = useMemo(() => getCoords(userLocation.lat, userLocation.lng), [userLocation]);

  useFrame(() => {
    if (globeRef.current) {
      // Smooth automatic rotation
      globeRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={globeRef}>
      {/* Outer Starfield */}
      <Points positions={starPositions} stride={3}>
        <PointMaterial transparent color="#a78bfa" size={0.02} sizeAttenuation opacity={0.4} depthWrite={false} />
      </Points>

      {/* Main globe sphere body */}
      <Sphere args={[1.58, 64, 64]}>
        <meshPhongMaterial 
          color="#040412" 
          transparent 
          opacity={0.95} 
          emissive="#060620" 
          emissiveIntensity={0.3}
          shininess={5} 
        />
      </Sphere>

      {/* Futuristic neon latitude/longitude grid wireframe overlay */}
      <Sphere args={[1.59, 36, 36]}>
        <meshBasicMaterial 
          color="#22c55e" 
          wireframe 
          transparent 
          opacity={0.08} 
        />
      </Sphere>

      {/* Atmosphere outer glow */}
      <Sphere args={[1.7, 32, 32]}>
        <meshBasicMaterial 
          color="#22c55e" 
          transparent 
          opacity={0.02} 
          side={THREE.BackSide} 
        />
      </Sphere>

      {/* User Location Radar sweeping wave */}
      <UserRadarSweep position={userPos} />

      {/* User Location Marker (Cyan Pin) */}
      <group position={userPos}>
        <mesh>
          <sphereGeometry args={[0.045, 16, 16]} />
          <meshBasicMaterial color="#06b6d4" />
        </mesh>
      </group>

      {/* Job Opportunity Coordinate Pins plotted globally */}
      {jobs.map((job) => (
        <GlobePin 
          key={job.id} 
          job={job} 
          onSelect={onJobSelect} 
          userLocation={userLocation} 
        />
      ))}
    </group>
  );
}

export default function ThreeGlobeMap({ userLocation, jobs, onJobSelect }) {
  const [activeJob, setActiveJob] = useState(null);

  const handleSelectJob = (job) => {
    setActiveJob(job);
    if (onJobSelect) onJobSelect(job);
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", background: "radial-gradient(circle at center, #0a0a20 0%, #03030b 100%)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border-subtle)", overflow: "hidden" }}>
      
      {/* Floating coordinates indicator */}
      <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 10, background: "rgba(6,6,15,0.75)", backdropFilter: "blur(12px)", border: "1px solid var(--border-subtle)", padding: "10px 16px", borderRadius: "var(--radius-md)", pointerEvents: "none" }}>
        <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Spatial Coordinate Array</div>
        <div style={{ fontSize: "0.85rem", color: "#22c55e", fontWeight: "bold", fontFamily: "monospace", marginTop: "2px" }}>
          SYS_PING: ACTIVE // ZOOM: 3.5X
        </div>
      </div>

      {/* Three.js Canvas */}
      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} color="#c4b5fd" />
        <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#06b6d4" />
        <pointLight position={[0, 2, 4]} intensity={0.6} color="#22c55e" />

        <GlobeModel jobs={jobs} onJobSelect={handleSelectJob} userLocation={userLocation} />
        
        <OrbitControls 
          enableDamping 
          dampingFactor={0.05} 
          minDistance={2.5} 
          maxDistance={6.0} 
          enablePan={false}
        />
      </Canvas>

      {/* Glassmorphism Job Detail Modal Overlay - Displays exactly matching the legendary cards */}
      {activeJob && (
        <div className="animate-fade-in" style={{
          position: "absolute",
          bottom: "16px",
          left: "16px",
          right: "16px",
          background: "rgba(13,13,43,0.85)",
          backdropFilter: "blur(20px)",
          border: "1.5px solid var(--border-subtle)",
          borderRadius: "var(--radius-lg)",
          padding: "16px",
          zIndex: 20,
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <span style={{ 
                fontSize: "0.65rem", 
                fontWeight: "bold", 
                letterSpacing: "1px", 
                color: activeJob.type === 'boss' ? '#ef4444' : activeJob.type === 'side-quest' ? '#a78bfa' : '#22c55e',
                textTransform: "uppercase"
              }}>
                {activeJob.type === "boss" ? "⚔️ Boss Fight Raid" : activeJob.type === "side-quest" ? "📜 Side Quest Opportunity" : "🏰 Job Opportunity Quest"}
              </span>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-primary)", marginTop: "2px" }}>
                {activeJob.title}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "1px" }}>
                🏢 Guild: {activeJob.company} • 📍 Coordinates: {activeJob.location_city}
              </p>
            </div>
            <button 
              onClick={() => setActiveJob(null)}
              style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1rem" }}
            >
              ✕
            </button>
          </div>

          {/* Stats Bar */}
          <div style={{ display: "flex", gap: "16px", fontSize: "0.8rem", background: "rgba(0,0,0,0.2)", padding: "8px 12px", borderRadius: "var(--radius-sm)" }}>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Difficulty: </span>
              <strong style={{ color: activeJob.difficulty === 'hard' || activeJob.difficulty === 'very_hard' ? '#ef4444' : '#22c55e' }}>
                {activeJob.difficulty.toUpperCase()}
              </strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Match: </span>
              <strong style={{ color: "#06b6d4" }}>{activeJob.match}% Match</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Reward: </span>
              <strong style={{ color: "#f59e0b" }}>🪙 {activeJob.xp_reward} XP</strong>
            </div>
          </div>

          {/* Action Trigger */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-purple-light)" }}>
              {activeJob.salary}
            </span>
            <Link 
              href={`/boss-fight/${activeJob.id}`} 
              style={{
                background: "linear-gradient(135deg, var(--accent-purple), #6d28d9)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "var(--radius-sm)",
                fontWeight: "bold",
                fontSize: "0.8rem",
                textDecoration: "none",
                boxShadow: "0 4px 12px rgba(124,58,237,0.3)"
              }}
            >
              ⚔️ Prepare for Raid
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
