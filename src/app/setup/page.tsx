"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SetupPage() {
    const router = useRouter();
    const [topic, setTopic] = useState("");
    const [description, setDescription] = useState("");

    const handleStart = () => {
        if (!topic || !description) return;

        const roomId = "demo-room-123";
        sessionStorage.setItem(`harmony-topic-${roomId}`, topic);
        sessionStorage.setItem(`harmony-desc-${roomId}`, description);
        router.push(`/input/${roomId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <Card className="shadow-xl shadow-zinc-200/50">
                    <CardHeader>
                        <CardTitle className="text-2xl">What are we discussing?</CardTitle>
                        <CardDescription>
                            Select a general category and give a brief note to set the context for the AI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="topic">Conflict Category</Label>
                            <Select onValueChange={setTopic} value={topic}>
                                <SelectTrigger id="topic">
                                    <SelectValue placeholder="Select a category..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="chores">Division of Labor & Fairness</SelectItem>
                                    <SelectItem value="boundaries">Boundaries & Taking Sides</SelectItem>
                                    <SelectItem value="money">Money & Security</SelectItem>
                                    <SelectItem value="other">Other/Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Brief Context</Label>
                            <Input
                                id="description"
                                placeholder="e.g. Husband's dirty socks are everywhere"
                                value={description}
                                onChange={(e: any) => setDescription(e.target.value)}
                            />
                            <p className="text-xs text-zinc-500">
                                You will get a chance to explain your full feelings next.
                            </p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white transition-all active:scale-95"
                            disabled={!topic || !description}
                            onClick={handleStart}
                        >
                            Set up the Room
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
