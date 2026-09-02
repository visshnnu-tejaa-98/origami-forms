export const ADMIN = "admin";
export const SUBSCRIBER = "subscriber";
export const STARTER = "starter";

export const USER_ROLES = [ADMIN, SUBSCRIBER, STARTER] as const;

export const DRAFT = "draft";
export const PUBLISHED = "published";
export const ARCHIVED = "archived";
export const EXPIRED = "expired"

export const FORM_STATUS_OPTIONS = [DRAFT, PUBLISHED, ARCHIVED, EXPIRED] as const

export const PUBLIC = "public";
export const UNLISTED = "unlisted";
export const AUTHENTICATED = "authenticated"

export const FORM_VISIBILITY_OPTIONS = [PUBLIC, UNLISTED, AUTHENTICATED] as const;

export const SHORT_TEXT = "short_text";
export const LONG_TEXT = "long_text";
export const EMAIL = "email";
export const NUMBER = "number";
export const PHONE = "phone";
export const URL = "url";
export const DATE = "date";
export const SINGLE_SELECT = "single_select";
export const MULTI_SELECT = "multi_select";
export const CHECK_BOX = "check_box";
export const RADIO = "radio";
export const RATING = "rating";
export const FILE_UPLOAD = "file_upload";
export const HEADING = "heading"
export const PAGE_BREAK = "page_break"

export const FIELD_TYPES = [
    SHORT_TEXT,
    LONG_TEXT,
    EMAIL,
    NUMBER,
    PHONE,
    URL,
    DATE,
    SINGLE_SELECT,
    MULTI_SELECT,
    CHECK_BOX,
    RADIO,
    RATING,
    FILE_UPLOAD,
] as const

export const TEXT_LIKE_FIELDS = [SHORT_TEXT, LONG_TEXT, EMAIL, PHONE, URL] as const
export const NUMBER_LIKE_FIELDS = [NUMBER, RATING] as const


export const LAYOUT_FIELD_TYPES = [PAGE_BREAK, HEADING] as const

export const FORM_FIELD_TYPES = [...FIELD_TYPES, ...LAYOUT_FIELD_TYPES] as const

export const PARTIAL = "partial";
export const COMPLETED = "completed";
export const ALL = "all";

export const RESPONSE_STATUS = [PARTIAL, COMPLETED, ALL] as const;

export const VIEWED = "viewed";
export const STARTED = "started";
export const SUBMITTED = "submitted";
export const ABANDONED = "abandoned";
export const EMAIL_SENT = "email_sent";

export const ANALYTICS_EVENT_TYPES = [VIEWED, STARTED, SUBMITTED, ABANDONED, EMAIL_SENT] as const;
