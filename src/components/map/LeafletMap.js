"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Component to dynamically pan and zoom the Leaflet map when user location or active job changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom, { animate: true, duration: 1.0 });
    }
  }, [center, zoom, map]);
  return null;
}

// Custom pulsing divIcon creators for extreme visual excellence and Turbopack compatibility
const createCustomIcon = (type) => {
  const color = type === 'boss' ? '#ef4444' : type === 'side-quest' ? '#a78bfa' : '#22c55e';
  const html = `
    <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
      <span style="position: absolute; display: inline-flex; height: 100%; width: 100%; border-radius: 9999px; background-color: ${color}; opacity: 0.4; animation: leaflet-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <div style="position: relative; width: 12px; height: 12px; border-radius: 9999px; background-color: ${color}; border: 1.5px solid #fff; box-shadow: 0 0 8px ${color};"></div>
    </div>
  `;
  return L.divIcon({
    html: html,
    className: 'custom-leaflet-pin',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
};

const createUserIcon = () => {
  const html = `
    <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
      <span style="position: absolute; display: inline-flex; height: 100%; width: 100%; border-radius: 9999px; background-color: #06b6d4; opacity: 0.55; animation: leaflet-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <div style="position: relative; width: 14px; height: 14px; border-radius: 9999px; background-color: #06b6d4; border: 2px solid #fff; box-shadow: 0 0 12px #06b6d4;"></div>
    </div>
  `;
  return L.divIcon({
    html: html,
    className: 'user-leaflet-pin',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

export default function LeafletMap({ userLocation, jobs, onJobSelect, activeJob }) {
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // Fallback center
  const [zoomLevel, setZoomLevel] = useState(12);

  // Sync center with userLocation or activeJob
  useEffect(() => {
    if (activeJob && activeJob.lat && activeJob.lng) {
      setMapCenter([activeJob.lat, activeJob.lng]);
      setZoomLevel(13); // Zoom in closer on selected job
    } else if (userLocation && userLocation.lat && userLocation.lng) {
      setMapCenter([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation, activeJob]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative", borderRadius: "var(--radius-lg)", overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
      {/* Global CSS injection for pulsing animation */}
      <style>{`
        @keyframes leaflet-ping {
          0% { transform: scale(0.6); opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .leaflet-container {
          background: #03030b !important;
          width: 100%;
          height: 100%;
        }
        .leaflet-bar a {
          background-color: rgba(13, 13, 35, 0.85) !important;
          border: 1px solid var(--border-subtle) !important;
          color: var(--text-primary) !important;
          backdrop-filter: blur(10px);
        }
        .leaflet-bar a:hover {
          background-color: var(--accent-purple) !important;
          color: white !important;
        }
        .leaflet-popup-content-wrapper {
          background: rgba(13, 13, 43, 0.95) !important;
          backdrop-filter: blur(16px) !important;
          border: 1.5px solid var(--border-subtle) !important;
          border-radius: var(--radius-md) !important;
          color: var(--text-primary) !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.6) !important;
        }
        .leaflet-popup-tip {
          background: rgba(13, 13, 43, 0.95) !important;
          border: 1.5px solid var(--border-subtle) !important;
        }
      `}</style>

      {/* Spatial coordinate display */}
      <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 1000, background: "rgba(6,6,15,0.8)", backdropFilter: "blur(12px)", border: "1px solid var(--border-subtle)", padding: "10px 16px", borderRadius: "var(--radius-md)", pointerEvents: "none" }}>
        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: 700 }}>Map Array Status</div>
        <div style={{ fontSize: "0.8rem", color: "#22c55e", fontWeight: "bold", fontFamily: "monospace", marginTop: "2px" }}>
          SAT_LINK: ONLINE // PULL_GEOPOSITION: GEOLOCATED
        </div>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={zoomLevel}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
      >
        <ChangeView center={mapCenter} zoom={zoomLevel} />
        
        {/* Beautiful, cinematic Dark Matter TileLayer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* User Geolocated Position Marker */}
        {userLocation && userLocation.lat && userLocation.lng && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserIcon()}>
            <Popup>
              <div style={{ textAlign: "center", padding: "4px" }}>
                <strong style={{ color: "#06b6d4", fontSize: "0.85rem" }}>🛡️ You Are Here</strong>
                <p style={{ fontSize: "0.75rem", margin: "4px 0 0 0", color: "var(--text-secondary)" }}>
                  Coordinates: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Dynamic coordinate markers for job list */}
        {jobs.map((job) => {
          if (!job.lat || !job.lng) return null;
          return (
            <Marker 
              key={job.id} 
              position={[job.lat, job.lng]} 
              icon={createCustomIcon(job.type)}
              eventHandlers={{
                click: () => {
                  if (onJobSelect) onJobSelect(job);
                }
              }}
            >
              <Popup>
                <div style={{ minWidth: "150px", padding: "2px" }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: "bold", color: job.type === 'boss' ? '#ef4444' : job.type === 'side-quest' ? '#a78bfa' : '#22c55e', textTransform: "uppercase" }}>
                    {job.type === "boss" ? "⚔️ Boss Fight Raid" : job.type === "side-quest" ? "📜 Side Quest" : "🏰 Quest"}
                  </span>
                  <h4 style={{ fontSize: "0.9rem", margin: "2px 0 0 0", fontWeight: 700, color: "var(--text-primary)" }}>{job.title}</h4>
                  <p style={{ fontSize: "0.75rem", margin: "1px 0", color: "var(--text-secondary)" }}>🏢 {job.company_name}</p>
                  <p style={{ fontSize: "0.75rem", margin: "1px 0", color: "var(--text-muted)" }}>📍 {job.location}</p>
                  <strong style={{ fontSize: "0.75rem", color: "var(--accent-gold)" }}>🪙 {job.xp_reward} XP Reward</strong>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
