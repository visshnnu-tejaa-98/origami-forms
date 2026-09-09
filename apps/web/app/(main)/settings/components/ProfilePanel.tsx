import React from "react";
import { Icon } from "../../components/icons";
import { DEFAULT_ROLE_COPY, ROLE_COPY } from "../constants";
import { ProfilePanelProps, Role } from "../types";
import { useUploadFile } from "~/hooks/use-uploadfile";
import { fileUploadLimit, userAvatarPath } from "~/app/(public)/form/utils";
import { useUserStore } from "~/app/store/user-store";

const ACCEPTED_AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"];
const AVATAR_SIZE_LIMIT_MB = 2;

const ProfilePanel = ({ section, profile, updateUserProfile }: ProfilePanelProps) => {
    const { inputRef, uploading, error, progress, pick, uploadFile } = useUploadFile();
    const userId = useUserStore((state) => state.user?.id ?? "");
    const [dragging, setDragging] = React.useState(false);

    const initial =
        profile.firstName.trim()[0]?.toUpperCase() ??
        profile.email.trim()[0]?.toUpperCase()

    const roleCopy = ROLE_COPY[profile.role as Role] || DEFAULT_ROLE_COPY
    const showRoleBadge = profile.role !== "starter" && profile.role !== ""

    if (section !== "profile") return null

    const onRemoveProfileImage = () => {
        updateUserProfile({ ...profile, avatarUrl: "" })
    }

    const handleFile = async (file: File | null) => {
        if (!file) return;

        const { uploadedImageUrl } = await uploadFile({
            id: userId,
            file,
            sessionKey: userId || "avatar",
            maxSizeAllowed: fileUploadLimit(AVATAR_SIZE_LIMIT_MB),
            path: userAvatarPath,
            acceptedTypes: ACCEPTED_AVATAR_TYPES,
            setIcon: (url) => updateUserProfile({ ...profile, avatarUrl: url ?? "" }),
        });

        return uploadedImageUrl;
    };

    const onDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setDragging(false);
        if (!uploading) void handleFile(event.dataTransfer.files?.[0] ?? null);
    };

    return (
        <section className="set-panel" id="profile">
            <span className="o-tape tape-pink" aria-hidden />
            <div className="set-panel__head">
                <h3>Profile</h3>
                <span className="sub">how you appear across your forms</span>
                {showRoleBadge && (
                    <span className={`o-badge ${roleCopy.badge} set-role`} title={roleCopy.blurb}>
                        <Icon name="lock" size={11} /> {roleCopy.label}
                    </span>)}
            </div>

            <div className="set-row">
                <div className="label">
                    Photo
                    <span className="lhelp">a square image reads best — PNG, JPG or WEBP, up to {AVATAR_SIZE_LIMIT_MB} MB</span>
                </div>
                <div className="control">
                    <div
                        className={`set-drop${dragging ? " is-dragging" : ""}${uploading ? " is-busy" : ""}`}
                        onDragOver={(e) => { e.preventDefault(); if (!uploading) setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={onDrop}
                    >
                        <button
                            type="button"
                            className="set-av"
                            onClick={pick}
                            disabled={uploading}
                            aria-busy={uploading}
                            aria-label={profile.avatarUrl ? "Replace photo" : "Upload a photo"}
                            title={profile.avatarUrl ? "Replace photo" : "Upload a photo"}
                        >
                            {profile.avatarUrl
                                ? <img src={profile.avatarUrl} alt="" />
                                : <span className="set-av__initial">{initial}</span>}

                            <span className="set-av__veil" aria-hidden="true">
                                <Icon name="upload" size={16} />
                            </span>

                            {uploading && (
                                <span className="set-av__ring" aria-hidden="true">
                                    <span
                                        className="set-av__ring-fill"
                                        style={{ ["--pct" as string]: `${Math.round(progress ?? 0)}%` }}
                                    />
                                </span>
                            )}
                        </button>

                        <div className="set-drop__body">
                            <p className="set-drop__lead">
                                <button type="button" className="set-drop__link" onClick={pick} disabled={uploading}>
                                    Choose a file
                                </button>
                                {" "}or drag one here
                            </p>

                            {uploading ? (
                                <div className="set-drop__progress" role="progressbar" aria-valuenow={Math.round(progress ?? 0)} aria-valuemin={0} aria-valuemax={100}>
                                    <span style={{ width: `${progress ?? 0}%` }} />
                                    <em>{Math.round(progress ?? 0)}%</em>
                                </div>
                            ) : (
                                <p className="set-drop__hint">square images look best</p>
                            )}

                            {profile.avatarUrl !== "" && !uploading && (
                                <button
                                    type="button"
                                    className="set-drop__remove"
                                    onClick={onRemoveProfileImage}
                                >
                                    <Icon name="trash" size={12} /> Remove photo
                                </button>
                            )}
                        </div>

                        <input
                            ref={inputRef}
                            type="file"
                            accept={ACCEPTED_AVATAR_TYPES.join(",")}
                            hidden
                            onChange={(e) => {
                                void handleFile(e.target.files?.[0] ?? null);
                                e.target.value = ""; // so re-picking the same file still fires
                            }}
                        />
                    </div>

                    {error !== "" && (
                        <p className="set-drop__error" role="alert">
                            <Icon name="error" size={13} /> {error}
                        </p>
                    )}
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
                            value={profile.firstName}
                            placeholder="First name"
                            onChange={(e) => updateUserProfile({ ...profile, firstName: e.target.value })}
                        />
                    </label>
                    <label className="o-field">
                        <span className="o-field-label">Last name</span>
                        <input
                            className="o-input"
                            value={profile.lastName}
                            placeholder="Last name"
                            onChange={(e) => updateUserProfile({ ...profile, lastName: e.target.value })}
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
                    <input className="o-input" value={profile.email} readOnly disabled />
                </div>
            </div>
        </section>
    );
};

export default ProfilePanel;
