import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { getAuth } from "@clerk/express";
import { userService } from "./services";

export async function createContext({ req }: CreateExpressContextOptions) {
  const { userId: clerkUserId } = getAuth(req);
  const user = clerkUserId ? await userService.getByClerkId(clerkUserId) : null;

  return {
    clerkUserId: clerkUserId ?? null,
    userId: user?.id ?? null,
    role: user?.role ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
