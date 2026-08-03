import type { ServerRouter } from "@repo/trpc/client";
import { createTRPCProxyClient } from "@repo/trpc/client";
import { createTRPCHttpBatchClient } from "~/trpc/create-client";

export const api = createTRPCProxyClient<ServerRouter>({
  links: [createTRPCHttpBatchClient()],
});

export const apiStreaming = createTRPCProxyClient<ServerRouter>({
  links: [createTRPCHttpBatchClient({ enableStreaming: true })],
});
