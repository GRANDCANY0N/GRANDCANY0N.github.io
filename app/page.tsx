import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  BriefcaseBusiness,
  CheckCircle2,
  Database,
  FileSearch,
  GraduationCap,
  Mail,
  Network,
} from "lucide-react";
import Link from "next/link";

const skillGroups = [
  {
    title: "Agent 系统",
    items: "Multi-Agent · Planner-SubAgent · ReAct · Tool Calling · LangGraph",
  },
  {
    title: "检索与文档理解",
    items: "RAG · GraphRAG · Hybrid Search · Embedding · Rerank · OCR",
  },
  {
    title: "后端与基础设施",
    items: "Python · FastAPI · Node.js · PostgreSQL · Redis · Elasticsearch",
  },
];

export default function Home() {
  return (
    <main id="top">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="返回主页顶部">
          <span className="wordmark-mark">SJH</span>
          <strong>孙嘉豪</strong>
        </a>
        <nav aria-label="主导航">
          <a href="#projects">项目</a>
          <a href="#experience">经历</a>
          <a href="#contact">联系</a>
        </nav>
      </header>

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow">AGENT ENGINEER · MASTER STUDENT</p>
          <h1>孙嘉豪</h1>
          <p className="hero-role">Agent 工程师 · 人工智能硕士在读</p>
          <p className="hero-intro">
            就读于南昌大学人工智能专业，主要关注 Agent Runtime、Multi-Agent 协作与复杂文档 RAG。目前在太极计算机股份有限公司参与 Agent 与检索系统研发。
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#projects">
              查看项目 <ArrowRight size={17} />
            </a>
            <a className="button secondary" href="mailto:sunjiahao@email.ncu.edu.cn">
              <Mail size={17} /> 邮件联系
            </a>
          </div>
        </div>

        <aside className="profile-facts" aria-label="个人概览">
          <div className="fact-row">
            <GraduationCap size={19} />
            <div><span>教育</span><strong>南昌大学 · 人工智能硕士</strong><small>2024.09—2027.06</small></div>
          </div>
          <div className="fact-row">
            <BriefcaseBusiness size={19} />
            <div><span>当前经历</span><strong>助理研发工程师（实习）</strong><small>2026.01—至今</small></div>
          </div>
          <div className="fact-row">
            <Network size={19} />
            <div><span>研发方向</span><strong>Agent · RAG · 后端工程</strong><small>工程项目与研究实践</small></div>
          </div>
        </aside>
      </section>

      <section className="skills-band" aria-labelledby="skills-title">
        <div className="shell skills-layout">
          <div className="section-label">
            <span>01</span>
            <h2 id="skills-title">能力概览</h2>
          </div>
          <div className="skill-list">
            {skillGroups.map((group) => (
              <div className="skill-row" key={group.title}>
                <strong>{group.title}</strong>
                <p>{group.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="projects shell" id="projects" aria-labelledby="projects-title">
        <div className="section-heading">
          <div className="section-label">
            <span>02</span>
            <h2 id="projects-title">项目</h2>
          </div>
          <p>以下内容来自实际代码、运行记录与回归验证。</p>
        </div>

        <article className="project-card project-primary">
          <div className="project-number">01</div>
          <div className="project-content">
            <div className="project-meta">
              <span className="status"><CheckCircle2 size={14} /> 重点项目</span>
              <span>2026</span>
            </div>
            <h3>复杂文档证据检索系统</h3>
            <p className="project-summary">
              面向扫描件、复杂表格、图表和多栏 PDF，构建从解析、质量门控、按需视觉修订，到多模态切块和混合召回的完整链路；每条结果保留页码、坐标、资产与修订来源。
            </p>
            <div className="project-stats" aria-label="项目验证结果">
              <div><strong>1,246</strong><span>最终检索 Chunk</span></div>
              <div><strong>99</strong><span>结构质量分</span></div>
              <div><strong>48</strong><span>召回回归问题</span></div>
            </div>
            <div className="project-footer">
              <div className="tag-list">
                <span>Python</span><span>MinerU</span><span>Qwen3-VL</span><span>MySQL</span><span>Milvus</span>
              </div>
              <Link className="project-link" href="/projects/document-evidence-rag/">
                查看详情 <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
          <div className="project-symbol" aria-hidden="true"><FileSearch size={72} strokeWidth={1.25} /></div>
        </article>

        <article className="project-card project-secondary">
          <div className="project-number">02</div>
          <div className="project-content">
            <div className="project-meta">
              <span className="status neutral"><Bot size={14} /> 独立开发</span>
              <span>2025—2026</span>
            </div>
            <h3>QQBot 校园生活 Agent</h3>
            <p className="project-summary">
              基于 Planner-SubAgent 架构处理校园多场景任务。围绕账单场景开发 OpenClaw Gmail Hook 与密码插件，实现加密附件下载、对话式密码校验、断点恢复、分类分析和结果交付。
            </p>
            <div className="project-stats compact" aria-label="项目验证结果">
              <div><strong>6</strong><span>异步任务状态</span></div>
              <div><strong>95%+</strong><span>测试场景恢复率</span></div>
              <div><strong>90%+</strong><span>图表生成成功率</span></div>
            </div>
            <div className="project-footer">
              <div className="tag-list">
                <span>Python</span><span>OpenClaw</span><span>TypeScript</span><span>QQBot</span><span>Cron</span>
              </div>
              <a className="project-link" href="https://github.com/GRANDCANY0N/campus-life-agent" target="_blank" rel="noreferrer">
                查看源码 <ArrowUpRight size={17} />
              </a>
            </div>
          </div>
          <div className="project-symbol secondary-symbol" aria-hidden="true"><Database size={72} strokeWidth={1.25} /></div>
        </article>
      </section>

      <section className="experience-section shell" id="experience" aria-labelledby="experience-title">
        <div className="section-label">
          <span>03</span>
          <h2 id="experience-title">经历</h2>
        </div>
        <div className="timeline">
          <article>
            <time>2026.01—至今</time>
            <div>
              <h3>太极计算机股份有限公司</h3>
              <p className="timeline-role">助理研发工程师</p>
              <p>参与复杂文档解析、Agent 生命周期安全 Hook、长期任务上下文管理，以及 LightRAG 与 BM25 混合检索架构的设计与实现。</p>
            </div>
          </article>
          <article>
            <time>2025.06—2025.11</time>
            <div>
              <h3>国家气象局空间地面站</h3>
              <p className="timeline-role">科研合作</p>
              <p>参与“风宇”大模型研发，设计基于 3D Swin-Transformer 的 TEC 时空预测模型；参与论文与发明专利撰写。</p>
            </div>
          </article>
        </div>
      </section>

      <footer className="site-footer" id="contact">
        <div className="shell footer-layout">
          <div>
            <p className="eyebrow">CONTACT</p>
            <h2>联系我</h2>
          </div>
          <a href="mailto:sunjiahao@email.ncu.edu.cn">
            sunjiahao@email.ncu.edu.cn <ArrowUpRight size={19} />
          </a>
          <div className="footer-note">
            <span>孙嘉豪 · 2026</span>
            <a href="#top">回到顶部</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
