import "./landing.css";
import Link from "next/link";
import { Icon, type IconName } from "~/components/origami/icon";
import { Crane, Plane, Pencil, Clip, Sakura, ScribbleArrow } from "~/components/origami/deco";
import Navbar from "../components/Navbar";
import Logo from "../components/Logo";

const features: { tint: string; icon: IconName; title: string; body: string }[] = [
  {
    tint: "tint-pink",
    icon: "sparkles",
    title: "Sketch with AI.",
    body: 'Describe your form in a sentence — "RSVP for a sakura picnic" — and Origami folds an opinionated draft you can edit.',
  },
  {
    tint: "tint-matcha",
    icon: "zap",
    title: "Drag, drop, done.",
    body: "11 question types — short text, long text, single/multi select, ratings, dates, files. Re-arrange like sticky notes.",
  },
  {
    tint: "tint-peach",
    icon: "layers",
    title: "Conditional folds.",
    body: "Show or hide questions based on previous answers. Multi-page flows. Save drafts, resume later.",
  },
  {
    tint: "tint-lavender",
    icon: "themes",
    title: "Nine paper themes.",
    body: "Minimal washi, anime, cyberpunk, retro OS, hacker terminal — flip a switch, the form re-skins instantly.",
  },
  {
    tint: "tint-indigo",
    icon: "analytics",
    title: "Hand-drawn analytics.",
    body: "Completion funnels, drop-off, average time. Charts that look like they belong in your notebook.",
  },
  {
    tint: "",
    icon: "lock",
    title: "Private as a journal.",
    body: "Unlisted links, password-protected forms, GDPR-shaped data — quiet by default, public when you choose.",
  },
];

const templates: { cls: string; deco: "sakura" | IconName; fields: string; title: string; body: string }[] = [
  { cls: "t-pink", deco: "sakura", fields: "9 fields", title: "Sakura Festival RSVP", body: "Date picker, headcount, dietary, kid-friendly toggle." },
  { cls: "t-matcha", deco: "sparkles", fields: "12 fields", title: "Startup Feedback Survey", body: "NPS, blockers, what'd you cut, what'd you add." },
  { cls: "t-peach", deco: "zap", fields: "11 fields", title: "Gaming Tournament Signup", body: "Team name, players, platform, skill tier." },
  { cls: "t-lavender", deco: "mail", fields: "3 fields", title: "Quiet Newsletter Signup", body: "Email, name, three interests. That's it." },
];

const testimonials: { cls: string; quote: string; initial: string; avatar: string; name: string; role: string }[] = [
  { cls: "", quote: "“Switched from Typeform on a Tuesday. By Wednesday three of my forms looked nice enough to print and frame.”", initial: "A", avatar: "peach", name: "Ayumi N.", role: "community designer · kobe" },
  { cls: "green", quote: "“The drop-off chart looks like a sketchbook page. Our team is fighting over who gets to share it in the all-hands.”", initial: "M", avatar: "matcha", name: "Marcus W.", role: "product · indie saas" },
  { cls: "pink", quote: "“Folded a wedding RSVP in 12 minutes. The thank-you page made my partner cry — in a good way.”", initial: "S", avatar: "sakura", name: "Sana K.", role: "event planner · london" },
  { cls: "peach", quote: "“I run a stationery shop. Origami feels like our product is a stationery shop. The end.”", initial: "R", avatar: "coral", name: "Riku T.", role: "paper merchant · kyoto" },
  { cls: "lav", quote: "“Eight respondents asked which tool we used. Two switched their newsletter to it the same day.”", initial: "N", avatar: "lavender", name: "Nora P.", role: "founder · slow software" },
  { cls: "coral", quote: "“AI-form-sketch with a single sentence, then I tweaked. Twenty minutes start to live link. Felt cozy, never robotic.”", initial: "J", avatar: "accent", name: "Jamie L.", role: "recruiter · remote-first" },
];

