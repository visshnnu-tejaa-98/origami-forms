// Used for docs generation

import { GET } from "../constants";

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

type ResponseMetaInputProps = {
    getPathFn: () => string;
    tags?: string[];
};

const listResponsesMeta = ({ getPathFn, tags }: ResponseMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: GET,
            path: pathType,
            tags: tags ?? ["Response"],
            summary: "List form responses",
            description: `
### Overview

Returns a paginated list of responses submitted to non-deleted forms, with optional
filtering, searching and sorting. Access is scoped by role: an admin sees responses across
all forms, while a regular user only sees responses to the forms they created. Each
response is returned already flattened — its answers are aligned against the form's live
fields, so a field that was never answered still appears with a \`null\` value.

### Query Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins see responses to all forms). |
| \`formId\` | string (uuid) | No | Restrict the list to a single form. |
| \`search\` | string | No | Case-insensitive partial match (1–255 chars) against the respondent's email, first name or last name, or against the form title. |
| \`status\` | enum | No | Filter by \`partial\` or \`completed\`; \`all\` returns both. Defaults to \`completed\`. |
| \`sortBy\` | enum | No | One of \`submittedAt\`, \`completionTimeInSec\`. Defaults to \`submittedAt\`. |
| \`sortOrder\` | enum | No | \`asc\` or \`desc\`. Defaults to \`desc\`. |
| \`page\` | number | No | 1-indexed page number. Defaults to \`1\`. |
| \`pageSize\` | number | No | Items per page (1–100). Defaults to \`10\`. |

### Flow

1. The requester's role is resolved to determine admin access.
2. Responses are scoped to non-deleted forms; a non-admin is further scoped to forms they
   created, and to a single form when \`formId\` is given.
3. \`search\` is matched against the respondent's user record *or* the form title, without
   widening the ownership scope above.
4. Results are ordered by the sort column with the response id as a stable tiebreaker, so
   pagination does not repeat or skip rows when timestamps collide.
5. For each response, its answers are keyed by field id and aligned against the form's
   non-deleted fields in \`order\`.

### Response

Returns \`{ responses, page, pageSize, totalItems, totalPages, hasNextPage, hasPrevPage }\`,
where \`totalItems\` is the count of all responses matching the same filters.

Each entry of \`responses\` has the shape:

| Field | Type | Description |
| --- | --- | --- |
| \`id\` | string (uuid) | Id of the response. |
| \`name\` | string \\| null | Respondent's full name, absent for anonymous submissions. |
| \`email\` | string \\| null | Respondent's email, absent for anonymous submissions. |
| \`status\` | enum | \`partial\` or \`completed\`. |
| \`logoUrl\` | string \\| null | Logo of the form the response belongs to. |
| \`formTitle\` | string | Title of the form the response belongs to. |
| \`submittedAt\` | string (date-time) \\| null | When the response was submitted; \`null\` while still \`partial\`. |
| \`completionTimeInSec\` | number \\| null | Seconds the respondent spent completing the form. |
| \`answers\` | array | One \`{ fieldId, fieldType, fieldLabel, value, order }\` entry per live form field, ordered by \`order\`, with \`value: null\` where the field was not answered. |

Respondent telemetry stored on the response (IP, city, device, referrer) is never included.

### Errors

- **Validation** — a query parameter fails its schema constraint (e.g. \`pageSize\` above 100, malformed \`requesterId\`).
- **User not found** — \`requesterId\` does not match a known user.
`,
        },
    };
};

const responsesStatsMeta = ({ getPathFn, tags }: ResponseMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: GET,
            path: pathType,
            tags: tags ?? ["Response"],
            summary: "Get response statistics",
            description: `
### Overview

Returns counts of responses broken down by status, across non-deleted forms. Access is
scoped by role: an admin sees responses across all forms, while a regular user only sees
responses to the forms they created. Unlike *List form responses*, this endpoint takes no
filters — it always reports over the requester's full visible set.

### Query Parameters

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| \`requesterId\` | string (uuid) | Yes | Id of the requesting user (admins see responses to all forms). |

### Flow

1. The requester's role is resolved to determine admin access.
2. Responses are scoped to non-deleted forms; a non-admin is further scoped to forms they created.
3. The statuses of the matching responses are counted, and the total is counted alongside them.

### Response

Returns \`{ completed, partial, totalItems }\`, where:

- \`completed\` — number of responses with status \`completed\`;
- \`partial\` — number of responses with status \`partial\`;
- \`totalItems\` — total number of responses in scope.

### Errors

- **Validation** — \`requesterId\` is missing or is not a valid uuid.
- **User not found** — \`requesterId\` does not match a known user.
`,
        },
    };
};

export { listResponsesMeta, responsesStatsMeta };
