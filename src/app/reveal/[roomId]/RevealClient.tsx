"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { revealNeeds, type RevealData } from "@/lib/ai-client";

export default function RevealClient(props: { params: Promise<{ roomId: string }> }) {
    const params = use(props.params);
    const router = useRouter();
    const [data, setData] = useState<RevealData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchReveal = async () => {
            try {
                const inputStr = sessionStorage.getItem(`harmony-input-${params.roomId}`) || "";
                const topic = sessionStorage.getItem(`harmony-topic-${params.roomId}`) || "";
                const desc = sessionStorage.getItem(`harmony-desc-${params.roomId}`) || "";

                const result = await revealNeeds(inputStr, topic, desc);
                setData(result);
            } catch (e) {
                console.error(e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchReveal();
    }, [params.roomId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-10 h-10 text-zinc-500 animate-spin" />
                <p className="text-zinc-500 mt-4 animate-pulse">Translating conflict into underlying needs...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex flex-col items-center justify-center p-4">
                <Card className="max-w-md w-full p-6 text-center">
                    <p className="text-red-500 mb-4">Something went wrong extracting the data.</p>
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </Card>
            </div>
        );
    }

    const handleContinue = () => {
        sessionStorage.setItem(`harmony-reveal-${params.roomId}`, JSON.stringify(data));
        router.push(`/rehearsal/${params.roomId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex flex-col items-center justify-center p-4 py-12">
            <div className="max-w-2xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">

                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">The Iceberg Model</h1>
                    <p className="text-zinc-500 max-w-lg mx-auto">
                        What we argue about is rarely what we are actually upset about. Here is what's really happening beneath the surface.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="shadow-lg border-blue-100/50 bg-white/60 backdrop-blur-sm">
                        <CardHeader className="bg-blue-50/50 pb-4">
                            <div className="flex items-center gap-2 mb-2 text-blue-800">
                                <User className="w-5 h-5" />
                                <CardTitle className="text-lg">Your True Needs</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div>
                                <p className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">Surface complaint</p>
                                <p className="text-zinc-800 font-medium">{data.userNeeds.surface}</p>
                            </div>
                            <Separator />
                            <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100">
                                <p className="text-xs uppercase font-semibold text-blue-400/80 tracking-wider mb-1">Hidden emotional need</p>
                                <p className="text-blue-900 font-medium">{data.userNeeds.hidden}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg border-emerald-100/50 bg-white/60 backdrop-blur-sm">
                        <CardHeader className="bg-emerald-50/50 pb-4">
                            <div className="flex items-center gap-2 mb-2 text-emerald-800">
                                <User className="w-5 h-5" />
                                <CardTitle className="text-lg">Their Perspective <span className="opacity-50 text-sm font-normal">(Likely)</span></CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div>
                                <p className="text-xs uppercase font-semibold text-zinc-400 tracking-wider">Surface action</p>
                                <p className="text-zinc-800 font-medium">{data.partnerNeeds.surface}</p>
                            </div>
                            <Separator />
                            <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-100">
                                <p className="text-xs uppercase font-semibold text-emerald-500/80 tracking-wider mb-1">Hidden emotional need</p>
                                <p className="text-emerald-900 font-medium">{data.partnerNeeds.hidden}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-lg border-zinc-200/60 mt-6 bg-zinc-900 text-zinc-50">
                    <CardHeader>
                        <CardTitle className="text-xl">Translated Message</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Notice how the blame is removed, focusing only on 'I' and a request for connection.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="pl-4 border-l-4 border-emerald-500 italic text-lg text-zinc-200">
                            "{data.userNeeds.translation}"
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-white hover:bg-zinc-200 text-zinc-900 transition-all active:scale-95 text-md h-12 mt-2"
                            onClick={handleContinue}
                        >
                            Enter Rehearsal Room <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>

            </div>
        </div>
    );
}
