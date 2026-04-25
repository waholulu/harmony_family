"use client";

import { use, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { PartnerInput } from "@/lib/ai-client";

const initialForm: PartnerInput = {
  whatHappened: "",
  hardestPart: "",
  whatToUnderstand: "",
  smallRequest: "",
};

export default function PartnerAClient(props: { params: Promise<{ roomId: string }> }) {
  const params = use(props.params);
  const router = useRouter();
  const [form, setForm] = useState<PartnerInput>(initialForm);
  const [warning, setWarning] = useState<string | null>(null);

  const requiredComplete = useMemo(
    () => Boolean(form.whatHappened.trim() && form.hardestPart.trim() && form.whatToUnderstand.trim()),
    [form]
  );

  const updateField = (key: keyof PartnerInput, value: string) => {
    setWarning(null);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!requiredComplete) {
      setWarning("写一点点就可以，不需要很完整。但至少告诉 AI 刚才发生了什么。");
      return;
    }

    sessionStorage.setItem(`harmony-mediation-a-${params.roomId}`, JSON.stringify(form));
    router.push(`/mediate/${params.roomId}/b`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl shadow-zinc-200/50">
        <CardHeader>
          <CardTitle className="text-2xl">A 的版本</CardTitle>
          <CardDescription>先写你的版本。你的原文不会直接展示给对方。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">1. 刚才你们主要为什么吵起来？</p>
            <Textarea value={form.whatHappened} onChange={(e) => updateField("whatHappened", e.target.value)} className="min-h-20" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">2. 你最生气、委屈或受伤的点是什么？</p>
            <Textarea value={form.hardestPart} onChange={(e) => updateField("hardestPart", e.target.value)} className="min-h-20" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">3. 你希望对方真正理解什么？</p>
            <Textarea value={form.whatToUnderstand} onChange={(e) => updateField("whatToUnderstand", e.target.value)} className="min-h-20" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">4. 你现在希望对方做的一件小事是什么？（可选）</p>
            <Textarea value={form.smallRequest} onChange={(e) => updateField("smallRequest", e.target.value)} className="min-h-20" />
          </div>
          {warning && <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">{warning}</p>}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit}>
            保存我的版本，交给对方
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
