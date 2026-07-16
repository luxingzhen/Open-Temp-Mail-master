import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Mail, RefreshCw, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface GeneratedEmail {
    email: string;
    expires: number;
}

export function TempMailGenerator() {
    const [generatedEmail, setGeneratedEmail] = useState<string>('');
    const [customLocal, setCustomLocal] = useState('');
    const [domains, setDomains] = useState<string[]>([]);
    const [selectedDomain, setSelectedDomain] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        const fetchDomains = async () => {
            try {
                const data = await apiFetch<string[]>('/api/domains');
                if (Array.isArray(data) && data.length > 0) {
                    setDomains(data);
                    setSelectedDomain(data[0]);
                }
            } catch (error) {
                console.error('Failed to fetch domains', error);
                toast.error('加载域名失败');
            }
        };

        fetchDomains();
    }, []);

    const handleRandomGenerate = async () => {
        setIsGenerating(true);
        try {
            // Find index of selected domain
            const domainIndex = domains.indexOf(selectedDomain);
            const idx = domainIndex >= 0 ? domainIndex : 0;

            const data = await apiFetch<GeneratedEmail>(`/api/generate?length=8&domainIndex=${idx}`);
            if (data?.email) {
                setGeneratedEmail(data.email);
                toast.success('随机邮箱生成成功！');
            }
        } catch (error) {
            console.error('Failed to generate email', error);
            toast.error('生成邮箱失败');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCustomCreate = async () => {
        if (!customLocal.trim()) {
            toast.error('请输入邮箱前缀');
            return;
        }

        if (!/^[a-z0-9._-]{1,64}$/i.test(customLocal.trim())) {
            toast.error('格式无效。仅允许字母、数字、点、连字符和下划线');
            return;
        }

        setIsCreating(true);
        try {
            // Find index of selected domain
            const domainIndex = domains.indexOf(selectedDomain);
            const idx = domainIndex >= 0 ? domainIndex : 0;

            const data = await apiFetch<GeneratedEmail>('/api/create', {
                method: 'POST',
                body: JSON.stringify({
                    local: customLocal.trim(),
                    domainIndex: idx
                })
            });

            if (data?.email) {
                setGeneratedEmail(data.email);
                setCustomLocal('');
                toast.success('自定义邮箱创建成功！');
            }
        } catch (error) {
            console.error('Failed to create email', error);
            toast.error('创建邮箱失败');
        } finally {
            setIsCreating(false);
        }
    };

    const handleCopy = () => {
        if (generatedEmail) {
            navigator.clipboard.writeText(generatedEmail);
            toast.success('邮箱地址已复制到剪贴板！');
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    临时邮箱生成器
                </CardTitle>
                <CardDescription>
                    生成临时邮箱地址用于测试或隐私保护
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Tabs defaultValue="random" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="random">随机生成</TabsTrigger>
                        <TabsTrigger value="custom">自定义</TabsTrigger>
                    </TabsList>

                    <TabsContent value="random" className="space-y-4">
                        <div className="space-y-2">
                            <Label>生成随机邮箱</Label>
                            <p className="text-sm text-muted-foreground">
                                点击下方按钮生成随机临时邮箱地址
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">域名:</span>
                                <Select value={selectedDomain} onValueChange={setSelectedDomain} disabled={domains.length === 0}>
                                    <SelectTrigger className="w-[200px]">
                                        <SelectValue placeholder="选择域名" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {domains.map((domain) => (
                                            <SelectItem key={domain} value={domain}>
                                                {domain}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <Button
                            onClick={handleRandomGenerate}
                            disabled={isGenerating || domains.length === 0}
                            className="w-full"
                        >
                            {isGenerating ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    生成中...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    生成随机邮箱
                                </>
                            )}
                        </Button>
                    </TabsContent>

                    <TabsContent value="custom" className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="custom-local">自定义邮箱地址</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="custom-local"
                                    placeholder="yourname"
                                    value={customLocal}
                                    onChange={(e) => setCustomLocal(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCustomCreate();
                                        }
                                    }}
                                />
                                <span className="flex items-center text-muted-foreground">@</span>
                                <Select value={selectedDomain} onValueChange={setSelectedDomain} disabled={domains.length === 0}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="选择域名" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {domains.map((domain) => (
                                            <SelectItem key={domain} value={domain}>
                                                {domain}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                使用字母、数字、点、连字符和下划线（1-64字符）
                            </p>
                        </div>
                        <Button
                            onClick={handleCustomCreate}
                            disabled={isCreating || domains.length === 0}
                            className="w-full"
                        >
                            {isCreating ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    创建中...
                                </>
                            ) : (
                                <>
                                    <Mail className="mr-2 h-4 w-4" />
                                    创建自定义邮箱
                                </>
                            )}
                        </Button>
                    </TabsContent>
                </Tabs>

                {generatedEmail && (
                    <div className="mt-4 p-4 bg-muted rounded-lg space-y-2">
                        <Label className="text-sm font-medium">生成的邮箱</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                value={generatedEmail}
                                readOnly
                                className="font-mono bg-background"
                            />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopy}
                                title="复制到剪贴板"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            点击复制按钮将邮箱地址复制到剪贴板
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
