import { ListResponseOutputType } from "@repo/services/response/model";
import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";


const responsesInitialState: { responsesData: ListResponseOutputType } = {
    responsesData: {
        responses: [],
        page: 0,
        pageSize: 0,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
    }
}



export const useResponsesStore = create(
    devtools(
        persist(
            combine(responsesInitialState, (set) => {
                return {
                    setResponsesData: (responsesData: ListResponseOutputType) => set({ responsesData }),
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