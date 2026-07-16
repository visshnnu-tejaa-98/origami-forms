import { publicProcedure, router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { z } from "./schema";

export const serverRouter = router({
  health: healthRouter,
  // auth: authRouter,
  chaicode: publicProcedure
    .meta({ openapi: { method: "POST", path: "/user" } })
    .input(
      z.object({
        email: z.string().email()
      })
    ).output(
      z.object({
        message: z.string()
      })
    ).query(async ({ input }) => {
      return {
        message: `Hello ${input.email}`
      }
    })
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
