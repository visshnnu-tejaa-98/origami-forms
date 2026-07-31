import { createUserInputSchema, createUserOutputSchema } from "@repo/services/user/model";
import { createUserMeta } from "@repo/services/user/meta";
import { userService } from "../../services";
import { publicProcedure, router } from "../../trpc";

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
});
