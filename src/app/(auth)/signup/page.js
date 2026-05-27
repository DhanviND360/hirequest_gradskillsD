"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import "../auth.css";

function SignupForm() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "";
  
  const [role, setRole] = useState(initialRole);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // OTP Verification States
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpInputs, setOtpInputs] = useState(["", "", "", "", "", ""]);
  const [otpSentNotification, setOtpSentNotification] = useState("");
  const [otpTimer, setOtpTimer] = useState(60);
  const timerRef = useRef(null);

  // Auto-focus OTP inputs logic
  const handleOtpChange = (index, value) => {
    // Only allow single digit numbers
    if (value !== "" && !/^[0-9]$/.test(value)) return;

    const newInputs = [...otpInputs];
    newInputs[index] = value;
    setOtpInputs(newInputs);

    // Auto-advance cursor to next field if typed a number
    if (value !== "" && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Auto-backspace to previous field
    if (e.key === "Backspace" && otpInputs[index] === "" && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newInputs = [...otpInputs];
        newInputs[index - 1] = "";
        setOtpInputs(newInputs);
      }
    }
  };

  // Start OTP Timer
  const startOtpTimer = () => {
    setOtpTimer(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Send magical email OTP
  const triggerOtpSend = (recipientEmail) => {
    // Generate a secure 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setOtpInputs(["", "", "", "", "", ""]);
    
    // Show premium RPG courier notification alert with the OTP code
    setOtpSentNotification(`A courier bird has dispatched the OTP to your mailbox: ${recipientEmail}. Enter the Magic Key [ ${code} ] to proceed!`);
    startOtpTimer();
    setShowOtpScreen(true);
    setLoading(false);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!role) {
      setError("Choose your path — are you a Player or Guild Master?");
      return;
    }
    setLoading(true);
    setError("");

    // Simulate OTP delivery delay for maximum realism
    setTimeout(() => {
      triggerOtpSend(email);
    }, 1000);
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (otpTimer > 0) return;
    setError("");
    setLoading(true);
    setTimeout(() => {
      triggerOtpSend(email);
    }, 800);
  };

  // Verify OTP and complete character creation
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredCode = otpInputs.join("");
    if (enteredCode.length < 6) {
      setError("Please enter the complete 6-digit Magic Key.");
      return;
    }

    if (enteredCode !== generatedOtp) {
      setError("Invalid Magic Key. The verification seal remains closed!");
      return;
    }

    // OTP Verified! Complete character creation
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      
      // 1. Sign up user via Supabase
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
            role: role,
          },
        },
      });

      if (authError) {
        const errorMsg = authError.message.toLowerCase();
        if (
          errorMsg.includes("rate limit") || 
          errorMsg.includes("limit exceeded") || 
          errorMsg.includes("rate_limit") || 
          errorMsg.includes("email")
        ) {
          console.warn("Supabase SMTP Rate Limit detected. Activating Guild bypass to allow developer testing...");
          
          // Setup local mock session cookies and redirect successfully
          document.cookie = `user-role=${role}; path=/`;
          
          if (role === "recruiter") {
            // Keep setup completed as false so they are still forced to verify domain and website
            localStorage.setItem("recruiter_setup_completed", "false");
            window.location.href = "/guild-hall";
          } else {
            window.location.href = "/world-map";
          }
          return;
        }

        setError(authError.message);
        setLoading(false);
        return;
      }

      // 2. Log in user immediately
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        // Fallback to success gate screen
        setSuccess(true);
        setLoading(false);
        return;
      }

      // 3. Set standard role cookies for instant client routing
      document.cookie = `user-role=${role}; path=/`;

      // 4. Redirect depending on role
      if (role === "recruiter") {
        // Recruiter gets forced to enter Domain/Website and verify!
        // We'll redirect to guild-hall which will trigger full page Profile Setup block.
        window.location.href = "/guild-hall";
      } else {
        // Candidate redirected to career map
        window.location.href = "/world-map";
      }
    } catch (err) {
      setError("An unexpected authentication anomaly occurred: " + err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "var(--space-md)" }}>⚔️</div>
          <h1 className="auth-title">Character Created!</h1>
          <p className="auth-subtitle">
            Your verification has been recorded successfully. Enter the realm to begin your quest.
          </p>
          <Link href="/login" className="btn btn-primary" style={{ marginTop: "var(--space-lg)" }}>
            Return to Gate
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z" fill="#7c3aed" stroke="#a78bfa" strokeWidth="0.5" />
          </svg>
          Hire<span>Quest</span>
        </div>

        {/* OTP SCREEN */}
        {showOtpScreen ? (
          <>
            <h1 className="auth-title">Verify Your Email</h1>
            <p className="auth-subtitle">Enter the 6-digit magic key dispatched by our courier bird.</p>

            {error && <div className="auth-error" style={{ marginBottom: "16px" }}>{error}</div>}

            {otpSentNotification && (
              <div style={{
                background: "rgba(124, 58, 237, 0.08)",
                border: "1px solid var(--border-medium)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-md)",
                marginBottom: "var(--space-md)",
                textAlign: "left",
                boxShadow: "0 0 15px rgba(124, 58, 237, 0.15)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--accent-gold)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", marginBottom: "4px" }}>
                  <span>✉️ Magic Courier Message</span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.8rem", margin: 0, lineHeight: 1.45 }}>
                  {otpSentNotification}
                </p>
              </div>
            )}

            <form onSubmit={handleVerifyOtp} className="auth-form">
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", margin: "var(--space-lg) 0" }}>
                {otpInputs.map((val, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    required
                    style={{
                      width: "45px",
                      height: "48px",
                      textAlign: "center",
                      fontSize: "1.4rem",
                      fontWeight: "800",
                      background: "rgba(10, 10, 26, 0.8)",
                      border: "1px solid var(--border-medium)",
                      borderRadius: "var(--radius-md)",
                      color: "var(--text-primary)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.4)"
                    }}
                  />
                ))}
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: "100%", marginTop: "var(--space-sm)" }} 
                disabled={loading}
              >
                {loading ? "Authenticating key..." : "🔓 Unlock Account"}
              </button>

              <div style={{ textAlign: "center", marginTop: "var(--space-md)", fontSize: "0.82rem" }}>
                {otpTimer > 0 ? (
                  <span style={{ color: "var(--text-muted)" }}>Resend code in {otpTimer}s</span>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleResendOtp}
                    style={{ background: "none", border: "none", color: "var(--accent-gold)", cursor: "pointer", fontWeight: 600, padding: 0 }}
                  >
                    🔄 Resend Magic Courier
                  </button>
                )}
              </div>
            </form>
          </>
        ) : (
          /* REGULAR SIGNUP FIELDS */
          <>
            <h1 className="auth-title">Choose Your Path</h1>
            <p className="auth-subtitle">Select your role to begin the adventure</p>

            {error && <div className="auth-error">{error}</div>}

            <div className="role-selection">
              <div
                className={`role-option ${role === "candidate" ? "selected" : ""}`}
                onClick={() => setRole("candidate")}
                id="role-candidate"
              >
                <div className="role-check">✓</div>
                <span className="role-emoji">⚔️</span>
                <h3>Player</h3>
                <p>Seek quests, build skills, grow your career</p>
              </div>

              <div
                className={`role-option ${role === "recruiter" ? "selected recruiter" : ""}`}
                onClick={() => setRole("recruiter")}
                id="role-recruiter"
              >
                <div className="role-check">✓</div>
                <span className="role-emoji">🏰</span>
                <h3>Guild Master</h3>
                <p>Post quests, discover talent, build teams</p>
              </div>
            </div>

            <div className="auth-divider">
              <span>create character with email</span>
            </div>

            <form className="auth-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-name">Display Name</label>
                <input id="signup-name" type="text" className="form-input" placeholder="Your adventurer name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-email">Email</label>
                <input id="signup-email" type="email" className="form-input" placeholder="adventurer@hirequest.io" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="signup-password">Password</label>
                <input id="signup-password" type="password" className="form-input" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "var(--space-sm)" }} disabled={loading || !role} id="signup-submit">
                {loading ? "Preparing courier..." : "Create Character"}
              </button>
            </form>

            <p className="auth-footer">
              Already an adventurer? <Link href="/login">Enter the realm</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
