import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Code2 } from "lucide-react";

export const metadata: Metadata = {
  title: "QQBot 校园生活 Agent｜孙嘉豪",
  description: "QQBot 校园生活 Agent 的文件路由、课表计划、账单状态机、Cron 与消息交付实现。",
};

const resumeStates = ["listening", "downloading", "waiting", "verifying", "processing", "done"];
const codeStates = ["PENDING_PASSWORD", "WAITING_PASSWORD", "VERIFYING", "EXTRACTING", "PROCESSING", "DONE / FAILED"];

const moduleRows = [
  ["消息与文件入口", "OpenClaw Hook / Plugin、QQBot、Gmail gog CLI", "接收对话与附件，建立 message_id / session_key"],
  ["课表域", "schedule_store、term_calendar、daily_planner、itinerary_planner", "版本化课表、单双周展开、课程链路与每日计划"],
  ["提醒域", "reminder_registry、cron_sync、reminder_fire、delivery_service", "稳定 reminder_key、dry-run diff、渲染与幂等投递"],
  ["账单域", "gmail_fetch、task_state、normalize_merge、wechat_classifier", "附件落盘、密码任务、跨平台标准化与增量去重"],
  ["外部适配", "Open-Meteo、OpenClaw Cron、QQBot、飞书", "统一 Adapter，测试使用 Fake / Mock 替身"],
];

function DetailSection({ eyebrow, title, children, id }: { eyebrow: string; title: string; children: React.ReactNode; id?: string }) {
  return <section className="case-section" id={id}><div className="case-section-heading"><span>{eyebrow}</span><h2>{title}</h2></div><div className="case-section-body">{children}</div></section>;
}

function LinearFlow({ title, items }: { title: string; items: string[] }) {
  return <div className="linear-flow"><h3>{title}</h3><div>{items.map((item, index) => <span key={item}><small>{String(index + 1).padStart(2, "0")}</small>{item}</span>)}</div></div>;
}

