import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Mailbox {
    id: number;
    address: string;
    forward_to?: string;
}

interface ForwardMailboxDialogProps {
    mailbox: Mailbox;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: (mailboxId: number, forwardTo: string | null) => void;
}

export function ForwardMailboxDialog({ mailbox, open, onOpenChange, onSuccess }: ForwardMailboxDialogProps) {
    const [forwardTo, setForwardTo] = useState(mailbox.forward_to || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setForwardTo(mailbox.forward_to || '');
    }, [mailbox]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const target = forwardTo.trim() || null;
            await apiFetch('/api/mailbox/forward', {
                method: 'POST',
                body: JSON.stringify({
                    mailbox_id: mailbox.id,
                    forward_to: target
                })
            });

            toast.success(target ? '转发设置成功' : '转发已禁用');
            onSuccess(mailbox.id, target);
            onOpenChange(false);
        } catch (error) {
            const msg = error instanceof Error ? error.message : '更新转发设置失败';
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>设置转发: {mailbox.address}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">转发到邮箱</label>
                        <Input
                            value={forwardTo}
                            onChange={e => setForwardTo(e.target.value)}
                            placeholder="user@example.com (留空则禁用)"
                            type="email"
                        />
                        <p className="text-xs text-muted-foreground">
                            发送到 <strong>{mailbox.address}</strong> 的邮件将被转发到此地址。
                            <br />
                            注意: 目标邮箱必须在 Cloudflare Email Routing 设置中已验证。
                        </p>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>取消</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            保存设置
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
