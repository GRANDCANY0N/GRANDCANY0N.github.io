import { ArrowUpRight, Code2, Mail } from "lucide-react";

const skills = [
  ["Agent 工程", "Multi-Agent、Planner-SubAgent、ReAct、Tool Calling、Harness Engineering、LangGraph"],
  ["检索与文档理解", "RAG、GraphRAG、LightRAG、Hybrid Search、Embedding、Rerank、MinerU"],
  ["后端与数据", "Python、FastAPI、Node.js、PostgreSQL、Redis、Elasticsearch、SSE"],
  ["研发工具", "Claude Code、OpenClaw、Codex、Hermes、SDD"],
];

const projectOneFlow = ["解析与页级审计", "VLM 定向修复", "结构重建", "分模态 Chunk", "问题分流与召回"];
const projectTwoFlow = ["QQ / Gmail 输入", "场景路由", "状态机处理", "Cron 调度", "QQBot 交付"];

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return <div className="resume-section-title"><h2 id={id}>{children}</h2><span aria-hidden="true" /></div>;
}

function Flow({ items, label }: { items: string[]; label: string }) {
  return <div className="compact-flow" aria-label={label}>{items.map((item, index) => <div className="compact-flow-step" key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>)}</div>;
}

export default function Home() {
  return (
    <main id="top">
      <header className="resume-nav">
        <a className="nav-name" href="#top">孙嘉豪</a>
        <nav aria-label="主导航"><a href="#about">关于</a><a href="#experience">经历</a><a href="#projects">项目</a><a href="#contact">联系</a></nav>
      </header>

      <div className="resume-page">
        <section className="identity" id="about">
          <p className="identity-kicker">AGENT ENGINEER · AI MASTER STUDENT</p>
          <h1>孙嘉豪</h1>
          <p className="identity-role">Agent 工程师 · 人工智能硕士在读</p>
          <p className="identity-summary">南昌大学人工智能专业硕士，关注 Agent Runtime、Multi-Agent 协作、复杂文档 RAG 与后端工程。现于太极计算机股份有限公司从事 Agent 与检索系统研发。</p>
          <div className="identity-links">
            <a href="mailto:sunjiahao@email.ncu.edu.cn"><Mail size={15} /> sunjiahao@email.ncu.edu.cn</a>
            <a href="https://github.com/GRANDCANY0N" target="_blank" rel="noreferrer"><Code2 size={15} /> GRANDCANY0N</a>
          </div>
        </section>

        <section className="resume-section" aria-labelledby="education-title">
          <SectionTitle id="education-title">教育经历</SectionTitle>
          <div className="resume-row three-column"><strong>南昌大学（211）</strong><span>人工智能（硕士）</span><time>2024.09—2027.06</time></div>
          <div className="resume-row three-column"><strong>湖北经济学院</strong><span>计算机科学与技术（本科）</span><time>2022.09—2024.06</time></div>
        </section>

        <section className="resume-section" aria-labelledby="skills-title">
          <SectionTitle id="skills-title">专业技能</SectionTitle>
          <div className="skills-table">{skills.map(([title, value]) => <div key={title}><strong>{title}</strong><p>{value}</p></div>)}</div>
        </section>

        <section className="resume-section" id="experience" aria-labelledby="experience-title">
          <SectionTitle id="experience-title">实习经历</SectionTitle>
          <article className="resume-entry">
            <header className="entry-header"><h3>太极计算机股份有限公司（北京）</h3><strong>研发工程师</strong><time>2026.01—2026.07</time></header>
            <p className="stack-line"><strong>技术栈：</strong>Python、MinerU、FastAPI、OpenCV、pypdf、MySQL、Milvus、Embedding、Rerank、BM25</p>
            <ul className="entry-points">
              <li><strong>文档后处理：</strong>参与设计并实现 MinerU + VLM 后处理流程，通过页级漏检检查、跨页表合并等处理，使解析准确率从 88% 提升至 97%+。</li>
              <li><strong>多模态 RAG：</strong>设计分模态 Chunk 与 Dense + BM25 + Rerank 混合召回架构，测试集 Top3 证据召回率提升 20%+。</li>
              <li><strong>查询意图识别：</strong>用正则路由明确问题，仅对指代不清问题调用 LLM 补全；重写后关键词覆盖率提升 30%+。</li>
              <li><strong>Agent 生命周期 Hook：</strong>构建 L1 粗过滤 → L2 Tool ACL + Shell 拦截 → L3 Secret / PII 输出脱敏的三级 Hook。</li>
            </ul>
          </article>
        </section>

        <section className="resume-section" id="projects" aria-labelledby="projects-title">
          <SectionTitle id="projects-title">项目经历</SectionTitle>
          <article className="resume-entry featured-entry">
            <header className="entry-header"><h3>复杂文档解析与证据检索</h3><strong>实习项目</strong><time>2026.01—2026.07</time></header>
            <p className="stack-line"><strong>技术栈：</strong>Python、MinerU、Qwen3-VL、FastAPI、OpenCV、pypdf、MySQL、Milvus、BM25、Rerank</p>
            <p className="entry-summary">针对扫描件、多栏、复杂表格、图表与公式 PDF，完成页级漏检审计、按需视觉修订、结构重建、分模态切块、查询分流与混合召回。</p>
            <Flow items={projectOneFlow} label="复杂文档解析与证据检索关键流程" />
            <div className="entry-actions"><a href="/projects/document-evidence-rag/">项目详情 <ArrowUpRight size={15} /></a><a href="https://github.com/GRANDCANY0N/document-evidence-rag" target="_blank" rel="noreferrer">GitHub 源码 <Code2 size={15} /></a></div>
          </article>

          <article className="resume-entry featured-entry">
            <header className="entry-header"><h3>基于 QQBot 端的校园生活 Agent（PCG 校园大赛）</h3><strong>独立开发</strong><time>2026.04—2026.05</time></header>
            <p className="stack-line"><strong>技术栈：</strong>Python、QQBot、Open-Meteo、OpenClaw Plugin / Hook、Cron</p>
            <p className="entry-summary">在一个 QQ 对话入口中组织课表提醒与多平台账单管理，通过场景路由、隔离状态和异步任务恢复支持多轮校园生活任务。</p>
            <Flow items={projectTwoFlow} label="校园生活 Agent 关键流程" />
            <div className="entry-actions"><a href="/projects/campus-life-agent/">项目详情 <ArrowUpRight size={15} /></a><a href="https://github.com/GRANDCANY0N/campus-life-agent" target="_blank" rel="noreferrer">GitHub 源码 <Code2 size={15} /></a></div>
          </article>

          <article className="resume-entry compact-entry">
            <header className="entry-header"><h3>基于 LangGraph 面向长时任务的 Multi-Agent</h3><strong>独立开发</strong><time>2025.12—2026.03</time></header>
            <p className="stack-line"><strong>技术栈：</strong>Python、LangGraph、LangChain、FastAPI、Plan-Execute、ReAct</p>
            <ul className="entry-points"><li>构建统一 Agent Runtime，抽象 call_agent、tool_call 等执行动作，实现多 Agent 动态协作与任务分解。</li><li>设计渐进式 Skill 加载与分阶段上下文压缩，降低上下文污染并保持长时任务连续性。</li></ul>
          </article>
        </section>

        <section className="resume-section" aria-labelledby="research-title">
          <SectionTitle id="research-title">科研经历</SectionTitle>
          <article className="resume-entry compact-entry">
            <header className="entry-header"><h3>基于白谱法的全球电离层 TEC 预测研究</h3><strong>课题负责人</strong><time>2025.06—2026.06</time></header>
            <ul className="entry-points"><li>与华为合作参与“风宇”大模型研发，设计并实现基于 3D Swin-Transformer 的 TEC 时空预测模型。</li><li>SCI 一区论文在审、北大核心期刊录用、国家发明专利一项；“风宇”获世界人工智能大会“最佳原生开发者”奖。</li></ul>
          </article>
        </section>

        <section className="resume-section" aria-labelledby="honors-title">
          <SectionTitle id="honors-title">荣誉奖励</SectionTitle>
          <div className="honors-grid"><span>CET-6</span><span>六次奖学金、校级优秀学生</span><span>蓝桥杯省级二等奖</span><span>计算机设计大赛国家级三等奖</span></div>
        </section>
      </div>

      <footer className="resume-footer" id="contact"><div><strong>孙嘉豪 · Agent 工程师</strong><a href="mailto:sunjiahao@email.ncu.edu.cn">sunjiahao@email.ncu.edu.cn</a></div><a href="#top">返回顶部</a></footer>
    </main>
  );
}
