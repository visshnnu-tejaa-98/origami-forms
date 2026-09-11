import { ResponseCreatedEvent } from "./model";

export interface ServerToClientEvents {
    "response:created": (payload: ResponseCreatedEvent) => void;
}

export interface ClientToServerEvents {
    "form:watch": (formId: string) => void;
    "form:unwatch": (formId: string) => void;
}

export interface SocketData {
    userId: string;
    clerkUserId: string;
}

/** Rooms — one helper, used on both sides, so a typo can't silently drop events. */
export const userRoom = (userId: string) => `user:${userId}`;
export const formRoom = (formId: string) => `form:${formId}`;