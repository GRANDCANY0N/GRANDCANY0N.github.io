import { ArrowUpRight, Award, Code2, Mail, MapPin } from "lucide-react";

const projects = [
  {
    index: "01",
    title: "面向长时任务的可恢复 Multi-Agent Runtime",
    meta: "独立开发 · 2025.12—2026.04",
    stack: "Python · LangGraph · FastAPI · SQLite",
    summary:
      "围绕长时任务容易中断、上下文膨胀和外部动作难以追踪的问题，构建 Requirement—Plan—Execute—Review—Replan 闭环。系统支持动态 DAG 并行执行，将图状态与动作账本分离持久化，可跨进程恢复并复用已完成动作；同时按任务阶段加载 Skill、分层管理上下文。",
    detail: "/projects/longtask-agent-runtime/",
    github: "https://github.com/GRANDCANY0N/longtask-agent-runtime",
  },
  {
    index: "02",
    title: "高并发铁路票务系统",
    meta: "独立开发 · 2025.09—2025.12",
    stack: "Java 17 · Spring Cloud · Redis · RocketMQ",
    summary:
      "以查询、库存、订单和支付超时为主链路拆分九个服务。余票查询使用 Redis 与 Pipeline 降低网络往返，购票采用 Lua 原子预扣与 MySQL 条件更新双重校验；通过延迟消息、Outbox / Inbox、补偿任务和 Canal BinLog 同步处理超时关单、消息重复与缓存最终一致性。",
    detail: "/projects/railway-ticket-system/",
    github: "https://github.com/GRANDCANY0N/railway-ticket-system",
  },
  {
    index: "03",
    title: "复杂文档解析与证据检索",
    meta: "实习项目 · 2026.01—2026.07",
    stack: "Python · MinerU · Qwen3-VL · Milvus",
    summary:
      "针对扫描件、多栏、复杂表格、图表与公式 PDF，在 MinerU 解析结果之上增加页级反向审计与 VLM 定向修订，完成结构重建和分模态 Chunk；查询侧通过意图分流、Dense 与词法候选融合及 Rerank，返回带页码、坐标和来源关系的可追溯证据。",
    detail: "/projects/document-evidence-rag/",
    github: "https://github.com/GRANDCANY0N/document-evidence-rag",
  },
  {
    index: "04",
    title: "QQBot 校园生活 Agent",
    meta: "独立开发 · 2026.04—2026.05",
    stack: "Python · TypeScript · OpenClaw · QQBot",
    summary:
      "以 QQ 对话为统一入口，将课表提醒与多平台账单管理拆分为两个状态隔离的业务域。系统通过文件语义与意图路由进入确定性处理流程，利用持久化状态机承接密码交互和异常恢复，并用 Cron、幂等提醒键和消息投递账本完成主动服务。",
    detail: "/projects/campus-life-agent/",
    github: "https://github.com/GRANDCANY0N/campus-life-agent",
  },
];

const honors = [
  ["2026", "研究生学业二等奖学金", "南昌大学 · 两次"],
  ["2025", "院级羽毛球男子单打第一名", "南昌大学"],
  ["2024—2026", "SCI 二区 TOP 期刊学生一作", "论文录用"],
  ["2023", "中国大学生计算机设计大赛国家级三等奖", "队长"],
  ["2023", "蓝桥杯 Java B 组省级三等奖", "个人赛"],
  ["本科阶段", "“藏龙学子”奖学金、三好学生", "专业前 5% · GPA 3.66 / 4.0"],
];

function SectionTitle({ id, eyebrow, children }: { id: string; eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="portfolio-section-title">
      <span>{eyebrow}</span>
      <h2 id={id}>{children}</h2>
    </div>
  );
}

