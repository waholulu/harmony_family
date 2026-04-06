"use client";

import { useState, use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PageProps {
    params: Promise<{ roomId: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function InputPage(props: PageProps) {
    const params = use(props.params);
    const searchParams = use(props.searchParams);

    const router = useRouter();
    const [inputStr, setInputStr] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [validationMsg, setValidationMsg] = useState<string | null>(null);

    const topic = searchParams.topic || "Unknown Topic";
    const desc = searchParams.desc || "";

    // Handle the focus shift, "I-statements"
    const isFactStatement = inputStr.length > 10 && !inputStr.toLowerCase().includes("i ") && !inputStr.toLowerCase().includes("my ") && !inputStr.toLowerCase().includes("feel");

    const handleSubmit = async () => {
        if (!inputStr) return;
        setIsLoading(true);

        try {
            const res = await fetch("/api/validate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: inputStr, topic, desc }),
            });

            const data = await res.json();
            if (data.validation) {
                setValidationMsg(data.validation);
            } else {
                setValidationMsg("I hear you. This sounds like a difficult spot to be in.");
            }
        } catch (e) {
            console.error(e);
            setValidationMsg("I hear you. This sounds like a difficult spot to be in.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = () => {
        // Save user's input to local storage mock for the next stages
        sessionStorage.setItem(`harmony-input-${params.roomId}`, inputStr);
        sessionStorage.setItem(`harmony-topic-${params.roomId}`, String(topic));
        sessionStorage.setItem(`harmony-desc-${params.roomId}`, String(desc));

        router.push(`/reveal/${params.roomId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">

                <Card className="shadow-xl shadow-zinc-200/50">
                    <CardHeader>
                        <CardTitle className="text-2xl">Phase 1: Vent</CardTitle>
                        <CardDescription>
                            Don't hold back. Express exactly what's frustrating you regarding <strong>{topic}</strong>. The other person will <strong>never</strong> see these raw words.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="e.g. He always leaves his dirty socks on the floor and it drives me crazy!"
                            className="min-h-[150px] resize-none"
                            value={inputStr}
                            onChange={(e: any) => setInputStr(e.target.value)}
                            disabled={validationMsg !== null || isLoading}
                        />

                        {isFactStatement && !validationMsg && !isLoading && (
                            <p className="text-sm text-amber-600 animate-in fade-in">
                                Tip: This sounds like a fact. How does it make you <strong>feel</strong>? Try using an "I feel..." statement.
                            </p>
                        )}

                        {validationMsg && (
                            <Alert className="bg-blue-50 border-blue-200">
                                <AlertTitle className="text-blue-800 font-semibold mb-1">Instant Validation</AlertTitle>
                                <AlertDescription className="text-blue-700">
                                    {validationMsg}
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter>
                        {!validationMsg ? (
                            <Button
                                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white transition-all active:scale-95"
                                disabled={!inputStr || isLoading}
                                onClick={handleSubmit}
                            >
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit to AI Coach
                            </Button>
                        ) : (
                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-95"
                                onClick={handleContinue}
                            >
                                Continue to Conflict Resolution
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
