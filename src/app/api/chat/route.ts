import { streamText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages, data } = await req.json();

        const topic = data?.topic || "a family issue";
        const partnerSurface = data?.partnerSurface || "Defensiveness";
        const partnerHidden = data?.partnerHidden || "Fear of being judged";

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            // Mock streaming response for MVP without API key
            const encoder = new TextEncoder();
            const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

            const customReadable = new ReadableStream({
                async start(controller) {
                    const words = "I see what you mean, but it's hard to remember every little thing when I'm tired. I do want to help though.".split(" ");
                    controller.enqueue(encoder.encode(`0:"I "\n`));
                    for (const word of words.slice(1)) {
                        await delay(100);
                        controller.enqueue(encoder.encode(`0:"${word} "\n`));
                    }
                    controller.close();
                },
            });

            return new Response(customReadable, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'X-Vercel-AI-Data-Stream': 'v1'
                }
            });
        }

        const systemPrompt = `You are a role-play partner in a family communication coach app.
The user is practicing how to talk to their partner/family member about: ${topic}.
You must play the role of the OTHER person.
Here is the other person's psychological profile for this conflict:
- Surface defense: ${partnerSurface}
- Hidden emotional need: ${partnerHidden}

RULES:
1. Stay in character as the family member. Do NOT act like an AI coach holding their hand.
2. If the user uses "I-statements" and addresses your hidden needs, soften your tone and be cooperative.
3. If the user attacks or uses labels (e.g. "you always..."), become defensive based on your surface defense.
4. Keep responses brief (1-3 sentences) to simulate a real conversation.
5. Provide a subtle meta-feedback at the VERY END of your message in brackets IF the user did poorly, e.g. [Coach: You used a blaming word there, which made me defensive.]`;

        const result = await streamText({
            model: google("models/gemini-2.5-pro"),
            system: systemPrompt,
            messages,
        });

        return result.toAIStreamResponse();
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Chat API Error:", message);

        const errorString = message.toLowerCase();
        if (errorString.includes('quota') || errorString.includes('429') || errorString.includes('resource_exhausted') || errorString.includes('generaterequestsperminute')) {
            const encoder = new TextEncoder();
            const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
            const customReadable = new ReadableStream({
                async start(controller) {
                    const words = "I see what you mean, but it's hard to remember every little thing when I'm tired. I do want to help though. [Coach: Try using more supportive language rather than accusing]".split(" ");
                    controller.enqueue(encoder.encode(`0:"I "\n`));
                    for (const word of words.slice(1)) {
                        await delay(100);
                        controller.enqueue(encoder.encode(`0:"${word} "\n`));
                    }
                    controller.close();
                },
            });

            return new Response(customReadable, {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'X-Vercel-AI-Data-Stream': 'v1'
                }
            });
        }

        return new Response(JSON.stringify({ error: message || "Failed to generate chat." }), { status: 500 });
    }
}
