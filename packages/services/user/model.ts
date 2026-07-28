import { z } from "zod";
import { STARTER_USER_ROLE, USER_ROLES } from "../constants";

export const createUserInputSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "Firstname must be atleast 2 characters long")
    .max(50, "Firstname cannot be longer than 50 characters")
    .optional()
    .describe("first name of the user — falls back to the email local-part when absent"),
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

export type CreateUserInputProps = z.infer<typeof createUserInputSchema>;

export const createUserOutputSchema = z.object({
  id: z.string().uuid().describe("id of the user"),
  firstName: z
    .string()
    .describe("first name of the user"),
  lastName: z
    .string()
    .optional()
    .describe("last name of the user"),
  email: z.string().trim().email("Invalid email address").describe("email address of the user"),
  clerkUserId: z.string().describe("clerk user id of the user"),
  avatarUrl: z.string().url("Invalid URL").optional().describe("avatar url of the user"),
  role: z.enum(USER_ROLES).optional().default(STARTER_USER_ROLE).describe("role of the user"),
})

export type CreateUserOutputSchemaType = z.infer<typeof createUserInputSchema>

export const deleteUserInputSchema = z.object({
  userId: z.string().uuid().describe("user id of the user to be deleted"),
  requesterId: z.string().uuid().describe("requester id of the user")
})

export type DeleteUserInputProps = z.infer<typeof deleteUserInputSchema>

export const deleteUserOutputSchema = z.object({
  isDeleted: z.boolean().describe("true if user is deleted successfully"),
  message: z.string().describe("success or error message"),
  id: z.string().uuid().optional().describe("deleted user id"),
})

export type DeleteUserOutputSchemaType = z.infer<typeof deleteUserOutputSchema>

export const updateUserInputSchema = z.object({
  id: z.string().uuid().describe("id of the user"),
  requesterId: z.string().uuid().describe("requester id of the user who is requesting"),
  firstName: z.string().optional().describe("first name of the user"),
  lastName: z.string().optional().describe("last name of the user"),
  avatarUrl: z.string().url("Invalid URL").optional().describe("avatar url of the user"),
})

export type UpdateUserInputProps = z.infer<typeof updateUserInputSchema>

export const updateUserOutputSchema = z.object({
  id: z.string().uuid().describe("id of the user"),
  firstName: z.string().describe("first name of the user"),
  lastName: z.string().optional().describe("last name of the user"),
  avatarUrl: z.string().url("Invalid URL").optional().describe("avatar url of the user"),
  role: z.enum(USER_ROLES).optional().describe("role of the user"),
})

export type UpdateUserOutputSchemaType = z.infer<typeof updateUserOutputSchema>