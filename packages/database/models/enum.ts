import { pgEnum } from "drizzle-orm/pg-core";
import {
    FORM_STATUS_OPTIONS,
    FORM_VISIBILITY_OPTIONS,
    USER_ROLES,
    FIELD_TYPES,
    RESPONSE_STATUS,
    ANALYTICS_EVENT_TYPES,
} from "../constants";

export const userRolesEnum = pgEnum("user_roles", USER_ROLES);

export const formStatusEnum = pgEnum("form_status", FORM_STATUS_OPTIONS);

export const formVisibilityEnum = pgEnum("form_visibility", FORM_VISIBILITY_OPTIONS);

export const formFieldTypeEnum = pgEnum("field_type", FIELD_TYPES);

export const responseStatusEnum = pgEnum("response_status", RESPONSE_STATUS);

export const analyticsEventTypeEnum = pgEnum("analytics_event_type", ANALYTICS_EVENT_TYPES);
