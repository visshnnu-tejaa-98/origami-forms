import { z } from "zod";
import { STARTER_USER_ROLE, USER_ROLES } from "../constants";

export const createUserInputModel = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Firstname must be atleast 2 characters long")
    .max(50, "Firstname cannot be longer than 50 characters")
    .describe("first name of the user"),
  lastName: z
    .string()
    .trim()
    .min(2, "Lastname must be atleast 2 characters long")
    .max(50, "Lastname cannot be longer than 50 characters")
    .optional()
    .describe("last name of the user"),
  email: z.string().trim().email("Invalid email address").describe("email address of the user"),
  clerkUserId: z.string().describe("clerk user id of the user"),
  avatarUrl: z.string().url("Invalid URL").optional().describe("avatar url of the user"),
  role: z.enum(USER_ROLES).optional().default(STARTER_USER_ROLE).describe("role of the user"),
});

export type CreateUserInputModelType = z.infer<typeof createUserInputModel>;

export const createUserOutputModel = z.object({
  id: z.string(),
  firstName: z
    .string()
    .trim()
    .min(2, "Firstname must be atleast 2 characters long")
    .max(50, "Firstname cannot be longer than 50 characters")
    .describe("first name of the user"),
  lastName: z
    .string()
    .trim()
    .min(2, "Lastname must be atleast 2 characters long")
    .max(50, "Lastname cannot be longer than 50 characters")
    .optional()
    .describe("last name of the user"),
  email: z.string().trim().email("Invalid email address").describe("email address of the user"),
  clerkUserId: z.string().describe("clerk user id of the user"),
  avatarUrl: z.string().url("Invalid URL").optional().describe("avatar url of the user"),
  role: z.enum(USER_ROLES).optional().default(STARTER_USER_ROLE).describe("role of the user"),
})

export type CreateUserOutputModel = z.infer<typeof createUserInputModel>