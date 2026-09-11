"use client"

import { useAuth } from "@clerk/nextjs"
import { ClientToServerEvents, ServerToClientEvents } from "@repo/services/socket";
import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { env } from "~/env";

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

let socket: AppSocket | null = null;

export function useSocket(handlers: Partial<ServerToClientEvents>) {
    const { isSignedIn, getToken } = useAuth();

    const handlersRef = useRef(handlers);
    handlersRef.current = handlers;

    useEffect(() => {
        if (!isSignedIn) return;

        if (!socket) {
            socket = io(env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:8000", {
                path: "/socket.io",
                withCredentials: true,
                auth: async (cb) => cb({ token: await getToken() }),
            });

            socket.on("connect", () => console.debug("[socket] connected", socket?.id));
            socket.on("connect_error", (err) => console.error("[socket] connect_error", err.message));
            socket.on("disconnect", (reason) => console.debug("[socket] disconnected", reason));
        }

        const active = socket;
        const names = Object.keys(handlersRef.current) as (keyof ServerToClientEvents)[];

        const listeners = names.map((name) => {
            const listener = ((...args: unknown[]) => {
                // @ts-expect-error — args are narrowed by the event name at the call site
                handlersRef.current[name]?.(...args);
            }) as ServerToClientEvents[typeof name];
            active.on(name, listener);
            return [name, listener] as const;
        });

        return () => {
            listeners.forEach(([name, listener]) => active.off(name, listener));
        };
    }, [isSignedIn])
}