"use client";

import { use, useEffect, useState } from "react";
import { useChat } from "ai/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Send, CheckCircle } from "lucide-react";

export default function RehearsalPage(props: { params: Promise<{ roomId: string }> }) {
    const params = use(props.params);
    const router = useRouter();
    const [topic, setTopic] = useState("");
    const [partnerData, setPartnerData] = useState<any>(null);

    useEffect(() => {
        const savedTopic = sessionStorage.getItem(`harmony-topic-${params.roomId}`);
        const savedReveal = sessionStorage.getItem(`harmony-reveal-${params.roomId}`);
        if (savedTopic) setTopic(savedTopic);
        if (savedReveal) {
            try {
                const parsed = JSON.parse(savedReveal);
                setPartnerData(parsed.partnerNeeds);
            } catch (e) {
                console.error(e);
            }
        }
    }, [params.roomId]);

    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
        api: "/api/chat",
        body: {
            data: {
                topic: topic,
                partnerSurface: partnerData?.surface,
                partnerHidden: partnerData?.hidden,
            },
        },
        initialMessages: [
            {
                id: "sys-welcome",
                role: "assistant",
                content: `I am ready to practice. Try saying what you planned to say, but use your new "I-statement" translation. I will respond however they would normally respond.`
            }
        ]
    });

    const handleFinish = () => {
        // In a real app, save the successful resolution to DB for the review card.
        router.push(`/review/${params.roomId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex flex-col items-center p-4">
            <div className="w-full max-w-2xl h-[90vh] flex flex-col pt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

                <Card className="flex-1 flex flex-col shadow-2xl border-zinc-200/60 bg-white/90 backdrop-blur-md overflow-hidden">
                    <CardHeader className="bg-zinc-900 text-zinc-50 py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="text-lg">Rehearsal Room</CardTitle>
                                <CardDescription className="text-zinc-400">Practicing: {topic || "Conflict"}</CardDescription>
                            </div>
                            <Button onClick={handleFinish} variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                                <CheckCircle className="w-4 h-4 mr-2" /> Finish & Review
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((m: any) => {
                            const isUser = m.role === "user";
                            // Check if message has coach feedback in brackets [Coach: ...]
                            const coachRegex = /\[(.*?)\]/;
                            const match = coachRegex.exec(m.content);
                            let mainContent = m.content;
                            let coachFeedback = null;

                            if (match) {
                                coachFeedback = match[1];
                                mainContent = m.content.replace(match[0], "").trim();
                            }

                            return (
                                <div key={m.id} className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser
                                        ? "bg-blue-600 text-white rounded-br-none"
                                        : m.id === "sys-welcome"
                                            ? "bg-amber-100 text-amber-900 rounded-bl-none text-sm font-medium border border-amber-200"
                                            : "bg-zinc-100 text-zinc-900 rounded-bl-none border border-zinc-200"
                                        }`}>
                                        {mainContent}
                                    </div>
                                    {coachFeedback && !isUser && (
                                        <div className="mt-1 flex items-center bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded border border-purple-100 max-w-[80%]">
                                            🤖 {coachFeedback}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-zinc-100 rounded-2xl rounded-bl-none px-4 py-3 border border-zinc-200 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" />
                                    <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce delay-150" />
                                    <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce delay-300" />
                                </div>
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="p-3 bg-zinc-50 border-t border-zinc-200">
                        <form onSubmit={handleSubmit} className="flex w-full gap-2">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type your message here..."
                                className="flex-1 bg-white"
                                disabled={isLoading}
                            />
                            <Button type="submit" disabled={isLoading || !input.trim()} className="bg-zinc-900 text-white shrink-0">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
