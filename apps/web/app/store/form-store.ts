import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";
import { FormStatsListOutputSchemaType, ListFormsOutputSchemaType } from "@repo/services/form/model";
import { ResponseCreatedEvent } from "@repo/services/socket";

const formsInitialState = {
    formsData: {
        forms: [] as ListFormsOutputSchemaType['forms'],
        page: 0,
        pageSize: 0,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    },
    liveResponses: [] as ResponseCreatedEvent[],
    formsStats: null as FormStatsListOutputSchemaType | null,
}

export const useFormStore = create(
    devtools(
        persist(
            combine(formsInitialState, (set) => {
                return {
                    setForms: (formsData: ListFormsOutputSchemaType) => set({ formsData }),
                    getFormsData: () => useFormStore.getState().formsData,
                    setFormsStats: (formsStats: FormStatsListOutputSchemaType) => set({ formsStats }),
                    pushLiveResponse: (event: ResponseCreatedEvent) =>
                        set((state) => {
                            // dedupe: a reconnect can replay, and StrictMode double-mounts in dev
                            if (state.liveResponses.some((r) => r.responseId === event.responseId)) return state;
                            console.log(111)
                            return {
                                liveResponses: [event, ...state.liveResponses].slice(0, 20),
                                formsStats: state.formsStats
                                    ? { ...state.formsStats, totalResponses: state.formsStats.totalResponses + 1 }
                                    : state.formsStats,
                            };
                        }),

                };
            }),
            {
                name: "forms",
                partialize: (state) => ({ formsData: state.formsData }),
            },
        ),
        {
            name: "Origami Store",
            store: "forms",
            enabled: process.env.NODE_ENV === "development"
        }
    ),
);

