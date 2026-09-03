import { useEffect, useRef, useState } from "react";
import { useFileUploadCredentials } from "./use-file";
import { ACCEPTED_ICON_TYPES, ICON_FOLDER, MAX_ICON_BYTES } from "~/app/(main)/builder/constants";
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { useBuilder } from "./use-builder";

export function useUploadFile() {
    const inputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState("");
    const [progress, setProgress] = useState<number | null>(null);
    const uploading = progress !== null;

    const objectUrl = useRef<string | null>(null);

    useEffect(() => releasePrevious, []);
    const getCredentials = useFileUploadCredentials();



    const releasePrevious = () => {
        if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
        objectUrl.current = null;
    };

    const iconPath = (formId: string) => ({
        folder: `${ICON_FOLDER}/${formId}`,
        fileName: "logo",
    });

    const versioned = (url: string) => {
        const separator = url.includes("?") ? "&" : "?";
        return `${url}${separator}updatedAt=${Date.now()}`;
    };

    const pick = () => {
        if (!uploading) inputRef.current?.click();
    };

    const uploadMessage = (error: unknown) => {
        if (error instanceof ImageKitAbortError) return "";
        if (error instanceof ImageKitUploadNetworkError)
            return "The upload lost its connection. Try again.";
        if (error instanceof ImageKitInvalidRequestError || error instanceof ImageKitServerError)
            return "ImageKit rejected that image. Try a different one.";
        return "That image didn't upload. Try again.";
    };

    const uploadFile = async (
        formId: string | null,
        file: File | null,
        sessionKey: string,
        setIcon: (url: string | null) => void,
    ) => {
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
                ...iconPath(formId ?? sessionKey),
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

    function removeFile(setIcon: (url: string | null) => void) {
        setError("");
        releasePrevious();
        setIcon(null);
    }

    return {
        error,
        progress,
        inputRef,
        uploading,
        pick,
        uploadFile,
        removeFile,
    };
}
