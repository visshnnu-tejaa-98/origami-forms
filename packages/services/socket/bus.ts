import { logger } from "@repo/logger";
import { ResponseCreatedEvent } from "./model";

export interface RealtimePublisher {
    responseCreated(userId: string, payload: ResponseCreatedEvent): void;
}

let publisher: RealtimePublisher | null = null;

export function registerRealtimePublisher(next: RealtimePublisher) {
    publisher = next;
}

export const realtimeBus: RealtimePublisher = {
    responseCreated(userId, payload) {
        if (!publisher) return;
        try {
            publisher.responseCreated(userId, payload);
        } catch (err) {
            logger.error("failed to publish response:created", { err });
        }
    },
};