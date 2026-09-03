import { useEffect, useRef, useState } from "react";
import { useFileUploadCredentials } from "./use-file";
import { ACCEPTED_ICON_TYPES, ICON_FOLDER } from "~/app/(main)/builder/constants";
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/next";
import { UploadFileProps } from "~/app/(main)/builder/types";

export function useUploadFile() {
    const [uploadedImageUrl, setUploadedUrl] = useState<string | null>(null);
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

    const uploadFile = async (props: UploadFileProps) => {
        const { id, file, sessionKey, maxSizeAllowed, path, setIcon } = props;
        if (!file) return;

        if (!ACCEPTED_ICON_TYPES.includes(file.type)) {
            setError("accepts only PNG or JPG files.");
            return;
        }
        if (file.size > maxSizeAllowed) {
            setError(`over ${maxSizeAllowed / 1024 / 1024} MB. Try a smaller one.`);
            return;
        }

        setError("");
        releasePrevious();
        objectUrl.current = URL.createObjectURL(file);
        setIcon?.(objectUrl.current);
        setUploadedUrl(objectUrl.current);
        setProgress(0);

        try {
            const { token, expire, signature, publicKey } = await getCredentials();

            const onProgress = ({ loaded, total }: { loaded: number; total: number }) =>
                setProgress((loaded / total) * 100);

            const options = {
                token,
                expire,
                signature,
                publicKey,
                file,
                useUniqueFileName: false,
                overwriteFile: true,
                onProgress,
                ...path(id || sessionKey),
            };

            const uploaded = await upload(options);

            if (!uploaded.url) throw new Error("Something went wrong while uploading image.");

            setIcon?.(uploaded.url);
            releasePrevious();
        } catch (uploadError) {
            console.error("Form icon upload failed:", uploadError);
            const message = uploadMessage(uploadError);
            if (message) {
                setError(message);
                releasePrevious();
                setIcon?.(null);
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
        uploadedImageUrl,
        pick,
        uploadFile,
        removeFile,
    };
}
