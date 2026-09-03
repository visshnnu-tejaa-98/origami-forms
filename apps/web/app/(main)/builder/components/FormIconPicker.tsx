import React, { useEffect, useRef, useState } from "react";
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { Icon } from "../../components/icons";
import { ACCEPTED_ICON_TYPES, ICON_FOLDER, MAX_ICON_BYTES } from "../constants";
import type { FormIconPickerProps } from "../types";
import { useFileUploadCredentials } from "~/hooks/use-file";

const iconPath = (formId: string) => ({
    folder: `${ICON_FOLDER}/${formId}`,
    fileName: "logo",
});

const draftKey = () => `draft-${Math.random().toString(36).slice(2, 10)}`;


const versioned = (url: string) => {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}updatedAt=${Date.now()}`;
};

const uploadMessage = (error: unknown) => {
    if (error instanceof ImageKitAbortError) return "";
    if (error instanceof ImageKitUploadNetworkError)
        return "The upload lost its connection. Try again.";
    if (error instanceof ImageKitInvalidRequestError || error instanceof ImageKitServerError)
        return "ImageKit rejected that image. Try a different one.";
    return "That image didn't upload. Try again.";
};

const FormIconPicker = ({ iconUrl, setIcon, formId }: FormIconPickerProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    const [progress, setProgress] = useState<number | null>(null);
    const uploading = progress !== null;

    const objectUrl = useRef<string | null>(null);
    const releasePrevious = () => {
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        objectUrl.current = null;
    };

    const sessionKey = useRef(draftKey());
    const getCredentials = useFileUploadCredentials();

    useEffect(() => releasePrevious, []);

    const pick = () => {
        if (!uploading) inputRef.current?.click();
    };

    const onFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        event.target.value = "";

        if (!file) return;

        if (!ACCEPTED_ICON_TYPES.includes(file.type)) {
            setError("accepts only PNG or JPG files.");
            return;
        }
        if (file.size > MAX_ICON_BYTES) {
            setError("over 2 MB. Try a smaller one.");
            return;
        }

        setError("");
        releasePrevious();
        objectUrl.current = URL.createObjectURL(file);
        setIcon(objectUrl.current);
        setProgress(0);

        try {
            const { token, expire, signature, publicKey } = await getCredentials();

            const uploaded = await upload({
                token,
                expire,
                signature,
                publicKey,
                file,
                ...iconPath(formId ?? sessionKey.current),
                useUniqueFileName: false,
                overwriteFile: true,
                onProgress: ({ loaded, total }) => setProgress((loaded / total) * 100),
            });

            if (!uploaded.url) throw new Error("Something went wrong while uploading image.");

            setIcon(versioned(uploaded.url));
            releasePrevious();
        } catch (uploadError) {
            console.error("Form icon upload failed:", uploadError);
            const message = uploadMessage(uploadError);
            if (message) {
                setError(message);
                releasePrevious();
                setIcon(null);
            }
        } finally {
            setProgress(null);
        }
    };

    const clear = () => {
        setError("");
        releasePrevious();
        setIcon(null);
    };

    return (
        <div className="form-icon">
            <button
                type="button"
                className={`form-icon-box${iconUrl ? " is-set" : ""}${uploading ? " is-busy" : ""}`}
                onClick={pick}
                disabled={uploading}
                aria-busy={uploading}
                aria-label={iconUrl ? "Replace form icon" : "Add a form icon"}
                title={iconUrl ? "Replace form icon" : "Add a form icon"}
            >
                {iconUrl ? (
                    <>
                        {/* the preview may be a local blob url, so next/image buys us nothing here */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={iconUrl} alt="" className="form-icon-img" />
                        <span className="form-icon-overlay">
                            <Icon name="upload" size={14} />
                        </span>
                    </>
                ) : (
                    <span className="form-icon-empty">
                        <Icon name="plus" size={16} />
                    </span>
                )}

                {uploading ? (
                    <span className="form-icon-progress">
                        {/* the frame itself fills as the bytes land */}
                        <svg viewBox="0 0 64 64" aria-hidden="true">
                            <rect
                                className="ring-track"
                                x="1"
                                y="1"
                                width="62"
                                height="62"
                                rx="6"
                                pathLength={100}
                            />
                            <rect
                                className="ring-fill"
                                x="1"
                                y="1"
                                width="62"
                                height="62"
                                rx="6"
                                pathLength={100}
                                style={{ strokeDashoffset: 100 - progress }}
                            />
                        </svg>
                        <span className="form-icon-pct">{Math.round(progress)}</span>
                    </span>
                ) : null}
            </button>

            {iconUrl && !uploading ? (
                <button type="button" className="form-icon-clear" onClick={clear}>
                    <Icon name="x" size={10} /> remove
                </button>
            ) : null}

            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_ICON_TYPES.join(",")}
                className="form-icon-input"
                onChange={onFileUpload}
                tabIndex={-1}
                aria-hidden="true"
            />

            {error ? (
                <p className="form-icon-error" role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
};

export default FormIconPicker;
