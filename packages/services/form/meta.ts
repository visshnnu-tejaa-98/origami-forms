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
The form is owned by the authenticated user (\`creatorId\`). A URL-safe \`slug\` is
generated from the title with a random suffix to keep it unique, and every field is
assigned a unique \`labelKey\`.

\`status\` is chosen by the caller and defaults to \`draft\`; passing \`published\` creates a
live form directly and stamps \`publishedAt\`, without a follow-up update.

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`title\` | string | Yes | Form title (2–255 characters). |
| \`description\` | string | No | Optional form description. |
| \`logoUrl\` | string | No | Valid URL of the form logo. |
| \`visibility\` | enum | No | One of \`public\`, \`unlisted\`, \`authenticated\`. Defaults to \`unlisted\`. |
| \`maxSubmissions\` | number | No | Positive integer cap on total submissions. |
| \`status\` | enum | No | \`draft\`, \`published\`, \`archived\` or \`expired\`. Defaults to \`draft\`. |
| \`expiresAt\` | string (date) | No | When submissions stop being accepted. |
| \`fields\` | array | Yes | At least one field. Shape depends on the field \`type\` (text, number, select, multi-select, date, file upload). |

### Flow

1. A form row is inserted with a generated \`slug\` and the requested \`status\`.
2. Each field in \`fields\` is inserted with a generated \`labelKey\`. Ordering comes from the
   array's position, **not** from any \`order\` value sent by the client — the two can
   disagree, and the array wins.
3. A creator activity is recorded (\`published\` when the form was created live, otherwise
   \`drafted\`), and its broadcast payload is returned as \`realTime\`.
4. If any step fails, the whole transaction is rolled back so no partial form is left behind.

### Response

Returns the created form row with \`submissionCount: 0\`, its inserted \`fields\`, and
\`realTime\` — the activity-feed payload for the socket broadcast, or \`null\` when the
creator record could not be read.

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
4. A second query counts the form's live \`form_views\` rows. It is a \`COUNT\` rather than a
   join, so a form with many views does not drag those rows into the payload.

### Response

Returns the form with its \`fields\` array (ordered by \`order\`) plus a \`views\` count, or
\`null\` when no matching form exists or the requester is not allowed to see it.

| Field | Type | Description |
| --- | --- | --- |
| \`views\` | number | Count of non-deleted \`form_views\` rows for this form, all-time — not narrowed by any date range. |

\`null\` covers both "no such form" and "not permitted"; the two are deliberately
indistinguishable so a non-owner cannot probe for the existence of a form id.

### Notes for callers

Nothing writes \`form_views\` from the public form route yet, so \`views\` reads \`0\` for
forms that have only ever been opened anonymously.
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
not included in the list payload; a per-form \`views\` count is.

### Query Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins see all forms). |
| \`search\` | string | No | Case-insensitive partial match against the form title. |
| \`status\` | enum | No | One of \`draft\`, \`published\`, \`archived\`, \`expired\`. See *Status filtering* below. |
| \`visibility\` | enum | No | One of \`public\`, \`unlisted\`, \`authenticated\`. |
| \`maxSubmissions\` | number | No | Only forms whose current submission count is at most this value. |
| \`sortBy\` | enum | No | One of \`createdAt\`, \`updatedAt\`, \`title\`, \`submissionCount\`, \`maxSubmissions\`, \`status\`. Defaults to \`updatedAt\`. |
| \`sortOrder\` | enum | No | \`asc\` or \`desc\`. Defaults to \`desc\`. |
| \`page\` | number | No | 1-indexed page number. Defaults to \`1\`. |
| \`pageSize\` | number | No | Items per page (1–100). Defaults to \`10\`. |

### Status filtering

\`status\` is not a plain column match — \`published\` and \`expired\` both read the
\`published\` column and split on \`expiresAt\`:

| Value | Matches |
| --- | --- |
| \`published\` | status \`published\` **and** \`expiresAt\` is null or still in the future |
| \`expired\` | status \`published\` **and** \`expiresAt\` already passed |
| \`draft\` / \`archived\` | a direct status match |

So a form that has run out of time is never returned by \`status: "published"\`.

### Response

Returns \`{ forms, page, pageSize, totalItems, totalPages, hasNextPage, hasPrevPage }\`,
where \`totalItems\` is the count of all forms matching the same filters.

Each entry carries a \`views\` count — non-deleted \`form_views\` rows for that form,
all-time and not narrowed by any filter above. The counts are gathered in one grouped
query over the page, so a form with no views reports \`0\` rather than being omitted.
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
| \`status\` | enum | No | New status (\`draft\`, \`published\`, \`archived\`, \`expired\`). |
| \`visibility\` | enum | No | New visibility (\`public\`, \`unlisted\`, \`authenticated\`). |
| \`maxSubmissions\` | number \\| null | No | New submission cap, or \`null\` to clear. |
| \`expiresAt\` | string (date) \\| null | No | New expiry date/time, or \`null\` to clear. |

### Flow

1. The form is fetched and authorized via the same rules as *Get a form by id*.
2. A status change to \`published\` stamps \`publishedAt\` (first time only); a change to
   \`archived\` stamps \`archivedAt\`.
3. Only explicitly provided fields are written; if nothing changed the update is skipped.

### Response

Returns \`{ success, message, formData, realTime }\`. On success \`formData\` holds the
re-read form — the same shape as *Get a form by id*, including its \`fields\` and a
\`views\` count. On a blocked transition or when there is nothing to update, \`success\` is
\`false\` and \`formData\` is \`null\`.

\`realTime\` carries the activity-feed payload: a \`published\` activity when the update
crossed from draft into published, otherwise \`edited\`. Note that an activity is recorded
on **every** successful update, not only on publish.

### Editing fields

When \`fields\` is supplied it replaces the whole list: entries with a known \`id\` are
updated, new entries are inserted, and any existing field missing from the array is
soft-deleted. Omit \`fields\` entirely to leave them untouched.

Once a form has submissions this is restricted — changing a field's \`type\` or removing a
field throws, so historical answers keep their meaning.

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

Soft-deletes a form and cascades the soft-delete to its fields, its responses, those
responses' answers, and the form's activity and view rows — all in a single transaction. Nothing is physically removed —
\`deletedAt\` is stamped on every still-live row. A \`published\` form can be deleted even
when it already has submissions; its responses are soft-deleted alongside it.

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`formId\` | string (uuid) | Yes | Id of the form to delete. |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins may delete any form). |

### Flow

1. The form is fetched; if it does not exist the request fails.
2. The requester is authorized — an admin may delete any form, anyone else only a form they created.
3. \`deletedAt\` is set on the form; if no row matched the transaction is rolled back.
4. \`deletedAt\` is set on all of the form's fields that are not already soft-deleted.
5. \`deletedAt\` is set on all of the form's live responses, and then on the answers
   belonging to those responses.
6. \`deletedAt\` is set on the form's live \`analytics\` and \`form_views\` rows. This happens
   whether or not the form had any responses.

### Response

Returns \`{ success, message }\`.

### Errors

- **Form not found** — no matching, non-deleted form.
- **Unauthorized** — a non-admin attempting to delete a form they do not own (\`success: false\`).
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

Fetches the counters behind the dashboard's headline row, over every non-deleted form the
requester can see. Admins see all forms; everyone else only the forms they created.

This endpoint accepts **no filters** — not status, visibility, submission count or date.
It always reports over the requester's full visible set.

### Query Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins see all forms). Supplied from the session, not the client. |

### Response

| Field | Type | Description |
| --- | --- | --- |
| \`published\` | number | Status \`published\` whose \`expiresAt\` is null or still ahead. |
| \`draft\` | number | Status \`draft\`. |
| \`archived\` | number | Status \`archived\`. |
| \`expired\` | number | Status \`published\` whose \`expiresAt\` has passed. |
| \`total\` | number | All non-deleted forms in scope. |
| \`totalResponses\` | number | **Sum of \`forms.submissionCount\`**, not a count of response rows. |
| \`completedResponses\` | number | Count of response rows with status \`completed\`. |
| \`pendingResponses\` | number | \`totalResponses - completedResponses\`. |
| \`totalViews\` | number | Count of \`form_views\` rows across the requester's forms. |
| \`completionRate\` | number | \`completedResponses / totalResponses\` as a whole percent. |
| \`avgTimeCompletion\` | number | Mean \`completion_time\` over completed responses, in whole seconds. |

\`published\` and \`expired\` are disjoint, so \`published + draft + archived + expired\` can
be lower than \`total\` if a form holds a status outside that set.

Because \`totalResponses\` counts submissions recorded on the form row while
\`completedResponses\` counts actual rows, the two can drift apart — treat
\`completionRate\` as indicative rather than exact.

### Errors

- **Validation** — \`requesterId\` is missing or is not a valid uuid.
- **Parse failure** — the assembled counters did not match the output schema; the service
  throws \`Failed to parse form stats\`.\n
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
