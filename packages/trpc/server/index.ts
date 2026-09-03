import { router } from "./trpc";

import { healthRouter } from "./routes/health/route";
import { authRouter } from "./routes/auth/route";
import { formsRouter } from "./routes/forms/route";
import { responseRouter } from "./routes/responses/route";
import { fileRouter } from "./routes/files/route";

export const serverRouter = router({
  health: healthRouter,
  auth: authRouter,
  forms: formsRouter,
  responses: responseRouter,
  files: fileRouter
});

export { createContext } from "./context";
export type ServerRouter = typeof serverRouter;
