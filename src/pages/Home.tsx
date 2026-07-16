import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Mail, Send, Shield, Zap, Globe, Lock, ArrowRight, Sparkles } from 'lucide-react';
import { TempMailGenerator } from '@/pages/dashboard/TempMailGenerator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
    const features = [
        {
            icon: Zap,
            title: '极速部署',
            desc: '基于 Cloudflare Workers 边缘网络，全球毫秒级响应，零冷启动延迟。'
        },
        {
            icon: Shield,
            title: '隐私优先',
            desc: '完全匿名的一次性邮箱，无需注册即可使用，邮件读取后自动销毁。'
        },
        {
            icon: Globe,
            title: '多域名支持',
            desc: '支持配置多个自定义域名，灵活切换，满足不同场景需求。'
        },
        {
            icon: Lock,
            title: '安全可控',
            desc: '管理员可管理邮箱权限、设置转发规则、批量操作，企业级安全标准。'
        },
        {
            icon: Send,
            title: '邮件转发',
            desc: '自动转发规则，将临时邮箱收到的邮件实时转发至真实邮箱。'
        },
        {
            icon: Mail,
            title: '完整邮箱功能',
            desc: '支持收件、发件、回复、HTML 邮件渲染、附件下载、收藏标记等。'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
            {/* Hero Section */}
            <section className="container max-w-6xl mx-auto px-4 py-20 md:py-32 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        Open-Temp-Mail v1.0.0 正式发布
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground via-primary to-blue-600 bg-clip-text text-transparent">
                        现代化临时邮箱服务
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                        基于 React + Cloudflare Workers 构建，提供极速、私密、功能完整的一次性邮箱体验。
                        支持自定义域名、邮件转发、批量管理，开箱即用。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/generate">
                            <Button size="lg" className="gap-2 px-8 py-3 text-lg">
                                <Mail className="h-5 w-5" />
                                立即生成临时邮箱
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="outline" className="gap-2 px-8 py-3 text-lg">
                                进入管理后台
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Generator Section - 无需登录，直接生成 */}
            <section className="container max-w-4xl mx-auto px-4 py-8">
                <Card className="border-primary/20 shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                            <Mail className="h-6 w-6 text-primary" />
                            临时邮箱生成器
                            <Sparkles className="h-5 w-5 text-primary" />
                        </CardTitle>
                        <CardDescription>
                            无需登录 · 即时生成 · 立即可用 · 隐私保护
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TempMailGenerator />
                    </CardContent>
                </Card>
            </section>

            {/* Features Section */}
            <section className="container max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">核心功能</h2>
                    <p className="text-muted-foreground text-lg">为开发者和隐私保护者设计的完整解决方案</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, i) => (
                        <div key={i} className="group p-6 bg-card border rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                <feature.icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tech Stack */}
            <section className="py-16 bg-muted/30">
                <div className="container max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">技术栈</h2>
                        <p className="text-muted-foreground">现代化全栈架构，高性能、可扩展性、低维护成本</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="p-4 bg-card border rounded-lg">
                            <div className="text-3xl font-bold text-primary mb-1">React 19</div>
                            <div className="text-sm text-muted-foreground">前端框架</div>
                        </div>
                        <div className="p-4 bg-card border rounded-lg">
                            <div className="text-3xl font-bold text-primary mb-1">Cloudflare Workers</div>
                            <div className="text-sm text-muted-foreground">边缘计算</div>
                        </div>
                        <div className="p-4 bg-card border rounded-lg">
                            <div className="text-3xl font-bold text-primary mb-1">D1 + R2</div>
                            <div className="text-sm text-muted-foreground">数据库 + 对象存储</div>
                        </div>
                        <div className="p-4 bg-card border rounded-lg">
                            <div className="text-3xl font-bold text-primary mb-1">TypeScript + Vite</div>
                            <div className="text-sm text-muted-foreground">类型安全 + 极速构建</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="container max-w-6xl mx-auto px-4 py-16">
                <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 md:p-12 text-center text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">准备开始了吗？</h2>
                    <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
                        无需注册，即刻生成临时邮箱。管理员可登录后台配置域名、管理用户、设置转发规则。
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/generate">
                            <Button size="lg" className="gap-2 px-8 py-3 text-lg bg-white text-primary hover:bg-primary-50">
                                <Mail className="h-5 w-5" />
                                免费生成临时邮箱
                                <ArrowRight className="h-5 w-5" />
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button size="lg" variant="secondary" className="gap-2 px-8 py-3 text-lg border-white text-white hover:bg-white/10">
                                管理员登录后台
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-8 text-center text-muted-foreground text-sm">
                <p>Open-Temp-Mail &copy; 2024 开源项目 · 基于 Cloudflare Workers 构建</p>
                <p className="mt-2">
                    <a href="https://github.com/Syntax-Error-1337/Open-Temp-Mail" target="_blank" rel="noopener noreferrer" className="hover:text-primary underline">
                        GitHub 开源地址
                    </a>
                </p>
            </footer>
        </div>
    );
}