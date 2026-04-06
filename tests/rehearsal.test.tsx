import { describe, it, expect } from "vitest";
import RehearsalPage from "../src/app/rehearsal/[roomId]/page";

describe("RehearsalPage compilation test", () => {
    it("should be successfully imported without module resolution errors like 'ai/react' not found", () => {
        // Just verifying the import succeeds and it's a valid React component
        expect(typeof RehearsalPage).toBe("function");
    });
});
