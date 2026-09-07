import { z } from "zod";
import { STARTER_USER_ROLE, USER_ROLES } from "../constants";
import { FORMS_VIEWS, GRID, LIGHT, THEMES } from "@repo/database/constants";

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

export type CreateUserOutputSchemaType = z.infer<typeof createUserOutputSchema>

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
  firstName: z.string().trim().min(2).max(50).optional().describe("first name of the user"),
  lastName: z.string().trim().min(2).max(50).nullable().optional().describe("last name of the user (null to clear)"),
  avatarUrl: z.string().url("Invalid URL").nullable().optional().describe("avatar url of the user (null to clear)"),
})

export type UpdateUserInputProps = z.infer<typeof updateUserInputSchema>

export const updateUserOutputSchema = z.object({
  success: z.boolean().describe("true or false based on if update was successful"),
  message: z.string().describe("Success or error message"),
  userData: z
    .object({
      id: z.string().uuid().describe("id of the user"),
      firstName: z.string().describe("first name of the user"),
      lastName: z.string().nullable().describe("last name of the user"),
      avatarUrl: z.string().nullable().describe("avatar url of the user"),
      role: z.enum(USER_ROLES).nullable().describe("role of the user"),
    })
    .nullable()
    .describe("updated user data, or null when no update was performed"),
})

export type UpdateUserOutputSchemaType = z.infer<typeof updateUserOutputSchema>


export const updateUserSettingsInputSchema = z.object({
  id: z.string().uuid().describe("id of the user"),
  requesterId: z.string().uuid().describe("requester id of the user who is requesting"),
  view: z.enum(FORMS_VIEWS).optional().default(GRID).describe("selected view to show forms"),
  theme: z.enum(THEMES).optional().default(LIGHT).describe("theme of the user"),
  formsPerPage: z.number().optional().default(10).describe("forms per page of the user"),
  responsesPerPage: z.number().optional().default(10).describe("responses per page of the user"),
})

export type UpdateUserSettingsInputProps = z.infer<typeof updateUserSettingsInputSchema>

export const updateUserSettingsOutputSchema = z.object({
  success: z.boolean().describe("true or false based on if update was successful"),
  message: z.string().describe("Success or error message"),
})

export type UpdateUserSettingsOutputSchemaType = z.infer<typeof updateUserSettingsOutputSchema>

export const getUserSettingsByUserIdInputProps = z.object({
  requesterId: z.string().uuid().describe("requester id of the user who is requesting"),
})

export type GetUserSettingsByUserInputPropsType = z.infer<typeof getUserSettingsByUserIdInputProps>

export const getUserSettingsByUserOutputSchema = z.object({
  success: z.boolean().describe("true or false based on if the fetch was successful"),
  message: z.string().describe("Success or error message"),
  userSettings: z.object({
    id: z.string().uuid().describe("id of the user"),
    view: z.enum(FORMS_VIEWS).optional().default(GRID).describe("selected view to show forms"),
    theme: z.enum(THEMES).describe("theme of the user"),
    formsPerPage: z.number().describe("forms per page of the user"),
    responsesPerPage: z.number().describe("responses per page of the user"),
  }).nullish()

})

export type GetUserSettingsByUserOutputSchemaType = z.infer<typeof getUserSettingsByUserOutputSchema>

