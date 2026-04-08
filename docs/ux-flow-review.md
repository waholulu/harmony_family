# Harmony UX 流程审查与优化计划

> 审查日期: 2026-04-08
> 当前版本: MVP (单人模拟, 无数据库, sessionStorage)

---

## 一、当前用户流程总览

```
首页(信任建立) → 设置(选择冲突类型) → Phase 1: 宣泄 → Phase 2: 冰山模型 → Phase 3: AI 角色扮演 → Phase 4: 总结卡片
     /              /setup          /input/[roomId]   /reveal/[roomId]   /rehearsal/[roomId]    /review/[roomId]
```

**数据传递方式**: 全部通过 `sessionStorage`，key 格式为 `harmony-{type}-{roomId}`

| 阶段 | 写入 sessionStorage | 读取 sessionStorage | 调用 API |
|------|---------------------|---------------------|----------|
| 首页 | — | — | — |
| 设置 | topic, desc | — | — |
| Phase 1 | input (原始宣泄) | topic, desc | POST /api/validate |
| Phase 2 | reveal (冰山数据 JSON) | input, topic, desc | POST /api/reveal |
| Phase 3 | — (对话临时存在) | topic, reveal | POST /api/chat (流式) |
| Phase 4 | — (清空全部) | topic, reveal | — |

---

## 二、关键问题诊断

### P0 — 阻断性问题 (必须立即修复)

#### 1. roomId 硬编码，无法支持多会话
- **现状**: `setup/page.tsx` 中 roomId 固定为 `"demo-room-123"`
- **影响**: 同一浏览器只能存在一个会话，新会话覆盖旧数据
- **方案**: 用 `crypto.randomUUID()` 或 `nanoid()` 生成唯一 roomId

#### 2. 全流程无返回导航
- **现状**: Phase 1→4 均没有返回上一步的按钮
- **影响**: 用户在 Phase 1 发现填错冲突背景时，必须走完全部 4 个阶段才能重来
- **方案**: 每个阶段顶部加 "← 返回上一步" 按钮，返回时保留 sessionStorage 数据

#### 3. AI 角色扮演未接收冰山分析数据
- **现状**: `RehearsalClient.tsx` 读取了 reveal 数据，但未传给 `/api/chat`
- **影响**: AI 扮演的"对方"完全不了解之前分析出的深层需求，回复泛化
- **方案**: 在 chat 请求的 `data` 或 `body` 字段中传入 `partnerNeeds` 和 `userNeeds`

#### 4. 错误恢复机制缺失
- **现状**: Phase 2 出错后 `window.location.reload()` 硬刷新，可能丢失 Phase 1 数据
- **影响**: 网络不稳定时用户被迫从头开始
- **方案**: 出错时提供"重试"按钮（不刷新页面），并保留已有数据

---

### P1 — 高价值优化

#### 5. "分享卡片" 按钮无功能
- **现状**: Phase 4 的 "Share Card" 按钮无 onClick 处理
- **影响**: 用户点击无反应，产生困惑和不信任感
- **方案**:
  - 优先实现 "复制到剪贴板"（最低成本）
  - 可选：Web Share API（移动端原生分享）、导出为图片

#### 6. Phase 3 没有 Phase 2 的翻译参考
- **现状**: 用户在角色扮演时需要凭记忆使用之前学到的 I-statement
- **影响**: 用户不知道怎么开口，练习效果大打折扣
- **方案**: 在聊天界面顶部或侧边显示可折叠的"参考卡片"，包含翻译后的 I-statement

#### 7. I-Statement 检测逻辑过于简陋
- **现状**: 用正则判断是否包含 `"I "` / `"my "` / `"feel"`
- **影响**: "My husband is lazy" 不触发提示（含 "my"）；正常表达可能误触发
- **方案**: 移除客户端正则，改用 AI validate 接口统一判断，或至少改进匹配规则

#### 8. Phase 2 "对方视角" 缺乏置信度说明
- **现状**: 标题为 "Their Perspective (Likely)"，无更多解释
- **影响**: 用户可能觉得 AI 在替对方说话、做不公平假设
- **方案**: 加注释 "这是基于常见冲突模式的推测，不代表对方的真实想法。实际沟通中请验证。"

---

### P2 — 体验打磨

#### 9. 移动端 Phase 3 键盘弹出布局抖动
- **现状**: 使用固定 `h-[90vh]`，移动端键盘弹出时地址栏变化导致布局跳动
- **影响**: 聊天体验在手机上不流畅
- **方案**: 改用 `dvh` (dynamic viewport height) 或 JS 监听 `visualViewport` 事件

