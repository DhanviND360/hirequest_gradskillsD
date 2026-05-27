"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import "../auth.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check user role and redirect
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Set role cookie for shared pages routing (Messages, Profile)
    let role = "candidate";
    let verificationStatus = "verified";

    if (user?.email && user.email.includes("recruiter")) {
      role = "recruiter";
    } else {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role, verification_status")
        .eq("id", user.id)
        .single();

      if (profile) {
        role = profile.role || "candidate";
        verificationStatus = profile.verification_status || "verified";
      }
    }

    document.cookie = `user-role=${role}; path=/;`;

    if (verificationStatus === "pending") {
      router.push("/verify");
    } else if (role === "recruiter") {
      router.push("/guild-hall");
    } else {
      router.push("/world-map");
    }
  };

  const handleGithubLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z" fill="#7c3aed" stroke="#a78bfa" strokeWidth="0.5" />
          </svg>
          Hire<span>Quest</span>
        </div>

        <h1 className="auth-title">Welcome Back, Adventurer</h1>
        <p className="auth-subtitle">Log in to continue your quest</p>

        {error && <div className="auth-error">{error}</div>}

        <button className="github-btn" onClick={handleGithubLogin} type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          Continue with GitHub
        </button>

        <div className="auth-divider">
          <span>or</span>
        </div>

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="adventurer@hirequest.io"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="Your secret passphrase"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "var(--space-sm)" }}
            disabled={loading}
            id="login-submit"
          >
            {loading ? "Entering the realm..." : "Enter the Realm"}
          </button>
        </form>

        <p className="auth-footer">
          New adventurer?{" "}
          <Link href="/signup">Create your character</Link>
        </p>
      </div>
    </div>
  );
}
