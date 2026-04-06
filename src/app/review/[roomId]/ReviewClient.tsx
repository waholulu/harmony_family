"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, RotateCcw, Share2, HeartHandshake } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function ReviewClient(props: { params: Promise<{ roomId: string }> }) {
    const params = use(props.params);
    const router = useRouter();
    const [topic, setTopic] = useState("");
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const savedTopic = sessionStorage.getItem(`harmony-topic-${params.roomId}`);
        const savedReveal = sessionStorage.getItem(`harmony-reveal-${params.roomId}`);
        if (savedTopic) setTopic(savedTopic);
        if (savedReveal) {
            try {
                setData(JSON.parse(savedReveal));
            } catch (e) {
                console.error(e);
            }
        }
    }, [params.roomId]);

    const handleRestart = () => {
        sessionStorage.clear();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-zinc-900 text-zinc-50 flex flex-col items-center justify-center p-4 py-12">
            <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-8">

                <div className="text-center space-y-2">
                    <div className="inline-flex bg-white/10 p-3 rounded-full mb-4">
                        <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Rehearsal Complete</h1>
                    <p className="text-zinc-400">
                        You're ready for the real conversation. Here is your summary card to keep you grounded.
                    </p>
                </div>

                <Card className="shadow-2xl border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-900 overflow-hidden transform rotate-1 transition-transform hover:rotate-0 duration-300">
                    <CardHeader className="bg-white/5 pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardDescription className="uppercase tracking-widest text-[10px] text-zinc-400 font-semibold mb-1">Conflict Resolution</CardDescription>
                                <CardTitle className="text-xl text-white">{topic || "Family Conflict"}</CardTitle>
                            </div>
                            <HeartHandshake className="w-6 h-6 text-rose-400" />
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-5 text-sm text-zinc-300">

                        <div>
                            <p className="font-semibold text-white mb-1">Your core need:</p>
                            <p>{data?.userNeeds?.hidden || "To feel respected and seen."}</p>
                        </div>

                        <Separator className="bg-white/10" />

                        <div>
                            <p className="font-semibold text-white mb-1">Their likely core need:</p>
                            <p>{data?.partnerNeeds?.hidden || "To feel accepted without judgment."}</p>
                        </div>

                        <Separator className="bg-white/10" />

                        <div className="bg-emerald-950/50 border border-emerald-900/50 p-4 rounded-xl">
                            <p className="font-semibold text-emerald-400 mb-2">Micro-Agreements to try:</p>
                            <ul className="space-y-2 list-disc pl-4 marker:text-emerald-600">
                                <li>Use your translated "I-statement": <br /><i className="text-emerald-200 mt-1 inline-block">"{data?.userNeeds?.translation || "I feel overwhelmed..."}"</i></li>
                                <li>Avoid labels or character attacks.</li>
                            </ul>
                        </div>

                        <div className="bg-rose-950/30 border border-rose-900/30 p-4 rounded-xl flex gap-3 items-start mt-4">
                            <HeartHandshake className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-rose-300 mb-1">Physical Action Suggestion:</p>
                                <p className="text-rose-200/80">If culturally appropriate, try giving a 6-second hug or a gentle hand on the shoulder before discussing the issue.</p>
                            </div>
                        </div>

                    </CardContent>
                    <CardFooter className="pt-2 pb-6 flex gap-2">
                        <Button variant="outline" className="w-full bg-transparent border-white/20 hover:bg-white/10 text-white">
                            <Share2 className="w-4 h-4 mr-2" /> Share Card
                        </Button>
                    </CardFooter>
                </Card>

                <div className="flex gap-4 pt-4">
                    <Button
                        onClick={handleRestart}
                        className="w-full bg-white hover:bg-zinc-200 text-zinc-900 font-medium h-12"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" /> Start a New Session
                    </Button>
                </div>

            </div>
        </div>
    );
}
