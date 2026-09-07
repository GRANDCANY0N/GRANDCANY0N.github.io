import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, Code2 } from "lucide-react";

export const metadata: Metadata = { title: "QQBot 校园生活 Agent｜孙嘉豪", description: "校园生活 Agent 的场景路由、异步状态机、课表提醒与账单管理工程详情。" };

const scheduleFlow = ["QQ 上传课表", "识别与归档", "学期周次展开", "每日课程计划", "天气 / 路线补充", "Cron 提醒", "QQBot 投递"];
const billFlow = ["Gmail / QQ 账单", "平台识别", "密码状态机", "解析与增量去重", "规则 + 模型分类", "专题数据", "对话查询 / 飞书"];
const taskStates = ["listening", "downloading", "waiting", "verifying", "processing", "done"];

function DetailSection({ eyebrow, title, children, id }: { eyebrow: string; title: string; children: React.ReactNode; id?: string }) {
  return <section className="case-section" id={id}><div className="case-section-heading"><span>{eyebrow}</span><h2>{title}</h2></div><div className="case-section-body">{children}</div></section>;
}

function LinearFlow({ title, items }: { title: string; items: string[] }) {
  return <div className="linear-flow"><h3>{title}</h3><div>{items.map((item, index) => <span key={item}><small>{String(index + 1).padStart(2, "0")}</small>{item}</span>)}</div></div>;
}

export default function CampusLifeAgentPage() {
  return (
    <main className="case-page" id="top">
      <header className="case-nav"><a href="/"><ArrowLeft size={16} /> 返回主页</a><nav aria-label="详情页导航"><a href="#architecture">架构</a><a href="#workflow">流程</a><a href="#engineering">设计</a></nav></header>
      <article className="case-sheet">
        <header className="case-title">
          <p>PROJECT 02 · AGENT SYSTEM</p>
          <h1>基于 QQBot 端的校园生活 Agent</h1>
          <div className="case-meta"><strong>独立开发</strong><span>PCG 校园 AI 产品创意大赛</span><time>2026.04—2026.05</time></div>
          <p className="case-lead">一个运行在 QQ 对话窗口中的校园生活 Agent：将课表提醒与微信、支付宝、银行卡账单管理组织在同一入口，通过 Planner-SubAgent 动态分发、隔离状态与可恢复任务流支撑多场景服务。</p>
          <p className="case-stack"><strong>技术栈：</strong>Python、TypeScript、QQBot、OpenClaw Plugin / Hook、Open-Meteo、Cron、Gmail、JSON 状态存储</p>
        </header>

        <DetailSection eyebrow="01 / ARCHITECTURE" title="双 Agent 场景架构" id="architecture">
          <div className="architecture-map"><div className="map-node input-node"><strong>QQBot / Gmail</strong><span>消息与文件入口</span></div><div className="map-arrow">→</div><div className="map-node router-node"><strong>Intent Router</strong><span>场景识别与上下文隔离</span></div><div className="map-arrow">→</div><div className="map-branches"><div className="map-node"><strong>课表提醒 Agent</strong><span>课表 · 天气 · 路线 · 提醒</span></div><div className="map-node"><strong>账单分析 Agent</strong><span>导入 · 分类 · 查询 · 交付</span></div></div></div>
          <ul className="case-bullets"><li><strong>Planner-SubAgent：</strong>根据文件语义与用户意图动态分发到课表或账单工作流，两个业务链路解耦。</li><li><strong>状态与记忆：</strong>课表版本、每日计划、提醒任务和账单任务分别持久化，避免多轮对话中的记忆污染。</li><li><strong>主动执行：</strong>基于用户状态、环境信息与时间事件生成任务，通过 OpenClaw Cron 与生命周期 Hook 主动唤醒。</li></ul>
        </DetailSection>

        <DetailSection eyebrow="02 / WORKFLOW" title="两条核心工作流" id="workflow"><div className="flow-stack"><LinearFlow title="课表提醒" items={scheduleFlow} /><LinearFlow title="账单管理" items={billFlow} /></div></DetailSection>

        <DetailSection eyebrow="03 / STATE MACHINE" title="可恢复的异步任务" id="engineering">
          <p className="section-intro">加密账单需要等待用户输入密码，无法在一次消息处理中完成。系统把任务状态独立保存，以关键词唤醒继续执行，并避免重跑已经完成的步骤。</p>
          <div className="state-machine" aria-label="六状态异步任务流">{taskStates.map((state, index) => <span key={state}><small>{String(index + 1).padStart(2, "0")}</small>{state}</span>)}</div>
          <ul className="case-bullets result-list"><li><strong>幂等处理：</strong>Gmail 以 message_id 去重，账单按交易单号增量合并，消息投递使用 delivery_id 防止重复发送。</li><li><strong>安全门控：</strong>真实 Cron 创建与 QQBot 发送默认关闭，启用时要求显式 apply、目标白名单与 revision 校验。</li><li><strong>断点续传：</strong>失败任务保留上下文，可继续提交密码或恢复处理；测试场景任务中断恢复成功率达到 <strong>95%+</strong>。</li></ul>
        </DetailSection>

        <DetailSection eyebrow="04 / IMPLEMENTATION" title="工程落点">
          <div className="case-grid"><article><h3>OpenClaw Plugin / Hook</h3><p>TypeScript 插件接入消息生命周期，维护密码会话；Gmail Hook 负责邮件识别、附件下载与待处理任务登记。</p></article><article><h3>课表与提醒服务</h3><p>Python 实现课表版本、term calendar、daily planner、天气服务、提醒 registry、Cron adapter 与 QQBot delivery adapter。</p></article><article><h3>账单数据流水线</h3><p>统一解析微信 XLSX 与支付宝 CSV，完成字段标准化、历史合并、一级/二级分类及餐饮、电商等专题数据生成。</p></article><article><h3>回归与替身适配器</h3><p>以 Fake Adapter、dry-run、allowlist、幂等键和状态回归测试覆盖定时任务、外部服务与真实发送边界。</p></article></div>
        </DetailSection>

        <footer className="case-source"><div><span>SOURCE CODE</span><h2>查看脱敏后的公开实现</h2><p>仓库包含课表、账单、OpenClaw 集成和测试代码；真实账单、课表、邮箱、QQ 目标、消息、运行状态和凭据均已排除。</p></div><a href="https://github.com/GRANDCANY0N/campus-life-agent" target="_blank" rel="noreferrer"><Code2 size={17} /> GitHub 源码 <ArrowUpRight size={16} /></a></footer>
      </article>
    </main>
  );
}
