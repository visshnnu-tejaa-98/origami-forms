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

type FileMetaInputProps = {
    getPathFn: () => string;
    tags?: string[];
};

const getImageUploadParamsMeta = ({ getPathFn, tags }: FileMetaInputProps): OpenApiMetaConfig => {
    const pathType = getPathFn() as `/${string}`;
    return {
        openapi: {
            method: GET,
            path: pathType,
            tags: tags ?? ["File"],
            summary: "Get image upload credentials",
            description: `
### Overview

Issues short-lived credentials that let the caller upload an image directly to ImageKit from
the browser, without the file passing through this API and without the private API key ever
leaving the server. The credentials authorise *an* upload — they do not reserve a filename,
folder or size, and they are not tied to any form or other resource.

### Query Parameters

Takes no input.

### Flow

1. The caller is authenticated; the credentials are issued to the authenticated session.
2. A random token is generated and an expiry is set 30 minutes ahead.
3. The token and expiry are signed with the private API key using HMAC-SHA1.
4. The signature is returned alongside the public API key, which the browser needs to address
   the upload endpoint.

### Response

Returns \`{ token, expire, signature, publicKey }\`:

| Field | Type | Description |
| --- | --- | --- |
| \`token\` | string | Unique identifier for this upload session. |
| \`expire\` | number | Unix timestamp (seconds) after which the credentials are rejected. |
| \`signature\` | string | HMAC-SHA1 signature over the token and expiry. |
| \`publicKey\` | string | Public API key identifying the ImageKit account to upload into. |

The private API key is never part of the response.

### Notes

- The credentials are valid for 30 minutes and are single-use — fetch them at the moment of
  upload rather than when the picker mounts, or the upload will fail once they lapse.
- Nothing is persisted here. The upload's resulting URL only becomes part of the application
  state once the caller writes it back through the relevant resource, such as a form's
  \`logoUrl\`.
- Because the signature does not cover the destination path, the browser chooses the folder
  and filename it uploads to. Any path that must be trusted has to be verified when the URL
  is written back.

### Errors

- **Unauthorized** — the caller has no authenticated session.
- **Configuration** — the ImageKit keys are missing from the environment, which fails at
  service start-up rather than per request.
`,
        },
    };
};

export { getImageUploadParamsMeta };
