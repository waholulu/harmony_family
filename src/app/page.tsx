import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Activity } from "lucide-react";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900">Communication Coach</h1>
          <p className="text-zinc-500">Your AI-powered safe space to resolve family conflicts.</p>
        </div>

        <Card className="border-zinc-200/60 shadow-xl shadow-zinc-200/50 backdrop-blur-sm bg-white/80">
          <CardHeader>
            <CardTitle>Welcome to a safer way to talk</CardTitle>
            <CardDescription>
              We handle the heat so you can focus on connection. Here is our promise to you:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="flex gap-4">
              <div className="bg-blue-50 text-blue-600 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-zinc-900 leading-none">Complete Privacy</h3>
                <p className="text-sm text-zinc-500">Your original, raw words are never shown to the other person. We filter out the emotional attacks.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-emerald-50 text-emerald-600 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-zinc-900 leading-none">Absolutely No Judging</h3>
                <p className="text-sm text-zinc-500">The AI never picks sides or tells you who is "right". Our only goal is mutual understanding.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="bg-amber-50 text-amber-600 p-3 rounded-full h-12 w-12 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-zinc-900 leading-none">Actionable Micro-Steps</h3>
                <p className="text-sm text-zinc-500">No big lectures. Just small, do-able actions to immediately improve your relationship today.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full text-lg h-12 bg-zinc-900 hover:bg-zinc-800 transition-all active:scale-95">
              <Link href="/setup">
                I Understand, Let's Start
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
