// Used for docs generation

import { GET, PATCH, POST } from "../constants";

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

type updateUserMetaInputProps = {
    getPathFn: () => string;
    tags?: string[];
};

const updateUserMeta = ({ getPathFn, tags }: updateUserMetaInputProps): OpenApiMetaConfig => {
    const generatePath = getPathFn();
    const pathType = generatePath as `/${string}`;
    return {
        openapi: {
            method: PATCH,
            path: pathType,
            tags: tags ?? ["User"],
            summary: "Update a user's profile",
            description: `
### Overview

Updates the editable parts of a user's profile — display name and avatar. Email,
\`clerkUserId\` and \`role\` are deliberately not editable here: the first two are
owned by the sign-in provider, and changing a role is a separate, privileged
concern.

A user may update their own profile. An **admin** may additionally update the
profile of any other user.

### Request Body

Every profile field is optional. An omitted field is left untouched, so a client
may send only what it is changing.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`id\` | uuid | Yes | The user being updated. |
| \`requesterId\` | uuid | Yes | The user performing the update. Must equal \`id\` unless the requester is an admin. |
| \`firstName\` | string | No | 2–50 characters, trimmed. |
| \`lastName\` | string \\| null | No | 2–50 characters, trimmed. Send \`null\` to clear it. |
| \`avatarUrl\` | string \\| null | No | A valid URL. Send \`null\` to clear it. |

Note the difference between omitting a field and sending \`null\`: omitting means
"leave this alone", while \`null\` clears the stored value. \`firstName\` cannot be
cleared, since a user must always have one.

### Flow

1. The target user (\`id\`) is looked up; soft-deleted users are treated as absent.
2. The requester's role is resolved to determine whether they are an admin.
3. The provided fields are collected into an update set. If none were provided,
   the request returns early without touching the database.
4. The update runs against the target's active row. For a non-admin it is
   additionally constrained to a row belonging to the requester, so a non-admin
   acting on somebody else matches no row and is rejected rather than silently
   permitted.

### Response

Returns \`success\`, a human-readable \`message\`, and \`userData\` containing the
updated \`id\`, \`firstName\`, \`lastName\`, \`avatarUrl\` and \`role\`.

When no updatable field was supplied, returns \`success: false\` with
\`"No changes to update"\` and \`userData: null\`.

### Errors

- **Validation** — a field fails its schema constraint (e.g. \`id\` is not a uuid,
  a name is shorter than two characters, \`avatarUrl\` is not a URL).
- **User not found** — no active user exists for \`id\`. **Throws**, rather than
  returning a \`success: false\` body.
- **Not authorised** — no row matched, which happens when a non-admin targets
  another user. **Throws** with \`"Not authorised to perform update operation"\`.

### Notes

Unlike the settings endpoints, the two failure cases above are thrown rather than
returned, so callers surface them as errors rather than as \`success: false\`
responses. The one soft failure is the no-op case, which comes back in the body.
`,
        },
    };
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

type getUserSettingsByUserIdMetaInputProps = {
    getPathFn: () => string;
    tags?: string[];
};

const getUserSettingsByUserIdMeta = ({
    getPathFn,
    tags,
}: getUserSettingsByUserIdMetaInputProps): OpenApiMetaConfig => {
    const generatePath = getPathFn();
    const pathType = generatePath as `/${string}`;
    return {
        openapi: {
            method: GET,
            path: pathType,
            tags: tags ?? ["User"],
            summary: "Get the requester's settings",
            description: `
### Overview

Reads the workspace preferences belonging to the calling user — colour theme and
the page sizes used by the forms and responses lists. Clients call this on load to
restore the user's chosen theme and pagination before the first screen is painted.

This endpoint is **self-scoped**: it only ever returns the settings of the user
identified by \`requesterId\`. There is no way to read another user's settings
through it, including as an admin.

### Request

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`requesterId\` | uuid | Yes | The user whose settings are read. Doubles as the subject and the caller. |

### Flow

1. The active \`userSettings\` row for \`requesterId\` is selected; rows with a
   \`deletedAt\` timestamp are treated as absent.
2. The first match is returned, or \`null\` when the user has no settings row.

### Response

Returns \`id\`, \`theme\`, \`formsPerPage\` and \`responsesPerPage\`. Values come from the
stored row, whose column defaults are \`light\`, \`10\` and \`20\` respectively.

Returns \`null\` when no active settings row exists — a user who has never saved
settings, or whose row has been soft-deleted. This is not an error, so clients must
handle the empty case and fall back to their own defaults.

### Errors

- **Validation** — \`requesterId\` is missing or is not a uuid.

### Notes

The service returns the settings row (or \`null\`) directly, while
\`getUserSettingsByUserOutputSchema\` describes a wrapped
\`{ success, message, userSettings }\` shape with \`userSettings\` required. A
procedure wiring this method to that schema has to build the envelope itself and
decide what to send when the row is absent, since \`null\` will not satisfy the
schema as written.
`,
        },
    };
};

export {
    createUserMeta,
    updateUserMeta,
    updateUserSettingsMeta,
    getUserSettingsByUserIdMeta,
};
