import db, { and, eq, formFields, forms, inArray, isNull, users } from "@repo/database";
import { createUserInputSchema } from "./model";
import type { CreateUserInputProps, DeleteUserInputProps, UpdateUserInputProps } from "./model";
import { ADMIN } from "@repo/database/constants";

export default class UserService {
    private async getUserByEmail(email: string) {
        const condition = and(eq(users.email, email), isNull(users.deletedAt));
        return await db
            .select()
            .from(users)
            .where(condition)
            .then((result) => result[0] ?? null);
    }

    private async getUserById(id: string) {
        const condition = and(eq(users.id, id), isNull(users.deletedAt));
        return await db
            .select()
            .from(users)
            .where(condition)
            .then((result) => result[0] ?? null);
    }

    public async createUser(userData: CreateUserInputProps) {
        const { firstName, lastName, email, clerkUserId, avatarUrl, role } =
            await createUserInputSchema.parseAsync(userData);
        const resolvedFirstName = firstName || email.split("@")[0]!;

        const existingUser = await this.getUserByEmail(email);
        if (existingUser)
            return {
                id: existingUser.id,
                clerkUserId: existingUser.clerkUserId,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                email: existingUser.email,
                avatarUrl: existingUser.avatarUrl,
                role: existingUser.role,
            };

        return await db
            .insert(users)
            .values({
                clerkUserId,
                firstName: resolvedFirstName,
                lastName: lastName || null,
                email,
                avatarUrl: avatarUrl || null,
                role,
            })
            .returning({
                id: users.id,
                clerkUserId: users.clerkUserId,
                firstName: users.firstName,
                lastName: users.lastName,
                email: users.email,
                avatarUrl: users.avatarUrl,
                role: users.role,
            })
            .then((result) => result[0]);
    }

    public async getByClerkId(clerkUserId: string) {
        const condition = and(eq(users.clerkUserId, clerkUserId), isNull(users.deletedAt));
        return await db.query.users.findFirst({
            where: condition,
            columns: {
                id: true,
                clerkUserId: true,
                email: true,
                role: true,
            },
        });
    }

    public async isAdmin(userId: string) {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: {
                role: true,
            },
        });

        if (!user) throw new Error("User not found");

        return user.role === ADMIN;
    }

    public async deleteUser(payload: DeleteUserInputProps) {
        const { userId, requesterId } = payload;

        const user = await this.getUserById(userId);

        if (!user) return { isDeleted: false, message: "User not found" };

        const isAdmin = await this.isAdmin(requesterId);

        const now = new Date();

        const condition = !isAdmin
            ? and(eq(users.id, userId), eq(users.id, requesterId), isNull(users.deletedAt))
            : and(eq(users.id, userId), isNull(users.deletedAt));

        const result = await db.transaction(async (tx) => {
            const [deletedUser] = await tx
                .update(users)
                .set({ deletedAt: now })
                .where(condition)
                .returning({ id: users.id });

            if (!deletedUser) return null;

            const deletedForms = await tx
                .update(forms)
                .set({ deletedAt: now })
                .where(and(eq(forms.creatorId, deletedUser.id), isNull(forms.deletedAt)))
                .returning({ id: forms.id });

            if (deletedForms.length > 0) {
                const formIds = deletedForms.map((f) => f.id);
                await tx
                    .update(formFields)
                    .set({ deletedAt: now })
                    .where(and(inArray(formFields.formId, formIds), isNull(formFields.deletedAt)));
            }
            return deletedUser.id;
        });

        if (!result)
            return {
                isDeleted: false,
                message: "Unauthorized or user already deleted.",
            };

        return { isDeleted: true, message: "User deleted successfully", id: userId };
    }

    public async updateUser(payload: UpdateUserInputProps) {
        const { id, requesterId, firstName, lastName, avatarUrl } = payload;

        const user = await this.getUserById(id);

        if (!user) throw new Error("User not found!");

        const isAdmin = await this.isAdmin(requesterId);
        const condition = !isAdmin
            ? and(eq(users.id, id), eq(users.id, requesterId), isNull(users.deletedAt))
            : and(eq(users.id, id), isNull(users.deletedAt));

        const updatedValues: Partial<typeof users.$inferInsert> = {};
        if (firstName !== undefined) updatedValues.firstName = firstName;
        if (lastName !== undefined) updatedValues.lastName = lastName;
        if (avatarUrl !== undefined) updatedValues.avatarUrl = avatarUrl;

        if (Object.keys(updatedValues).length === 0)
            return {
                success: false,
                message: "No changes to update",
                userData: null,
            };

        const [updatedUser] = await db
            .update(users)
            .set(updatedValues)
            .where(condition)
            .returning({
                id: users.id,
                firstName: users.firstName,
                lastName: users.lastName,
                avatarUrl: users.avatarUrl,
                role: users.role,
            });

        if (!updatedUser) throw new Error("Not authorised to perform update operation");

        return {
            success: true,
            message: "User updated successfully",
            userData: updatedUser,
        };
    }
}
