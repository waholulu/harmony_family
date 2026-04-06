import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { config } from "dotenv";

config({ path: ".env.local" });

async function main() {
    for (const modelName of ["gemini-2.5-pro", "models/gemini-2.5-pro", "gemini-2.0-flash", "gemini-1.5-pro"]) {
        try {
            const { text } = await generateText({
                model: google(modelName as any),
                prompt: "Say hello",
            });
            console.log(`SUCCESS [${modelName}]:`, text);
        } catch (e: any) {
            console.error(`ERROR [${modelName}]:`, e.message || e);
        }
    }
}

main();
