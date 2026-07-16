export interface EmailDetailData {
  id: number;
  sender: string;
  subject: string;
  content?: string;
  html_content?: string;
  to_addrs: string;
  received_at: string;
  download?: string;
  preview?: string;
}

interface EmailDetailProps {
  email: EmailDetailData;
  onReply: (email: EmailDetailData) => void;
  onDelete: (e: React.MouseEvent, id: number) => void;
  onClose: () => void;
}

export default function EmailDetail({ email, onReply, onDelete, onClose }: EmailDetailProps) {
  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden h-[70vh] flex flex-col">
      {/* 邮件头 */}
      <div className="p-6 md:p-8 border-b border-white/10">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-zinc-400">来自</div>
            <div className="font-medium text-white">{email.sender}</div>
            <div className="text-sm text-zinc-500 mt-1">至 {email.to_addrs}</div>
          </div>
          <div className="text-right shrink-0 ml-4">
            <div className="text-sm text-zinc-400">{new Date(email.received_at).toLocaleString()}</div>
            <button onClick={onClose} className="lg:hidden mt-2 px-3 py-1 bg-white/10 rounded-xl text-sm">
              ✕
            </button>
          </div>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold mt-4 text-white">{email.subject}</h2>
      </div>

      {/* 邮件正文 */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        {email.html_content ? (
          <div
            dangerouslySetInnerHTML={{ __html: email.html_content }}
            className="prose prose-invert max-w-none text-zinc-200 [&_a]:text-blue-400 [&_img]:max-w-full"
          />
        ) : (
          <pre className="whitespace-pre-wrap font-sans text-sm text-zinc-300 leading-relaxed">
            {email.content}
          </pre>
        )}
      </div>

      {/* 底部操作栏 */}
      <div className="p-4 md:p-6 border-t border-white/10 flex gap-3 bg-black/30">
        <button
          onClick={() => onReply(email)}
          className="flex-1 py-3.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-sm font-medium"
        >
          ↩ 回复
        </button>
        <button className="flex-1 py-3.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-sm font-medium">
          ↗ 转发
        </button>
        {email.download && (
          <a
            href={email.download}
            download
            className="flex-1 py-3.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-all text-sm font-medium text-center block"
          >
            📥 下载
          </a>
        )}
        <button
          onClick={(e) => onDelete(e, email.id)}
          className="flex-1 py-3.5 bg-red-500/20 hover:bg-red-500/40 rounded-2xl transition-all text-sm font-medium"
        >
          🗑️ 删除
        </button>
      </div>
    </div>
  );
}
