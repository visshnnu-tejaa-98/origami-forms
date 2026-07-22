import { z } from "zod";

export const signInFormInput = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .max(255, "Email connot excees 255 characters")
        .email("Invalid email format"),
    password: z.string()
        .trim()
        .min(1, "Password is required")
        .min(8, "Password must be atleast 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/, "Password must contain at least one special character"),
});


export type SignInFormInputType = z.infer<typeof signInFormInput>