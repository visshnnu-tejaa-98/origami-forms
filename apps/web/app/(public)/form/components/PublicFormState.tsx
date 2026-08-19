import React from "react";
import Link from "next/link";
import { Icon } from "../../../(main)/components/icons";
import { Clip, Crane } from "~/components/origami/deco";
import type { PublicStateScreenProps } from "../types";

/** one sheet, centred — loading, a dead link, a closed form and the thank-you all wear it */
const PublicFormState = ({ icon, title, description, action }: PublicStateScreenProps) => (
    <section className="pv-stage pf-stage">
        <header className="pv-top pf-top">
            <Link className="pf-brand" href="/">
                <Crane size={22} />
                <span>made with origami</span>
            </Link>
        </header>

        <div className="pv-pages">
            <div className="pv-card">
                <span className="pv-grain-card" aria-hidden />
                <span className="pv-watermark" aria-hidden>
                    <Crane size={190} />
                </span>
                <span className="pv-clip" aria-hidden>
                    <Clip size={34} />
                </span>
                <span className="pv-fold" aria-hidden />

                <div className="pv-centered">
                    <span className="pv-mascot">
                        <Icon name={icon} size={64} />
                    </span>
                    <h1 className="pv-title">{title}</h1>
                    <p className="pv-help">{description}</p>
                    {action && (
                        <div className="pv-actions pv-actions--center">
                            <button className="o-btn o-btn--accent o-btn--lg" onClick={action.onClick}>
                                {action.label}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <footer className="pv-bot">
            <div className="kbd-row">
                folded with <Link href="/" className="pf-foot-link">origami</Link>
            </div>
        </footer>
    </section>
);

export default PublicFormState;
