// Used for docs generation

import { PATCH, POST } from "../constants";

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

type updateUserSettingsMetaInputProps = {
    getPathFn: () => string;
    tags?: string[];
};

const updateUserSettingsMeta = ({
    getPathFn,
    tags,
}: updateUserSettingsMetaInputProps): OpenApiMetaConfig => {
    const generatePath = getPathFn();
    const pathType = generatePath as `/${string}`;
    return {
        openapi: {
            method: PATCH,
            path: pathType,
            tags: tags ?? ["User"],
            summary: "Update a user's settings",
            description: `
### Overview

Updates the workspace preferences held against a user — colour theme and the page
sizes used by the forms and responses lists. Settings live in a \`userSettings\`
record separate from the user's profile, so this endpoint changes how the app is
presented to that person and never touches their identity, email or role.

A user may update their own settings. An **admin** may additionally update the
settings of any other user.

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`id\` | uuid | Yes | The user whose settings are being updated. |
| \`requesterId\` | uuid | Yes | The user performing the update. Must equal \`id\` unless the requester is an admin. |
| \`theme\` | enum | No | One of \`light\`, \`dark\`. Defaults to \`light\`. |
| \`formsPerPage\` | number | No | Rows per page on the My forms screen. Defaults to \`10\`. |
| \`responsesPerPage\` | number | No | Rows per page on the Responses screen. Defaults to \`10\`. |

### Flow

1. The target user (\`id\`) is looked up; soft-deleted users are treated as absent.
2. The requester's role is resolved to determine whether they are an admin.
3. An update is issued against the target's active \`userSettings\` row. For a
   non-admin the update is additionally constrained to a row belonging to the
   requester, so a non-admin acting on somebody else matches no row and is
   rejected rather than silently permitted.
4. If a row was updated the change is confirmed; if none matched, the caller was
   not authorised.

### Response

Returns \`success\` and a human-readable \`message\`. The updated values are not
echoed back — re-read the user's settings if the client needs them.

### Errors

- **Validation** — a field fails its schema constraint (e.g. \`id\` is not a uuid,
  \`theme\` is outside the allowed set).
- **User not found** — no active user exists for \`id\`. Returns
  \`success: false\` with \`"User not found!"\`.
- **Not authorised** — no settings row matched, which happens when a non-admin
  targets another user, or when the target has no active settings row. Returns
  \`success: false\` with \`"Not authorised to perform update operation"\`.

### Notes

Because a missing settings row and an authorisation failure both produce zero
updated rows, they are reported through the same message. If the two need to be
distinguished, the settings row must be checked before the update is issued.
`,
        },
    };
};

export { createUserMeta, updateUserSettingsMeta };
