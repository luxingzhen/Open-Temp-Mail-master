import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors">
          ← 返回首页
        </Link>
        <h1 className="text-4xl font-bold mb-8">服务条款</h1>
        <div className="space-y-6 text-zinc-300 leading-relaxed">
          <p className="text-zinc-400 text-sm">最后更新：2026 年 7 月</p>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. 服务说明</h2>
            <p>Open Temp Mail 提供一次性临时邮箱服务（以下简称"本服务"）。本服务允许用户生成临时邮箱地址，用于接收验证邮件和临时通信。</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. 使用规则</h2>
            <p>使用本服务时，您同意：</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>不得将本服务用于任何违法活动</li>
              <li>不得利用本服务发送垃圾邮件、诈骗信息或恶意内容</li>
              <li>不得尝试破坏或干扰本服务的正常运行</li>
              <li>不得利用本服务侵犯他人合法权益</li>
              <li>不得将本服务用于批量注册、刷票等滥用行为</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. 免责声明</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>本服务按"现状"提供，不提供任何明示或暗示的保证</li>
              <li>我们不对邮件内容的准确性、完整性或合法性负责</li>
              <li>我们有权在任何时候修改、暂停或终止服务，无需另行通知</li>
              <li>因使用本服务而产生的任何损失或损害，我们不承担责任</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. 知识产权</h2>
            <p>本服务的所有权利、所有权和利益归项目所有者所有。本服务基于开源代码构建，遵循相应开源许可协议。</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. 终止</h2>
            <p>我们保留在任何时候、因任何原因（包括但不限于违反本条款）终止您访问本服务的权利。终止后，您的临时邮箱将立即失效，所有邮件将被删除。</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. 条款变更</h2>
            <p>我们可能会不时修改本条款。修改后的条款将在本页面发布。继续使用本服务即表示您接受修改后的条款。</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. 适用法律</h2>
            <p>本条款受中华人民共和国法律管辖。如有争议，双方应友好协商解决；协商不成的，提交有管辖权的人民法院裁决。</p>
          </section>
        </div>
      </div>
    </div>
  );
}
