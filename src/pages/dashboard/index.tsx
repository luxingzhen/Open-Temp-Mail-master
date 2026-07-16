import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { apiFetch } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Mail, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserList } from './UserList';
import { MailboxList } from './MailboxList';
import { TempMailGenerator } from './TempMailGenerator';

export default function Dashboard() {
    const { user } = useAuth();
    // Overview state
    const [stats, setStats] = useState({ total: 0, online: true });

    // Mailbox User state
    const isMailboxUser = user?.role === 'mailbox';
    const isAdmin = user?.role === 'admin';

    // Fetch basic stats for overview
    const fetchStats = useCallback(async () => {
        if (!user || user.role !== 'admin') return;
        try {
            // Re-using mailboxes endpoint or dedicated stats endpoint if available
            // For now, let's just use the mailboxes endpoint to get total count
            const data = await apiFetch<{ total: number }>('/api/mailboxes?limit=1');
            if (data && typeof data.total === 'number') {
                setStats(s => ({ ...s, total: data.total }));
            }
        } catch {
            console.error('Failed to fetch stats');
        }
    }, [user]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        void fetchStats();
    }, [fetchStats]);

    if (isMailboxUser) {
        return (
            <div className="p-6 space-y-6">
                <h1 className="text-3xl font-bold">欢迎, {user?.username}</h1>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">我的收件箱</CardTitle>
                            <Mail className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">查看邮件</div>
                            <p className="text-xs text-muted-foreground">
                                查看您收到的消息
                            </p>
                            <Button asChild className="mt-4 w-full">
                                <Link to="/app/mailbox">前往收件箱</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">仪表盘</h1>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">概览</TabsTrigger>
                    {isAdmin && <TabsTrigger value="mailboxes">邮箱管理</TabsTrigger>}
                    {isAdmin && <TabsTrigger value="users">用户管理</TabsTrigger>}
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">邮箱总数</CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.total}</div>
                                <p className="text-xs text-muted-foreground">
                                    管理的活跃邮箱
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">系统状态</CardTitle>
                                <div className="h-4 w-4 rounded-full bg-green-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">在线</div>
                                <p className="text-xs text-muted-foreground">
                                    Cloudflare Worker 运行中
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <TempMailGenerator />
                        <Card>
                            <CardHeader>
                                <CardTitle>近期活动</CardTitle>
                                <CardDescription>
                                    系统活动概览。
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    系统运行正常。使用上方标签页管理邮箱和用户。
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {isAdmin && (
                    <TabsContent value="mailboxes" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>邮箱管理</CardTitle>
                                <CardDescription>
                                    管理所有临时邮箱，按域名筛选，执行批量操作。
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <MailboxList />
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                {isAdmin && (
                    <TabsContent value="users">
                        <UserList />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
