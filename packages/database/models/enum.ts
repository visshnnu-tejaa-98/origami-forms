import { pgEnum } from "drizzle-orm/pg-core";

export const userRolesEnum = pgEnum("user_roles", ["admin", "subscriber", "starter"])

export const formStatusEnum = pgEnum("form_status", ["draft", "published", "archived"]);

export const formVisibilityEnum = pgEnum("form_visibility", ["public", "unlisted"])

export const formFieldTypeEnum = pgEnum("field_type",
    ["short_text", "long_text", "email", "number", "phone", "url", "date", "single_select", "multi_select", "check_box", "radio", "rating", "file_upload"]
)

export const responseStatusEnum = pgEnum("response_statis", ["partial", "completed"])

export const analyticsEventTypeEnum = pgEnum("analytics_event_type", ["viewed", "started", "submitted", "abandoned", "email_sent"])
