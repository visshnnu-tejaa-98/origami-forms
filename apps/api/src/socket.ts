import type http from "node:http";
import { Server } from "socket.io";
import { verifyToken } from "@clerk/backend";
import { logger } from "@repo/logger";
import { userService } from "@repo/trpc/server/services";
import {
    formRoom,
    userRoom,
    type ClientToServerEvents,
    type ServerToClientEvents,
    type SocketData,
} from "@repo/services/socket";
import { registerRealtimePublisher, type RealtimePublisher } from "@repo/services/socket/bus";
import { env } from "./env";

export function createSocketServer(httpServer: http.Server) {
    const io = new Server<ClientToServerEvents, ServerToClientEvents, object, SocketData>(
        httpServer,
        {
            path: "/socket.io",
            cors: {
                origin: "http://localhost:3000",
                credentials: true,
            },
        },
    );

    // authenticate once, at handshake — this is what populates socket.data.userId
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token as string | undefined;
            if (!token) return next(new Error("unauthorized"));

            const claims = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
            const user = await userService.getByClerkId(claims.sub);
            if (!user) return next(new Error("unauthorized"));

            socket.data.userId = user.id;
            socket.data.clerkUserId = claims.sub;
            return next();
        } catch (err) {
            logger.warn("socket auth failed", { err });
            return next(new Error("unauthorized"));
        }
    });

    io.on("connection", (socket) => {
        socket.join(userRoom(socket.data.userId));
        logger.debug(`socket connected: ${socket.data.userId}`);

        socket.on("form:watch", (formId) => socket.join(formRoom(formId)));
        socket.on("form:unwatch", (formId) => socket.leave(formRoom(formId)));

        socket.on("disconnect", (reason) => {
            logger.debug(`socket disconnected: ${socket.data.userId} (${reason})`);
        });
    });

    const publisher: RealtimePublisher = {
        responseCreated(userId, payload) {
            io.to(userRoom(userId)).emit("response:created", payload);
            io.to(formRoom(payload.formId)).emit("response:created", payload);
        },
    };

    registerRealtimePublisher(publisher);
    logger.info("socket.io server attached");
    return io;
}
