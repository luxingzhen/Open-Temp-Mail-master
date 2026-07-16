import { TempMailGenerator } from '@/pages/dashboard/TempMailGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Generate() {
    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="container max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                        <ArrowLeft className="h-4 w-4" />
                        返回首页
                    </Link>
                </div>

                <Card className="border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                            <Mail className="h-6 w-6 text-primary" />
                            临时邮箱生成器
                        </CardTitle>
                        <CardDescription>
                            点击下方按钮即可生成临时邮箱地址，无需登录，即时可用
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TempMailGenerator />
                    </CardContent>
                </Card>

                <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>生成的邮箱地址可用于接收验证码、注册账号等场景</p>
                    <p className="mt-1">邮件将在生成后的 24 小时内自动清理</p>
                </div>
            </div>
        </div>
    );
}