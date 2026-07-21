"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Icon } from "~/components/origami/icon";
import { OAuthRow } from "./oauth-row";
import { VerifyCode } from "./verify-code";

export function SignInFlow() {
  const [isVerificationPending, setIsVerificationPending] = useState(false);
  const [email, setEmail] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setEmail(String(data.get("email") ?? ""));

    setIsSendingCode(true);
    try {
      // TODO: kick off the email-code sign-in (e.g. signIn.emailCode.sendCode()).
      setIsVerificationPending(true);
    } finally {
      setIsSendingCode(false);
    }
  };

  if (isVerificationPending) {
    return (
      <VerifyCode
        email={email}
        onBack={() => setIsVerificationPending(false)}
        onVerify={async () => {
          // TODO: verify the code and redirect into the studio.
        }}
        onResend={async () => {
          // TODO: re-send the email code.
        }}
      />
    );
  }

  return (
    <div>
      <h2 className="auth-title">Welcome back.</h2>
      <p className="auth-sub">Pick up where you left your pen.</p>

      <OAuthRow />

      <form className="form-stack" onSubmit={handleSignIn}>
        <div className="o-field">
          <label className="o-field-label" htmlFor="email">Email</label>
          <input id="email" name="email" className="o-input" type="email" placeholder="you@studio.dev" autoComplete="email" required />
        </div>

        <div className="o-field">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label className="o-field-label" htmlFor="password">Password</label>
            <Link className="forgot-link" href="/forgot">forgot?</Link>
          </div>
          <input id="password" name="password" className="o-input" type="password" placeholder="at least 8 characters" autoComplete="current-password" required />
        </div>

        <button className="o-btn o-btn--accent o-btn--lg o-btn--block" type="submit" disabled={isSendingCode}>
          {isSendingCode ? (
            <>
              <span className="o-spinner" /> Sending code…
            </>
          ) : (
            <>
              Sign in
              <Icon name="arrow" size={18} />
            </>
          )}
        </button>
      </form>

      <div className="auth-foot">
        New here? <Link href="/sign-up">Fold your first form →</Link>
      </div>
    </div>
  );
}
