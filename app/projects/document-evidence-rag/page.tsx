import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Code2 } from "lucide-react";

export const metadata: Metadata = {
  title: "复杂文档解析与证据检索｜孙嘉豪",
  description: "复杂 PDF 从 MinerU 解析、VLM 后处理、分模态 Chunk 到混合召回的项目详情。",
};

const pipeline = [
  ["01", "PDF 预检", "检查文件完整性、页面方向、文本层与运行身份。"],
  ["02", "MinerU 解析", "抽取 Page、Block、Asset 与基础结构。"],
  ["03", "质量审计", "识别漏块、乱码、错序、低清与表格结构异常。"],
  ["04", "VLM 后处理", "按问题类型路由 Qwen3-VL，只修订疑难区域。"],
  ["05", "结构重建", "恢复标题路径、阅读顺序与跨页表关系。"],
  ["06", "分模态 Chunk", "正文、表格、图表和公式采用不同切分策略。"],
  ["07", "证据召回", "Dense + BM25 + Rerank，保留页码、坐标与资产。"],
];

function DetailSection({ eyebrow, title, children, id }: { eyebrow: string; title: string; children: React.ReactNode; id?: string }) {
  return <section className="case-section" id={id}><div className="case-section-heading"><span>{eyebrow}</span><h2>{title}</h2></div><div className="case-section-body">{children}</div></section>;
}

export default function DocumentEvidenceRagPage() {
  return (
    <main className="case-page" id="top">
      <header className="case-nav"><a href="/"><ArrowLeft size={16} /> 返回主页</a><nav aria-label="详情页导航"><a href="#process">流程</a><a href="#design">设计</a><a href="#result">结果</a></nav></header>
      <article className="case-sheet">
        <header className="case-title">
          <p>PROJECT 01 · DOCUMENT INTELLIGENCE</p>
          <h1>复杂文档解析与证据检索</h1>
          <div className="case-meta"><strong>实习项目</strong><span>太极计算机股份有限公司</span><time>2026.01—2026.07</time></div>
          <p className="case-lead">面向扫描件、多栏排版、复杂表格、图表和公式 PDF，构建从文档解析、质量门控、按需视觉修订，到分模态 Chunk 和混合召回的完整链路。每条结果保留来源，可回到原页复核。</p>
          <p className="case-stack"><strong>技术栈：</strong>Python、MinerU、Qwen3-VL、FastAPI、OpenCV、pypdf、MySQL、Milvus、Embedding、BM25、Rerank</p>
        </header>

        <DetailSection eyebrow="01 / BACKGROUND" title="问题与目标">
          <ul className="case-bullets"><li><strong>解析完整性：</strong>MinerU 在双栏、旋转页、低清扫描、漏块和跨页表格场景中可能出现内容缺失与阅读顺序错误。</li><li><strong>证据完整性：</strong>正文、表格、图表与跨页证据采用同一种切分方式时，容易丢失标题路径、表头语义和相邻关系。</li><li><strong>修订可信度：</strong>VLM 可以补充视觉信息，但输出不能无记录覆盖原始解析，需要保留来源、冲突和复核状态。</li></ul>
        </DetailSection>

        <DetailSection eyebrow="02 / PROCESS" title="关键处理流程" id="process">
          <ol className="case-pipeline">{pipeline.map(([index, title, text]) => <li key={index}><span>{index}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>
        </DetailSection>

        <DetailSection eyebrow="03 / ENGINEERING" title="核心设计" id="design">
          <div className="case-grid">
            <article><h3>非破坏式 VLM 后处理</h3><p>先用确定性规则定位问题 Block，再按文字、表格、图表和公式路由视觉任务。原始内容与修订分层保存，发生冲突时标记待复核。</p></article>
            <article><h3>复杂表格结构恢复</h3><p>依据真实行边界切片并重复表头；将 MinerU 与视觉结果规范化为 canonical cells，逐格比较，多级表头和跨页表使用独立规则。</p></article>
            <article><h3>分模态 Chunk</h3><p>正文保留标题路径，表格生成摘要、行组与精确单行，图表拆分整体描述与可检索事实，公式保留上下文与页内位置。</p></article>
            <article><h3>可追溯混合召回</h3><p>通过 Dense + BM25 + Rerank 组合召回，Chunk 携带 page、bbox、asset、revision source 与 evidence status。</p></article>
          </div>
          <div className="evidence-line"><strong>证据状态：</strong><span>raw content</span><i>→</i><span>revision</span><i>→</i><span>resolved / review</span><i>→</i><span>verified / provisional chunk</span></div>
        </DetailSection>

        <DetailSection eyebrow="04 / RESULT" title="结果与边界" id="result">
          <ul className="case-bullets result-list"><li>针对双栏、漏块及跨页表格完成 VLM 后处理流程，相较单 MinerU 解析准确率提升 <strong>10%+</strong>。</li><li>设计分模态 Chunk 与 Dense + BM25 + Rerank 架构，测试集 Top3 证据召回率提升 <strong>20%+</strong>。</li><li>用合成复杂 PDF、结构质量测试和代表性召回问题进行回归；验证范围是当前测试集，不外推为通用 OCR 准确率。</li><li>当前项目边界止于可追溯证据召回，不包含最终自然语言答案生成器。</li></ul>
        </DetailSection>

        <footer className="case-source"><div><span>SOURCE CODE</span><h2>查看脱敏后的公开实现</h2><p>公开仓库保留核心代码、合成测试与评测入口；内部设计文档、真实文档、模型产物、运行数据与凭据不公开。</p></div><a href="https://github.com/GRANDCANY0N/document-evidence-rag" target="_blank" rel="noreferrer"><Code2 size={17} /> GitHub 源码 <ArrowUpRight size={16} /></a></footer>
      </article>
    </main>
  );
}