export default function CampusLifeAgentPage() {
  return (
    <main className="case-page" id="top">
      <header className="case-nav">
        <a href="/"><ArrowLeft size={16} /> 返回主页</a>
        <nav aria-label="详情页导航"><a href="#architecture">架构</a><a href="#bill">账单</a><a href="#schedule">课表</a><a href="#delivery">调度</a></nav>
      </header>

      <article className="case-sheet">
        <header className="case-title">
          <p>PROJECT 02 · AGENT SYSTEM</p>
          <h1>基于 QQBot 端的校园生活 Agent</h1>
          <div className="case-meta"><strong>独立开发</strong><span>PCG 校园 AI 产品创意大赛</span><time>2026.04—2026.05</time></div>
          <p className="case-lead">系统以 QQ 对话作为统一入口，把课表提醒和微信、支付宝、银行卡账单管理拆成两个独立业务域。Intent Router 负责分流，文件型状态保存长期事实，OpenClaw Plugin / Hook 处理对话生命周期，Cron 负责把每日计划转成可追踪的主动任务。</p>
          <p className="case-stack"><strong>技术栈：</strong>Python、TypeScript、QQBot、OpenClaw Plugin SDK / Hooks、Gmail、Open-Meteo、Cron、JSON 状态存储、飞书多维表</p>
        </header>

        <DetailSection eyebrow="01 / ARCHITECTURE" title="入口统一，状态隔离" id="architecture">
          <div className="architecture-map wide-map">
            <div className="map-node input-node"><strong>QQBot / Gmail</strong><span>对话、课表、账单附件</span></div>
            <div className="map-arrow">→</div>
            <div className="map-node router-node"><strong>Intent Router</strong><span>文件语义 + 对话意图</span></div>
            <div className="map-arrow">→</div>
            <div className="map-branches">
              <div className="map-node"><strong>课表提醒 Agent</strong><span>schedule / plan / reminder state</span></div>
              <div className="map-node"><strong>账单分析 Agent</strong><span>task state / ledger / derived data</span></div>
            </div>
          </div>
          <ul className="case-bullets">
            <li><strong>文件先落盘再执行：</strong>入站附件生成 file_id、SHA-256、MIME、来源消息和语义置信度，原文件与 manifest 分开保存。</li>
            <li><strong>业务状态分域：</strong>课表版本、学期日历、每日计划、提醒 registry 与账单 task_state 各自持久化，避免一个长对话把不同任务状态混在上下文里。</li>
            <li><strong>确定性流程承担执行：</strong>Agent 负责意图理解和工具调用，周次计算、账单去重、状态迁移、Cron diff 和消息幂等由代码完成。</li>
          </ul>
        </DetailSection>

        <DetailSection eyebrow="02 / FILE ROUTING" title="文件识别与版本化">
          <div className="case-grid">
            <article><h3>课表附件</h3><p>文件名命中“课表 / schedule / timetable”等关键词时给出高置信路由；CSV、XLSX、PDF、HTML 等扩展名只作为低置信补充。归档后创建 raw schedule version，可解析并切换 active_schedule。</p></article>
            <article><h3>账单附件</h3><p>识别“账单 / alipay / wechat”等关键词和 ZIP / 表格类型。Gmail 侧从附件或 HTML 下载链接中选择候选，校验 ZIP magic，再按平台和账期落盘。</p></article>
            <article><h3>幂等身份</h3><p>课表文件保存 SHA-256 与 source_message_id；Gmail 下载以 message_id 建立 manifest，重复事件直接复用已存在的归档文件。</p></article>
            <article><h3>未知输入</h3><p>无法确定语义的图片或文档保留 unknown 类型和低置信原因，不直接进入课表或账单处理链，避免误处理用户文件。</p></article>
          </div>
        </DetailSection>

        <DetailSection eyebrow="03 / BILL AGENT" title="账单从邮件到可查询总账" id="bill">
          <div className="flow-stack">
            <LinearFlow title="邮件接入" items={["Gmail Hook", "读取 message", "识别平台", "选择附件 / 链接", "ZIP 校验", "manifest 幂等", "写入待处理任务"]} />
            <LinearFlow title="账单处理" items={["密码验证", "安全解压", "支付宝 CSV / 微信 XLSX", "字段标准化", "交易单号去重", "分类与专题数据", "QQ 总结 / 飞书"]} />
          </div>

          <h3 className="subsection-title">人机协同状态机</h3>
          <p className="section-intro">简历用六个业务阶段描述用户看到的流程；代码将解压与失败分支进一步显式化，保证每个等待点和副作用都能恢复。</p>
          <div className="state-compare">
            <div><strong>业务阶段</strong><div className="state-machine">{resumeStates.map((state, index) => <span key={state}><small>{String(index + 1).padStart(2, "0")}</small>{state}</span>)}</div></div>
            <div><strong>持久化状态</strong><div className="state-machine code-states">{codeStates.map((state, index) => <span key={state}><small>{String(index + 1).padStart(2, "0")}</small>{state}</span>)}</div></div>
          </div>

          <ol className="numbered-detail top-gap">
            <li><span>1</span><div><strong>before_dispatch 拦截</strong><p>插件只在用户进入密码模式、退出模式、输入候选密码或已有 session flow 时接管消息，其他对话正常交给 Agent。</p></div></li>
            <li><span>2</span><div><strong>逐 Job 验证</strong><p>同一会话可以维护多个待处理账单；候选密码先用 7z 测试，坏密码回到 WAITING_PASSWORD，环境或文件错误进入 FAILED。</p></div></li>
            <li><span>3</span><div><strong>成功后再产生副作用</strong><p>验证通过才解压并调用 Python pipeline；处理成功清理临时目录并写 DONE，失败保留 lastError 供后续定位。</p></div></li>
          </ol>
          <aside className="technical-note"><strong>账单一致性</strong><p>支付宝 CSV 与微信 XLSX 归一成统一 BillRecord；先读取历史 merged.json，再按交易单号增量去重。分类先跑硬规则与一级/二级规则，信息不足时才调用 OpenAI-compatible 模型。</p></aside>
        </DetailSection>

        <DetailSection eyebrow="04 / SCHEDULE AGENT" title="课表、行程与提醒逐层生成" id="schedule">
          <div className="retrieval-chain schedule-chain">
            <span><small>01</small>active_schedule</span><i>→</i>
            <span><small>02</small>term calendar</span><i>→</i>
            <span><small>03</small>daily plan</span><i>→</i>
            <span><small>04</small>itinerary legs</span><i>→</i>
            <span><small>05</small>weather / route</span><i>→</i>
            <span><small>06</small>reminder registry</span>
          </div>
          <div className="case-grid top-gap">
            <article><h3>学期日期展开</h3><p>term calendar 把教学周、周几、单双周和调停课覆盖项换算成具体日期；缺少必要学期配置时明确报错，不猜测课程日期。</p></article>
            <article><h3>每日行程</h3><p>按课程时间排序后生成 first_departure、class_transition 和长课间返宿舍等 itinerary leg，计划结果单独落盘。</p></article>
            <article><h3>环境补充</h3><p>Open-Meteo 读取真实天气，失败时显式降级到 mock weather；地点坐标优先读取用户配置，其次读取地理编码结果。</p></article>
            <article><h3>稳定提醒键</h3><p>reminder_key 由日期、leg、课程和提醒类型组成；记录 source_schedule_version、plan_generated_at 与 sync_revision，识别过期任务。</p></article>
          </div>
        </DetailSection>

        <DetailSection eyebrow="05 / CRON & DELIVERY" title="计划、渲染、发送分离" id="delivery">
          <div className="delivery-phases">
            <article><span>PLAN</span><h3>reminder registry</h3><p>每日计划生成提醒候选；无法确定课程时间的记录写为 skipped，而不是创建错误任务。</p></article>
            <article><span>SYNC</span><h3>cron diff</h3><p>先计算 would_create / update / cancel / unchanged；默认 dry-run，真实 apply 需要显式确认。</p></article>
            <article><span>RENDER</span><h3>render-only</h3><p>Cron payload 只携带 reminder_key、data_root、workdir 和 revision，不缓存最终文案或 QQ 目标。</p></article>
            <article><span>DELIVER</span><h3>idempotent send</h3><p>只有 rendered 状态可以发送；目标来自配置并经过 allowlist，delivery_id 阻止重复投递。</p></article>
          </div>
          <p className="section-intro top-gap">投递状态、provider message id、失败时间和错误原因写回 registry。QQBot Adapter 支持 preview，测试和排查流程不需要触发真实消息。</p>
        </DetailSection>

        <DetailSection eyebrow="06 / CODE MAP" title="核心模块与职责">
          <table className="detail-table module-table">
            <caption className="sr-only">项目核心模块</caption>
            <thead><tr className="detail-table-head"><th>层</th><th>主要模块</th><th>职责</th></tr></thead>
            <tbody>{moduleRows.map(([layer, modules, responsibility]) => <tr className="detail-table-row" key={layer}><th scope="row">{layer}</th><td><code>{modules}</code></td><td>{responsibility}</td></tr>)}</tbody>
          </table>
        </DetailSection>

        <DetailSection eyebrow="07 / ENGINEERING" title="关键工程约束">
          <ul className="case-bullets">
            <li><strong>断点恢复：</strong>任务状态先于外部动作写盘，密码错误、解压失败、处理异常和消息失败都有明确回退或错误状态；测试场景中断恢复成功率提升至 95%+。</li>
            <li><strong>幂等：</strong>message_id 避免重复下载，交易单号避免重复入账，reminder_key 避免重复建任务，delivery_id 避免重复发消息。</li>
            <li><strong>显式副作用：</strong>真实 Cron 和真实 QQ 发送默认关闭，apply、real-send、yes 与 allow-target 组成多层门控。</li>
            <li><strong>可测试适配层：</strong>Cron、天气、路线与消息发送均可替换为 Fake / Mock Adapter，业务状态机不依赖真实外部服务。</li>
          </ul>
        </DetailSection>

        <footer className="case-source">
          <div><span>SOURCE CODE</span><h2>查看完整工程结构</h2><p>公开仓库包含课表、账单、OpenClaw 集成、适配层和回归测试；真实账单、课表和账号配置未提交。</p></div>
          <a href="https://github.com/GRANDCANY0N/campus-life-agent" target="_blank" rel="noreferrer"><Code2 size={17} /> GitHub 源码 <ArrowUpRight size={16} /></a>
        </footer>
      </article>
    </main>
  );
}
