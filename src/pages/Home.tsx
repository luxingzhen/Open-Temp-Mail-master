import { useState } from 'react';

export default function Home() {
  const [currentEmail, setCurrentEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [domain] = useState('srfwq.top');

  const generateEmail = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const random = Math.floor(Math.random() * 99999);
      setCurrentEmail(`user${random}@${domain}`);
      setIsGenerating(false);
    }, 700);
  };

  const copyEmail = () => {
    if (currentEmail) navigator.clipboard.writeText(currentEmail);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-xl">📧</div>
            <div className="text-2xl font-bold">Open Temp Mail</div>
          </div>
          <div className="flex gap-4">
            <a href="/app/dashboard">
              <button className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-full text-sm">控制台</button>
            </a>
          </div>
        </header>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-900/60 text-emerald-400 px-6 py-2 rounded-full text-sm">
            ● 实时可用 · 全球加速
          </div>
        </div>

        <h1 className="text-5xl font-bold text-center mb-4">临时邮箱 一键生成</h1>
        <p className="text-center text-zinc-400 max-w-md mx-auto mb-12">
          保护你的隐私，再也不怕垃圾邮件和信息泄露。安全、快速、免费的一次性邮箱服务。
        </p>

        {/* 生成区域 */}
        <div className="max-w-xl mx-auto bg-zinc-900 border border-zinc-700 rounded-3xl p-10 mb-16">
          <div className="flex justify-center mb-6">
            <select className="bg-zinc-800 border border-zinc-700 rounded-2xl px-6 py-3 text-sm">
              <option>{domain}</option>
            </select>
          </div>

          <button
            onClick={generateEmail}
            disabled={isGenerating}
            className="w-full py-6 text-xl font-medium bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl hover:brightness-110 transition-all"
          >
            {isGenerating ? "生成中..." : "✨ 一键生成临时邮箱"}
          </button>

          {currentEmail && (
            <div className="mt-8 flex gap-4 items-center bg-black/60 p-5 rounded-2xl border border-zinc-700">
              <div className="flex-1 font-mono text-lg">{currentEmail}</div>
              <button onClick={copyEmail} className="px-8 py-3 bg-white text-black rounded-xl hover:bg-gray-100">复制</button>
            </div>
          )}
        </div>

        {/* 收件箱 */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-6">收件箱</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/70 border border-zinc-700 rounded-3xl p-16 text-center">
              <div className="mx-auto w-20 h-20 bg-zinc-800 rounded-2xl flex items-center justify-center mb-6 text-4xl">📬</div>
              <p className="font-medium">暂无邮件</p>
              <p className="text-sm text-zinc-400 mt-2">新邮件会自动出现在这里</p>
            </div>
            <div className="bg-zinc-900/70 border border-zinc-700 rounded-3xl p-16 text-center flex flex-col items-center justify-center">
              <div className="text-6xl mb-6 opacity-40">✉️</div>
              <p className="text-zinc-400">选择一封邮件查看</p>
            </div>
          </div>
        </div>

        {/* 特性卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: "⚡", title: "即时可用", desc: "无需注册，点击即可生成" },
            { icon: "🛡️", title: "隐私优先", desc: "不记录任何个人信息，自动销毁" },
            { icon: "🌍", title: "全球加速", desc: "基于 Cloudflare 边缘网络" }
          ].map((item, i) => (
            <div key={i} className="bg-zinc-900/70 border border-zinc-700 rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">{item.icon}</div>
              <div className="font-semibold text-xl mb-2">{item.title}</div>
              <div className="text-zinc-400">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* 新增内容：使用说明 + FAQ（提高AdSense友好度） */}
        <div className="bg-zinc-900/70 border border-zinc-700 rounded-3xl p-12 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">如何使用临时邮箱？</h2>
          <div className="grid md:grid-cols-2 gap-8 text-zinc-300">
            <div>
              <h3 className="font-semibold text-lg mb-4">1. 生成邮箱</h3>
              <p>点击上方按钮即可获得一个临时邮箱地址，复制后即可使用。</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">2. 接收邮件</h3>
              <p>在注册网站时使用该邮箱，邮件会实时显示在下方收件箱。</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">3. 安全隐私</h3>
              <p>所有邮件在 24 小时后自动删除，不留任何记录。</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4">4. 合法用途</h3>
              <p>本服务仅供保护隐私使用，禁止用于违法或有害行为。</p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-20">
          <h2 className="text-2xl font-bold mb-8 text-center">常见问题</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              ["临时邮箱能用多久？", "通常 24 小时内自动清理，建议尽快使用。"],
              ["会保存我的信息吗？", "完全匿名，不保存任何个人信息或邮件内容。"],
              ["支持附件吗？", "支持查看图片和文本附件。"],
              ["为什么需要临时邮箱？", "避免垃圾邮件、保护主邮箱隐私、快速注册各种服务。"]
            ].map(([q, a], i) => (
              <div key={i} className="bg-zinc-900/70 border border-zinc-700 rounded-3xl p-8">
                <div className="font-semibold mb-3">Q: {q}</div>
                <div className="text-zinc-400">A: {a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer - 隐私政策 */}
        <footer className="mt-24 text-center text-xs text-zinc-500 border-t border-zinc-800 pt-8">
          © 2026 Open Temp Mail • 本站仅供合法隐私保护使用 • 
          <a href="#" className="hover:text-zinc-300">隐私政策</a> • 
          <a href="#" className="hover:text-zinc-300">服务条款</a>
        </footer>
      </div>
    </div>
  );
}
