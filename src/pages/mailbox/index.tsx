import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import EmailDetail from './EmailDetail';

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

export default function Mailbox() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryMailbox = searchParams.get('mailbox');
  const targetMailbox = queryMailbox || user?.mailboxAddress;

  const [emails, setEmails] = useState<EmailSummary[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<EmailDetail | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEmails = useCallback(async (silent = false) => {
    const isAdminAllView = !targetMailbox && user?.role === 'admin';
    if (!targetMailbox && !isAdminAllView) return;

    if (!silent) setIsLoadingList(true);
    try {
      const endpoint = isAdminAllView
        ? '/api/emails?limit=100&offset=0'
        : `/api/emails?mailbox=${encodeURIComponent(targetMailbox!)}&limit=100&offset=0`;

      const response = await apiFetch<{ results?: EmailSummary[] } | EmailSummary[]>(endpoint);
      if (Array.isArray(response)) setEmails(response);
      else if (response?.results) setEmails(response.results);
    } catch {
      if (!silent) toast.error('加载邮件失败');
    } finally {
      if (!silent) setIsLoadingList(false);
    }
  }, [targetMailbox, user?.role]);

  useEffect(() => {
    const isAdminAllView = !targetMailbox && user?.role === 'admin';
    if (targetMailbox || isAdminAllView) fetchEmails();
  }, [fetchEmails, targetMailbox, user?.role]);

  const filteredEmails = useMemo(() => {
    if (!searchQuery.trim()) return emails;
    const q = searchQuery.toLowerCase();
    return emails.filter(e =>
      e.subject.toLowerCase().includes(q) ||
      e.sender.toLowerCase().includes(q) ||
      e.preview?.toLowerCase().includes(q)
    );
  }, [emails, searchQuery]);

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

  const handleReply = (email: EmailDetail) => {
    navigate('/app/compose', {
      state: {
        to: email.sender,
        subject: email.subject.startsWith('Re:') ? email.subject : `Re: ${email.subject}`,
        body: `\n\n\n--- Original Message ---\nFrom: ${email.sender}\nDate: ${new Date(email.received_at).toLocaleString()}\nSubject: ${email.subject}\n\n`
      }
    });
  };

  const handleNewEmail = () => {
    window.location.href = '/';
  };

  const selected = selectedEmail;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-slate-950 to-black text-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* 顶部栏 */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">收件箱</h1>
            {targetMailbox && (
              <p className="text-zinc-400 text-sm mt-1">{targetMailbox}</p>
            )}
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="搜索邮件..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 pl-10 text-sm text-white placeholder-zinc-500 outline-none focus:border-blue-400/50 w-48 transition-colors"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">🔍</span>
            </div>
            <button
              onClick={() => fetchEmails()}
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 rounded-2xl transition-all text-sm flex items-center gap-2"
            >
              {isLoadingList ? '⟳' : '↻'} 刷新
            </button>
            <button
              onClick={handleNewEmail}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl transition-all text-sm font-medium hover:brightness-110"
            >
              ✨ 生成新邮箱
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 邮件列表 */}
          <div className={`lg:col-span-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden h-fit max-h-[75vh] overflow-y-auto ${selected ? 'hidden lg:block' : ''}`}>
            {filteredEmails.length === 0 && !isLoadingList && (
              <div className="h-96 flex flex-col items-center justify-center text-zinc-400">
                <div className="text-6xl mb-4 opacity-50">📭</div>
                <p>暂无邮件</p>
                <p className="text-sm mt-1">新邮件会自动出现在这里</p>
              </div>
            )}
            {filteredEmails.map((mail) => (
              <div
                key={mail.id}
                onClick={() => handleSelectEmail(mail.id)}
                className={`group p-5 border-b border-white/10 hover:bg-white/5 cursor-pointer transition-all relative ${
                  selected?.id === mail.id ? 'bg-white/10' : ''
                } ${!mail.is_read ? 'border-l-2 border-l-blue-500' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div className="font-medium truncate flex-1">{mail.sender}</div>
                  <div className="text-xs text-zinc-500 whitespace-nowrap ml-3">
                    {formatDistanceToNow(new Date(mail.received_at), { addSuffix: true })}
                  </div>
                </div>
                {mail.mailbox_address && (
                  <div className="text-xs text-blue-400 mt-0.5">📬 {mail.mailbox_address}</div>
                )}
                <div className="font-semibold mt-1 text-sm truncate">{mail.subject}</div>
                <div className="text-sm text-zinc-400 line-clamp-2 mt-0.5">{mail.preview}</div>
                <button
                  onClick={(e) => handleDelete(e, mail.id)}
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 hover:bg-white/10 w-7 h-7 rounded-lg flex items-center justify-center text-zinc-500 hover:text-red-400 transition-all"
                  title="删除"
                >
                  🗑️
                </button>
              </div>
            ))}
            {filteredEmails.length > 0 && (
              <div className="p-4 text-center text-xs text-zinc-500 border-t border-white/5">
                共 {filteredEmails.length} 封邮件
              </div>
            )}
          </div>

          {/* 邮件详情 */}
          <div className={`lg:col-span-7 ${!selected ? 'hidden lg:block' : ''}`}>
            {isLoadingDetail ? (
              <div className="h-[70vh] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl flex items-center justify-center">
                <div className="text-zinc-400 text-lg animate-pulse">加载中...</div>
              </div>
            ) : selected ? (
              <EmailDetail
                email={selected}
                onReply={handleReply}
                onDelete={handleDelete}
                onClose={() => setSelectedEmail(null)}
              />
            ) : (
              <div className="h-[70vh] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl flex items-center justify-center text-zinc-400">
                <div className="text-center">
                  <div className="text-7xl mb-6 opacity-30">✉️</div>
                  <p className="text-xl">选择一封邮件查看</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
