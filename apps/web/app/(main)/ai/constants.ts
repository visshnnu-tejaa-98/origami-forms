import type { Example, RecentDraft } from "./types";
import type { AiTemplate } from "./schema";

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


export const systemBehaviour = `
# Role

You are a form-generation assistant.

# Task

Your task is to generate a complete form template based on the user's request.

The form should contain:
- A clear and concise title
- A useful description
- A list of fields required to collect the requested information

# Supported Field Types

You may use only the following field types:

- single_select
- multi_select
- radio
- checkbox
- text
- number
- date
- email
- phone
- rating
- page_break
- file
- heading

# Field Selection Rules

Choose the field type that best matches the information the user wants to collect.

For example:

- Use "text" for names, addresses, comments, and general text.
- Use "number" for ages, quantities, prices, and other numeric values.
- Use "email" for email addresses.
- Use "phone" for phone numbers.
- Use "date" for dates.
- Use "single_select" when the user should select one option.
- Use "multi_select" when the user can select multiple options.
- Use "radio" when the user should select exactly one option from a small list.
- Use "checkbox" for yes/no or agreement-style choices.
- Use "rating" for satisfaction or rating questions.
- Use "file" when the user needs to upload a file.
- Use "page_break" when the form should be divided into multiple pages.
- Use "heading" when the form should be divided into multiple pages.


# Guidelines

- Only generate fields relevant to the user's request.
- Do not generate unnecessary fields.
- Make reasonable assumptions when the user's request is not completely specific.
- Mark a field as required only when the information is important for the purpose of the form.
- For select, radio, checkbox, and multi-select fields, generate appropriate options.
- Keep labels clear and concise.
- Keep descriptions helpful but short.
- Do not invent unrelated information.
- Do not place heading and page_break side by side.
- Do not place two headings side by side.

# Output

Return the form according to the provided structured output schema.`




export const dummyAPIData: AiTemplate = {
    "title": "Customer Feedback Form",
    "description": "We appreciate your feedback following your recent purchase. Please take a moment to share your thoughts with us.",
    "fields": [
        {
            "type": "rating",
            "label": "Overall Rating",
            "description": "Please rate your experience with us from 1 to 5, with 5 being the best.",
            "helpText": "Select a rating between 1 and 5.",
            "required": true,
            "order": 1,
            "placeholder": null,
            "defaultValue": null,
            "validation": null,
            "options": null
        },
        {
            "type": "long_text",
            "label": "What Did You Like?",
            "description": "Please share what you enjoyed about your purchase or experience.",
            "helpText": "Your feedback helps us know what's working well for us.",
            "required": false,
            "order": 2,
            "placeholder": "Enter your thoughts here...",
            "defaultValue": null,
            "validation": null,
            "options": null
        },
        {
            "type": "long_text",
            "label": "What Could We Do Better?",
            "description": "We value constructive criticism. Please let us know how we can improve.",
            "helpText": "Your suggestions are crucial for our growth.",
            "required": false,
            "order": 3,
            "placeholder": "Enter your thoughts here...",
            "defaultValue": null,
            "validation": null,
            "options": null
        },
        {
            "type": "radio",
            "label": "Would You Recommend Us?",
            "description": "Would you recommend our products/services to others?",
            "helpText": "Select one option below.",
            "required": true,
            "order": 4,
            "placeholder": null,
            "defaultValue": null,
            "validation": null,
            "options": [
                {
                    "id": "yes",
                    "label": "Yes",
                    "value": "yes"
                },
                {
                    "id": "no",
                    "label": "No",
                    "value": "no"
                }
            ]
        }
    ]
}