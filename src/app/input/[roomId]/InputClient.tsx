"use client";

import { useState, use, useEffect, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateInput } from "@/lib/ai-client";

interface Props {
    params: Promise<{ roomId: string }>;
}

export default function InputClient(props: Props) {
    const params = use(props.params);

    const router = useRouter();
    const [inputStr, setInputStr] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [validationMsg, setValidationMsg] = useState<string | null>(null);
    const [topic, setTopic] = useState("Unknown Topic");
    const [desc, setDesc] = useState("");

    useEffect(() => {
        const savedTopic = sessionStorage.getItem(`harmony-topic-${params.roomId}`);
        const savedDesc = sessionStorage.getItem(`harmony-desc-${params.roomId}`);
        if (savedTopic) setTopic(savedTopic);
        if (savedDesc) setDesc(savedDesc);
    }, [params.roomId]);

    const isFactStatement = inputStr.length > 10 && !inputStr.toLowerCase().includes("i ") && !inputStr.toLowerCase().includes("my ") && !inputStr.toLowerCase().includes("feel");

    const handleSubmit = async () => {
        if (!inputStr) return;
        setIsLoading(true);

        try {
            const validation = await validateInput(inputStr, topic, desc);
            setValidationMsg(validation);
        } catch (e) {
            console.error(e);
            setValidationMsg("I hear you. This sounds like a difficult spot to be in.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleContinue = () => {
        sessionStorage.setItem(`harmony-input-${params.roomId}`, inputStr);
        router.push(`/reveal/${params.roomId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">

                <Card className="shadow-xl shadow-zinc-200/50">
                    <CardHeader>
                        <CardTitle className="text-2xl">Phase 1: Vent</CardTitle>
                        <CardDescription>
                            Don&apos;t hold back. Express exactly what&apos;s frustrating you regarding <strong>{topic}</strong>. The other person will <strong>never</strong> see these raw words.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="e.g. He always leaves his dirty socks on the floor and it drives me crazy!"
                            className="min-h-[150px] resize-none"
                            value={inputStr}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputStr(e.target.value)}
                            disabled={validationMsg !== null || isLoading}
                        />

                        {isFactStatement && !validationMsg && !isLoading && (
                            <p className="text-sm text-amber-600 animate-in fade-in">
                                Tip: This sounds like a fact. How does it make you <strong>feel</strong>? Try using an &quot;I feel...&quot; statement.
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
