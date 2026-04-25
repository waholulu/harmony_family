"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { rewriteNextMessage, type MediationData, type RewriteData } from "@/lib/ai-client";

export default function CoachClient(props: { params: Promise<{ roomId: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<RewriteData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRewrite = async () => {
    if (!message.trim()) return;

    setLoading(true);
    const mediationRaw = sessionStorage.getItem(`harmony-mediation-result-${params.roomId}`);
    const mediation = mediationRaw ? (JSON.parse(mediationRaw) as MediationData) : undefined;
    const rewritten = await rewriteNextMessage(message, mediation);
    setResult(rewritten);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader>
          <CardTitle>下一句话优化</CardTitle>
          <CardDescription>把你想说的话贴进来，我帮你降一点防御感，同时保留你的核心诉求。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            className="min-h-28"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="例如：你每次都这样，我真的受够了。"
          />
          {result && (
            <div className="space-y-3 text-sm">
              <div><p className="font-medium">可能会让对方防御的地方</p><p>{result.risk}</p></div>
              <div><p className="font-medium">更容易被听进去的版本</p><p>{result.betterVersion}</p></div>
              <div><p className="font-medium">更短的版本</p><p>{result.shorterVersion}</p></div>
              <div><p className="font-medium">更温和但仍然清楚的版本</p><p>{result.gentleButClearVersion}</p></div>
            </div>
          )}
        </CardContent>
        <CardFooter className="gap-2">
          <Button onClick={handleRewrite} disabled={loading || !message.trim()}>
            {loading ? "优化中..." : "生成改写"}
          </Button>
          <Button variant="outline" onClick={() => router.push(`/mediate/${params.roomId}/result`)}>
            返回调停结果
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
