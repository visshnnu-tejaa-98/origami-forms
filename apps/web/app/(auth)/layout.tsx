import "./auth.css";
import Link from "next/link";
import { Crane, Plane, Sakura, Leaf, Pen, Clip } from "~/components/origami/deco";
import { AuthTabs } from "./_components/auth-tabs";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-shell">
      {/* ---------- LEFT: the desk ---------- */}
      <aside className="auth-desk">
        <Link className="auth-brand" href="/">
          <span className="mark">
            <Crane size={34} />
          </span>
          <span>origami</span>
        </Link>

        <div className="deco-floats">
          <span className="crane"><Crane size={100} /></span>
          <span className="plane"><Plane size={62} /></span>
          <span className="sakura1"><Sakura size={36} /></span>
          <span className="sakura2"><Sakura size={28} /></span>
          <span className="leaf"><Leaf size={40} /></span>
          <span className="pen"><Pen size={120} /></span>
        </div>

        <div className="desk-cards">
          <div className="dc dc1">
            <div className="lbl">today</div>
            <div className="ttl">218 responses</div>
            <div className="sub">+42 since you slept</div>
            <div className="o-progress" style={{ marginTop: 10 }}>
              <div className="bar" style={{ "--p": "72%" } as React.CSSProperties} />
            </div>
          </div>

          <div className="dc dc2">
            <span className="o-tape o-tape--pink o-tape--right" />
            <div className="ttl">remember</div>
            <div style={{ fontFamily: "var(--font-hand)", fontSize: "1rem", color: "var(--ink-2)", marginTop: 4, lineHeight: 1.2 }}>
              send sakura
              <br />
              thank-you cards
            </div>
          </div>

          <div className="dc dc3">
            <div className="lbl">latest answer</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}>
              <span className="o-avatar o-avatar--sm" style={{ background: "var(--matcha-soft)", color: "var(--matcha-deep)" }}>
                a
              </span>
              <div style={{ fontSize: "0.86rem", color: "var(--ink-1)" }}>
                aiko · <span style={{ color: "var(--ink-3)" }}>&ldquo;summer waves&rdquo;</span>
              </div>
            </div>
            <div className="sub" style={{ marginTop: 6 }}>2 minutes ago · field 03</div>
          </div>
        </div>

        <div className="desk-quote">
          <span className="o-badge o-badge--matcha" style={{ marginBottom: 14 }}>welcome back ✶</span>
          <h2>Your paper desk has been waiting.</h2>
          <p>3 drafts, 2 forms live, 42 fresh responses since Tuesday. Sign in and we&apos;ll fold the rest.</p>
        </div>
      </aside>

      {/* ---------- RIGHT: the form card ---------- */}
      <section className="auth-form-side">
        <div className="auth-card">
          <span className="clip-pin">
            <Clip size={34} />
          </span>
          <AuthTabs />
          {children}
        </div>
      </section>
    </main>
  );
}
