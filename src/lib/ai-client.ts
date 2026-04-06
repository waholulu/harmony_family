// Client-side AI service for GitHub Pages static deployment.
// Replaces the server-side API routes with mock implementations.

export interface RevealData {
    userNeeds: {
        surface: string;
        hidden: string;
        translation: string;
    };
    partnerNeeds: {
        surface: string;
        hidden: string;
        translation: string;
    };
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function validateInput(
    _prompt: string,
    _topic: string,
    _desc: string
): Promise<string> {
    await delay(1500);
    return "It sounds like you're feeling really frustrated. That's completely understandable. It's hard when you feel like you're not being heard. Take a deep breath, we are here to help untangle this.";
}

export async function revealNeeds(
    _prompt: string,
    _topic: string,
    _desc: string
): Promise<RevealData> {
    await delay(2000);
    return {
        userNeeds: {
            surface: "Cleanliness and order",
            hidden: "Feeling respected and valued in the home",
            translation: "I feel overwhelmed when the shared space is messy, and I would love us to keep it organized together so I can relax.",
        },
        partnerNeeds: {
            surface: "Convenience and comfort",
            hidden: "Feeling accepted without constant criticism",
            translation: "I sometimes forget the small things because I'm exhausted, but I don't want to feel like a disappointment.",
        },
    };
}

const MOCK_CHAT_RESPONSE =
    "I see what you mean, but it's hard to remember every little thing when I'm tired. I do want to help though.";

export async function streamChat(
    onWord: (word: string) => void,
    onDone: () => void
): Promise<void> {
    const words = MOCK_CHAT_RESPONSE.split(" ");
    for (const word of words) {
        await delay(100);
        onWord(word + " ");
    }
    onDone();
}
