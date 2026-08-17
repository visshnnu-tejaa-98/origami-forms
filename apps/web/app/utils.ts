// Output: 'July 23, 2026'
export const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long", // "July"
    day: "numeric", // "23"
    year: "numeric", // "2026"
});

export const relativeTime = (iso: string) => {
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

export const getNameFromEmail = (email: string) => {
    return email.split("@")[0]
}