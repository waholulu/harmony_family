import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(req: Request) {
    try {
        const { prompt, topic, desc } = await req.json();

        // In MVP, we might mock this if API key is not present. 
        // We will check for the key and fallback to a mock response.
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            // Mock validation response
            await new Promise((resolve) => setTimeout(resolve, 1500));
            return Response.json({
                validation: "It sounds like you're feeling really frustrated. That's completely understandable. It's hard when you feel like you're not being heard. Take a deep breath, we are here to help untangle this.",
            });
        }

        const { text } = await generateText({
            model: google("models/gemini-2.5-pro"),
            system: `You are the empathy engine for a family communication coach app.
Your ONLY job right now is "Instant Emotional Validation".
The user is going to vent about a family conflict.
Do NOT give advice. Do NOT judge who is right or wrong. 
DO validate their feelings, show empathy, and help them calm down.
Keep it under 3 sentences. Be warm and human.`,
            prompt: `Context: ${topic} - ${desc}\nUser says: ${prompt}`,
        });

        return Response.json({ validation: text });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Validate API Error:", message);

        // Fallback for quota limits
        const errorString = message.toLowerCase();
        if (errorString.includes('quota') || errorString.includes('429') || errorString.includes('resource_exhausted') || errorString.includes('generaterequestsperminute')) {
            return Response.json({
                validation: "It sounds like you're feeling really frustrated. That's completely understandable. It's hard when you feel like you're not being heard. Take a deep breath, we are here to help untangle this.",
            });
        }

        return Response.json({ error: message || "Failed to generate validation." }, { status: 500 });
    }
}
