

import OpenAI from "openai"

const OPEN_API_KEY = process.env.NEXT_OPEN_API_KEY;

export const apiKeyChecker = () => {
    console.log({ OPEN_API_KEY })
    if (!OPEN_API_KEY) {
        console.log("Error: NEXT_OPEN_API_KEY is not loaded")
    }
}

export const checkOpenAI = () => {

    const client = new OpenAI({ apiKey: OPEN_API_KEY });

    if (!client) {
        console.log("Error: Failed to initialise OpenAI client")
    }

    return client;
};

