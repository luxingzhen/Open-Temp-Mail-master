import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/theme/ThemeContext';
import { apiFetch } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

interface EmailSummary {
  id: number;
  sender: string;
  subject: string;
  preview?: string;
  received_at: string;
  is_read?: boolean;
  mailbox_address?: string;
}

interface EmailDetail extends EmailSummary {
  content?: string;
  html_content?: string;
  to_addrs: string;
  download?: string;
}

export default function Home() {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const [currentEmail, setCurrentEmail] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [domains, setDomains] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [customPrefix, setCustomPrefix] = useState('');
  const [mode, setMode] = useState<'random' | 'custom'>('random');

  const [emails, setEmails] = useState<EmailSummary[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailDetail | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const pollingRef = useRef<number | null>(null);

  const isLoggedIn = !!user;
  const targetMailbox = currentEmail || user?.mailboxAddress;

  useEffect(() => {
    apiFetch<string[]>('/api/domains').then(data => {
      if (Array.isArray(data) && data.length > 0) {
        setDomains(data);
        setSelectedDomain(data[0]);
      }
    }).catch(() => {});
  }, []);

  const generateEmail = () => {
    if (!selectedDomain) return;
    setIsGenerating(true);
    const idx = Math.max(0, domains.indexOf(selectedDomain));
    apiFetch<{ email: string }>(`/api/generate?length=8&domainIndex=${idx}`).then(data => {
      if (data?.email) setCurrentEmail(data.email);
    }).catch(() => {
      const random = Math.floor(Math.random() * 99999);
      setCurrentEmail(`user${random}@${selectedDomain}`);
    }).finally(() => setIsGenerating(false));
  };

  const createCustomEmail = async () => {
    const local = customPrefix.trim().toLowerCase();
    if (!local) return toast.error('请输入邮箱前缀');
    if (!/^[a-z0-9._-]{1,64}$/i.test(local)) return toast.error('前缀只允许字母、数字、._-');
    setIsGenerating(true);
    const idx = Math.max(0, domains.indexOf(selectedDomain));
    try {
      const data = await apiFetch<{ email: string }>('/api/create', {
        method: 'POST',
        body: JSON.stringify({ local, domainIndex: idx })
      });
      if (data?.email) setCurrentEmail(data.email);
    } catch {
      toast.error('创建失败，该地址可能已被使用');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyEmail = () => {
    if (currentEmail) navigator.clipboard.writeText(currentEmail);
  };

  const fetchEmails = useCallback(async (silent = false) => {
    if (!targetMailbox) return;
    if (!silent) setIsLoadingList(true);
    try {
      const endpoint = `/api/emails?mailbox=${encodeURIComponent(targetMailbox)}&limit=50&offset=0`;
      const response = await apiFetch<{ results?: EmailSummary[] } | EmailSummary[]>(endpoint);
      if (Array.isArray(response)) setEmails(response);
      else if (response?.results) setEmails(response.results);
    } catch {
      if (!silent) toast.error('加载邮件失败');
    } finally {
      if (!silent) setIsLoadingList(false);
    }
  }, [targetMailbox]);

  useEffect(() => {
    if (targetMailbox) {
      fetchEmails();
      pollingRef.current = window.setInterval(() => fetchEmails(true), 5000);
    }
    return () => {
      if (pollingRef.current) { clearInterval(pollingRef.current); pollingRef.current = null; }
    };
  }, [targetMailbox, fetchEmails]);

  const handleSelectEmail = async (id: number) => {
    setIsLoadingDetail(true);
    setSelectedEmail(null);
    try {
      const data = await apiFetch<EmailDetail>(`/api/email/${id}`);
      if (data) {
        setEmails(prev => prev.map(e => e.id === id ? { ...e, is_read: true } : e));
        setSelectedEmail(data);
      }
    } catch {
      toast.error('加载邮件内容失败');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!confirm('确定要删除这封邮件吗？')) return;
    try {
      await apiFetch(`/api/email/${id}`, { method: 'DELETE' });
      toast.success('邮件已删除');
      setEmails(emails.filter(em => em.id !== id));
      if (selectedEmail?.id === id) setSelectedEmail(null);
    } catch {
      toast.error('删除邮件失败');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-xl">📧</div>
            <div className="text-2xl font-bold">Open Temp Mail</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggle} className="w-9 h-9 bg-muted hover:bg-accent rounded-xl flex items-center justify-center transition-colors cursor-pointer" title={theme === 'dark' ? '切换亮色模式' : '切换暗黑模式'}>
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {isLoggedIn ? (
              <a href="/app/dashboard">
                <button className="px-5 py-2 bg-muted hover:bg-accent rounded-full text-sm transition-colors cursor-pointer">控制台</button>
              </a>
            ) : (
              <a href="/login">
                <button className="px-5 py-2 bg-muted hover:bg-accent rounded-full text-sm transition-colors cursor-pointer">登录</button>
              </a>
            )}
          </div>
        </header>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-emerald-900/60 text-emerald-400 px-6 py-2 rounded-full text-sm">
            ● 实时可用 · 全球加速
          </div>
        </div>

        <h1 className="text-5xl font-bold text-center mb-4">临时邮箱 一键生成</h1>
        <p className="text-center text-muted-foreground max-w-md mx-auto mb-12">
          保护你的隐私，再也不怕垃圾邮件和信息泄露。安全、快速、免费的一次性邮箱服务。
        </p>

        {/* 生成区域 */}
        <div className="max-w-xl mx-auto bg-card border border-border rounded-3xl p-10 mb-16">
          <div className="flex justify-center gap-3 mb-6">
            <select value={selectedDomain} onChange={e => setSelectedDomain(e.target.value)} className="bg-muted border border-border rounded-2xl px-6 py-3 text-sm focus:outline-none flex-1">
              {domains.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            <button onClick={() => setMode('random')} className={`px-5 py-2 rounded-full text-sm transition-colors cursor-pointer ${mode === 'random' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-accent'}`}>随机生成</button>
            <button onClick={() => setMode('custom')} className={`px-5 py-2 rounded-full text-sm transition-colors cursor-pointer ${mode === 'custom' ? 'bg-blue-600 text-white' : 'bg-muted hover:bg-accent'}`}>自定义</button>
          </div>

          {mode === 'random' ? (
            <button
              onClick={generateEmail}
              disabled={isGenerating}
              className="w-full py-6 text-xl font-medium bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl hover:brightness-110 transition-all cursor-pointer"
            >
              {isGenerating ? "生成中..." : "✨ 一键生成临时邮箱"}
            </button>
          ) : (
            <div className="flex gap-3">
              <input type="text" value={customPrefix} onChange={e => setCustomPrefix(e.target.value)} placeholder="输入邮箱前缀" maxLength={30}
                className="flex-1 bg-muted border border-border rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500" />
              <button onClick={createCustomEmail} disabled={isGenerating}
                className="px-8 py-3 font-medium bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl hover:brightness-110 transition-all cursor-pointer disabled:opacity-70">
                {isGenerating ? "创建中" : "创建"}
              </button>
            </div>
          )}

          {currentEmail && (
            <div className="mt-8 flex gap-4 items-center bg-card/80 p-5 rounded-2xl border border-border">
              <div className="flex-1 font-mono text-lg">{currentEmail}</div>
              <button onClick={copyEmail} className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:brightness-110 transition-all cursor-pointer">复制</button>
            </div>
          )}
        </div>

        {/* 收件箱 */}
        <div className="mb-20">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">收件箱</h2>
            {targetMailbox && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                每 5 秒自动刷新
                <button onClick={() => fetchEmails()} className="px-4 py-1.5 bg-muted hover:bg-accent rounded-full transition-colors cursor-pointer">
                  {isLoadingList ? '⟳' : '↻'}
                </button>
              </div>
            )}
          </div>

          {targetMailbox ? (
            <div className="bg-card border border-border rounded-3xl overflow-hidden">
              {emails.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="mx-auto w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6 text-4xl">📬</div>
                  <p className="font-medium">暂无邮件</p>
                  <p className="text-sm text-muted-foreground mt-2">新邮件会自动出现在这里</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {emails.map(mail => (
                    <div key={mail.id} onClick={() => handleSelectEmail(mail.id)}
                      className={`p-5 hover:bg-accent cursor-pointer transition-colors flex items-start gap-4 ${selectedEmail?.id === mail.id ? 'bg-accent' : ''} ${!mail.is_read ? 'border-l-2 border-l-blue-500' : ''}`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center">
                          <div className="font-medium truncate">{mail.sender}</div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap ml-3">
                            {formatDistanceToNow(new Date(mail.received_at), { addSuffix: true })}
                          </div>
                        </div>
                        <div className="font-semibold mt-0.5 truncate">{mail.subject}</div>
                        <div className="text-sm text-muted-foreground line-clamp-2 mt-0.5">{mail.preview}</div>
                      </div>
                      <button onClick={(e) => handleDelete(e, mail.id)}
                        className="shrink-0 opacity-0 hover:opacity-100 hover:bg-white/10 w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-red-400 transition-all cursor-pointer">🗑️</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-3xl p-16 text-center">
              <div className="mx-auto w-20 h-20 bg-muted rounded-2xl flex items-center justify-center mb-6 text-4xl">📬</div>
              <p className="font-medium">暂无邮件</p>
              <p className="text-sm text-muted-foreground mt-2">先生成邮箱，邮件将自动显示</p>
            </div>
          )}
        </div>

        {/* 邮件详情弹窗 */}
        {selectedEmail && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            {isLoadingDetail ? (
              <div className="bg-card border border-border rounded-3xl max-w-3xl w-full p-12 text-center">
                <div className="text-muted-foreground animate-pulse">加载中...</div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-border">
                  <button onClick={() => setSelectedEmail(null)} className="float-right text-muted-foreground hover:text-foreground text-xl cursor-pointer">✕</button>
                  <div className="text-sm text-muted-foreground">{selectedEmail.sender}</div>
                  <h2 className="text-xl font-semibold mt-2">{selectedEmail.subject}</h2>
                  <div className="text-xs text-muted-foreground mt-2">
                    至 {selectedEmail.to_addrs} · {new Date(selectedEmail.received_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex-1 p-6 overflow-auto">
                  {selectedEmail.html_content ? (
                    <div className="prose prose-invert max-w-none text-muted-foreground [&_a]:text-blue-400 [&_img]:max-w-full" dangerouslySetInnerHTML={{ __html: selectedEmail.html_content }} />
                  ) : (
                    <pre className="whitespace-pre-wrap font-sans text-sm text-muted-foreground leading-relaxed">{selectedEmail.content}</pre>
                  )}
                </div>
                <div className="p-4 border-t border-border flex gap-3">
                  <button onClick={(e) => handleDelete(e, selectedEmail.id)} className="flex-1 py-3.5 bg-red-500/20 hover:bg-red-500/40 rounded-2xl transition-all text-sm cursor-pointer">🗑️ 删除</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 特性卡片 */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: "⚡", title: "即时可用", desc: "无需注册，点击即可生成" },
            { icon: "🛡️", title: "隐私优先", desc: "不记录任何个人信息，自动销毁" },
            { icon: "🌍", title: "全球加速", desc: "基于 Cloudflare 边缘网络" }
          ].map((item, i) => (
            <div key={i} className="bg-card border border-border rounded-3xl p-8 text-center">
              <div className="text-5xl mb-4">{item.icon}</div>
              <div className="font-semibold text-xl mb-2">{item.title}</div>
              <div className="text-muted-foreground">{item.desc}</div>
            </div>
          ))}
        </div>

        {/* 使用说明 */}
        <div className="bg-card border border-border rounded-3xl p-12 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">如何使用临时邮箱？</h2>
          <div className="grid md:grid-cols-2 gap-8 text-muted-foreground">
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">1. 生成邮箱</h3>
              <p>点击上方按钮即可获得一个临时邮箱地址，复制后即可使用。</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">2. 接收邮件</h3>
              <p>在注册网站时使用该邮箱，邮件会实时显示在下方收件箱。</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">3. 安全隐私</h3>
              <p>所有邮件在 24 小时后自动删除，不留任何记录。</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">4. 合法用途</h3>
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
              <div key={i} className="bg-card border border-border rounded-3xl p-8">
                <div className="font-semibold mb-3">{q}</div>
                <div className="text-muted-foreground">{a}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 text-center text-xs text-muted-foreground/70 border-t border-border pt-8 pb-4">
          <div className="space-y-2">
            <div>© 2026 Open Temp Mail. All rights reserved.</div>
            <div>
              <a href="/privacy" className="hover:text-foreground">隐私政策</a> • 
              <a href="/terms" className="hover:text-foreground">服务条款</a> • 
              <a href="/about" className="hover:text-foreground">关于我们</a> • 
              <a href="/faq" className="hover:text-foreground">常见问题</a>
            </div>
            <div>本站仅供合法隐私保护使用</div>
            <div>ICP备案号：<a href="https://beian.miit.gov.cn/" target="_blank" className="hover:text-foreground">沪ICP备2024xxxxx号-1</a></div>
          </div>
        </footer>
      </div>
    </div>
  );
}
