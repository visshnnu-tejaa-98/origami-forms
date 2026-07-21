import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "~/components/origami/icon";

export const metadata: Metadata = {
  title: "Origami · Reset password",
  description: "Send yourself a gentle reset link.",
};

export default function ForgotPage() {
  return (
    <div>
      <h2 className="auth-title">Forgot the fold?</h2>
      <p className="auth-sub">Drop your email — we&apos;ll send a reset link, gently.</p>

      <form className="form-stack" style={{ marginTop: 8 }}>
        <div className="o-field">
          <label className="o-field-label" htmlFor="email">Email</label>
          <input id="email" name="email" className="o-input" type="email" placeholder="you@studio.dev" autoComplete="email" />
        </div>

        <button className="o-btn o-btn--accent o-btn--lg o-btn--block" type="submit">
          <Icon name="mail" size={18} />
          Send reset link
        </button>
      </form>

      <div className="o-note o-note--sticky o-note--green" style={{ marginTop: 20, transform: "rotate(-1deg)", fontSize: "1.05rem" }}>
        ✶ Reset links live for 5 minutes — then they fold away.
      </div>

      <div className="auth-foot">
        Remembered it? <Link href="/sign-in">Back to sign in →</Link>
      </div>
    </div>
  );
}
