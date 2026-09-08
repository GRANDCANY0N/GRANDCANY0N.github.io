import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Code2 } from "lucide-react";

export const metadata: Metadata = {
  title: "复杂文档解析与证据检索｜孙嘉豪",
  description: "复杂 PDF 的页级审计、VLM 定向修复、多模态 Chunk、查询分流与混合召回实现。",
};

const ingestSteps = [
  ["01", "PDF 预检", "校验文件与加密状态，记录页尺寸、旋转角和 SHA-256 文档身份。"],
  ["02", "MinerU 解析", "上传完整 PDF，取得 content_list、版面块和图片资产；ZIP 解压前检查路径穿越。"],
  ["03", "统一证据图", "把 Page、Block、Asset、Revision 归一化，保留 MinerU 原始顺序与原始内容。"],
  ["04", "页级反向审计", "用 PDF 文本层、bbox 与可见墨迹检查漏块、数字差异、脚注冲突和遮挡区域。"],
  ["05", "VLM 定向修复", "只将命中质量 Flag 的文字、表格、图表和公式路由到对应视觉任务。"],
  ["06", "结构重建", "重新计算分栏阅读顺序、标题树、表格上下文和跨页表关系。"],
  ["07", "多模态 Chunk", "正文、表格、图表、公式按不同粒度生成 verified / provisional 检索单元。"],
  ["08", "质量门控与索引", "Chunk 审计通过后批量 Embedding，写入 MySQL 证据图与 Milvus 向量索引。"],
];

const qualityRows = [
  ["完全漏块", "PDF 文本层行 + bbox 覆盖 + 局部可见墨迹", "可靠文本层补偿 Block；证据不足时进入复核"],
  ["文字或数字冲突", "序列相似度、字符 F1、数字与脚注编码比对", "保留 MinerU 主证据，修订作为独立 Revision"],
  ["低清 / 低对比", "Laplacian 方差与灰度标准差", "原图和增强图共同输入 VLM，并记录不确定项"],
  ["遮挡区域", "深色实心区域占比", "标记 unreadable，禁止模型根据上下文猜测"],
  ["复杂或跨页表", "结构区域、行分隔线、表号 / 表题 / 表头与页边位置", "完整行切片、双源逐格核对；身份冲突直接禁止合并"],
];

const modalityRows = [
  ["正文", "同章节、同栏、同状态的相邻 Block；优先在段落和完整句边界切分", "text_segment"],
  ["表格", "展开 rowspan / colspan，重复表题、单位和多级表头，同时保留行级 cells", "table_summary / row_group / row"],
  ["图表 / 图片", "生成整体结构摘要，再拆出包含数值、趋势或极值的局部事实", "chart_summary / chart_fact / image_summary"],
  ["公式", "把同页同章节的前文末段、LaTeX 与后文首段组合，避免公式脱离语境", "formula_context"],
];

const routes = [
  ["FAST", "明确问题", "包含明确页码、表号、图号，或实体和提问目标完整。直接进入检索，不调用改写模型。"],
  ["REWRITE", "上下文追问", "过短、口语化或包含“这两个、那一列”等指代。结合有界上一轮上下文生成独立查询。"],
  ["BYPASS", "非检索输入", "闲聊、致谢和对话控制指令不访问向量库，也不产生无意义的检索调用。"],
];

function DetailSection({ eyebrow, title, children, id }: { eyebrow: string; title: string; children: React.ReactNode; id?: string }) {
  return <section className="case-section" id={id}><div className="case-section-heading"><span>{eyebrow}</span><h2>{title}</h2></div><div className="case-section-body">{children}</div></section>;
}

