import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientOpts {
  enableStreaming?: boolean;
  /** Returns the current Clerk session token, or null when signed out. */
  getToken?: () => Promise<string | null>;
}

export const createTRPCHttpBatchClient = (opts?: CreateTRPCHttpBatchClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/trpc",
    async headers() {
      const token = opts?.getToken ? await opts.getToken() : null;
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  });
};
