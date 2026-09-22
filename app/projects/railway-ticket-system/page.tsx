import type { Metadata } from "next";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Clock3, Code2, Database, LockKeyhole, RefreshCw, Search, TicketCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "高并发铁路票务系统｜孙嘉豪",
  description: "基于 Spring Cloud、Redis、RocketMQ 与 Canal 的高并发铁路票务系统设计与实现。",
};

const serviceRows = [
  ["gateway", "统一入口、路由与限流边界", "Spring Cloud Gateway"],
  ["user", "注册、登录与用户信息", "Bloom / Redis Set 防穿透"],
  ["train", "车次、站点、席别与时刻", "MyBatis-Plus / MySQL"],
  ["inventory", "区间余票、预扣、确认与释放", "Redis Lua + MySQL 条件更新"],
  ["order", "创建订单、支付、关闭与状态 CAS", "RocketMQ / Outbox / Inbox"],
  ["order-close", "延迟关单与超时补偿", "10 分钟延迟消息"],
  ["cache-sync", "数据库变更驱动缓存失效", "Canal BinLog + MQ"],
  ["admin", "基础数据维护与运营接口", "独立管理边界"],
];

function DetailSection({ eyebrow, title, children, id }: { eyebrow: string; title: string; children: React.ReactNode; id?: string }) {
  return <section className="case-section" id={id}><div className="case-section-heading"><span>{eyebrow}</span><h2>{title}</h2></div><div className="case-section-body">{children}</div></section>;
}

