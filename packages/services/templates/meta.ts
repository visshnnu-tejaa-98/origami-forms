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

type TemplateMetaInputProps = {
    getPathFn: () => string;
    tags?: string[];
};

const createTemplateMeta = ({ getPathFn, tags }: TemplateMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: POST,
            path: pathType,
            tags: tags ?? ["Template"],
            summary: "Create a template",
            description: `
### Overview

Creates a new template together with all of its fields in a single database transaction.
The template is owned by the authenticated user (\`creatorId\`). A URL-safe \`slug\` is
generated from the title with a random suffix to keep it unique, and every field is
assigned a unique \`labelKey\`.

\`status\` is chosen by the caller and defaults to \`draft\`; passing \`published\` creates a
live template directly and stamps \`publishedAt\`, without a follow-up update.

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`title\` | string | Yes | Template title (2–255 characters). |
| \`description\` | string | No | Optional template description. |
| \`logoUrl\` | string | No | Valid URL of the template logo. |
| \`status\` | enum | No | \`draft\`, \`published\` or \`archived\`. Defaults to \`draft\`. |
| \`fields\` | array | Yes | At least one field. Shape depends on the field \`type\` (text, number, select, multi-select, date, file upload) — the same field shapes a form takes. |

### Flow

1. A template row is inserted with a generated \`slug\` and the requested \`status\`.
2. Each field in \`fields\` is inserted with a generated \`labelKey\`. Ordering comes from the
   array's position, **not** from any \`order\` value sent by the client — the two can
   disagree, and the array wins.
3. If any step fails, the whole transaction is rolled back so no partial template is left
   behind.

Unlike *Create a form*, nothing is recorded on the activity feed and no socket broadcast
payload is returned — a template is authoring material, not a live form.

### Response

Returns the created template row with its inserted \`fields\`. \`publishedAt\` is set only
when the template was created as \`published\`; \`archivedAt\` and \`deletedAt\` start \`null\`.

### Errors

- **Validation** — a field fails its schema constraint (e.g. title too short, empty fields array, invalid field shape).
`,
        },
    };
};

const listTemplatesMeta = ({ getPathFn, tags }: TemplateMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: GET,
            path: pathType,
            tags: tags ?? ["Template"],
            summary: "List templates",
            description: `
### Overview

Returns a paginated list of non-deleted templates with optional filtering, searching and
sorting. Admins see all templates; regular users see only the templates they created.
Fields are not included in the list payload; a per-template like count is.

### Query Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins see all templates). |
| \`search\` | string | No | Case-insensitive partial match against the template title (1–255 characters). |
| \`status\` | enum | No | One of \`draft\`, \`published\`, \`archived\`. A direct column match. |
| \`sortBy\` | enum | No | One of \`createdAt\`, \`updatedAt\`, \`title\`, \`status\`. Defaults to \`updatedAt\`. |
| \`sortOrder\` | enum | No | \`asc\` or \`desc\`. Defaults to \`desc\`. |
| \`page\` | number | No | 1-indexed page number. Defaults to \`1\`. |
| \`pageSize\` | number | No | Items per page (1–100). Defaults to \`10\`. |

Unlike *List forms*, \`status\` here is a plain match on the column — there is no expiry to
split \`published\` against, because a template never stops being usable.

### Response

Returns \`{ templates, page, pageSize, totalItems, totalPages, hasNextPage, hasPrevPage }\`,
where \`totalItems\` is the count of all templates matching the same filters.

Each entry carries a \`likes\` count — non-deleted \`template_likes\` rows for that template,
all-time and not narrowed by any filter above. The counts are gathered in one grouped
query over the page, so a template with no likes reports \`0\` rather than being omitted.
`,
        },
    };
};

const getTemplateByIdMeta = ({ getPathFn, tags }: TemplateMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: GET,
            path: pathType,
            tags: tags ?? ["Template"],
            summary: "Get a template by id",
            description: `
### Overview

Fetches a single, non-deleted template by id along with its non-deleted fields, ordered by
the field \`order\`. Access is scoped by role: an admin can read any template, while a
regular user can only read templates they created.

### Path / Query Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`templateId\` | string (uuid) | Yes | Id of the template to fetch. |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins may read any template). |

### Flow

1. The requester's role is resolved to determine admin access.
2. A non-admin query is scoped to \`creatorId === requesterId\`; an admin query is not.
3. Soft-deleted templates and soft-deleted fields are excluded.
4. A second query counts the template's live \`template_likes\` rows. It is a \`COUNT\` rather
   than a join, so a popular template does not drag those rows into the payload.

### Response

Returns the template with its \`fields\` array (ordered by \`order\`) plus a \`likes\` count, or
\`null\` when no matching template exists or the requester is not allowed to see it.

| Field | Type | Description |
| --- | --- | --- |
| \`likes\` | number | Count of non-deleted \`template_likes\` rows for this template, all-time. |

\`null\` covers both "no such template" and "not permitted"; the two are deliberately
indistinguishable so a non-owner cannot probe for the existence of a template id.
`,
        },
    };
};

