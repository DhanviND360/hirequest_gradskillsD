"use client";

import React from "react";

// Gold star inside golden circle
export const GoldStarIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(245,158,11,0.4))" }}>
    <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="1.5" />
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="rgba(245,158,11,0.2)" />
  </svg>
);

// Neon green heart for HP (Motivation)
export const GreenHeartIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(34,197,94,0.4))" }}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill="rgba(34,197,94,0.15)" />
  </svg>
);

// Neon purple diamond crystal for Gems
export const PurpleGemIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(167,139,250,0.4))" }}>
    <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" fill="rgba(167,139,250,0.15)" />
    <line x1="12" y1="2" x2="12" y2="22" />
    <line x1="2" y1="8.5" x2="22" y2="8.5" />
    <line x1="2" y1="15.5" x2="22" y2="15.5" />
  </svg>
);

// Green circular target crosshair for quests
export const TargetQuestIcon = ({ size = 32 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 10px rgba(34,197,94,0.5))" }}>
    <circle cx="12" cy="12" r="10" fill="rgba(34,197,94,0.05)" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="1.5" fill="#22c55e" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
  </svg>
);

// Cyber red skull helmet for Boss Fight
export const RedSkullIcon = ({ size = 48 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 12px rgba(239,68,68,0.5))" }}>
    <path d="M12 2C6.48 2 2 6.48 2 12c0 2.21.72 4.25 1.93 5.92L12 22l8.07-4.08C21.28 16.25 22 14.21 22 12c0-5.52-4.48-10-10-10z" fill="rgba(239,68,68,0.08)" />
    <path d="M8 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    <path d="M12 11v3" strokeWidth="1.5" />
    <path d="M9 16c1.5 1.5 4.5 1.5 6 0" />
    <line x1="6" y1="14" x2="8" y2="15" />
    <line x1="18" y1="14" x2="16" y2="15" />
  </svg>
);

// Hexagon Outline Wrapper
const HexagonFrame = ({ children, color, size = 32 }) => (
  <div style={{
    width: size,
    height: size,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  }}>
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0, filter: `drop-shadow(0 0 6px ${color}50)` }}>
      <polygon points="50,5 93,30 93,80 50,95 7,80 7,30" fill="rgba(6, 6, 15, 0.6)" stroke={color} strokeWidth="6" />
    </svg>
    <div style={{ zIndex: 2, position: "relative", display: "flex" }}>{children}</div>
  </div>
);

// Job Opportunity Suitcase Icon inside Hexagon
export const SuitcaseIcon = ({ size = 32 }) => (
  <HexagonFrame color="#22c55e" size={size}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  </HexagonFrame>
);

// Main Quest Gold Shield Icon inside Hexagon
export const MainQuestIcon = ({ size = 32 }) => (
  <HexagonFrame color="#f59e0b" size={size}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  </HexagonFrame>
);

// Side Quest Purple Crown Icon inside Hexagon
export const SideQuestIcon = ({ size = 32 }) => (
  <HexagonFrame color="#7c3aed" size={size}>
    <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z" />
      <path d="M3 20h18" />
    </svg>
  </HexagonFrame>
);

// Guild Grey Castle Icon inside Hexagon
export const GuildIcon = ({ size = 32 }) => (
  <HexagonFrame color="#6b6b9a" size={size}>
    <svg width={size * 0.5} height={size * 0.5} viewBox="0 0 24 24" fill="none" stroke="#b4b4d1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 22v-9a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v9" />
      <path d="M6 10V4h2v3h4V4h2v3h4V4h2v6" />
      <path d="M10 22v-4a2 2 0 0 1 4 0v4" />
    </svg>
  </HexagonFrame>
);

// Location Pin Icon
export const LocationIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(6,182,212,0.4))" }}>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="rgba(6,182,212,0.15)" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

// Radar Active Icon
export const RadarIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(34,197,94,0.4))" }}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" fill="#22c55e" />
  </svg>
);

/* ============================================================
   Bottom Navigation Outlined Vector Icons
   ============================================================ */

export const WorldMapNavIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export const QuestLogNavIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

export const SkillsNavIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="3" />
    <circle cx="5" cy="19" r="3" />
    <circle cx="19" cy="19" r="3" />
    <path d="M5 16l5-8" />
    <path d="M19 16l-5-8" />
    <line x1="12" y1="8" x2="12" y2="16" />
  </svg>
);

export const InventoryNavIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

export const GuildNavIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export const ProfileNavIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const ScoutNavIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

export const MessageNavIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
