import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;

/**
 * Requires an authenticated Clerk user. Rejects with UNAUTHORIZED when no valid
 * token was presented, and narrows `ctx.clerkUserId` to a non-null string for
 * downstream resolvers.
 */
export const protectedProcedure = tRPCContext.procedure.use(({ ctx, next }) => {
  if (!ctx.clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" });
  }
  return next({ ctx: { ...ctx, clerkUserId: ctx.clerkUserId } });
});
