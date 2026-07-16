import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
          ← 返回首页
        </Link>
        <h1 className="text-4xl font-bold mb-8">关于我们</h1>

        <div className="space-y-8 text-zinc-300 leading-relaxed">
          <section className="bg-zinc-900/70 border border-zinc-700 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">项目介绍</h2>
            <p>Open Temp Mail 是一个开源的一次性临时邮箱服务，基于 Cloudflare Workers 构建。我们的目标是帮助用户保护在线隐私，避免垃圾邮件骚扰，同时保持完全免费和易用。</p>
          </section>

          <section className="bg-zinc-900/70 border border-zinc-700 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">技术栈</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "React", desc: "前端框架" },
                { name: "Cloudflare Workers", desc: "边缘计算" },
                { name: "D1 Database", desc: "数据库" },
                { name: "R2 Storage", desc: "邮件存储" },
                { name: "TypeScript", desc: "开发语言" },
                { name: "Tailwind CSS", desc: "样式框架" },
                { name: "Vite", desc: "构建工具" },
                { name: "Wrangler", desc: "部署工具" }
              ].map((item, i) => (
                <div key={i} className="bg-zinc-800 rounded-2xl p-4 text-center">
                  <div className="font-semibold text-white">{item.name}</div>
                  <div className="text-xs text-zinc-400 mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-zinc-900/70 border border-zinc-700 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">开源</h2>
            <p className="mb-4">本项目完全开源，欢迎参与贡献：</p>
            <a href="https://github.com/luxingzhen/Open-Temp-Mail-master" target="_blank" className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-2xl transition-colors">
              <span className="text-xl">🐙</span>
              <span>GitHub 仓库</span>
            </a>
          </section>

          <section className="bg-zinc-900/70 border border-zinc-700 rounded-3xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-4">联系方式</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xl">🐛</span>
                <span>问题反馈：</span>
                <a href="https://github.com/luxingzhen/Open-Temp-Mail-master/issues" target="_blank" className="text-blue-400 hover:text-blue-300">GitHub Issues</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">📧</span>
                <span>邮箱：</span>
                <a href="mailto:admin@jisuysc.com" className="text-blue-400 hover:text-blue-300">admin@jisuysc.com</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xl">💬</span>
                <span>项目讨论：</span>
                <a href="https://github.com/luxingzhen/Open-Temp-Mail-master/discussions" target="_blank" className="text-blue-400 hover:text-blue-300">GitHub Discussions</a>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
