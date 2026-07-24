
import db, { eq, usersTable } from "@repo/database";
import { createUserInputModel, CreateUserInputModelType } from "./model";

export default class UserService {

    private async getUserByEmail(email: string) {
        return await db.select().from(usersTable).where(eq(usersTable.email, email)).then(result => result[0] ?? null)
    }

    public async createUser(userData: CreateUserInputModelType) {
        const { firstName, lastName, email, clerkUserId, avatarUrl, role } = await createUserInputModel.parseAsync(userData)

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

        return await db.insert(usersTable).values({
            clerkUserId,
            firstName,
            lastName: lastName || null,
            email,
            avatarUrl: avatarUrl || null,
            role,
        }).returning({
            id: usersTable.id,
            clerkUserId: usersTable.clerkUserId,
            firstName: usersTable.firstName,
            lastName: usersTable.lastName,
            email: usersTable.email,
            avatarUrl: usersTable.avatarUrl,
            role: usersTable.role
        }).then(result => result[0])
    }
}