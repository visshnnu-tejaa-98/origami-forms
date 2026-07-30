import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getAuth } from "@clerk/express";

export async function createContext({ req }: CreateExpressContextOptions) {
  // `clerkMiddleware()` (mounted in apps/api) validates the incoming token and
  // populates the auth object; here we just read the authenticated user id.
  const { userId } = getAuth(req);

  return {
    clerkUserId: userId ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
