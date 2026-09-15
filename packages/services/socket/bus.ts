import { logger } from "@repo/logger";
import { FormUpdateRealTimeEvent, ResponseSubmittedEvent } from "../form/model";

export interface RealtimePublisher {
    responseSubmitted(userId: string, payload: ResponseSubmittedEvent): void;
    formDrafted(userId: string, payload: FormUpdateRealTimeEvent): void;
}

let publisher: RealtimePublisher | null = null;

export function registerRealtimePublisher(next: RealtimePublisher) {
    publisher = next;
}

export const realtimeBus: RealtimePublisher = {
    responseSubmitted(userId, payload) {
        if (!publisher) {
            logger.warn("dropped response:submitted — no realtime publisher registered", { userId });
            return;
        }
        try {
            logger.debug("publishing response:submitted", { userId, formId: payload.formId });
            publisher.responseSubmitted(userId, payload);
        } catch (err) {
            logger.error("failed to submit response:submitted", { err });
        }
    },
    formDrafted(userId, payload) {
        if (!publisher) {
            logger.warn("dropped form:drafted — no realtime publisher registered", { userId });
            return;
        }
        try {
            logger.debug("publishing form:drafted", { userId, formId: payload.formId });
            publisher.formDrafted(userId, payload);
        } catch (err) {
            logger.error("failed to publish form:drafted", { err });
        }
    }
};