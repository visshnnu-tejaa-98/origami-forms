import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

export type TRPCContext = {
    // res: HTTP.ServerResponse;
    // req: HTTP.IncomingMessage;
}

export async function createContext({ req, res }: CreateExpressContextOptions) {
    return {
        developerName: "VT",
        cookie: req.cookies.user_session_token
    }
}
export type Context = Awaited<ReturnType<typeof createContext>>;
