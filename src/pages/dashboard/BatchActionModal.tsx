import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiFetch } from '@/lib/api';

interface BatchActionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    action: 'allow' | 'deny' | 'favorite' | 'unfavorite' | 'forward' | 'clear-forward' | null;
    selectedMailboxes: string[];
    onSuccess: () => void;
}

export function BatchActionModal({ open, onOpenChange, action, selectedMailboxes, onSuccess }: BatchActionModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [forwardTo, setForwardTo] = useState('');

    const getActionDetails = () => {
        switch (action) {
            case 'allow': return { title: '批量允许登录', icon: '✅', confirmText: '允许登录' };
            case 'deny': return { title: '批量禁止登录', icon: '🚫', confirmText: '禁止登录' };
            case 'favorite': return { title: '批量收藏', icon: '⭐', confirmText: '添加到收藏' };
            case 'unfavorite': return { title: '批量取消收藏', icon: '☆', confirmText: '移除收藏' };
            case 'forward': return { title: '批量设置转发', icon: '↪️', confirmText: '设置转发' };
            case 'clear-forward': return { title: '批量清除转发', icon: '🚫', confirmText: '清除转发' };
            default: return { title: '批量操作', icon: '⚡', confirmText: '确认' };
        }
    };

    const { title, icon, confirmText } = getActionDetails();

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            if (action === 'allow' || action === 'deny') {
                await apiFetch('/api/mailboxes/batch-toggle-login', {
                    method: 'POST',
                    body: JSON.stringify({
                        addresses: selectedMailboxes,
                        can_login: action === 'allow'
                    })
                });
            } else if (action === 'favorite' || action === 'unfavorite') {
                await apiFetch('/api/mailboxes/batch-favorite-by-address', {
                    method: 'POST',
                    body: JSON.stringify({
                        addresses: selectedMailboxes,
                        is_favorite: action === 'favorite'
                    })
                });
            } else if (action === 'forward') {
                if (!forwardTo || !forwardTo.includes('@')) {
                    toast.error('请输入有效的邮箱地址');
                    setIsLoading(false);
                    return;
                }
                await apiFetch('/api/mailboxes/batch-forward-by-address', {
                    method: 'POST',
                    body: JSON.stringify({
                        addresses: selectedMailboxes,
                        forward_to: forwardTo
                    })
                });
            } else if (action === 'clear-forward') {
                await apiFetch('/api/mailboxes/batch-forward-by-address', {
                    method: 'POST',
                    body: JSON.stringify({
                        addresses: selectedMailboxes,
                        forward_to: null
                    })
                });
            }

            toast.success('批量操作完成');
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error('Batch action failed:', error);
            const msg = error instanceof Error ? error.message : '批量操作失败';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <span>{icon}</span>
                        <span>{title}</span>
                    </DialogTitle>
                    <DialogDescription>
                        您即将对 <strong>{selectedMailboxes.length}</strong> 个邮箱应用此操作。
                    </DialogDescription>
                </DialogHeader>

                {action === 'forward' && (
                    <div className="py-2">
                        <label className="text-sm font-medium mb-1 block">转发地址</label>
                        <Input
                            value={forwardTo}
                            onChange={(e) => setForwardTo(e.target.value)}
                            placeholder="target@example.com"
                            type="email"
                        />
                    </div>
                )}

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>取消</Button>
                    <Button onClick={handleConfirm} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
