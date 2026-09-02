import { create } from "zustand";
import { combine, devtools, persist } from "zustand/middleware";
import { FormStatsListOutputSchemaType, ListFormsOutputSchemaType } from "@repo/services/form/model";

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
    formsStats: {
        published: 0,
        draft: 0,
        archived: 0,
        expired: 0,
        total: 0,
    }
}

export const useFormStore = create(
    devtools(
        persist(
            combine(formsInitialState, (set) => {
                return {
                    setForms: (formsData: ListFormsOutputSchemaType) => set({ formsData }),
                    getFormsData: () => useFormStore.getState().formsData,
                    setFormsStats: (formsStats: FormStatsListOutputSchemaType) => set({ formsStats }),
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