function avatarStyle(tone: string) {
  return { background: `var(--${tone}-soft)`, color: `var(--${tone}-deep)` } as const;
}

export default function Home() {
  return (
    <>
      {/* ===== NAV ===== */}
      <Navbar />

      {/* ===== HERO ===== */}
      <header className="lp-hero">
        <div>
          <div className="lp-hero-eyebrow">
            <span className="o-badge o-badge--matcha">★ new · ai form sketching</span>
            <span className="o-muted" style={{ fontSize: "0.86rem" }}>
              v0.1 — beta
            </span>
          </div>
          <h1>
            Forms that feel <span className="accent o-underline">handmade.</span>
          </h1>
          <p className="lede">
            Origami is a Typeform-style form builder, designed like a Japanese stationery set. Fold a
            beautiful form in two minutes, publish a private link, and watch the responses fall onto
            your paper desk.
          </p>
          <div className="lp-hero-actions">
            <Link href="/sign-up" className="o-btn o-btn--accent o-btn--xl">
              <Icon name="sparkles" size={20} /> Start folding — it&apos;s free
            </Link>
            <Link href="/f/demo" className="o-btn o-btn--lg">
              <Icon name="play" size={18} /> See a live form
            </Link>
          </div>
          <div className="lp-hero-trust">
            <div className="lp-avatar-stack">
              <span className="o-avatar o-avatar--sm" style={avatarStyle("sakura")}>Y</span>
              <span className="o-avatar o-avatar--sm" style={avatarStyle("matcha")}>K</span>
              <span className="o-avatar o-avatar--sm" style={avatarStyle("peach")}>A</span>
              <span className="o-avatar o-avatar--sm" style={avatarStyle("lavender")}>S</span>
            </div>
            <span>3,200+ paper makers, designers, and quiet introverts.</span>
          </div>
        </div>

        {/* HERO CANVAS */}
        <div className="lp-hero-canvas">
          <div className="lp-hc-mat" />

          <div className="lp-hc-card lp-hc-q">
            <div className="step">question 3 of 7 ↘</div>
            <h3>Which season do you fold for?</h3>
            <div className="pills">
              <span className="pill"><span className="kbd-mini">1</span> spring · sakura</span>
              <span className="pill on"><span className="kbd-mini">2</span> summer · waves</span>
              <span className="pill"><span className="kbd-mini">3</span> autumn · maple</span>
              <span className="pill"><span className="kbd-mini">4</span> winter · pine</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, color: "var(--ink-3)", fontSize: "0.78rem" }}>
              <span className="o-kbd">↵</span>
              <span>press enter to continue</span>
            </div>
          </div>

          <div className="lp-hc-sticky">
            hand-drawn checks ✓ ↓<br />
            <span style={{ fontSize: "0.84rem", color: "var(--ink-3)", fontFamily: "var(--font-body)", fontStyle: "italic" }}>
              made of paper
            </span>
          </div>

          <div className="lp-hc-resp">
            <div className="hd">
              <b>live responses ↗</b>
              <span style={{ fontSize: "0.7rem", color: "var(--ink-3)" }}>+12 today</span>
            </div>
            <div className="rows">
              <div className="row"><span className="av">あ</span>aiko · summer<span className="rdot" /></div>
              <div className="row"><span className="av">k</span>kenji · autumn<span className="rdot" /></div>
              <div className="row"><span className="av">m</span>mira · spring<span className="rdot" /></div>
            </div>
          </div>

          <div className="lp-hc-chart">
            <div className="lbl">complete rate</div>
            <div className="num">89%<span className="pos">↑ 4</span></div>
            <svg viewBox="0 0 120 40" aria-hidden="true">
              <path d="M2,32 C18,24 28,30 42,18 C56,6 70,22 84,14 C96,8 110,12 118,4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M2,32 C18,24 28,30 42,18 C56,6 70,22 84,14 C96,8 110,12 118,4 L118,40 L2,40 Z" fill="currentColor" fillOpacity="0.14" />
            </svg>
          </div>

          <span className="lp-hc-crane"><Crane size={100} /></span>
          <span className="lp-hc-plane"><Plane size={58} /></span>
          <span className="lp-hc-pencil"><Pencil size={100} /></span>
          <span className="lp-hc-clip"><Clip size={32} /></span>
          <span className="lp-annot-arrow"><ScribbleArrow size={60} /></span>
          <span className="lp-annot-label">tap a fold,<br />it&apos;ll talk back ↘</span>
        </div>
      </header>

      {/* ===== FEATURES ===== */}
      <section className="lp-features" id="features">
        <div className="lp-section-head">
          <span className="eyebrow">why origami</span>
          <h2>Form-building that doesn&apos;t feel like form-filling.</h2>
          <p>Every fold of the product — from drag-and-drop to public link — is built on shared paper.</p>
        </div>
        <div className="lp-feature-grid">
          {features.map((f) => (
            <div key={f.title} className={`lp-feature ${f.tint}`}>
              <span className="corner" />
              <div className="icon"><Icon name={f.icon} size={24} /></div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== BUILDER SHOWCASE ===== */}
      <section className="lp-showcase">
        <div className="lp-showcase-grid">
          <div className="lp-showcase-text">
            <span className="eyebrow">★ the studio</span>
            <h2>A workspace that whispers, never shouts.</h2>
            <p>
              Click any question to edit it. Drag from the left to add a new field. Live preview on the
              right — every keystroke folds into your form the moment you type it.
            </p>
            <ul className="lp-checks">
              {[
                "Drag-to-reorder with paper-snap feedback",
                "Inline validation rules — required, regex, ranges",
                "Multi-page flows + conditional logic",
                "Auto-save every change, every keystroke",
              ].map((c) => (
                <li key={c}>
                  <span className="check-mark"><Icon name="check" size={13} weight={2.4} /></span> {c}
                </li>
              ))}
            </ul>
            <div style={{ marginTop: 28 }}>
              <Link className="o-btn o-btn--primary o-btn--lg" href="/builder">
                Open the studio <Icon name="arrow" size={18} />
              </Link>
            </div>
          </div>

          <div className="lp-builder">
            <div className="top">
              <div className="dots"><span /><span /><span /></div>
              <div className="url">origami.dev / forms / sakura-rsvp</div>
              <span className="o-badge o-badge--matcha">saved · 2s ago</span>
            </div>
            <div className="body">
              <div className="left">
                <div className="o-eyebrow" style={{ marginBottom: 8, padding: "0 8px" }}>Add field</div>
                <div className="ft"><Icon name="text" size={16} /> Short text</div>
                <div className="ft active"><Icon name="align" size={16} /> Long text</div>
                <div className="ft"><Icon name="list" size={16} /> Single select</div>
                <div className="ft"><Icon name="check" size={16} /> Multi select</div>
                <div className="ft"><Icon name="star" size={16} /> Rating</div>
                <div className="ft"><Icon name="calendar" size={16} /> Date</div>
                <div className="ft"><Icon name="mail" size={16} /> Email</div>
                <div className="ft"><Icon name="hash" size={16} /> Number</div>
              </div>
              <div className="center">
                <div className="o-eyebrow" style={{ marginBottom: 10 }}>Cherry Blossom RSVP · 3 questions</div>
                <div className="question">
                  <span className="drag"><Icon name="drag" size={14} /></span>
                  <div className="meta">
                    <div className="lbl">01 · email</div>
                    <h4>Your email — we&apos;ll send the picnic map.</h4>
                    <div className="hint">required · validates as email</div>
                  </div>
                </div>
                <div className="question selected">
                  <span className="drag"><Icon name="drag" size={14} /></span>
                  <div className="meta">
                    <div className="lbl">02 · single select</div>
                    <h4>Pick a date — we have three to offer.</h4>
                    <div className="hint">3 options · required</div>
                  </div>
                  <span className="o-badge" style={{ background: "var(--accent)", color: "#fff", fontSize: "0.6rem" }}>editing</span>
                </div>
                <div className="question">
                  <span className="drag"><Icon name="drag" size={14} /></span>
                  <div className="meta">
                    <div className="lbl">03 · long text</div>
                    <h4>Anything we should know? (allergies, kids, kites?)</h4>
                    <div className="hint">optional · max 240 chars</div>
                  </div>
                </div>
                <button className="add-btn" type="button">+ add a question</button>
              </div>
              <div className="right">
                <h5>Field settings</h5>
                <div className="row"><span className="lab">Label</span><div className="ipt">Pick a date</div></div>
                <div className="row"><span className="lab">Helper</span><div className="ipt">We&apos;ll send a paper map.</div></div>
                <div className="row"><span className="lab">Validation</span><div className="ipt">Required</div></div>
                <hr className="o-rule o-rule--dashed" style={{ margin: "12px 0" }} />
                <label className="o-toggle" style={{ fontSize: "0.78rem" }}>
                  <input type="checkbox" defaultChecked />
                  <span className="track" /> Show this question
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TEMPLATES ===== */}
      <section className="lp-templates" id="templates">
        <div className="lp-section-head">
          <span className="eyebrow">templates</span>
          <h2>Start from a folded shape.</h2>
          <p>A handful of opinionated starting points — clone one, remix the questions, ship by lunch.</p>
        </div>
        <div className="lp-template-row">
          {templates.map((t) => (
            <div key={t.title} className={`lp-tmpl ${t.cls}`}>
              <span className="accent-strip" />
              <div className="icon-thing">
                {t.deco === "sakura" ? <Sakura size={36} /> : <Icon name={t.deco as IconName} size={28} />}
              </div>
              <h4>{t.title}</h4>
              <p>{t.body}</p>
              <div className="meta-row"><span>{t.fields}</span><span className="o-dot o-dot--success" /></div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link className="o-btn o-btn--lg" href="/templates">
            See the full gallery <Icon name="arrow" size={18} />
          </Link>
        </div>
      </section>

      {/* ===== ANALYTICS SHOWCASE ===== */}
      <section className="lp-ana-grid">
        <div className="lp-ana-board">
          <div className="lp-ana-card lp-ana-c1">
            <div className="lbl">total submissions</div>
            <div className="big">2,418</div>
            <div className="delta">↑ 312 this week</div>
            <div className="lp-bars" style={{ marginTop: 14 }}>
              <div style={{ background: "var(--accent)", height: "48%" }} />
              <div style={{ background: "var(--accent)", height: "62%" }} />
              <div style={{ background: "var(--accent)", height: "34%" }} />
              <div style={{ background: "var(--accent)", height: "78%" }} />
              <div style={{ background: "var(--accent)", height: "54%" }} />
              <div style={{ background: "var(--accent-deep)", height: "82%" }} />
              <div style={{ background: "var(--accent)", height: "66%" }} />
            </div>
          </div>
          <div className="lp-ana-card lp-ana-c2">
            <div className="lbl">completion rate</div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 8 }}>
              <div className="o-ring" style={{ "--p": 89, "--size": "72px" } as React.CSSProperties}><span>89%</span></div>
              <div>
                <div style={{ fontFamily: "var(--font-hand)", fontSize: "1.6rem", lineHeight: 1 }}>love it.</div>
                <div style={{ fontSize: "0.78rem", color: "var(--ink-3)" }}>+4% on last form</div>
              </div>
            </div>
          </div>
          <div className="lp-ana-card lp-ana-c3">
            <div className="lbl">submissions over time</div>
            <svg viewBox="0 0 280 70" style={{ width: "100%", height: 64, marginTop: 6, color: "var(--matcha-deep)" }} aria-hidden="true">
              <path d="M4,56 C30,42 50,50 80,30 C108,12 140,40 168,22 C200,8 230,28 276,12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M4,56 C30,42 50,50 80,30 C108,12 140,40 168,22 C200,8 230,28 276,12 L276,68 L4,68 Z" fill="currentColor" fillOpacity="0.14" />
              <circle cx="80" cy="30" r="3" fill="currentColor" />
              <circle cx="168" cy="22" r="3" fill="currentColor" />
              <circle cx="276" cy="12" r="3.5" fill="currentColor" />
            </svg>
          </div>
        </div>
        <div className="lp-ana-text">
          <span className="lp-ana-tape">analytics</span>
          <h2>A clean chart, drawn by hand.</h2>
          <p>
            Total views, completion rate, drop-off per question, average completion time. Every chart is
            rendered with soft brush strokes and warm paper backgrounds — at home in your notebook, not
            your spreadsheet.
          </p>
          <div style={{ marginTop: 24 }}>
            <Link className="o-btn o-btn--lg" href="/analytics">
              See the analytics page <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="lp-testimonials">
        <div className="lp-section-head">
          <span className="eyebrow">love notes</span>
          <h2>Pinned to the studio wall.</h2>
        </div>
        <div className="lp-t-wall">
          {testimonials.map((t) => (
            <div key={t.name} className={`lp-t-note ${t.cls}`}>
              <p>{t.quote}</p>
              <div className="who">
                <span className="o-avatar" style={avatarStyle(t.avatar)}>{t.initial}</span>
                <div>
                  <div className="name">{t.name}</div>
                  <div className="role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== PRICING CTA ===== */}
      <section className="lp-price-cta">
        <span className="crane"><Crane size={80} /></span>
        <span className="plane"><Plane size={62} /></span>
        <span className="o-badge o-badge--ink" style={{ marginBottom: 18 }}>free forever · 3 forms</span>
        <h2>Fold your first form today.</h2>
        <p>Free for up to three forms and one thousand responses a month. Upgrade when the paper stack gets heavy.</p>
        <div className="actions">
          <Link className="o-btn o-btn--accent o-btn--xl" href="/sign-up">Get started — no card needed</Link>
          <Link className="o-btn o-btn--xl" href="/pricing">See pricing</Link>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="lp-footer">
        <div className="lp-footer-grid">
          <div className="col brand">
            <Logo />
            <p>A quiet form builder, folded out of paper and washi tape. Built for makers who care about the small folds.</p>
            <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
              <span className="o-badge o-badge--matcha">v0.1 · beta</span>
            </div>
          </div>
          <div className="col">
            <h5>Product</h5>
            <Link href="/builder">Form Builder</Link>
            <Link href="/templates">Templates</Link>
            <Link href="/analytics">Analytics</Link>
            <Link href="/pricing">Pricing</Link>
            <a href="#themes">Themes</a>
          </div>
          <div className="col">
            <h5>Resources</h5>
            <Link href="/studio">Design System</Link>
            <a href="#docs">API docs</a>
            <a href="#changelog">Changelog</a>
            <a href="#help">Help center</a>
          </div>
          <div className="col">
            <h5>Company</h5>
            <a href="#about">About</a>
            <a href="#blog">Notebook ↗</a>
            <a href="#contact">Contact</a>
            <a href="#careers">Careers</a>
          </div>
          <div className="col">
            <h5>Legal</h5>
            <a href="#tos">Terms</a>
            <a href="#privacy">Privacy</a>
            <a href="#cookies">Cookies</a>
            <a href="#gdpr">GDPR</a>
          </div>
        </div>
        <div className="lp-footer-bottom">
          <span>© 2026 Origami Stationery, Co. — folded in Kyoto + Brooklyn.</span>
          <span style={{ display: "inline-flex", gap: 10, alignItems: "center" }}>
            <span className="o-dot o-dot--success" /> all systems folding nicely
          </span>
        </div>
      </footer>
    </>
  );
}
