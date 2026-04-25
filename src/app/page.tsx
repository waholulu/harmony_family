"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield, TriangleAlert } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  const handleStart = () => {
    const roomId =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID().slice(0, 8)
        : `${Date.now()}`;
    router.push(`/mediate/${roomId}/a`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-4">
        <Card className="shadow-xl shadow-zinc-200/50 border-zinc-200/70">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl tracking-tight">刚刚吵了一轮？先别继续升级。</CardTitle>
            <p className="text-zinc-600 text-sm leading-relaxed">
              双方分别写下自己的版本。原文不会直接展示给对方，AI 只会提炼重点，帮助你们看清真正的问题，并达成一个小协议。
            </p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-zinc-600">
            <div className="flex gap-3">
              <Lock className="w-4 h-4 mt-0.5 text-zinc-500" />
              <p>你的原文不会被直接转发给对方。</p>
            </div>
            <div className="flex gap-3">
              <Shield className="w-4 h-4 mt-0.5 text-zinc-500" />
              <p>不是评判谁对谁错，而是帮助你们把争执从情绪对抗拉回到问题解决。</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-amber-900 text-xs leading-relaxed flex gap-2">
              <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <p>
                如果争执涉及暴力、威胁、强迫控制或人身安全，请优先离开现场并联系可信的人或当地紧急资源。这个工具只适合普通关系冲突的沟通梳理。
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleStart} className="w-full h-11 bg-zinc-900 hover:bg-zinc-800">
              开始 3 分钟调停
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