export default function RailwayTicketSystemPage() {
  return (
    <main className="case-page" id="top">
      <header className="case-nav">
        <a href="/"><ArrowLeft size={16} /> 返回主页</a>
        <nav aria-label="详情页导航"><a href="#query">查询</a><a href="#purchase">购票</a><a href="#order">订单</a><a href="#consistency">一致性</a></nav>
      </header>

      <article className="case-sheet">
        <header className="case-title">
          <p>PROJECT 02 · DISTRIBUTED BACKEND</p>
          <h1>高并发铁路票务系统</h1>
          <div className="case-meta"><strong>独立开发</strong><span>查询 / 库存 / 订单 / 缓存同步</span><time>2025.09—2025.12</time></div>
          <p className="case-lead">项目围绕票务系统最容易出错的三条链路展开：高频余票查询、区间库存扣减和支付超时关单。MySQL 保存最终业务事实，Redis 承接高并发读与原子预扣，RocketMQ 连接跨服务事件，Canal 根据 BinLog 驱动缓存失效。</p>
          <p className="case-stack"><strong>技术栈：</strong>Java 17、Spring Boot 3、Spring Cloud、MyBatis-Plus、MySQL 8、Redis、Redisson、RocketMQ、Canal、Maven、Docker</p>
        </header>

        <DetailSection eyebrow="01 / ARCHITECTURE" title="九个模块围绕核心链路拆分">
          <figure className="case-visual">
            <Image unoptimized src="/projects/railway-ticket-system/system-architecture.png" alt="铁路票务系统微服务架构，展示网关、用户、车次、库存、订单、关单和缓存同步服务" width={1672} height={941} />
            <figcaption>同步请求通过 Gateway 进入业务服务；订单、库存和缓存同步之间使用消息解耦。MySQL 是最终事实源，Redis 是可重建的高并发门面。</figcaption>
          </figure>
          <table className="detail-table service-table top-gap">
            <caption className="sr-only">铁路票务系统服务职责</caption>
            <thead><tr className="detail-table-head"><th>模块</th><th>职责</th><th>关键实现</th></tr></thead>
            <tbody>{serviceRows.map(([service, responsibility, implementation]) => <tr className="detail-table-row" key={service}><th scope="row"><code>{service}</code></th><td>{responsibility}</td><td>{implementation}</td></tr>)}</tbody>
          </table>
        </DetailSection>

        <DetailSection eyebrow="02 / QUERY" title="先挡无效请求，再批量读取余票" id="query">
          <figure className="query-guard">
            <figcaption className="sr-only">余票查询和缓存穿透防护流程：查询条件经过存在性校验后，使用 Redis Pipeline 批量读取席别余票。</figcaption>
            <div><Search size={19} /><strong>查询条件</strong><span>车次 / 日期 / 区间</span></div><i>→</i>
            <div><LockKeyhole size={19} /><strong>存在性校验</strong><span>Bloom + Redis Set</span></div><i>→</i>
            <div><Database size={19} /><strong>Redis Pipeline</strong><span>批量读取席别余票</span></div><i>→</i>
            <div className="terminal"><TicketCheck size={19} /><strong>查询结果</strong><span>避免逐席别往返</span></div>
          </figure>
          <div className="evaluation-list top-gap">
            <article><strong>99%</strong><span>无效注册与查询 Key 在缓存层的拦截率。</span></article>
            <article><strong>−85%+</strong><span>非法 Key 直接访问数据库的次数下降。</span></article>
            <article><strong>12% → &lt;0.3%</strong><span>简历测试口径下的缓存穿透比例变化。</span></article>
          </div>
          <p className="section-intro top-gap">Redis Pipeline 将同一车次多个席别的读取合并成一次网络往返。缓存未命中时回源 MySQL 并重建短期视图；空结果也有受控缓存，避免热点不存在 Key 反复击穿数据库。</p>
        </DetailSection>

        <DetailSection eyebrow="03 / INVENTORY" title="区间令牌预扣与数据库条件更新" id="purchase">
          <figure className="case-visual">
            <Image unoptimized src="/projects/railway-ticket-system/segment-inventory.png" alt="铁路区间库存模型与 Redis Lua 原子预扣流程" width={1672} height={941} />
            <figcaption>一张车票会占用出发站到到达站之间的多个区间。Redis Lua 在单次原子操作中校验并扣减全部相关区间，避免并发请求只扣到部分区间。</figcaption>
          </figure>
          <ol className="numbered-detail top-gap">
            <li><span>1</span><div><strong>稳定请求身份</strong><p>客户端生成 clientRequestId，服务端派生 reservationId 与 messageId；重试沿用同一身份，不会重复创建预占。</p></div></li>
            <li><span>2</span><div><strong>Redis 原子预扣</strong><p>Lua 一次检查相关区间令牌，任一区间不足则整体失败，全部满足才原子扣减并记录 reservation。</p></div></li>
            <li><span>3</span><div><strong>MySQL 最终校验</strong><p>数据库通过带剩余量条件的 UPDATE 落定库存；受影响行数不符合预期时回滚并触发 Redis 释放。</p></div></li>
            <li><span>4</span><div><strong>确认与补偿</strong><p>订单落库后确认 reservation；异常路径以 reservationId 幂等释放，过期扫描器回收孤儿预占。</p></div></li>
          </ol>
          <aside className="technical-note"><strong>不超卖并非只依赖缓存</strong><p>Redis 负责高并发入口的原子性和快速失败，MySQL 条件更新承担最终库存约束。缓存预扣成功但数据库失败时，必须按预占身份补偿，而不是简单增加一个不具来源的库存数字。</p></aside>
        </DetailSection>

        <DetailSection eyebrow="04 / ORDER" title="支付与超时关单竞争时用状态 CAS 收口" id="order">
          <figure className="case-visual">
            <Image unoptimized src="/projects/railway-ticket-system/order-lifecycle.png" alt="铁路订单生命周期，展示创建、支付和十分钟超时关单的并发竞争" width={1672} height={941} />
            <figcaption>订单创建为 PENDING_PAYMENT 并投递 10 分钟延迟消息。支付与关单都必须从 PENDING_PAYMENT 条件更新；只有一个分支能成功改变最终状态。</figcaption>
          </figure>
          <div className="order-race top-gap">
            <div className="order-origin"><Clock3 size={19} /><strong>PENDING_PAYMENT</strong><span>创建订单 + 延迟消息</span></div>
            <div className="order-branches"><span>支付回调</span><span>10 分钟到期</span></div>
            <div className="order-results"><article><CheckCircle2 size={18} /><strong>PAID</strong><p>CAS 成功后确认订单；迟到的关单消息读取终态后退出。</p></article><article><RefreshCw size={18} /><strong>CLOSED</strong><p>CAS 成功后发布库存释放事件；迟到支付不能覆盖已关闭状态。</p></article></div>
          </div>
          <ul className="case-bullets top-gap">
            <li><strong>消息幂等：</strong>Inbox 记录 messageId；重复投递只返回已处理结果。</li>
            <li><strong>本地事务：</strong>订单状态变化与 Outbox 事件在同一数据库事务内提交，后台发布器重试发送未投递事件。</li>
            <li><strong>释放幂等：</strong>库存补偿按 reservationId 执行，防止关单重试造成重复返还。</li>
          </ul>
        </DetailSection>

        <DetailSection eyebrow="05 / CONSISTENCY" title="BinLog 驱动缓存失效，业务事件负责补偿" id="consistency">
          <figure className="case-visual">
            <Image unoptimized src="/projects/railway-ticket-system/cache-consistency.png" alt="MySQL BinLog、Canal、RocketMQ 与 Redis 缓存一致性流程" width={1672} height={941} />
            <figcaption>Canal 订阅 MySQL BinLog，把表和主键变化转换为缓存失效事件；消费者先删缓存，后续查询按数据库事实重建，避免跨服务代码直接拼接并修改缓存。</figcaption>
          </figure>
          <div className="consistency-grid top-gap">
            <article><span>BUSINESS EVENT</span><h3>Outbox / Inbox</h3><p>承担订单关闭、库存释放等需要业务语义的事件，保证至少一次投递下的可重试与幂等消费。</p></article>
            <article><span>DATA CHANGE</span><h3>Canal / BinLog</h3><p>承担基础数据与查询缓存失效。事件只描述变更事实，消费者根据 Key 规则删除可重建缓存。</p></article>
            <article><span>RECONCILE</span><h3>定时对账</h3><p>扫描过期 reservation、未发布 Outbox 和异常订单，覆盖短暂网络故障或进程退出后的遗漏。</p></article>
          </div>
        </DetailSection>

        <DetailSection eyebrow="06 / VALIDATION" title="测试覆盖与数据口径">
          <div className="evaluation-list">
            <article><strong>53 tests</strong><span>覆盖缓存防护、库存 Lua、订单状态、消息幂等与补偿链路。</span></article>
            <article><strong>10 modules</strong><span>Maven Reactor 全模块验证通过，包含 9 个业务模块与父工程。</span></article>
            <article><strong>0 oversell</strong><span>并发测试中的设计验收条件；由 Redis 原子预扣和 MySQL 条件更新共同保障。</span></article>
          </div>
          <p className="data-note">文档中的 QPS 数值是容量设计目标，并非线上压测结论，因此本页不把 8k / 10k QPS 作为已实测成绩展示。</p>
        </DetailSection>

        <footer className="case-source">
          <div><span>SOURCE CODE</span><h2>查看完整后端工程</h2><p>仓库包含九个服务模块、Docker 本地依赖、数据库迁移、Lua 脚本、消息链路与自动化测试。</p></div>
          <a href="https://github.com/GRANDCANY0N/railway-ticket-system" target="_blank" rel="noreferrer"><Code2 size={17} /> GitHub 源码 <ArrowUpRight size={16} /></a>
        </footer>
      </article>
    </main>
  );
}
