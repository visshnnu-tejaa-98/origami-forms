// Used for docs generation

import { DELETE, GET, PATCH, POST } from "../constants";

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

type FormMetaInputProps = {
    getPathFn: () => string;
    tags?: string[];
};

const createFormMeta = ({ getPathFn, tags }: FormMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: POST,
            path: pathType,
            tags: tags ?? ["Form"],
            summary: "Create a form",
            description: `
### Overview

Creates a new form together with all of its fields in a single database transaction.
The form is owned by the authenticated user (\`creatorId\`) and starts in \`draft\`
status. A URL-safe \`slug\` is generated from the title with a random suffix to keep it
unique, and every field is assigned a unique \`labelKey\`.

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`title\` | string | Yes | Form title (2–255 characters). |
| \`description\` | string | No | Optional form description. |
| \`logoUrl\` | string | No | Valid URL of the form logo. |
| \`visibility\` | enum | No | One of \`public\`, \`unlisted\`. Defaults to \`unlisted\`. |
| \`maxSubmissions\` | number | No | Positive integer cap on total submissions. |
| \`fields\` | array | Yes | At least one field. Shape depends on the field \`type\` (text, number, select, multi-select, date, file upload). |

### Flow

1. A form row is inserted with a generated \`slug\` and \`status: draft\`.
2. Each field in \`fields\` is inserted with a generated \`labelKey\`, preserving \`order\`.
3. If any step fails, the whole transaction is rolled back so no partial form is left behind.

### Response

Returns the created form's id: \`{ id }\`.

### Errors

- **Validation** — a field fails its schema constraint (e.g. title too short, empty fields array, invalid field shape).
`,
        },
    };
};

const getFormByIdMeta = ({ getPathFn, tags }: FormMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: GET,
            path: pathType,
            tags: tags ?? ["Form"],
            summary: "Get a form by id",
            description: `
### Overview

Fetches a single, non-deleted form by id along with its non-deleted fields, ordered by
the field \`order\`. Access is scoped by role: an admin can read any form, while a regular
user can only read forms they created.

### Path / Query Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`formId\` | string (uuid) | Yes | Id of the form to fetch. |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins may read any form). |

### Flow

1. The requester's role is resolved to determine admin access.
2. A non-admin query is scoped to \`creatorId === requesterId\`; an admin query is not.
3. Soft-deleted forms and soft-deleted fields are excluded.

### Response

Returns the form with its \`fields\` array (ordered by \`order\`), or \`null\` when no
matching form exists or the requester is not allowed to see it.
`,
        },
    };
};

const listFormsMeta = ({ getPathFn, tags }: FormMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: GET,
            path: pathType,
            tags: tags ?? ["Form"],
            summary: "List forms",
            description: `
### Overview

Returns a paginated list of non-deleted forms with optional filtering, searching and
sorting. Admins see all forms; regular users see only the forms they created. Fields are
not included in the list payload.

### Query Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins see all forms). |
| \`search\` | string | No | Case-insensitive partial match against the form title. |
| \`status\` | enum | No | Filter by \`draft\`, \`published\`, or \`archived\`. |
| \`visibility\` | enum | No | Filter by \`public\` or \`unlisted\`. |
| \`maxSubmissions\` | number | No | Only forms whose current submission count is at most this value. |
| \`sortBy\` | enum | No | One of \`createdAt\`, \`updatedAt\`, \`title\`, \`submissionCount\`, \`maxSubmissions\`, \`status\`. Defaults to \`updatedAt\`. |
| \`sortOrder\` | enum | No | \`asc\` or \`desc\`. Defaults to \`desc\`. |
| \`page\` | number | No | 1-indexed page number. Defaults to \`1\`. |
| \`pageSize\` | number | No | Items per page (1–100). Defaults to \`10\`. |

### Response

Returns \`{ forms, page, pageSize, totalItems, totalPages, hasNextPage, hasPrevPage }\`,
where \`totalItems\` is the count of all forms matching the same filters.
`,
        },
    };
};

const updateFormMeta = ({ getPathFn, tags }: FormMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: PATCH,
            path: pathType,
            tags: tags ?? ["Form"],
            summary: "Update a form",
            description: `
### Overview

Partially updates a form. Only the fields provided in the request body are changed; any
field omitted is left untouched, and a nullable field may be set to \`null\` to clear it.
Access is scoped by role (admins may update any form; users only their own). The \`slug\`
is intentionally immutable and is never regenerated on update.

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`formId\` | string (uuid) | Yes | Id of the form to update. |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins may update any form). |
| \`title\` | string | No | New title (2–255 characters). |
| \`description\` | string \\| null | No | New description, or \`null\` to clear. |
| \`logoUrl\` | string \\| null | No | New logo URL, or \`null\` to clear. |
| \`status\` | enum | No | New status (\`draft\`, \`published\`, \`archived\`). |
| \`visibility\` | enum | No | New visibility (\`public\`, \`unlisted\`). |
| \`maxSubmissions\` | number \\| null | No | New submission cap, or \`null\` to clear. |
| \`expiresAt\` | string (date) \\| null | No | New expiry date/time, or \`null\` to clear. |

### Flow

1. The form is fetched and authorized via the same rules as *Get a form by id*.
2. A status change to \`published\` stamps \`publishedAt\` (first time only); a change to
   \`archived\` stamps \`archivedAt\`.
3. Only explicitly provided fields are written; if nothing changed the update is skipped.

### Response

Returns \`{ success, message, formData }\`. On success \`formData\` holds the updated form;
on a blocked transition or when there is nothing to update, \`success\` is \`false\` and
\`formData\` is \`null\`.

### Errors

- **Form not found** — no matching, non-deleted form for this requester.
- **Blocked transition** — moving a \`published\` form back to \`draft\` while it already has submissions is rejected (\`success: false\`).
`,
        },
    };
};

