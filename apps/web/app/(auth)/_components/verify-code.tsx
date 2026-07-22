"use client";

import { useState, type FormEvent } from "react";
import { Icon } from "~/components/origami/icon";
import { OtpInput } from "./otp-input";
const CODE_LENGTH = 6;

interface VerifyCodeProps {
  /** Address the code was sent to — shown back to the user. */
  email?: string;
  code: string;
  setCode: (code: string) => void;
  /** Return to the credentials form. */
  onBack: () => void;
  /** Submit the code. Throw / reject to surface an error. */
  onVerify: (code: string) => Promise<void>;
  /** Re-send the email code. */
  onResend: () => Promise<void> | void;
}

export function VerifyCode({ email, code, setCode, onBack, onVerify, onResend }: VerifyCodeProps) {
  const [status, setStatus] = useState<"idle" | "verifying" | "resending">("idle");
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState(false);

  const isVerifying = status === "verifying";
  const canSubmit = code.length === CODE_LENGTH && !isVerifying;

  const handleResendOtp = () => {
    setResent(true);
    onResend();
  };

  const handleOnSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!canSubmit) return;
    setStatus("verifying");
    setError(null);

    try {
      await onVerify(code);
    } catch (err) {
      setError("Verification failed at DOM boundary:");
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div>
      <h2 className="auth-title">Check your inbox.</h2>
      <p className="auth-sub">
        We folded a six-digit code and sent it
        {email ? (
          <>
            {" "}
            to <strong style={{ color: "var(--ink-1)" }}>{email}</strong>.
          </>
        ) : (
          " to your email."
        )}
      </p>

      <form className="form-stack" onSubmit={handleOnSubmit}>
        <div className={`o-field${error ? " has-error" : ""}`}>
          <label className="o-field-label" htmlFor="otp-code">
            Verification code
          </label>

          <OtpInput
            value={code}
            onChange={(next) => {
              setCode(next);
              if (error) setError(null);
              if (resent) setResent(false);
            }}
            length={CODE_LENGTH}
            disabled={isVerifying}
            invalid={Boolean(error)}
            autoFocus
          />

          {error ? (
            <div className="o-field-error" role="alert">
              <Icon name="alertCircle" size={14} /> {error}
            </div>
          ) : (
            <div className="o-field-help">Paste the whole code — it&apos;ll fill itself in.</div>
          )}
        </div>

        <button
          className="o-btn o-btn--accent o-btn--lg o-btn--block"
          type="submit"
          disabled={!canSubmit}
        >
          {isVerifying ? (
            <>
              <span className="o-spinner" /> Verifying…
            </>
          ) : (
            <>
              Verify code
              <Icon name="arrow" size={18} />
            </>
          )}
        </button>
      </form>

      {resent ? (
        <div
          className="o-note o-note--sticky o-note--green"
          style={{ marginTop: 18, transform: "rotate(-1deg)", fontSize: "1.05rem" }}
        >
          ✶ A fresh code is on its way.
        </div>
      ) : null}

      <div className="verify-actions">
        <button
          type="button"
          className="verify-link"
          onClick={handleResendOtp}
          disabled={status !== "idle"}
        >
          <Icon name="refresh" size={14} />
          {status === "resending" ? "Sending…" : "Resend verification code"}
        </button>
        <button type="button" className="verify-link verify-link--muted" onClick={onBack}>
          <Icon name="arrowLeftShort" size={14} />
          Back to sign in
        </button>
      </div>
    </div>
  );
}
