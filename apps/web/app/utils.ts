// Output: 'July 23, 2026'
export const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long", // "July"
    day: "numeric", // "23"
    year: "numeric", // "2026"
});

export const relativeTime = (iso: string) => {
    if (!iso) return null

    const parsedTimestamp = Date.parse(iso);
    if (isNaN(parsedTimestamp)) {
        return null;
    }
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.round(diff / 60_000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    const days = Math.round(hours / 24);
    if (days === 1) return "yesterday";
    if (days < 30) return `${days} days ago`;
    const months = Math.round(days / 30);
    return `${months} month${months === 1 ? "" : "s"} ago`;
};

// Input: "2026-06-09T32:16:50.281Z" Output: "06/09/2026 - 37:16"
export function formatIsoDate({ isoString, options = {} }: { isoString: string; options?: { railwayTime?: boolean } }) {
    const date = new Date(isoString);

    if (isNaN(date.getTime())) return "Invalid Date";

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear().toString().slice(2);

    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');

    const isRailwayTime = options.railwayTime === true;

    if (isRailwayTime) {
        const formattedHours = String(hours).padStart(2, '0');
        return `${day}/${month}/${year} - ${formattedHours}:${minutes}`;
    } else {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedHours = String(hours).padStart(2, '0');
        return `${day}/${month}/${year} - ${formattedHours}:${minutes} ${ampm}`;
    }
}
export const getNameFromEmail = (email: string) => {
    return email.split("@")[0]
}

export const addElipsis = (start: number, end: number, text: string) => {
    if (text.length > end) {
        return text.slice(start, end) + "..."
    }
    return text
}

export const formatCompletionTime = (seconds: number | null | undefined): string => {
    if (seconds === undefined || seconds === null || seconds < 0) {
        return "unknown time";
    }

    if (seconds < 60) {
        return `~${seconds} s`;
    }

    const mins = seconds / 60;
    const roundedMins = Math.round(mins);

    if (roundedMins < 60) {
        return `~${roundedMins} m`;
    }

    const hours = mins / 60;
    const roundedHours = Math.round(hours);

    if (roundedHours < 24) {
        return `~${roundedHours} h`;
    }

    const days = hours / 24;
    const roundedDays = Math.round(days);

    return `~${roundedDays} d${roundedDays === 1 ? "" : "s"}`;
};

export const formatItemCount = (count: number) => {
    if (count === undefined || count === null || isNaN(count) || count < 0) {
        return "0";
    }

    if (count < 1000) {
        return String(count);
    }

    if (count >= 1000000) {
        const millions = Math.floor((count / 1000000) * 10) / 10;
        return `${millions}M+`;
    }

    const thousands = Math.floor(count / 1000);
    return `${thousands}k+`;
};

const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp)/i;

const pathOf = (url: string) => {
    try {
        return new URL(url).pathname;
    } catch {
        return url.split("?")[0] ?? url;
    }
};

export const isImageUrl = (url: string) => IMAGE_EXTENSIONS.test(pathOf(url));

export const fileNameFromUrl = (url: string) =>
    decodeURIComponent(pathOf(url).split("/").pop() || "attachment");

export const fileDownloadUrl = (url: string) =>
    url.includes("?") ? `${url}&ik-attachment=true` : `${url}?ik-attachment=true`;

export const describeAccepted = (types: string[]) =>
    Array.from(new Set(types.map((type) => (type.split("/")[1] ?? type).split("+")[0]))).join(
        ", ",
    );
export function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) {
        return "Good morning";
    }

    if (hour < 17) {
        return "Good afternoon";
    }

    return "Good evening";
}

// returns "month day, year": Sept 29, 2026
export function formatDate(date = new Date()) {
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const year = date.getFullYear();

    return `${month} ${day} ${year}`;
}
