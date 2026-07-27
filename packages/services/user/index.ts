
import db, { eq, users } from "@repo/database";
import { createUserInputModel, CreateUserInputModelType } from "./model";

export default class UserService {

    private async getUserByEmail(email: string) {
        return await db.select().from(users).where(eq(users.email, email)).then(result => result[0] ?? null)
    }

    public async createUser(userData: CreateUserInputModelType) {
        const { firstName, lastName, email, clerkUserId, avatarUrl, role } = await createUserInputModel.parseAsync(userData)
        const resolvedFirstName = firstName || email.split("@")[0]!

        const existingUser = await this.getUserByEmail(email)
        if (existingUser) return {
            id: existingUser.id,
            clerkUserId: existingUser.clerkUserId,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            avatarUrl: existingUser.avatarUrl,
            role: existingUser.role
        }

        return await db.insert(users).values({
            clerkUserId,
            firstName: resolvedFirstName,
            lastName: lastName || null,
            email,
            avatarUrl: avatarUrl || null,
            role,
        }).returning({
            id: users.id,
            clerkUserId: users.clerkUserId,
            firstName: users.firstName,
            lastName: users.lastName,
            email: users.email,
            avatarUrl: users.avatarUrl,
            role: users.role
        }).then(result => result[0])
    }
}