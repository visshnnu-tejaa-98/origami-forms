import { z } from "zod";

export const isoDateSchema = z.coerce.date()
    .transform((val) => val.toISOString())
    .pipe(z.string().datetime());

export const optionsSchema = z.object({
    id: z.string().min(1).max(64),
    label: z.string().min(1).max(255).describe("label for the option"),
    value: z.string().min(1).max(255).describe("value for the option"),
});