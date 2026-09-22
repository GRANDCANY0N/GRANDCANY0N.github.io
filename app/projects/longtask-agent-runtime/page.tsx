import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Code2, Database, GitBranch, Layers3, Play, RotateCcw } from "lucide-react";

export const metadata: Metadata = {
  title: "可恢复 Multi-Agent Runtime｜孙嘉豪",
  description: "面向长时任务的 LangGraph Multi-Agent Runtime：动态 DAG、动作账本、断点恢复、阶段化 Skill 与上下文治理。",
};

const executionSteps = [
  ["01", "Requirement", "结构化目标、验收条件和硬约束，信息不足时进入澄清。"],
  ["02", "Plan", "Planner 生成带依赖关系的步骤，形成可执行 DAG。"],
  ["03", "Plan Review", "执行前检查依赖、风险、预算和验收覆盖。"],
  ["04", "Execute", "按就绪节点并行调度 Agent / Tool Action。"],
  ["05", "Review", "批次与最终结果分别审查，失败证据写回状态。"],
  ["06", "Bounded Replan", "仅重规划未完成部分，在预算内闭环修复。"],
  ["07", "Summary", "汇总结果、证据、未解决项与完整运行轨迹。"],
];

const layers = [
  ["Task Memory", "目标、任务状态、预算、暂停与取消标记", "回答“这个任务现在是什么状态”"],
  ["Graph Checkpoint", "当前节点、计划、依赖、Review 结果", "回答“工作流执行到哪里”"],
  ["Action Ledger", "action_id、attempt、输入摘要、结果、副作用", "回答“外部动作是否已经发生”"],
];

function DetailSection({ eyebrow, title, children, id }: { eyebrow: string; title: string; children: React.ReactNode; id?: string }) {
  return <section className="case-section" id={id}><div className="case-section-heading"><span>{eyebrow}</span><h2>{title}</h2></div><div className="case-section-body">{children}</div></section>;
}

