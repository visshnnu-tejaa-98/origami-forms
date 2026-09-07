import { createUserInputSchema, createUserOutputSchema, getUserSettingsByUserIdInputProps, getUserSettingsByUserOutputSchema, updateUserSettingsInputSchema, updateUserSettingsOutputSchema } from "@repo/services/user/model";
import { createUserMeta, getUserSettingsByUserIdMeta, updateUserSettingsMeta } from "@repo/services/user/meta";
import { userService } from "../../services";
import { protectedProcedure, publicProcedure, router } from "../../trpc";

const TAGS = ["Authentication"];

export const authRouter = router({
  createUser: publicProcedure
    .meta(createUserMeta({ getPathFn: () => "/auth/user", tags: TAGS }))
    .input(createUserInputSchema)
    .output(createUserOutputSchema)
    .mutation(async ({ input }) => {
      const { firstName, lastName, email, clerkUserId, avatarUrl, role } = input;

      const result = await userService.createUser({
        firstName,
        lastName,
        email,
        clerkUserId,
        avatarUrl,
        role,
      });

      if (!result) throw Error("Something wnet wrong while creating an user");

      return {
        id: result.id,
        firstName: result.firstName,
        lastName: result.lastName ?? undefined,
        email: result.email,
        clerkUserId: result.clerkUserId,
        avatarUrl: result.avatarUrl ?? undefined,
        role: result.role ?? undefined,
      };
    }),
  updateUserSettings: protectedProcedure
    .meta(updateUserSettingsMeta({ getPathFn: () => "/auth/settings", tags: TAGS }))
    .input(updateUserSettingsInputSchema.omit({ id: true, requesterId: true }))
    .output(updateUserSettingsOutputSchema)
    .mutation(async ({ input, ctx }) => {
      const { view, theme, formsPerPage, responsesPerPage } = input

      const result = await userService.updateUserSettings({
        id: ctx.userId,
        requesterId: ctx.userId,
        view,
        theme,
        formsPerPage,
        responsesPerPage
      })

      if (!result) throw Error("Something went wrong while updating user settings");

      return {
        success: result.success,
        message: result.message,
      }
    }),
  getUserSettings: protectedProcedure
    .meta(getUserSettingsByUserIdMeta({ getPathFn: () => "/auth/settings", tags: TAGS }))
    .input(getUserSettingsByUserIdInputProps.omit({ requesterId: true }))
    .output(getUserSettingsByUserOutputSchema)
    .query(async ({ ctx }) => {

      const result = await userService.getUserSettingsByUserId({
        requesterId: ctx.userId,
      })

      if (!result) throw Error("Something went wrong while getting user settings");

      return result
    })
});
