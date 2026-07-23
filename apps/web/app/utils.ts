// Output: 'July 23, 2026'
export const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",   // "July"
    day: "numeric",  // "23"
    year: "numeric", // "2026"
});
