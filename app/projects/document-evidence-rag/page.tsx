import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  Database,
  FileSearch,
  Layers3,
  SearchCheck,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "复杂文档证据检索系统｜孙嘉豪",
  description: "复杂 PDF 从解析、质量门控、视觉修订、多模态切块到可追溯召回的项目案例。",
};

const pipeline = [
  ["01", "PDF 预检", "文件完整性、页数、旋转与运行身份"],
  ["02", "基础解析", "MinerU 输出 Page / Block / Asset"],
  ["03", "完整性审计", "文本层、坐标与可见墨迹交叉检查"],
  ["04", "按需视觉修订", "疑难文字、表格、图表与公式路由"],
  ["05", "结构重建", "阅读顺序、标题路径与跨页表判断"],
  ["06", "多模态切块", "正文、表格、图表和公式分层生成"],
  ["07", "证据召回", "MySQL 存证，Milvus 混合检索与重排"],
];

const decisions = [
  {
    index: "01",
    title: "非破坏式证据裁决",
    text: "MinerU 原始内容永久保留，PDF 文本层与 Qwen 输出作为独立修订。只有证据满足规则时才进入 resolved；发生冲突时保留主证据并标记待复核。",
  },
  {
    index: "02",
    title: "局部、按需调用 VLM",
    text: "先用确定性规则发现乱码、模糊、旋转、表格异常等问题，再为不同 Block 路由专用任务。不可读区域禁止根据上下文猜测。",
  },
  {
    index: "03",
    title: "复杂表格双源验证",
    text: "按真实行边界切片并重复表头，将 MinerU 与 Qwen 结果展开为 canonical cells 逐格比较；不同表号和表题是跨页合并的硬否决条件。",
  },
  {
    index: "04",
    title: "检索粒度与风险分层",
    text: "表格同时生成摘要、行组和精确单行，图表拆分整体描述与事实。Chunk 区分 verified 与 provisional，召回结果携带页码、bbox、资产和证据状态。",
  },
];

