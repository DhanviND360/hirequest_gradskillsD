"use client";

import { useState } from "react";
import "./messages.css";

const INITIAL_CONVERSATIONS = [
  {
    id: "tcs",
    partyName: "TCS Recruiters Guild",
    avatar: "T",
    online: true,
    lastMsgTime: "10m ago",
    unread: true,
    lastMsg: "Your video resume 'Battle Cry' score looks epic! We'd like to schedule an interview.",
    messages: [
      { sender: "recruiter", text: "Hello Arjun, we reviewed your video resume 'Battle Cry' and your profile details.", time: "10:15 AM" },
      { sender: "recruiter", text: "Your communication score of 88/100 and overall rating look very strong. We would love to schedule a Boss Fight interview round with you in the Arena.", time: "10:17 AM" },
      { sender: "candidate", text: "Thank you! That sounds exciting. I'm ready to take on the challenge.", time: "10:20 AM" },
      { sender: "recruiter", text: "Great! Let us know your availability for a 30-minute Arena session this week so we can coordinate.", time: "10:22 AM" }
    ]
  },
  {
    id: "google",
    partyName: "Google Guild Master",
    avatar: "G",
    online: true,
    lastMsgTime: "2h ago",
    unread: false,
    lastMsg: "Keep leveling up your skills! We are keeping an eye on your development tree.",
    messages: [
      { sender: "recruiter", text: "Hey Arjun! We noticed your Frontend strength is at 92/100. That's highly impressive.", time: "Yesterday" },
      { sender: "candidate", text: "Thanks, Guild Master! I've been mastering Next.js and state coordination circles.", time: "Yesterday" },
      { sender: "recruiter", text: "Excellent. Keep leveling up your skills! We are keeping an eye on your development tree for upcoming Senior openings.", time: "Yesterday" }
    ]
  },
  {
    id: "phonepe",
    partyName: "PhonePe Quest Giver",
    avatar: "P",
    online: false,
    lastMsgTime: "1d ago",
    unread: false,
    lastMsg: "Your application for iOS developer quest is successfully registered.",
    messages: [
      { sender: "recruiter", text: "Greeting Adventurer. Your application for the iOS Developer quest has been received.", time: "2 days ago" },
      { sender: "candidate", text: "Perfect. Let me know if you need any additional scrolls or certificates from my bag.", time: "2 days ago" },
      { sender: "recruiter", text: "Your application for iOS developer quest is successfully registered. We will notify you if your skills match the target requirements.", time: "Yesterday" }
    ]
  }
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState("tcs");
  const [inputText, setInputText] = useState("");

  const activeConv = conversations.find((c) => c.id === activeId);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newMessage = {
      sender: "candidate",
      text: inputText,
      time: timeString
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            lastMsg: inputText,
            lastMsgTime: "Just now",
            unread: false,
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    setInputText("");
  };

  const handleSelectConversation = (id) => {
    setActiveId(id);
    // Mark as read
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: false } : c))
    );
  };

  return (
    <div className="messages-page">
      {/* Left Sidebar - Conversation list */}
      <div className="parties-sidebar">
        <div className="sidebar-header-chat">
          <span>💬</span> Party Chat
        </div>
        <div className="parties-list">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`party-item ${conv.id === activeId ? "active" : ""}`}
              onClick={() => handleSelectConversation(conv.id)}
            >
              {conv.unread && <span className="unread-badge-chat" />}
              <div className="party-avatar">
                {conv.avatar}
                {conv.online && <span className="online-dot-sm" />}
              </div>
              <div className="party-info">
                <div className="party-name-row">
                  <span className="party-name">{conv.partyName}</span>
                  <span className="party-time">{conv.lastMsgTime}</span>
                </div>
                <div className="party-last-message">{conv.lastMsg}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - Chat bubble stream */}
      <div className="chat-console">
        {activeConv ? (
          <>
            <div className="chat-console-header">
              <div className="chat-console-party-details">
                <div className="party-avatar">
                  {activeConv.avatar}
                  {activeConv.online && <span className="online-dot-sm" />}
                </div>
                <div>
                  <div className="chat-console-party-name">{activeConv.partyName}</div>
                  <div className="chat-console-party-status">
                    {activeConv.online ? (
                      <>
                        <span className="radar-dot" style={{ position: 'static', width: '8px', height: '8px', background: 'var(--accent-green)' }} />
                        Active in Party
                      </>
                    ) : (
                      <span style={{ color: "var(--text-muted)" }}>Offline</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="chat-messages-container">
              {activeConv.messages.map((msg, i) => {
                const isCandidate = msg.sender === "candidate";
                return (
                  <div
                    key={i}
                    className={`message-bubble ${isCandidate ? "outgoing" : "incoming"}`}
                  >
                    <span className="message-meta-chat">
                      {isCandidate ? "You" : activeConv.partyName} • {msg.time}
                    </span>
                    <div className="message-text-bubble">
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form className="chat-input-bar" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type your message scroll..."
                className="chat-input-field"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Send 🏹
              </button>
            </form>
          </>
        ) : (
          <div className="inventory-empty-slot-msg" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            Select an active Recruiter Party to open chat logs.
          </div>
        )}
      </div>
    </div>
  );
}