const deleteFormMeta = ({ getPathFn, tags }: FormMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: DELETE,
            path: pathType,
            tags: tags ?? ["Form"],
            summary: "Delete a form",
            description: `
### Overview

Soft-deletes a form and cascades the soft-delete to its fields in a single transaction.
Nothing is physically removed — \`deletedAt\` is set on the form and on every one of its
still-live fields. Access is scoped by role (admins may delete any form; users only their
own).

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`formId\` | string (uuid) | Yes | Id of the form to delete. |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins may delete any form). |

### Flow

1. The form is fetched and authorized via the same rules as *Get a form by id*.
2. \`deletedAt\` is set on the form; if no row matched the transaction is rolled back.
3. \`deletedAt\` is set on all of the form's fields that are not already soft-deleted.

### Response

Returns \`{ success, message }\`.

### Errors

- **Form not found** — no matching, non-deleted form for this requester.
- **Blocked deletion** — a \`published\` form that already has submissions cannot be deleted (\`success: false\`).
`,
        },
    };
};

const cloneFormMeta = ({ getPathFn, tags }: FormMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: POST,
            path: pathType,
            tags: tags ?? ["Form"],
            summary: "Clone a form",
            description: `
### Overview

Creates a copy of an existing form, owned by the requester. The clone reuses the source
form's fields (each with a freshly generated \`labelKey\`), copies its metadata, and starts
as a new \`draft\` with its own generated \`slug\`. The cloned title is derived from the
original. Admins may clone any form; regular users may clone only their own.

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`formId\` | string (uuid) | Yes | Id of the form to clone. |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user, who becomes the owner of the clone. |

### Flow

1. The source form is fetched and authorized (admin, or the form's creator).
2. Its fields are copied with new \`labelKey\`s; a new title and \`slug\` are generated.
3. The copy is created through the same path as *Create a form* (new form + fields in one transaction).

### Response

Returns the new form's id: \`{ id }\`.

### Errors

- **Form not found** — no matching, non-deleted source form.
- **Unauthorized** — a non-admin attempting to clone a form they do not own.
`,
        },
    };
};

const formStatsMeta = ({ getPathFn, tags }: FormMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: GET,
            path: pathType,
            tags: tags ?? ["Form"],
            summary: "Get form statistics",
            description: `
### Overview

Fetches statistics for non-deleted forms, with optional filtering. Admins see all forms; regular users see only the forms they created.

### Query Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins see all forms). |
| \`status\` | enum | No | Filter by \`draft\`, \`published\`, or \`archived\`. |
| \`visibility\` | enum | No | Filter by \`public\` or \`unlisted\`. |
| \`maxSubmissions\` | number | No | Only forms whose current submission count is at most this value. |

### Response

Returns \`{
  published: number,
  draft: number,
  archived: number,
  total: number
}\`, where:\n
- \`published\` — number of published forms;\n
- \`draft\` — number of draft forms;\n
- \`archived\` — number of archived forms;\n
- \`total\` — total number of forms matching the filters.\n

### Errors

- **Validation** — a query parameter fails its schema constraint (e.g. \`maxSubmissions\` is not positive).\n
`,
        },
    };
}

const getPublicFormMeta = ({ getPathFn, tags }: FormMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: GET,
            path: pathType,
            tags: tags ?? ["Form"],
            summary: "Get a published form for a respondent",
            description: `
### Overview

Fetches a published form by the two halves of its public link — its \`slug\` and its
\`formId\`. No authentication is required. Both halves have to match the same row, so an
id on its own never opens a form.

### Path Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`slug\` | string | Yes | Slug from the public link. |
| \`formId\` | string (uuid) | Yes | Form id from the public link. |

### Response

Returns the form's public shape: \`{ id, title, description, logoUrl, slug, accepting,
closedReason, fields }\`. The creator, the submission counts and the internal timestamps
are never included. \`accepting\` is false once the form has expired or has reached its
\`maxSubmissions\`, and \`closedReason\` says which.

### Errors

- **Not found** — no published form matches that slug and id, or it has been deleted.\n
`,
        },
    };
}

const submitPublicResponseMeta = ({ getPathFn, tags }: FormMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: POST,
            path: pathType,
            tags: tags ?? ["Form"],
            summary: "Submit a response to a published form",
            description: `
### Overview

Records an anonymous respondent's answers against a published form and bumps the form's
\`submissionCount\`, both in one transaction so a submission cap cannot be walked past.

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`slug\` | string | Yes | Slug from the public link. |
| \`formId\` | string (uuid) | Yes | Form id from the public link. |
| \`answers\` | array | Yes | \`{ fieldId, value }\` per answered field; \`value\` may be a string or a list of strings. |
| \`completionTimeInSec\` | number | No | How long the respondent spent on the form. |

### Flow

1. The form is re-read and re-checked — published, not expired, not full.
2. Answers for fields the form does not own are dropped, and empty answers are ignored.
3. Every required field must be answered, or the submission is rejected.
4. The response, its answers and the incremented count are written together.

### Response

Returns \`{ success, responseId, message }\`.

### Errors

- **Not found** — no published form matches that slug and id.\n
- **Closed** — the form has expired or has reached its submission limit.\n
- **Validation** — a required field was left unanswered.\n
`,
        },
    };
}

export {
    createFormMeta,
    getFormByIdMeta,
    listFormsMeta,
    updateFormMeta,
    deleteFormMeta,
    cloneFormMeta,
    formStatsMeta,
    getPublicFormMeta,
    submitPublicResponseMeta
};
