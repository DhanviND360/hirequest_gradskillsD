"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import "../auth.css";

export default function VerifyPage() {
  const [step, setStep] = useState(1); // 1: ID upload, 2: Selfie, 3: Review
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [selfieBlob, setSelfieBlob] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const router = useRouter();

  // Handle ID document upload
  const handleIdUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setIdPreview(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  // Stream is now bound via callback ref on the video element
  useEffect(() => {
    return () => {
      // Clean up when unmounting or camera becomes inactive
      if (!cameraActive && streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [cameraActive]);

  // Start camera for selfie
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
      });
      streamRef.current = stream;
      setCameraActive(true);
    } catch {
      setError("Camera access denied. Please allow camera access for verification.");
    }
  };

  // Capture selfie
  const captureSelfie = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, 640, 480);
    canvas.toBlob((blob) => {
      setSelfieBlob(blob);
      setSelfiePreview(URL.createObjectURL(blob));
      // Stop camera
      streamRef.current?.getTracks().forEach((t) => t.stop());
      setCameraActive(false);
    }, "image/jpeg", 0.9);
  }, []);

  // Submit verification
  const handleSubmit = async () => {
    if (!idFile || !selfieBlob) {
      setError("Both ID document and selfie are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Session expired. Please log in again.");
        return;
      }

      // Upload ID document
      const idExt = idFile.name.split(".").pop();
      const idPath = `${user.id}/id-document.${idExt}`;
      const { error: idError } = await supabase.storage
        .from("id-documents")
        .upload(idPath, idFile, { upsert: true });

      if (idError) {
        setError("Failed to upload ID document. " + idError.message);
        setLoading(false);
        return;
      }

      // Upload selfie
      const selfiePath = `${user.id}/selfie.jpg`;
      const { error: selfieError } = await supabase.storage
        .from("selfies")
        .upload(selfiePath, selfieBlob, {
          contentType: "image/jpeg",
          upsert: true,
        });

      if (selfieError) {
        setError("Failed to upload selfie. " + selfieError.message);
        setLoading(false);
        return;
      }

      // Get public URLs
      const { data: idUrlData } = supabase.storage
        .from("id-documents")
        .getPublicUrl(idPath);
      const { data: selfieUrlData } = supabase.storage
        .from("selfies")
        .getPublicUrl(selfiePath);

      // Update profile with verification docs
      await supabase
        .from("profiles")
        .update({
          id_document_url: idUrlData.publicUrl,
          selfie_url: selfieUrlData.publicUrl,
          verification_status: "in_review",
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      setSubmitted(true);
    } catch (err) {
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Skip verification (for demo)
  const handleSkip = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "recruiter") {
        router.push("/guild-hall");
      } else {
        router.push("/world-map");
      }
    }
  };

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "var(--space-md)" }}>🛡️</div>
          <h1 className="auth-title">Verification Submitted!</h1>
          <p className="auth-subtitle">
            Your identity documents are being reviewed. You&apos;ll receive a verification badge once approved.
          </p>
          <div className="verify-status pending" style={{ justifyContent: "center", margin: "var(--space-lg) 0" }}>
            ⏳ Status: In Review
          </div>
          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={() => {
              const supabase = createClient();
              supabase.auth.getUser().then(({ data: { user } }) => {
                supabase.from("profiles").select("role").eq("id", user?.id).single().then(({ data }) => {
                  router.push(data?.role === "recruiter" ? "/guild-hall" : "/world-map");
                });
              });
            }}
          >
            Continue to Quest →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: "520px" }}>
        <div className="auth-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 2L16.5 11.5L26 14L16.5 16.5L14 26L11.5 16.5L2 14L11.5 11.5L14 2Z" fill="#7c3aed" stroke="#a78bfa" strokeWidth="0.5" />
          </svg>
          Hire<span>Quest</span>
        </div>

        <h1 className="auth-title">Identity Verification</h1>
        <p className="auth-subtitle">
          Verify your identity to earn the{" "}
          <span style={{ color: "var(--accent-green)" }}>✓ Verified</span> badge
        </p>

        {error && <div className="auth-error">{error}</div>}

        <div className="verify-steps">
          {/* Step 1: ID Upload */}
          <div className={`verify-step ${idFile ? "completed" : ""}`}>
            <h3>
              {idFile ? "✅" : "1️⃣"} Upload Government ID
            </h3>
            <p>
              Aadhaar card, PAN card, passport, or driver&apos;s license.
            </p>
            {idPreview ? (
              <div style={{ position: "relative" }}>
                <img
                  src={idPreview}
                  alt="ID Preview"
                  style={{
                    width: "100%",
                    maxHeight: "150px",
                    objectFit: "contain",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                  }}
                />
                <button
                  className="btn btn-sm btn-ghost"
                  style={{ marginTop: "var(--space-sm)" }}
                  onClick={() => {
                    setIdFile(null);
                    setIdPreview(null);
                  }}
                >
                  Re-upload
                </button>
              </div>
            ) : (
              <label className="upload-zone" htmlFor="id-upload">
                <div className="upload-icon">📄</div>
                <p className="upload-text">
                  <strong>Click to upload</strong> or drag & drop
                  <br />
                  PNG, JPG, PDF up to 5MB
                </p>
                <input
                  id="id-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleIdUpload}
                  style={{ display: "none" }}
                />
              </label>
            )}
          </div>

          {/* Step 2: Selfie */}
          <div className={`verify-step ${selfieBlob ? "completed" : ""}`}>
            <h3>
              {selfieBlob ? "✅" : "2️⃣"} Take a Selfie
            </h3>
            <p>
              We&apos;ll match your selfie with your ID for verification.
            </p>
            {selfiePreview ? (
              <div style={{ textAlign: "center" }}>
                <div className="selfie-preview">
                  <img src={selfiePreview} alt="Selfie" />
                </div>
                <button
                  className="btn btn-sm btn-ghost"
                  style={{ marginTop: "var(--space-sm)" }}
                  onClick={() => {
                    setSelfieBlob(null);
                    setSelfiePreview(null);
                  }}
                >
                  Retake
                </button>
              </div>
            ) : cameraActive ? (
              <div style={{ textAlign: "center" }}>
                <div className="selfie-preview" style={{ width: "200px", height: "200px" }}>
                  <video 
                    ref={(el) => {
                      videoRef.current = el;
                      if (el && streamRef.current) {
                        el.srcObject = streamRef.current;
                        el.play().catch(() => {});
                      }
                    }} 
                    autoPlay playsInline muted style={{ transform: "scaleX(-1)" }} 
                  />
                </div>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginTop: "var(--space-md)" }}
                  onClick={captureSelfie}
                >
                  📸 Capture
                </button>
              </div>
            ) : (
              <button
                className="btn btn-ghost"
                style={{ width: "100%" }}
                onClick={startCamera}
              >
                📷 Open Camera
              </button>
            )}
          </div>
        </div>

        {/* Submit */}
        <div style={{ marginTop: "var(--space-xl)", display: "flex", flexDirection: "column", gap: "var(--space-sm)" }}>
          <button
            className="btn btn-primary"
            style={{ width: "100%" }}
            onClick={handleSubmit}
            disabled={loading || !idFile || !selfieBlob}
          >
            {loading ? "Submitting..." : "🛡️ Submit for Verification"}
          </button>
          <button
            className="btn btn-ghost btn-sm"
            style={{ width: "100%", opacity: 0.7 }}
            onClick={handleSkip}
          >
            Skip for now →
          </button>
        </div>
      </div>
    </div>
  );
}
