import React from "react";
import { Icon } from "../../components/icons";
import { ROLE_COPY } from "../constants";
import { ProfilePanelProps } from "../types";

const ProfilePanel = ({ section, draft, email, role, onChange }: ProfilePanelProps) => {
    const fileRef = React.useRef<HTMLInputElement>(null);
    const initial =
        draft.firstName.trim()[0]?.toUpperCase() ??
        email.trim()[0]?.toUpperCase() ??
        "A";
    const roleCopy = ROLE_COPY[role];

    if (section !== "profile") return null

    return (
        <section className="set-panel" id="profile">
            <span className="o-tape tape-pink" aria-hidden />
            <div className="set-panel__head">
                <h3>Profile</h3>
                <span className="sub">how you appear across your forms</span>
                <span className={`o-badge ${roleCopy.badge} set-role`} title={roleCopy.blurb}>
                    <Icon name="lock" size={11} /> {roleCopy.label}
                </span>
            </div>

            <div className="set-row">
                <div className="label">
                    Photo
                    <span className="lhelp">a square image reads best — PNG or JPG, up to 2 MB</span>
                </div>
                <div className="control">
                    <div className="set-av-row">
                        <span className="set-av">
                            {draft.avatarUrl ? (
                                <img src={draft.avatarUrl} alt="" />
                            ) : (
                                initial
                            )}
                        </span>
                        <div className="set-av-actions">
                            <button
                                type="button"
                                className="o-btn o-btn--sm"
                                onClick={() => fileRef.current?.click()}
                            >
                                <Icon name="upload" size={13} /> Upload photo
                            </button>
                            {draft.avatarUrl !== "" && (
                                <button
                                    type="button"
                                    className="o-btn o-btn--sm o-btn--ghost set-btn--danger"
                                    onClick={() => onChange({ avatarUrl: "" })}
                                >
                                    Remove
                                </button>
                            )}
                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                hidden
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    // preview only — nothing is uploaded yet
                                    if (file) onChange({ avatarUrl: URL.createObjectURL(file) });
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="set-row">
                <div className="label">
                    Name
                    <span className="lhelp">shown next to every response you collect</span>
                </div>
                <div className="control set-row-2">
                    <label className="o-field">
                        <span className="o-field-label">First name</span>
                        <input
                            className="o-input"
                            value={draft.firstName}
                            placeholder="First name"
                            onChange={(e) => onChange({ firstName: e.target.value })}
                        />
                    </label>
                    <label className="o-field">
                        <span className="o-field-label">Last name</span>
                        <input
                            className="o-input"
                            value={draft.lastName}
                            placeholder="Last name"
                            onChange={(e) => onChange({ lastName: e.target.value })}
                        />
                    </label>
                </div>
            </div>

            <div className="set-row">
                <div className="label">
                    Email
                    <span className="lhelp">managed by your sign-in provider</span>
                </div>
                <div className="control">
                    <input className="o-input" value={email} readOnly disabled />
                </div>
            </div>
        </section>
    );
};

export default ProfilePanel;
