import { Link } from 'react-router-dom';

export default function Faq() {
  const faqs = [
    {
      q: "临时邮箱能用多久？",
      a: "临时邮箱的有效期通常为 24 小时。24 小时后，邮箱地址和所有邮件将被自动永久删除。建议在生成后尽快使用。"
    },
    {
      q: "会保存我的个人信息吗？",
      a: "完全不会。我们采用纯匿名设计，不收集任何个人信息，包括姓名、IP 地址、浏览器指纹等。生成的邮箱地址也是完全随机的。"
    },
    {
      q: "支持接收附件吗？",
      a: "支持。您可以接收包含图片、文档等附件的邮件。我们会保留邮件原文，以便您查看附件内容。"
    },
    {
      q: "可以发送邮件吗？",
      a: "本服务主要用于接收邮件。如果您需要发送邮件，可以登录后使用我们提供的发送功能（仅限已登录用户）。"
    },
    {
      q: "为什么我收不到邮件？",
      a: "请检查：1) 邮箱地址是否正确复制；2) 对方是否已发送；3) 是否需要等待几秒钟以刷新收件箱。如果仍然收不到，可能是发件方有延迟或被拦截。"
    },
    {
      q: "邮件内容安全吗？",
      a: "所有邮件传输使用 HTTPS 加密，存储在 Cloudflare 的安全基础设施中。邮件会在 24 小时后自动删除，我们不会读取或分享您的邮件内容。"
    },
    {
      q: "可以注册多少个临时邮箱？",
      a: "没有数量限制。您可以随时生成新的临时邮箱地址，每个地址独立有效。我们建议用完即弃，保护隐私。"
    },
    {
      q: "本服务合法吗？",
      a: "本服务完全合法，旨在帮助用户保护在线隐私。但请勿将本服务用于任何违法活动，如发送垃圾邮件、诈骗、侵犯他人权益等。"
    },
    {
      q: "为什么选择 Cloudflare？",
      a: "Cloudflare 提供全球边缘网络，确保邮件收发快速可靠。同时 Cloudflare 严格的安全和隐私标准也保证了数据安全。"
    },
    {
      q: "有使用限制吗？",
      a: "为了防止滥用，我们可能会对单 IP 的生成频率进行限制。正常使用不受影响。如需更高配额，请通过 GitHub 联系我们。"
    },
    {
      q: "可以自托管部署吗？",
      a: "可以。本项目完全开源，您可以在自己的 Cloudflare 账号上部署。请参阅 GitHub 仓库中的部署文档。"
    },
    {
      q: "如何报告问题或提出建议？",
      a: "欢迎通过 GitHub Issues 提交问题反馈或功能建议：github.com/luxingzhen/Open-Temp-Mail-master"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
          ← 返回首页
        </Link>
        <h1 className="text-4xl font-bold mb-8">常见问题</h1>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <details key={i} className="bg-zinc-900/70 border border-zinc-700 rounded-3xl overflow-hidden group">
              <summary className="p-6 cursor-pointer font-semibold hover:bg-zinc-800/50 transition-colors flex items-center justify-between">
                <span>Q: {faq.q}</span>
                <span className="text-zinc-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div className="px-6 pb-6 text-zinc-400 leading-relaxed">
                A: {faq.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
