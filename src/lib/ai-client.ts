// Client-side AI service for static deployment.
// Includes both legacy coaching mocks and new mediation-focused mocks.

export interface RevealData {
  userNeeds: {
    surface: string;
    hidden: string;
    translation: string;
  };
  partnerNeeds: {
    surface: string;
    hidden: string;
    translation: string;
  };
}

export interface PartnerInput {
  whatHappened: string;
  hardestPart: string;
  whatToUnderstand: string;
  smallRequest: string;
}

export interface MediationData {
  surfaceConflict: string;
  partnerA: {
    coreFeelings: string;
    coreNeeds: string;
    neutralSummary: string;
  };
  partnerB: {
    coreFeelings: string;
    coreNeeds: string;
    neutralSummary: string;
  };
  misunderstandings: {
    aMayMisreadB: string;
    bMayMisreadA: string;
  };
  escalationPoint: string;
  factsVsFeelings: {
    facts: string[];
    feelings: string[];
  };
  temporaryAgreement: {
    title: string;
    steps: string[];
  };
  suggestedLines: {
    partnerA: string;
    partnerB: string;
  };
  principle: string;
}

export interface RewriteData {
  risk: string;
  betterVersion: string;
  shorterVersion: string;
  gentleButClearVersion: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const normalize = (value: string) => value.trim().replace(/\s+/g, " ");

const safeSnippet = (value: string, fallback: string) => {
  const cleaned = normalize(value);
  if (!cleaned) return fallback;
  return cleaned.length > 48 ? `${cleaned.slice(0, 48)}…` : cleaned;
};

export async function generateMediation(
  partnerA: PartnerInput,
  partnerB: PartnerInput
): Promise<MediationData> {
  await delay(900);

  const aWhat = safeSnippet(partnerA.whatHappened, "生活安排");
  const bWhat = safeSnippet(partnerB.whatHappened, "被理解与回应");
  const aHard = safeSnippet(partnerA.hardestPart, "感到没有被重视");
  const bHard = safeSnippet(partnerB.hardestPart, "感到被否定");
  const aNeed = safeSnippet(partnerA.whatToUnderstand, "我不是在挑错，而是在求协作");
  const bNeed = safeSnippet(partnerB.whatToUnderstand, "我不是不在乎，只是当下压力很高");

  return {
    surfaceConflict: `这次争执表面上围绕「${aWhat}」与「${bWhat}」展开。`,
    partnerA: {
      coreFeelings: `A 更明显的感受是：${aHard}。`,
      coreNeeds: `A 的核心需要是被认真对待、被回应，并看到可执行的小变化。`,
      neutralSummary: `A 想表达的是：${aNeed}。`,
    },
    partnerB: {
      coreFeelings: `B 更明显的感受是：${bHard}。`,
      coreNeeds: `B 的核心需要是被理解当下限制，同时被信任有改善意愿。`,
      neutralSummary: `B 想表达的是：${bNeed}。`,
    },
    misunderstandings: {
      aMayMisreadB: "A 可能把 B 的沉默或反驳理解为“不在乎这段关系”。",
      bMayMisreadA: "B 可能把 A 的追问理解为“全面否定自己这个人”。",
    },
    escalationPoint:
      "升级点通常出现在：用“你总是/你从不”下结论、在疲惫时继续追问、把单次事件扩大为人格评价。",
    factsVsFeelings: {
      facts: [
        "有一个具体事件触发了争执。",
        "双方都提出了希望对方马上调整的点。",
        "目前都不想继续升级冲突。",
      ],
      feelings: [
        "一方更在意被看见与被重视。",
        "另一方更在意被理解与被信任。",
        "双方都担心继续说会更糟。",
      ],
    },
    temporaryAgreement: {
      title: "今晚只解决一个小问题：先降温，再确认一个动作",
      steps: [
        "先暂停 20 分钟，不继续争辩旧账。",
        "回到对话后，每人先用一句“我感到…因为…”。",
        "只确定今晚一件小事（例如时间、分工或提醒方式）。",
      ],
    },
    suggestedLines: {
      partnerA: "我现在有点委屈，我更希望我们先确定今晚的一件小事，而不是继续互相指责。",
      partnerB: "我听到你很在意这件事，我愿意先做一个小调整，今晚我们先把这一步定下来。",
    },
    principle:
      "把指责句改成“观察 + 感受 + 需要 + 请求”，能更快降低防御，让对话回到可执行的问题上。",
  };
}

export async function rewriteNextMessage(
  message: string,
  _mediation?: MediationData
): Promise<RewriteData> {
  await delay(500);

  const cleanMessage = normalize(message);
  const hasAbsolutes = /总是|从不|每次|永远/.test(cleanMessage);
  const hasBlame = /你就|都是你|你根本/.test(cleanMessage);

  const riskParts = [
    hasAbsolutes ? "包含绝对化表达，容易被当成定性" : "语气整体可对话",
    hasBlame ? "有直接指责，可能触发防御" : "指责性较低",
  ];

  const base = cleanMessage || "我想把这件事说清楚";

  return {
    risk: `风险提示：${riskParts.join("；")}。`,
    betterVersion: `我想把这件事讲清楚：刚才发生后我有点难受，我需要被回应。你今晚愿意先和我确认一个小安排吗？`,
    shorterVersion: `我有点难受，今晚先确认一个小安排可以吗？`,
    gentleButClearVersion: `我不是想责怪你，我是希望我们别再升级。${base.slice(0, 36)}，我们先定今晚的一步，好吗？`,
  };
}

// Legacy flow mocks kept for compatibility with old routes.
export async function validateInput(
  _prompt: string,
  _topic: string,
  _desc: string
): Promise<string> {
  await delay(1500);
  return "It sounds like you're feeling really frustrated. That's completely understandable. It's hard when you feel like you're not being heard. Take a deep breath, we are here to help untangle this.";
}

export async function revealNeeds(
  _prompt: string,
  _topic: string,
  _desc: string
): Promise<RevealData> {
  await delay(2000);
  return {
    userNeeds: {
      surface: "Cleanliness and order",
      hidden: "Feeling respected and valued in the home",
      translation:
        "I feel overwhelmed when the shared space is messy, and I would love us to keep it organized together so I can relax.",
    },
    partnerNeeds: {
      surface: "Convenience and comfort",
      hidden: "Feeling accepted without constant criticism",
      translation:
        "I sometimes forget the small things because I'm exhausted, but I don't want to feel like a disappointment.",
    },
  };
}

const MOCK_CHAT_RESPONSE =
  "I see what you mean, but it's hard to remember every little thing when I'm tired. I do want to help though.";

export async function streamChat(
  onWord: (word: string) => void,
  onDone: () => void
): Promise<void> {
  const words = MOCK_CHAT_RESPONSE.split(" ");
  for (const word of words) {
    await delay(100);
    onWord(`${word} `);
  }
  onDone();
}
