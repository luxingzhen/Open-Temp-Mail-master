import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
          ← 返回首页
        </Link>
        <h1 className="text-4xl font-bold mb-8">隐私政策</h1>
        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <p className="text-zinc-400 text-sm">最后更新：2026 年 7 月</p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. 信息收集</h2>
            <p>Open Temp Mail 致力于保护您的隐私。我们采用纯匿名设计：</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>我们不会收集您的姓名、邮箱地址、IP 地址或任何个人身份信息</li>
              <li>生成的临时邮箱地址完全随机，与您的身份无关</li>
              <li>我们不会使用 Cookie 或任何追踪技术</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. 邮件数据处理</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>您接收的邮件内容仅存储在您的临时邮箱中</li>
              <li>所有邮件会在 24 小时后自动永久删除</li>
              <li>我们不会读取、分析或共享您的邮件内容</li>
              <li>邮件数据存储在 Cloudflare 的 D1 数据库和 R2 存储中，采用加密传输</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. 数据共享</h2>
            <p>我们不会将任何数据出售、出租或共享给第三方。我们使用 Cloudflare 作为基础设施提供商，其数据处理也遵循严格的隐私保护标准。</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. 数据安全</h2>
            <p>我们采用行业标准的安全措施保护您的数据：</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>所有数据传输使用 HTTPS 加密</li>
              <li>数据库访问受严格的身份验证保护</li>
              <li>邮件存储使用加密的分布式存储系统</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. 用户权利</h2>
            <p>您可以随时：</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>删除当前临时邮箱中的所有邮件</li>
              <li>停止使用并让邮箱自动过期</li>
              <li>联系我们要求删除任何关联数据</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. 联系我们</h2>
            <p>如果您对本隐私政策有任何疑问，请通过 GitHub Issues 联系我们：<a href="https://github.com/luxingzhen/Open-Temp-Mail-master" target="_blank" className="text-blue-400 hover:text-blue-300">github.com/luxingzhen/Open-Temp-Mail-master</a></p>
          </section>
        </div>
      </div>
    </div>
  );
}