export default function DocumentEvidenceRagPage() {
  return (
    <main className="case-page" id="top">
      <header className="case-nav">
        <a href="/"><ArrowLeft size={16} /> 返回主页</a>
        <nav aria-label="详情页导航"><a href="#ingest">文档处理</a><a href="#chunk">Chunk</a><a href="#query">检索</a><a href="#result">验证</a></nav>
      </header>

      <article className="case-sheet">
        <header className="case-title">
          <p>PROJECT 01 · DOCUMENT INTELLIGENCE</p>
          <h1>复杂文档解析与证据检索</h1>
          <div className="case-meta"><strong>实习项目</strong><span>太极计算机股份有限公司</span><time>2026.01—2026.07</time></div>
          <p className="case-lead">该项目为我在太极计算机股份有限公司实习期间参与研发的复杂文档检索系统。针对扫描件、双栏、复杂表格、图表和公式 PDF，系统先审计 MinerU 是否漏解析或错序，再按问题类型调用 VLM 修复；完成结构重建和分模态切块后，通过问题分流、Dense + 词法候选与 Rerank 返回带页码、坐标和来源的证据。</p>
          <p className="case-stack"><strong>技术栈：</strong>Python、MinerU、Qwen3-VL、FastAPI、OpenCV、pypdf、MySQL、Milvus、Qwen3-Embedding、BM25 / 词法检索、Rerank</p>
        </header>

        <DetailSection eyebrow="01 / SYSTEM" title="两条主链">
          <div className="system-lanes">
            <article><span>DOCUMENT PATH</span><h3>文档进入系统</h3><p>PDF → MinerU → 页级审计 → VLM 修订 → 结构重建 → Chunk → 索引</p></article>
            <article><span>EVIDENCE PATH</span><h3>证据持续留痕</h3><p>raw content → revisions → resolved / review → verified / provisional</p></article>
            <article><span>QUERY PATH</span><h3>问题进入系统</h3><p>fast / rewrite / bypass → 多查询召回 → RRF → Rerank → Top-K</p></article>
          </div>
          <p className="section-intro top-gap">MySQL 保存页面、资产、Block 和全部 Revision，Milvus 只承载检索需要的 Chunk 元数据与向量；解析事实层与检索索引分开维护。</p>
        </DetailSection>

        <DetailSection eyebrow="02 / INGEST" title="从 PDF 到可索引证据" id="ingest">
          <ol className="case-pipeline">{ingestSteps.map(([index, title, text]) => <li key={index}><span>{index}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol>
        </DetailSection>

        <DetailSection eyebrow="03 / QUALITY GATE" title="先定位问题，再调用模型">
          <p className="section-intro">质量门控按问题 Flag 决定处理分支。已有可靠证据时不重复调用 VLM；单个视觉任务失败只影响对应 Block，并写入错误类型、请求信息和耗时。</p>
          <table className="detail-table quality-table">
            <caption className="sr-only">解析质量门控</caption>
            <thead><tr className="detail-table-head"><th>问题</th><th>如何发现</th><th>处理方式</th></tr></thead>
            <tbody>{qualityRows.map(([issue, detect, action]) => <tr className="detail-table-row" key={issue}><th scope="row">{issue}</th><td>{detect}</td><td>{action}</td></tr>)}</tbody>
          </table>
          <aside className="technical-note"><strong>文字裁决原则</strong><p>MinerU 非空时作为 primary evidence。VLM 与其一致或只做可验证的非破坏补充才写入 resolved；事实字符冲突时保留原文并标记 review，不让模型输出静默覆盖解析结果。</p></aside>
        </DetailSection>

        <DetailSection eyebrow="04 / TABLES" title="复杂表格的双源核对">
          <ol className="numbered-detail">
            <li><span>1</span><div><strong>识别结构区域</strong><p>先识别方向、表题、表头、数据区、日期、单位和脚注；再依据真实行分隔线修正数据边界。</p></div></li>
            <li><span>2</span><div><strong>按完整行切片</strong><p>每个 tile 重复表头，相邻片重叠一整行；合并时只消除重叠行，避免固定像素切到数据行中间。</p></div></li>
            <li><span>3</span><div><strong>Canonical Cells</strong><p>把 MinerU HTML 与 Qwen 结果展开为二维单元格网格，按 row / column 比较数字、负号、小数和百分比。</p></div></li>
            <li><span>4</span><div><strong>跨页身份门控</strong><p>只有“上页表到底、下页表从页顶开始”才进入判断；不同表号或明显不同表题是硬否决，不能被 Embedding 或 VLM 推翻。</p></div></li>
          </ol>
        </DetailSection>

        <DetailSection eyebrow="05 / CHUNK" title="按内容类型组织检索粒度" id="chunk">
          <table className="detail-table modality-table">
            <caption className="sr-only">多模态 Chunk 设计</caption>
            <thead><tr className="detail-table-head"><th>内容</th><th>切分与上下文</th><th>Chunk Role</th></tr></thead>
            <tbody>{modalityRows.map(([type, logic, roles]) => <tr className="detail-table-row" key={type}><th scope="row">{type}</th><td>{logic}</td><td><code>{roles}</code></td></tr>)}</tbody>
          </table>
          <div className="evidence-line"><strong>每条 Chunk：</strong><span>source blocks</span><i>+</i><span>page / bbox</span><i>+</i><span>asset</span><i>+</i><span>section path</span><i>+</i><span>parent / sibling</span><i>+</i><span>retrieval tier</span></div>
          <p className="section-intro top-gap">索引前执行结构硬门控：检查 ID、正文、来源页、坐标、顺序、父子关系、重复文本和证据等级。出现 hard failure 时停止 Embedding，不替换线上索引。</p>
        </DetailSection>

        <DetailSection eyebrow="06 / QUERY ROUTING" title="明确问题直接查，模糊问题再改写" id="query">
          <div className="route-grid">{routes.map(([route, title, text]) => <article key={route}><span>{route}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
          <div className="safe-rewrite">
            <h3>改写安全约束</h3>
            <ul className="case-bullets">
              <li>固定 JSON Schema、temperature=0；改写只能使用当前问题和有界上下文。</li>
              <li>程序检查新增数字、年份和表号，发现凭空增加的信息就丢弃该改写。</li>
              <li>原问题始终保留；改写只扩充候选，不能替换用户原始问题。</li>
            </ul>
          </div>
        </DetailSection>

        <DetailSection eyebrow="07 / RETRIEVAL" title="多查询候选融合与一次重排">
          <div className="retrieval-chain">
            <span><small>01</small>批量 Query Embedding</span><i>→</i>
            <span><small>02</small>Dense + 中文 bigram 词法候选</span><i>→</i>
            <span><small>03</small>RRF 合并候选并集</span><i>→</i>
            <span><small>04</small>候选并集一次 Rerank</span><i>→</i>
            <span><small>05</small>按 logical parent 控制重复</span>
          </div>
          <ul className="case-bullets top-gap">
            <li>每条改写查询分别取得 Dense 与词法候选，多条查询一次批量 Embedding，不重复跑完整 Rerank。</li>
            <li>词法侧保留英文、数字、小数和百分比，中文按字符 bigram；对表格摘要做轻度长度归一。</li>
            <li>表格同一 parent 最多保留 3 条行证据，其他 parent 最多 2 条，兼顾多行问题和结果多样性。</li>
          </ul>
        </DetailSection>

        <DetailSection eyebrow="08 / VALIDATION" title="评测结果" id="result">
          <div className="evaluation-list">
            <article><strong>88% → 97%+</strong><span>通过页级漏检检查、跨页表合并和定向 VLM 后处理提升解析准确率。</span></article>
            <article><strong>Top3 +20%+</strong><span>分模态 Chunk 配合向量、关键词与 Rerank 混合召回后的证据召回提升。</span></article>
            <article><strong>关键词覆盖 +30%+</strong><span>针对多轮问答的指代不清问题，经路由与上下文重写后的简历口径结果。</span></article>
          </div>
          <h3 className="subsection-title">查询分流专项实验</h3>
          <div className="experiment-summary">
            <div><strong>30 / 30</strong><span>分流标签匹配</span></div>
            <div><strong>12 / 30</strong><span>仅模糊问题调用改写模型</span></div>
            <div><strong>33.3% → 100%</strong><span>12 条模糊追问 Top3 证据成功率</span></div>
            <div><strong>48 / 48</strong><span>原独立问题回归无退化</span></div>
          </div>
          <p className="data-note">专项实验使用一份金融报告、10 条明确问题、12 条上下文追问和 8 条非检索输入；同时记录改写额外耗时，避免只展示召回收益。</p>
        </DetailSection>

        <footer className="case-source">
          <div><span>SOURCE CODE</span><h2>核心实现与测试</h2><p>公开仓库包含解析、质量门控、Chunk、检索和评测代码；内部 docs 未进入公开仓库。</p></div>
          <a href="https://github.com/GRANDCANY0N/document-evidence-rag" target="_blank" rel="noreferrer"><Code2 size={17} /> GitHub 源码 <ArrowUpRight size={16} /></a>
        </footer>
      </article>
    </main>
  );
}
