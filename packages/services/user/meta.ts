// Used for docs generation

import { POST, GET, PUT, DELETE, PATCH } from "../constants";

type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE" | "PUT";

type OpenApiMetaConfig = {
    openapi: {
        method: HttpMethod;
        path: `/${string}`;
        tags?: string[];
        summary?: string;
        description?: string;
    };
};

type createUserMetaInputProps = {
    getPathFn: () => string;
    tags?: string[];
};

const createUserMeta = ({ getPathFn, tags }: createUserMetaInputProps): OpenApiMetaConfig => {
    const generatePath = getPathFn();
    const pathType = generatePath as `/${string}`;
    return {
        openapi: {
            method: POST,
            path: pathType,
            tags: tags ?? ["User"],
            summary: "Create a user",
            description: `
### Overview

Creates a new user record in Origami Forms. This endpoint is called once a person's
identity has been verified by Clerk (via email OTP or Google OAuth) to persist their
profile in the application database and link it to their Clerk account through
\`clerkUserId\`.

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`firstName\` | string | Yes | User's first name (2–50 characters). |
| \`lastName\` | string | No | User's last name (2–50 characters). |
| \`email\` | string | Yes | Unique, valid email address. Used to detect duplicate accounts. |
| \`clerkUserId\` | string | Yes | Identifier of the verified Clerk user to link this profile to. |
| \`avatarUrl\` | string | No | Valid URL of the user's profile image. |
| \`role\` | enum | No | One of \`admin\`, \`subscriber\`, \`starter\`. Defaults to \`starter\`. |

### Flow

1. The client completes sign-in / sign-up with Clerk (email OTP or Google OAuth).
2. On success, the verified profile details and \`clerkUserId\` are sent to this endpoint.
3. The server rejects the request if a user with the same \`email\` already exists.
4. Otherwise a new user is inserted and the created profile is returned.

### Response

Returns the created user: \`id\`, \`firstName\`, \`lastName\`, \`email\`, \`clerkUserId\`,
\`avatarUrl\`, and \`role\`.

### Errors

- **Validation** — a field fails its schema constraint (e.g. invalid email, name too short).
- **User already exists** — a user with the given \`email\` is already registered.
`,
        },
    }
};

export { createUserMeta };