const updateTemplateMeta = ({ getPathFn, tags }: TemplateMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: PATCH,
            path: pathType,
            tags: tags ?? ["Template"],
            summary: "Update a template",
            description: `
### Overview

Partially updates a template. Only the fields provided in the request body are changed;
any field omitted is left untouched, and a nullable field may be set to \`null\` to clear
it. Access is scoped by role (admins may update any template; users only their own). The
\`slug\` is intentionally immutable and is never regenerated on update.

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`templateId\` | string (uuid) | Yes | Id of the template to update. |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins may update any template). |
| \`title\` | string | No | New title (2–255 characters). |
| \`description\` | string \\| null | No | New description, or \`null\` to clear. |
| \`logoUrl\` | string \\| null | No | New logo URL, or \`null\` to clear. |
| \`status\` | enum | No | New status (\`draft\`, \`published\`, \`archived\`). |
| \`fields\` | array | No | The full field list. Omit to leave the template's fields untouched. |

### Flow

1. The template is fetched and authorized via the same rules as *Get a template by id*.
2. A status change to \`published\` stamps \`publishedAt\` (first time only); a change to
   \`archived\` stamps \`archivedAt\`.
3. Only explicitly provided fields are written; if nothing changed and \`fields\` was
   omitted, the update is skipped and \`success\` is \`false\`.

### Status transitions

Moving a \`published\` template back to \`draft\` is rejected outright — a template that has
been published may be archived, but not un-published. Every other transition is allowed.

### Editing fields

When \`fields\` is supplied it replaces the whole list: entries with a known \`id\` are
updated, new entries are inserted, and any existing field missing from the array is
soft-deleted. Ordering again comes from the array's position. Omit \`fields\` entirely to
leave them untouched.

Unlike *Update a form*, there is no submission-history restriction: a template's fields can
be retyped or removed freely, because nothing has answered them.

### Response

Returns \`{ success, message, templateData }\`. On success \`templateData\` holds the re-read
template — the same shape as *Get a template by id*, including its \`fields\` and a \`likes\`
count.

On a blocked transition or when there is nothing to update, \`success\` is \`false\` and no
template data is returned.

### Errors

- **Template not found** — no matching, non-deleted template for this requester.
- **Blocked transition** — moving a \`published\` template back to \`draft\` is rejected (\`success: false\`).
- **No changes to update** — the body carried no updatable field and no \`fields\` array (\`success: false\`).
`,
        },
    };
};

const deleteTemplateMeta = ({ getPathFn, tags }: TemplateMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: DELETE,
            path: pathType,
            tags: tags ?? ["Template"],
            summary: "Delete a template",
            description: `
### Overview

Soft-deletes a template and cascades the soft-delete to its fields and its likes — all in
a single transaction. Nothing is physically removed — \`deletedAt\` is stamped on every
still-live row. Forms already created from the template are untouched, since a form copies
the template's fields rather than referencing them.

### Request Body

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`templateId\` | string (uuid) | Yes | Id of the template to delete. |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins may delete any template). |

### Flow

1. The template is fetched under the same access rules as *Get a template by id*; if it
   does not exist — or the requester may not see it — the request fails.
2. \`deletedAt\` is set on the template; if no row matched the transaction is rolled back.
3. \`deletedAt\` is set on all of the template's fields that are not already soft-deleted.
4. \`deletedAt\` is set on the template's live \`template_likes\` rows.

### Response

Returns \`{ success, message }\`.

### Errors

- **Template not found** — no matching, non-deleted template the requester can see. Because
  the lookup is already scoped to the owner, a non-owner gets this rather than an
  authorization error, so a template id cannot be probed for.
`,
        },
    };
};

export {
    createTemplateMeta,
    listTemplatesMeta,
    getTemplateByIdMeta,
    updateTemplateMeta,
    deleteTemplateMeta,
};