#### 10. 无障碍访问 (Accessibility) 缺口
- **问题清单**:
  - 动态内容（验证消息、流式聊天）缺少 `aria-live` 区域
  - 加载 spinner 缺少 `aria-label`
  - Share 按钮只有图标，缺少 `aria-label`
  - 聊天消息容器缺少 `role="log"`
  - Coach 反馈使用 emoji 🤖，屏幕阅读器会读出 "robot face"
- **方案**: 逐项补充 ARIA 属性

#### 11. sessionStorage 无过期机制
- **现状**: 数据永久保留直到用户主动清除或走到 Phase 4
- **影响**: 用户中途退出后，下次打开可能看到旧数据（但又不在对应阶段）
- **方案**: 写入时附带时间戳，读取时检查是否超过 24 小时

#### 12. 微行动建议不够个性化
- **现状**: Phase 4 的建议部分硬编码（如 "避免贴标签"、"6秒拥抱"）
- **影响**: 对不同冲突类型（婆媳、亲子、夫妻）千篇一律
- **方案**: 让 AI 根据冲突类型和冰山分析结果，生成 2-3 条个性化微行动

---

## 三、优化后的理想流程

```
                    ┌──────────────────────────────────────────────┐
                    │           可随时返回上一步                      │
                    └──────────────────────────────────────────────┘

首页            →  设置                →  Phase 1: 宣泄            →  Phase 2: 冰山分析
(信任建立)         (选类型 + 背景)         (自由表达 + AI 共情)         (深层需求 + I-statement)
                   生成唯一 roomId          智能提示改为 AI 判断         加置信度说明
                                           添加返回按钮               添加返回按钮

   → Phase 3: 角色扮演              →  Phase 4: 行动卡片
     (侧边栏显示 I-statement 参考)       (个性化微行动)
     (传入完整 reveal 数据给 AI)         (分享功能: 复制/导出)
     (移动端键盘适配)                    (保存到本地/邮件)
     添加返回按钮
```

---

## 四、实施计划

### Sprint 1: 基础可用性 (P0 修复)

| # | 任务 | 涉及文件 | 预估复杂度 |
|---|------|----------|-----------|
| 1 | roomId 改为动态生成 | `setup/page.tsx` | 低 |
| 2 | 全流程添加返回导航 | 所有 phase 页面 | 低 |
| 3 | 将 reveal 数据传入 chat API | `RehearsalClient.tsx`, `api/chat/route.ts` | 中 |
| 4 | 错误处理改为不刷新页面的重试 | `RevealClient.tsx`, `InputClient.tsx` | 中 |

### Sprint 2: 核心体验提升 (P1)

| # | 任务 | 涉及文件 | 预估复杂度 |
|---|------|----------|-----------|
| 5 | 实现分享卡片功能 (复制到剪贴板) | `ReviewClient.tsx` | 低 |
| 6 | Phase 3 添加 I-statement 参考面板 | `RehearsalClient.tsx` | 中 |
| 7 | 改进 I-statement 检测逻辑 | `InputClient.tsx` | 中 |
| 8 | Phase 2 添加置信度/免责说明 | `RevealClient.tsx` | 低 |

### Sprint 3: 打磨与无障碍 (P2)

| # | 任务 | 涉及文件 | 预估复杂度 |
|---|------|----------|-----------|
| 9 | 移动端键盘布局适配 | `RehearsalClient.tsx` | 中 |
| 10 | 全站 ARIA 无障碍补充 | 所有 phase 页面 | 中 |
| 11 | sessionStorage 过期机制 | 新建 `lib/storage.ts` 工具函数 | 低 |
| 12 | AI 生成个性化微行动建议 | `ReviewClient.tsx`, 新增 API route | 高 |

---

## 五、衡量指标 (建议)

| 指标 | 当前状态 | 优化目标 |
|------|---------|---------|
| 流程完成率 | 未追踪 | > 60% 用户走完 4 个阶段 |
| Phase 3 平均对话轮数 | 未追踪 | ≥ 3 轮 (说明用户在真正练习) |
| 返回修改率 | 不可能 (无返回按钮) | 可返回，但返回率 < 20% |
| 分享卡片使用率 | 0% (按钮无功能) | > 30% 用户使用分享功能 |
| 移动端跳出率 | 未追踪 | Phase 3 跳出率 < 40% |