export default function LongtaskAgentRuntimePage() {
  return (
    <main className="case-page" id="top">
      <header className="case-nav">
        <a href="/"><ArrowLeft size={16} /> 返回主页</a>
        <nav aria-label="详情页导航"><a href="#runtime">运行时</a><a href="#recovery">恢复</a><a href="#context">上下文</a><a href="#validation">验证</a></nav>
      </header>

      <article className="case-sheet">
        <header className="case-title">
          <p>PROJECT 01 · AGENT INFRASTRUCTURE</p>
          <h1>面向长时任务的可恢复 Multi-Agent Runtime</h1>
          <div className="case-meta"><strong>独立开发</strong><span>Runtime / Control Plane / Worker</span><time>2025.12—2026.04</time></div>
          <p className="case-lead">项目不是把多个 Agent 简单串联，而是把长时任务拆成可计划、可审查、可恢复的执行单元。LangGraph 管理流程位置，Action Runtime 统一承接 Agent 与工具调用，Checkpoint 和 Action Ledger 分别保存工作流状态与外部动作事实。</p>
          <p className="case-stack"><strong>技术栈：</strong>Python、LangGraph、LangChain、FastAPI、Pydantic、SQLite、SSE、pytest、Ruff、mypy</p>
        </header>

        <DetailSection eyebrow="01 / ARCHITECTURE" title="控制面、工作流与动作执行分层">
          <figure className="case-visual">
            <Image unoptimized src="/projects/longtask-agent-runtime/system-architecture.png" alt="可恢复 Multi-Agent Runtime 系统架构，包含 FastAPI 控制面、Worker、LangGraph、Skill、Context 与 Action Runtime" width={1672} height={941} />
            <figcaption>API 负责创建、暂停、恢复和取消任务；独立 Worker 从队列取得任务并驱动 LangGraph。Agent / Tool 的调用统一经过 Action Runtime，再写入动作账本。</figcaption>
          </figure>
          <div className="system-lanes top-gap">
            <article><span>CONTROL</span><h3>FastAPI 控制面</h3><p>提供任务 API、SSE 事件流和控制指令。API 进程不直接执行长任务，避免请求生命周期与任务生命周期耦合。</p></article>
            <article><span>ORCHESTRATION</span><h3>LangGraph Worker</h3><p>根据依赖选择就绪步骤，驱动 Plan、Execute、Review 和 Replan，并将每次状态迁移写入 Checkpoint。</p></article>
            <article><span>EXECUTION</span><h3>Action Runtime</h3><p>为 call_agent 与 tool_call 生成稳定动作身份，统一处理重试、超时、预算、结果落账和不确定副作用。</p></article>
          </div>
        </DetailSection>

        <DetailSection eyebrow="02 / WORKFLOW" title="从需求到有界重规划" id="runtime">
          <ol className="runtime-flow">
            {executionSteps.map(([index, title, text]) => <li key={index}><span>{index}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}
          </ol>
          <figure className="case-visual top-gap">
            <Image unoptimized src="/projects/longtask-agent-runtime/task-lifecycle.png" alt="长时任务生命周期图，展示需求澄清、计划、执行、审查与有界重规划" width={1672} height={941} />
            <figcaption>Review 不只给出通过或失败，还把缺失证据和修改建议送回 Planner；Replan 受次数与动作预算约束，不允许无限循环。</figcaption>
          </figure>
        </DetailSection>

        <DetailSection eyebrow="03 / DYNAMIC DAG" title="依赖驱动的并行执行">
          <figure className="dag-visual">
            <figcaption className="sr-only">动态 DAG 并行执行示意：Action A 完成后，Action B 和 Action C 并行执行，最后聚合到 Action D 与 Review。</figcaption>
            <div className="dag-node root"><GitBranch size={18} /><strong>Plan</strong><span>A → B / C → D</span></div>
            <div className="dag-connector">↓</div>
            <div className="dag-node"><Play size={18} /><strong>Action A</strong><span>满足前置依赖</span></div>
            <div className="dag-split"><span>↙</span><span>↘</span></div>
            <div className="dag-parallel"><div className="dag-node accent"><strong>Action B</strong><span>并行分支</span></div><div className="dag-node accent"><strong>Action C</strong><span>并行分支</span></div></div>
            <div className="dag-merge">↘ &nbsp;&nbsp; ↙</div>
            <div className="dag-node terminal"><CheckCircle2 size={18} /><strong>Action D / Review</strong><span>聚合分支结果</span></div>
          </figure>
          <ul className="case-bullets top-gap">
            <li><strong>动态就绪：</strong>每轮从未完成步骤中筛选依赖已满足的节点；独立节点并发，同一依赖链保持顺序。</li>
            <li><strong>批次审查：</strong>并行分支完成后统一做 Batch Review，避免单个结果未经检查就被下游采用。</li>
            <li><strong>预算收口：</strong>总动作数、单动作尝试次数、Replan 次数与时间预算共同限制执行范围。</li>
          </ul>
        </DetailSection>

        <DetailSection eyebrow="04 / RECOVERY" title="图位置与动作事实分开保存" id="recovery">
          <table className="detail-table runtime-memory-table">
            <caption className="sr-only">三层持久化信息</caption>
            <thead><tr className="detail-table-head"><th>层</th><th>保存内容</th><th>解决的问题</th></tr></thead>
            <tbody>{layers.map(([name, content, purpose]) => <tr className="detail-table-row" key={name}><th scope="row">{name}</th><td>{content}</td><td>{purpose}</td></tr>)}</tbody>
          </table>
          <div className="recovery-chain top-gap">
            <div><Database size={19} /><strong>读取 Checkpoint</strong><span>恢复图状态与待执行步骤</span></div><i>→</i>
            <div><Layers3 size={19} /><strong>核对 Action Ledger</strong><span>识别成功、失败或 UNKNOWN</span></div><i>→</i>
            <div><RotateCcw size={19} /><strong>复用或补偿</strong><span>已成功动作不重复执行</span></div>
          </div>
          <aside className="technical-note"><strong>UNKNOWN 副作用</strong><p>如果进程在外部调用成功、结果尚未落账时退出，系统不会把动作直接当成失败重试；它进入 UNKNOWN，要求根据幂等键查询、人工确认或补偿，降低重复写入风险。</p></aside>
        </DetailSection>

        <DetailSection eyebrow="05 / SKILL & CONTEXT" title="按阶段加载能力，按温度管理上下文" id="context">
          <div className="context-map">
            <article><span>DISCOVER</span><h3>Skill 发现</h3><p>根据任务意图找到候选 Skill，只读取名称、描述与适用条件。</p></article>
            <article><span>PIN</span><h3>任务级固定</h3><p>把选中的 Skill 与版本固定到任务，恢复后仍使用同一行为契约。</p></article>
            <article><span>PHASE LOAD</span><h3>阶段化加载</h3><p>Plan、Execute、Review 只注入当前需要的说明与模板。</p></article>
            <article><span>CONTEXT</span><h3>Hot / Warm / Cold</h3><p>当前动作保留原文，阶段摘要进入 Warm，历史证据按需从 Cold 取回。</p></article>
          </div>
          <p className="data-note">在项目自带估算器的阶段材料对比中，按阶段加载相对全量加载平均减少 60.5% 的 Skill 文本；该数值表示注入材料估算，不等同于模型供应商账单总 Token。</p>
        </DetailSection>

        <DetailSection eyebrow="06 / VALIDATION" title="代码质量与长链路验证" id="validation">
          <div className="evaluation-list">
            <article><strong>101 passed</strong><span>单元、集成与恢复场景测试全部通过。</span></article>
            <article><strong>24 steps</strong><span>长链路评测计划包含 24 个步骤，运行中累计完成 30 个动作。</span></article>
            <article><strong>49 files</strong><span>源代码通过 mypy strict；Ruff 检查与项目构建同时通过。</span></article>
          </div>
          <h3 className="subsection-title">当前工程边界</h3>
          <ul className="case-bullets">
            <li>SQLite 版本定位为单机参考实现；横向扩展需要替换任务队列、Checkpoint 和 Action Store。</li>
            <li>工具工作区和注册表限制可访问范围，但不等价于操作系统级沙箱。</li>
            <li>外部系统无法保证 exactly-once，因此通过稳定幂等键、UNKNOWN 状态与补偿策略管理重复风险。</li>
          </ul>
        </DetailSection>

        <footer className="case-source">
          <div><span>SOURCE CODE</span><h2>查看 Runtime 实现</h2><p>仓库包含控制面、Worker、LangGraph 工作流、Action Runtime、三层持久化、Skill 系统及完整测试。</p></div>
          <a href="https://github.com/GRANDCANY0N/longtask-agent-runtime" target="_blank" rel="noreferrer"><Code2 size={17} /> GitHub 源码 <ArrowUpRight size={16} /></a>
        </footer>
      </article>
    </main>
  );
}
