import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const { prompt, topic, desc } = await req.json();

        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            return Response.json({
                userNeeds: {
                    surface: "Cleanliness and order",
                    hidden: "Feeling respected and valued in the home",
                    translation: "I feel overwhelmed when the shared space is messy, and I would love us to keep it organized together so I can relax."
                },
                partnerNeeds: {
                    surface: "Convenience and comfort",
                    hidden: "Feeling accepted without constant criticism",
                    translation: "I sometimes forget the small things because I'm exhausted, but I don't want to feel like a disappointment."
                }
            });
        }

        const { object } = await generateObject({
            model: google("models/gemini-2.5-pro"),
            system: `You are a conflict translator for a family communication coach app.
Your job is to take a raw, emotional input from a user about a conflict and extract the "Iceberg Model" of needs.
You must find:
1. The user's surface complaint.
2. The user's hidden, underlying need (e.g., fear, desire for connection, respect).
3. A non-violent, constructive translation of what the user actually wants to say.
Then, you must also guess the OTHER person's perspective based on the context to help build empathy:
4. The other person's likely surface defense.
5. The other person's likely hidden need.
6. A constructive translation of what the other person might be feeling.
Be highly empathetic and neutral. Avoid any blame.`,
            schema: z.object({
                userNeeds: z.object({
                    surface: z.string().describe("What the user says they are upset about."),
                    hidden: z.string().describe("The deeper emotional need (e.g., feeling seen, respected, secure)."),
                    translation: z.string().describe("A safe, non-violent 'I-statement' translation of their grievance.")
                }),
                partnerNeeds: z.object({
                    surface: z.string().describe("What the partner's immediate defense or action looks like."),
                    hidden: z.string().describe("The partner's likely deeper emotional need or insecurity."),
                    translation: z.string().describe("A safe translation of the partner's perspective.")
                })
            }),
            prompt: `Context: ${topic} - ${desc}\nUser says: ${prompt}`,
        });

        return Response.json(object);
    } catch (error: any) {
        console.error("Reveal API Error:", error.message || error);

        // Fallback for quota limits
        const errorString = String(error.message || error).toLowerCase();
        if (errorString.includes('quota') || errorString.includes('429') || errorString.includes('resource_exhausted') || errorString.includes('generaterequestsperminute')) {
            return Response.json({
                userNeeds: {
                    surface: "Cleanliness and order",
                    hidden: "Feeling respected and valued in the home",
                    translation: "I feel overwhelmed when the shared space is messy, and I would love us to keep it organized together so I can relax."
                },
                partnerNeeds: {
                    surface: "Convenience and comfort",
                    hidden: "Feeling accepted without constant criticism",
                    translation: "I sometimes forget the small things because I'm exhausted, but I don't want to feel like a disappointment."
                }
            });
        }

        return Response.json({ error: error.message || "Failed to generate reveal data." }, { status: 500 });
    }
}
