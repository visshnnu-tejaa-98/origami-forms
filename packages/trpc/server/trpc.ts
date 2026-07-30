import { initTRPC, TRPCError } from "@trpc/server";
import { OpenApiMeta } from "trpc-to-openapi";

import { createContext } from "./context";

export const tRPCContext = initTRPC
  .meta<OpenApiMeta>()
  .context<typeof createContext>()
  .create({});

export const router = tRPCContext.router;

export const publicProcedure = tRPCContext.procedure;


export const protectedProcedure = tRPCContext.procedure.use(({ ctx, next }) => {
  if (!ctx.clerkUserId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Authentication required" });
  }
  if (!ctx.userId) {
    throw new TRPCError({ code: "FORBIDDEN", message: "User is not registered" });
  }
  return next({
    ctx: { ...ctx, clerkUserId: ctx.clerkUserId, userId: ctx.userId, role: ctx.role },
  });
});