export default function ProjectDetail() {
  return (
    <main className="detail-page">
      <header className="detail-header shell">
        <Link className="back-link" href="/">
          <ArrowLeft size={17} /> 返回主页
        </Link>
        <nav aria-label="项目详情导航">
          <a href="#overview">概览</a>
          <a href="#architecture">架构</a>
          <a href="#decisions">设计决策</a>
          <a href="#results">验证</a>
        </nav>
      </header>

      <section className="detail-hero shell" id="overview">
        <div>
          <p className="eyebrow">PROJECT 01 · DOCUMENT INTELLIGENCE</p>
          <h1>复杂文档<br />证据检索系统</h1>
          <p className="detail-lead">
            面向扫描件、多栏排版、复杂表格、图表和公式，完成从 PDF 解析到 TopK 证据召回的工程链路。重点不是让模型覆盖原结果，而是保留来源、显式处理冲突，并让每条召回证据可回到原页复核。
          </p>
          <div className="detail-tags tag-list">
            <span>Python</span><span>MinerU</span><span>Qwen3-VL</span><span>MySQL</span><span>Milvus</span><span>Hybrid Search</span>
          </div>
        </div>
        <aside className="scope-note">
          <FileSearch size={24} />
          <strong>当前项目边界</strong>
          <p>系统返回带出处的检索证据，暂不包含最终自然语言答案生成器。</p>
        </aside>
      </section>

      <section className="result-strip" aria-label="项目验证摘要">
        <div className="shell result-grid">
          <div><strong>1,246</strong><span>最终多模态 Chunk</span></div>
          <div><strong>99</strong><span>Chunk 结构质量分</span></div>
          <div><strong>36</strong><span>自动化回归测试通过</span></div>
          <div><strong>48</strong><span>召回评测问题</span></div>
        </div>
      </section>

      <section className="problem-section shell">
        <div className="detail-section-title">
          <span>01 / PROBLEM</span>
          <h2>复杂 PDF 的问题不止是 OCR</h2>
        </div>
        <div className="problem-grid">
          <article>
            <span>内容缺失</span>
            <p>解析器可能完全漏掉文字，也可能与 PDF 文本层在数字、脚注或段落边界上冲突。</p>
          </article>
          <article>
            <span>结构失真</span>
            <p>双栏、旋转页、页眉页脚和标题层级会改变阅读顺序，直接污染下游 Chunk。</p>
          </article>
          <article>
            <span>表格复杂</span>
            <p>多级表头、超长表、跨页表和被误识别为图片的表格，需要不同于正文的处理策略。</p>
          </article>
          <article>
            <span>证据风险</span>
            <p>VLM 能补全视觉信息，但输出并非真值；冲突结果不能无记录地覆盖原始内容。</p>
          </article>
        </div>
      </section>

      <section className="architecture-section" id="architecture">
        <div className="shell">
          <div className="detail-section-title light">
            <span>02 / ARCHITECTURE</span>
            <h2>从文件输入到可追溯召回</h2>
          </div>
          <ol className="pipeline-list">
            {pipeline.map(([index, title, text], i) => (
              <li key={index}>
                <div className="pipeline-index">{index}</div>
                <strong>{title}</strong>
                <p>{text}</p>
                {i < pipeline.length - 1 && <ArrowRight className="pipeline-arrow" size={18} aria-hidden="true" />}
              </li>
            ))}
          </ol>

          <div className="evidence-model">
            <div className="evidence-title">
              <Layers3 size={22} />
              <div><strong>证据链</strong><span>每一步都保留来源与状态</span></div>
            </div>
            <div className="evidence-flow" aria-label="证据状态传递">
              <span>raw content</span><i>→</i><span>revisions</span><i>→</i><span>resolved / review</span><i>→</i><span>verified / provisional chunk</span><i>→</i><span>page · bbox · asset</span>
            </div>
          </div>
        </div>
      </section>

      <section className="decision-section shell" id="decisions">
        <div className="detail-section-title">
          <span>03 / ENGINEERING DECISIONS</span>
          <h2>关键设计决策</h2>
        </div>
        <div className="decision-list">
          {decisions.map((decision) => (
            <article key={decision.index}>
              <span>{decision.index}</span>
              <h3>{decision.title}</h3>
              <p>{decision.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="validation-section" id="results">
        <div className="shell validation-layout">
          <div className="detail-section-title">
            <span>04 / VALIDATION</span>
            <h2>验证结果与适用边界</h2>
          </div>
          <div>
            <div className="validation-card">
              <SearchCheck size={24} />
              <h3>代表性文档召回回归</h3>
              <p>48 题回归集中，Top3 / Top5 / Top10 的页命中、内容成功、grounded、strict 与平均关键词覆盖均为 100%。</p>
              <small>该结果只描述当前单文档证据召回集，不代表通用 OCR、跨文档 RAG 或最终答案准确率。</small>
            </div>
            <ul className="boundary-list">
              <li><CheckCircle2 size={17} />1,246 个 Chunk 无 hard failure、完全重复或页码倒退</li>
              <li><CheckCircle2 size={17} />结构修复回归测试 36 项通过</li>
              <li><ShieldCheck size={17} />冲突内容以 provisional 证据保留，不伪装为已确认结果</li>
              <li><Database size={17} />当前词法索引适合单文档规模，MySQL 与 Milvus 尚无分布式事务</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="detail-footer shell">
        <div>
          <p className="eyebrow">SOURCE</p>
          <h2>查看实现与工程文档</h2>
          <p>公开仓库包含核心源码、合成测试文档、回归评测和可编辑工作流；真实文档、运行产物与凭据已排除。</p>
        </div>
        <a className="button secondary" href="https://github.com/GRANDCANY0N/document-evidence-rag" target="_blank" rel="noreferrer"><Code2 size={17} /> GitHub 源码</a>
      </section>
    </main>
  );
}
