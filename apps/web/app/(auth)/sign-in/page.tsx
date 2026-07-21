import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "~/components/origami/icon";
import { OAuthRow } from "../_components/oauth-row";

export const metadata: Metadata = {
    title: "Origami · Sign in",
    description: "Sign in to your Origami paper desk.",
};

export default function SignInPage() {
    return (
        <div>
            <h2 className="auth-title">Welcome back.</h2>
            <p className="auth-sub">Pick up where you left your pen.</p>

            <OAuthRow />

            <form className="form-stack">
                <div className="o-field">
                    <label className="o-field-label" htmlFor="email">Email</label>
                    <input id="email" name="email" className="o-input" type="email" placeholder="you@studio.dev" autoComplete="email" />
                </div>

                <div className="o-field">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <label className="o-field-label" htmlFor="password">Password</label>
                        <Link className="forgot-link" href="/forgot">forgot?</Link>
                    </div>
                    <input id="password" name="password" className="o-input" type="password" placeholder="at least 8 characters" autoComplete="current-password" />
                </div>

                <button className="o-btn o-btn--accent o-btn--lg o-btn--block" type="submit">
                    Sign in
                    <Icon name="arrow" size={18} />
                </button>
            </form>

            <div className="auth-foot">
                New here? <Link href="/sign-up">Fold your first form →</Link>
            </div>
        </div>
    );
}
