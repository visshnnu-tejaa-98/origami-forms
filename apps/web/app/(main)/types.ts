import { IconName } from "./components/icons";
import { ARCHIVED, DRAFT, PUBLISHED } from "./constants";

export type Status = typeof DRAFT | typeof PUBLISHED | typeof ARCHIVED

export type Form = {
    id: string;
    title: string;
    icon: IconName;
    tint: string; // k1..k6
    status: Status;
    responses: number;
    completion: number; // 0..100
    edited: string; // human label
    editedRank: number; // for sorting (lower = more recent)
    pinned: boolean;
    description: string;
};

export type PageOptions = {
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
    page: number
    pageSize: number
    totalItems: number
}

