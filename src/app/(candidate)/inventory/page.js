"use client";

import { useState } from "react";
import "./inventory.css";

const INITIAL_INVENTORY = [
  {
    id: "resume",
    name: "Scroll of Resume",
    icon: "📜",
    rarity: "legendary",
    description: "A highly detailed manuscript summarizing your career quest, engineering abilities, and magical project builds. Essential for challenging major Recruiters.",
    stats: [
      { name: "Required Level", val: "1" },
      { name: "Recruiter Attention Bonus", val: "+25% Gaze Rate", isBonus: true },
      { name: "File Format", val: "PDF (Maximum 5MB)" },
      { name: "Equipped File", val: "arjun_sharma_resume_v4.pdf" }
    ]
  },
  {
    id: "react_cert",
    name: "Tome of React Mastery",
    icon: "📘",
    rarity: "epic",
    description: "An ancient spellbook containing advanced hooks, component lifecycles, and mystical state coordination circles. Proves frontend efficiency.",
    stats: [
      { name: "Attribute Power", val: "+15 Frontend Strength", isBonus: true },
      { name: "Issuer", val: "Meta Academic Guild" },
      { name: "Equipped File", val: "react_advanced_spec.pdf" }
    ]
  },
  {
    id: "node_cert",
    name: "Amulet of Node.js",
    icon: "📿",
    rarity: "rare",
    description: "A glowing gemstone charged with server streams, socket pings, and REST runic portals. Keeps back-ends fast and structured.",
    stats: [
      { name: "Attribute Power", val: "+10 Backend Intelligence", isBonus: true },
      { name: "Issuer", val: "OpenJS Foundation Guild" },
      { name: "Equipped File", val: "node_developer_credential.png" }
    ]
  },
  {
    id: "aws_cert",
    name: "Shield of AWS Cloud",
    icon: "🛡️",
    rarity: "rare",
    description: "An armored plate designed to sustain massive request strikes, balance server loads, and secure vital database vaults.",
    stats: [
      { name: "Attribute Power", val: "+12 DevOps Agility", isBonus: true },
      { name: "Issuer", val: "Amazon Cloud Guild" },
      { name: "Equipped File", val: "aws_solutions_arch.pdf" }
    ]
  }
];

export default function InventoryPage() {
  const [items, setItems] = useState(INITIAL_INVENTORY);
  const [selectedId, setSelectedId] = useState("resume");
  const [uploadedFileNames, setUploadedFileNames] = useState({});

  const selectedItem = items.find((item) => item.id === selectedId);

  const handleFileUpload = (e, itemId) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileNames((prev) => ({
        ...prev,
        [itemId]: file.name
      }));

      // Update item stats dynamically in local state
      setItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              stats: item.stats.map((stat) => {
                if (stat.name === "Equipped File") {
                  return { ...stat, val: file.name };
                }
                return stat;
              })
            };
          }
          return item;
        })
      );
    }
  };

  // Create 12 inventory slots (occupied or empty)
  const slots = Array.from({ length: 12 }, (_, i) => {
    return items[i] || { id: `empty-${i}`, name: "Empty Slot", icon: "➕", isEmpty: true };
  });

  return (
    <div className="inventory-page">
      {/* Left pane - RPG inventory grid */}
      <div className="inventory-main">
        <div className="inventory-grid-header">
          <h2 className="inventory-grid-title">🎒 Adventurer Bag</h2>
          <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Equipped: {items.length} / 12 items
          </span>
        </div>

        <div className="inventory-slots-grid">
          {slots.map((slot, index) => {
            const isOccupied = !slot.isEmpty;
            const isSelected = slot.id === selectedId;

            return (
              <div
                key={slot.id}
                className={`inventory-slot ${isOccupied ? "occupied" : ""} ${isSelected ? "selected" : ""}`}
                onClick={() => {
                  if (isOccupied) {
                    setSelectedId(slot.id);
                  }
                }}
              >
                {isOccupied && (
                  <span className={`inventory-slot-rarity ${slot.rarity}`} />
                )}
                <div className="inventory-item-icon">
                  {slot.icon}
                </div>
                <div className="inventory-item-name-sm">
                  {slot.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right pane - Selected Item stats & actions */}
      <div className="item-details-panel">
        {selectedItem ? (
          <>
            <div className="item-details-header">
              <div className="item-details-icon-large">
                {selectedItem.icon}
              </div>
              <h2 className="item-details-name">{selectedItem.name}</h2>
              <span className={`item-details-rarity-badge ${selectedItem.rarity}`}>
                {selectedItem.rarity}
              </span>
            </div>

            <div className="item-description-box">
              {selectedItem.description}
            </div>

            <div className="item-stats-list">
              {selectedItem.stats.map((stat, i) => (
                <div className="item-stat-row" key={i}>
                  <span className="item-stat-name">{stat.name}</span>
                  <span className={`item-stat-value ${stat.isBonus ? "bonus" : ""}`}>
                    {stat.val}
                  </span>
                </div>
              ))}
            </div>

            <div className="item-upload-area">
              <label 
                className="btn btn-primary" 
                style={{ display: "block", textAlign: "center", cursor: "pointer" }}
              >
                ⚙️ Re-equip (Upload File)
                <input
                  type="file"
                  onChange={(e) => handleFileUpload(e, selectedItem.id)}
                  style={{ display: "none" }}
                  accept=".pdf,.png,.jpg,.jpeg"
                />
              </label>
              <span className="item-file-info">
                Supported formats: PDF, PNG, JPG up to 5MB.
              </span>
            </div>
          </>
        ) : (
          <div className="inventory-empty-slot-msg">
            Select an equipped inventory item to inspect details and modify credentials.
          </div>
        )}
      </div>
    </div>
  );
}
