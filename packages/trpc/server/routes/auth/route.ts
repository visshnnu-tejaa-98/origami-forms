import { createUserInputModel, createUserOutputModel } from "@repo/services/user/model";
import { createUserMeta } from "@repo/services/user/meta";
import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
// import { getAuthenticationMethodOutputSchema } from "@repo/services/user/model";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUser: publicProcedure
    .meta(createUserMeta({ getPathFn: () => "/auth/user", tags: TAGS }))
    .input(createUserInputModel)
    .output(createUserOutputModel)
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
