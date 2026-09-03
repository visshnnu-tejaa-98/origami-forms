import { trpc } from "~/trpc/client";

export function useFileUploadCredentials() {
    const utils = trpc.useUtils();

    return () => utils.files.getImageUploadParams.fetch(undefined, { staleTime: 0 });
}
