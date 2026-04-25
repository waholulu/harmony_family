"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { generateMediation, type MediationData, type PartnerInput } from "@/lib/ai-client";

export default function ResultClient(props: { params: Promise<{ roomId: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [partnerA, setPartnerA] = useState<PartnerInput | null>(null);
  const [partnerB, setPartnerB] = useState<PartnerInput | null>(null);
  const [result, setResult] = useState<MediationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      await Promise.resolve();
      const rawA = sessionStorage.getItem(`harmony-mediation-a-${params.roomId}`);
      const rawB = sessionStorage.getItem(`harmony-mediation-b-${params.roomId}`);

      if (!rawA || !rawB) {
        if (active) setLoading(false);
        return;
      }

      try {
        const parsedA = JSON.parse(rawA) as PartnerInput;
        const parsedB = JSON.parse(rawB) as PartnerInput;
        if (active) {
          setPartnerA(parsedA);
          setPartnerB(parsedB);
        }

        const cached = sessionStorage.getItem(`harmony-mediation-result-${params.roomId}`);
        if (cached) {
          if (active) setResult(JSON.parse(cached) as MediationData);
          return;
        }

        const data = await generateMediation(parsedA, parsedB);
        if (active) {
          setResult(data);
          sessionStorage.setItem(`harmony-mediation-result-${params.roomId}`, JSON.stringify(data));
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [params.roomId]);

  const regenerate = async () => {
    if (!partnerA || !partnerB) return;
    setLoading(true);
    const data = await generateMediation(partnerA, partnerB);
    setResult(data);
    sessionStorage.setItem(`harmony-mediation-result-${params.roomId}`, JSON.stringify(data));
    setLoading(false);
  };

  const copyText = async (value: string) => {
    await navigator.clipboard.writeText(value);
  };

  if (!partnerA || !partnerB) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader>
            <CardTitle>还缺少一方的版本</CardTitle>
            <CardDescription>先补齐双方输入，再生成中立调停结果。</CardDescription>
          </CardHeader>
          <CardFooter className="gap-2 flex-wrap">
            <Button onClick={() => router.push(`/mediate/${params.roomId}/a`)}>去 A 页面</Button>
            <Button variant="outline" onClick={() => router.push(`/mediate/${params.roomId}/b`)}>去 B 页面</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (loading || !result) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-600 mt-3">正在生成中立矛盾地图…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 p-4 py-8">
      <div className="max-w-5xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>中立矛盾地图</CardTitle>
            <CardDescription>我不会判断谁对谁错。下面只是把双方表达中的事实、感受、需要和请求拆开。</CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">表面争执</CardTitle></CardHeader>
          <CardContent className="text-sm text-zinc-700">{result.surfaceConflict}</CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader><CardTitle className="text-lg">A 真正在意的</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-700">
              <p>{result.partnerA.coreFeelings}</p>
              <p>{result.partnerA.coreNeeds}</p>
              <p>{result.partnerA.neutralSummary}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-lg">B 真正在意的</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-700">
              <p>{result.partnerB.coreFeelings}</p>
              <p>{result.partnerB.coreNeeds}</p>
              <p>{result.partnerB.neutralSummary}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-lg">你们可能误解了什么</CardTitle></CardHeader>
          <CardContent className="text-sm text-zinc-700">
            <ul className="list-disc pl-5 space-y-1">
              <li>{result.misunderstandings.aMayMisreadB}</li>
              <li>{result.misunderstandings.bMayMisreadA}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">这次争吵的升级点</CardTitle></CardHeader>
          <CardContent className="text-sm text-zinc-700">{result.escalationPoint}</CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">事实问题 vs 感受问题</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-700">
            <div>
              <p className="font-medium mb-1">事实问题</p>
              <ul className="list-disc pl-5 space-y-1">
                {result.factsVsFeelings.facts.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <p className="font-medium mb-1">感受问题</p>
              <ul className="list-disc pl-5 space-y-1">
                {result.factsVsFeelings.feelings.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-300 bg-emerald-50/60">
          <CardHeader>
            <CardTitle className="text-lg">今晚只解决一个小问题</CardTitle>
            <CardDescription>{result.temporaryAgreement.title}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-emerald-950">
            <ul className="list-disc pl-5 space-y-1">
              {result.temporaryAgreement.steps.map((step) => <li key={step}>{step}</li>)}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={() => copyText([result.temporaryAgreement.title, ...result.temporaryAgreement.steps].join("\n"))}>复制临时协议</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">建议下一句话</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-zinc-700">
            <div className="space-y-2">
              <p className="font-medium">A 可以这样说</p>
              <p>{result.suggestedLines.partnerA}</p>
              <Button variant="outline" size="sm" onClick={() => copyText(result.suggestedLines.partnerA)}>复制 A 句子</Button>
            </div>
            <div className="space-y-2">
              <p className="font-medium">B 可以这样说</p>
              <p>{result.suggestedLines.partnerB}</p>
              <Button variant="outline" size="sm" onClick={() => copyText(result.suggestedLines.partnerB)}>复制 B 句子</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">为什么这样做</CardTitle></CardHeader>
          <CardContent className="text-sm text-zinc-700">{result.principle}</CardContent>
        </Card>

        <div className="flex flex-wrap gap-2 pt-2">
          <Button>我们同意这个临时协议</Button>
          <Button variant="outline" onClick={() => router.push(`/mediate/${params.roomId}/coach`)}>继续让 AI 帮我们改下一句话</Button>
          <Button variant="outline">暂停 20 分钟后再回来</Button>
          <Button variant="ghost" onClick={() => router.push("/")}>重新开始</Button>
          <Button variant="ghost" onClick={regenerate}>重新生成调停结果</Button>
        </div>
      </div>
    </div>
  );
}
