import { RouterOutputs } from "@repo/trpc/client";
import { ICONS, TINTS } from "./constants";
import { PageOptions, Status } from "./types";
import { relativeTime } from "../utils";

export const TAPE = ["tape-pink", "tape-matcha", "tape-yellow", "tape-lav"];

export const STATUS_BADGE: Record<Status, { cls: string; label: string }> = {
    published: { cls: "o-badge--matcha", label: "live" },
    draft: { cls: "o-badge--sakura", label: "draft" },
    archived: { cls: "o-badge--ghost", label: "archived" },
};

export const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
};

type ApiForm = RouterOutputs["forms"]["getAllForms"]["forms"][number];

export const toUiForm = (f: ApiForm) => ({
    id: f.id,
    title: f.title,
    icon: ICONS[hash(f.id) % ICONS.length]!,
    tint: TINTS[hash(f.id) % TINTS.length]!,
    // `unlisted` is a visibility on the API, but a status in this UI.
    status: f.status,
    responses: f.submissionCount,
    // Progress toward the submission cap; 0 when the form is uncapped.
    // TODO: Change this max submission count based on subscription plan
    completion:
        f.maxSubmissions > 0
            ? Math.min(100, Math.round((f.submissionCount / f.maxSubmissions) * 100))
            : 0,
    edited: relativeTime(f.updatedAt),
    // Lower rank = more recent; the API already sorts by updatedAt desc.
    editedRank: -new Date(f.updatedAt).getTime(),
    pinned: false,
    description: f.description,
});

export const updatePageOptions = (props: PageOptions) => {
    const { totalPages, hasNextPage, hasPrevPage, page, pageSize, totalItems } = props;
    const rangeStart = (page - 1) * pageSize + 1;
    const rangeEnd = Math.min(page * pageSize, totalItems);
    return {
        totalPages,
        hasNextPage,
        hasPrevPage,
        page,
        pageSize,
        totalItems,
        rangeStart,
        rangeEnd,
    };
};
