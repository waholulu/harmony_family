import { test, expect } from "vitest";
import { POST as validatePOST } from "../src/app/api/validate/route";
import { POST as revealPOST } from "../src/app/api/reveal/route";
import { config } from "dotenv";

// Load environment variables from .env.local if present
config({ path: ".env.local" });

test("validate API should return validation text", async () => {
    const req = new Request("http://localhost/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prompt: "I am so mad my partner never does the dishes! It's always me cleaning up.",
            topic: "Household Chores",
            desc: "Disagreement over cleaning responsibilities"
        })
    });

    const res = await validatePOST(req);
    const json = await res.json();
    if (res.status === 500) console.error("VALIDATE ERR:", json);
    expect(res.status).toBe(200);

    expect(json).toHaveProperty("validation");
    expect(typeof json.validation).toBe("string");
    expect(json.validation.length).toBeGreaterThan(0);
}, 20000);

test("reveal API should return iceberg model", async () => {
    const req = new Request("http://localhost/api/reveal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prompt: "I am so mad my partner never does the dishes! I have to clean up after them every day!",
            topic: "Household Chores",
            desc: "Disagreement over cleaning responsibilities"
        })
    });

    const res = await revealPOST(req);
    const json = await res.json();
    if (res.status === 500) console.error("REVEAL ERR:", json);
    expect(res.status).toBe(200);

    expect(json).toHaveProperty("userNeeds");
    expect(json).toHaveProperty("partnerNeeds");

    // Check userNeeds structure
    expect(json.userNeeds).toHaveProperty("surface");
    expect(json.userNeeds).toHaveProperty("hidden");
    expect(json.userNeeds).toHaveProperty("translation");

    // Check partnerNeeds structure
    expect(json.partnerNeeds).toHaveProperty("surface");
    expect(json.partnerNeeds).toHaveProperty("hidden");
    expect(json.partnerNeeds).toHaveProperty("translation");
}, 20000);