export default function Home() {
  return (
    <main id="top">
      <header className="resume-nav">
        <a className="nav-name" href="#top">孙嘉豪</a>
        <nav aria-label="主导航">
          <a href="#internship">实习</a><a href="#projects">项目</a><a href="#honors">荣誉</a><a href="#contact">联系</a>
        </nav>
      </header>

      <div className="resume-page portfolio-page">
        <section className="identity portfolio-hero" aria-labelledby="home-title">
          <p className="identity-kicker">AGENT ENGINEERING · BACKEND DEVELOPMENT</p>
          <h1 id="home-title">孙嘉豪</h1>
          <p className="identity-role">人工智能硕士在读 · Agent / 后端开发</p>
          <p className="identity-summary">关注可恢复 Agent Runtime、检索系统与高并发后端。习惯把模型能力落到清晰的状态、数据边界和可验证的执行链路中。</p>
          <div className="identity-links">
            <a href="mailto:sunjiahao@email.ncu.edu.cn"><Mail size={15} /> sunjiahao@email.ncu.edu.cn</a>
            <a href="https://github.com/GRANDCANY0N" target="_blank" rel="noreferrer"><Code2 size={15} /> GRANDCANY0N</a>
            <span><MapPin size={15} /> 南昌</span>
          </div>
        </section>

        <section className="portfolio-section" id="internship" aria-labelledby="internship-title">
          <SectionTitle id="internship-title" eyebrow="01 / INTERNSHIP">实习经历</SectionTitle>
          <article className="internship-card">
            <header>
              <div><h3>太极计算机股份有限公司（北京）</h3><p>助理研发工程师</p></div>
              <time>2026.01—2026.07</time>
            </header>
            <div className="internship-highlights">
              <article><strong>复杂文档后处理</strong><p>参与 MinerU + VLM 后处理链路，增加页级漏检检查、跨页表合并和按问题类型触发的视觉修订，解析准确率由 88% 提升至 97%+。</p></article>
              <article><strong>多模态检索</strong><p>设计正文、表格、图表和公式的分模态 Chunk，以 Dense + BM25 + Rerank 组织混合召回，测试集 Top3 证据召回率提升 20%+。</p></article>
              <article><strong>Agent 安全 Hook</strong><p>实现 L1 输入过滤、L2 Tool ACL 与 Shell 拦截、L3 Secret / PII 输出脱敏的三级生命周期 Hook。</p></article>
            </div>
          </article>
        </section>

        <section className="portfolio-section" id="projects" aria-labelledby="projects-title">
          <SectionTitle id="projects-title" eyebrow="02 / SELECTED WORK">项目经历</SectionTitle>
          <div className="project-list">
            {projects.map((project) => (
              <article className="project-card" key={project.title}>
                <div className="project-index">{project.index}</div>
                <div className="project-content">
                  <p className="project-meta">{project.meta}</p>
                  <h3>{project.title}</h3>
                  <p className="project-stack">{project.stack}</p>
                  <p className="project-summary">{project.summary}</p>
                  <div className="entry-actions">
                    <a href={project.detail}>项目详情 <ArrowUpRight size={15} /></a>
                    <a href={project.github} target="_blank" rel="noreferrer">GitHub 源码 <Code2 size={15} /></a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="portfolio-section" id="honors" aria-labelledby="honors-title">
          <SectionTitle id="honors-title" eyebrow="03 / HONORS">荣誉与成果</SectionTitle>
          <div className="honors-timeline">
            {honors.map(([date, title, note]) => (
              <article key={`${date}-${title}`}>
                <time>{date}</time>
                <Award size={17} aria-hidden="true" />
                <div><strong>{title}</strong><span>{note}</span></div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <footer className="resume-footer" id="contact">
        <div><strong>孙嘉豪 · Agent / 后端开发</strong><a href="mailto:sunjiahao@email.ncu.edu.cn">sunjiahao@email.ncu.edu.cn</a></div>
        <a href="https://github.com/GRANDCANY0N" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={14} /></a>
      </footer>
    </main>
  );
}
