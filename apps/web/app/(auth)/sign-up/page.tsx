import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "~/components/origami/icon";
import { OAuthRow } from "../_components/oauth-row";

export const metadata: Metadata = {
    title: "Origami · Create account",
    description: "Start folding — three forms free, no card needed.",
};

export default function SignUpPage() {
    return (
        <div>
            <h2 className="auth-title">Start folding.</h2>
            <p className="auth-sub">Three forms free, no card needed.</p>

            <OAuthRow />

            <form className="form-stack">
                <div className="o-field">
                    <label className="o-field-label" htmlFor="name">Name</label>
                    <input id="name" name="name" className="o-input" placeholder="Aiko Tanaka" autoComplete="name" />
                </div>

                <div className="o-field">
                    <label className="o-field-label" htmlFor="email">Email</label>
                    <input id="email" name="email" className="o-input" type="email" placeholder="you@studio.dev" autoComplete="email" />
                </div>

                <div className="o-field">
                    <label className="o-field-label" htmlFor="password">Choose a password</label>
                    <input id="password" name="password" className="o-input" type="password" placeholder="at least 8 characters" autoComplete="new-password" />
                    <div className="o-field-help">
                        Eight characters, folded tight. Something only you can unfold.
                    </div>
                </div>

                <label className="o-check">
                    <input type="checkbox" name="newsletter" defaultChecked />
                    <span className="box" /> I&apos;d like the gentle monthly notebook.
                </label>

                <button className="o-btn o-btn--accent o-btn--lg o-btn--block" type="submit">
                    <Icon name="sparkles" size={18} />
                    Create account
                </button>
            </form>

            <div className="auth-foot">
                By signing up you agree to our <Link href="/terms">terms</Link> &amp; <Link href="/privacy">privacy</Link>.
            </div>
        </div>
    );
}
