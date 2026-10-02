import type { Example, RecentDraft } from "./types";

export const PROMPT_EXAMPLES: Example[] = [
    {
        id: "rsvp",
        title: "Wedding RSVP",
        blurb: "Guests, meal choices, plus-ones",
        prompt:
            "An RSVP form for my wedding — who's coming, whether they're bringing a plus-one, meal choice between chicken, fish and vegetarian, and any dietary needs.",
        icon: "sakura",
        tint: "pink",
    },
    {
        id: "job",
        title: "Job application",
        blurb: "Details, experience, resume upload",
        prompt:
            "An application form for a senior software developer role — name, email, phone, years of experience, LinkedIn and portfolio links, a resume upload and a short cover letter.",
        icon: "clip",
        tint: "indigo",
    },
    {
        id: "feedback",
        title: "Customer feedback",
        blurb: "Ratings and open comments",
        prompt:
            "A feedback form to send after a purchase — overall rating out of five, what they liked, what we could do better, and whether they'd recommend us.",
        icon: "star",
        tint: "peach",
    },
    {
        id: "event",
        title: "Event registration",
        blurb: "Sessions, tickets, dietary needs",
        prompt:
            "A registration form for a one-day conference — attendee details, which two breakout sessions they want, t-shirt size and dietary requirements.",
        icon: "calendar",
        tint: "matcha",
    },
    {
        id: "contact",
        title: "Contact form",
        blurb: "Short, and gets to the point",
        prompt:
            "A simple contact form for my website — name, email, what the enquiry is about from a short list, and a message box.",
        icon: "mail",
        tint: "lavender",
    },
    {
        id: "survey",
        title: "Team survey",
        blurb: "Scales, multi-select, free text",
        prompt:
            "An anonymous quarterly team survey — how supported people feel on a scale, which areas need the most attention, and space for anything they'd like to raise.",
        icon: "users",
        tint: "highlighter",
    },
];

export const STEPS = [
    { n: "01", title: "Describe it", body: "A sentence or two in plain words. Detail helps." },
    { n: "02", title: "Review the draft", body: "Questions, field types and validation, ready to read." },
    { n: "03", title: "Edit in the builder", body: "Open it up and change anything you like." },
];

export const RECENT_DRAFTS: RecentDraft[] = [
    {
        id: "r1",
        title: "Pottery Weekend · Registration",
        kind: "form",
        questions: 7,
        when: "2 hours ago",
    },
    {
        id: "r2",
        title: "Senior Software Developer Application",
        kind: "form",
        questions: 9,
        when: "Yesterday",
    },
    {
        id: "r3",
        title: "Post-purchase Feedback",
        kind: "template",
        questions: 5,
        when: "Yesterday",
    },
    {
        id: "r4",
        title: "Spring Conference · Attendee Details",
        kind: "form",
        questions: 11,
        when: "3 days ago",
    },
    {
        id: "r5",
        title: "Quarterly Team Pulse",
        kind: "template",
        questions: 6,
        when: "Last week",
    },
];

export const PROMPT_TIPS = [
    "Name the fields you know you need — email, phone, a file upload.",
    "Say how people should answer: pick one, pick many, a rating, a date.",
    "Mention who is filling it in; the tone of the questions follows.",
];
