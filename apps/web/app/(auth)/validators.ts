import { z } from "zod";

export const signInFormInput = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .max(255, "Email connot excees 255 characters")
        .email("Invalid email format"),
});


export type SignInFormInputType = z.infer<typeof signInFormInput>