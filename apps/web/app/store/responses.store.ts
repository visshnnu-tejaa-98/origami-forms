import { ListResponseOutputType, FormResponsesStatsOutputType } from "@repo/services/response/model";
import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";


const responsesInitialState: { responsesData: ListResponseOutputType, responsesStats: FormResponsesStatsOutputType } = {
    responsesData: {
        responses: [],
        page: 0,
        pageSize: 0,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    },
    responsesStats: {
        completed: 0,
        partial: 0
    }
}



export const useResponsesStore = create(
    devtools(
        persist(
            combine(responsesInitialState, (set) => {
                return {
                    setResponsesData: (responsesData: ListResponseOutputType) => set({ responsesData }),
                    setResponsesStats: (responsesStats: FormResponsesStatsOutputType) => set({ responsesStats }),
                }
            }),
            {
                name: "responses",
                partialize: (state) => ({ responsesData: state.responsesData }),
            },
        ),
        {
            name: "Origami Store",
            store: "responses",
            enabled: process.env.NODE_ENV === "development"
        }
    )
)