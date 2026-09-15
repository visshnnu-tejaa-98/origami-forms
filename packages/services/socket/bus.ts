import { logger } from "@repo/logger";
import { FormDraftedEvent, ResponseCreatedEvent } from "../form/model";

export interface RealtimePublisher {
    responseCreated(userId: string, payload: ResponseCreatedEvent): void;
    formDrafted(userId: string, payload: FormDraftedEvent): void;
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
    formDrafted(userId, payload) {
        if (!publisher) return;
        try {
            publisher.formDrafted(userId, payload);
        } catch (err) {
            logger.error("failed to publish form:drafted", { err });
        }
    },

};