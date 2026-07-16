/**
 * 静态资源管理器模块
 * @module assets/manager
 */

import { resolveAuthPayload } from '../middleware/auth.js';

/**
 * 静态资源管理器
 * 支持新路由结构：
 * - 公开路由（无需认证）: /, /generate, /login
 * - 受保护路由（需认证）: /app/*
 * - API路由: /api/* (由router处理)
 * - 静态资源: /assets/*, 等
 */
export class AssetManager {
  constructor() {
    // 无需认证的 SPA 路由（返回 index.html）
    this.publicSpaRoutes = new Set([
      '/',
      '/generate',
      '/login',
      '/login.html',
      '/privacy',
      '/terms',
      '/about',
      '/faq'
    ]);
  }

  /**
   * 判断是否为SPA路由（需要返回 index.html）
   */
  isSpaRoute(pathname) {
    // 根路径
    if (pathname === '/') return true;
    // /app/* 所有路径
    if (pathname.startsWith('/app/')) return true;
    // /generate
    if (pathname === '/generate') return true;
    // 登录页
    if (pathname === '/login' || pathname === '/login.html') return true;
    // 静态信息页
    if (pathname === '/privacy' || pathname === '/terms' || pathname === '/about' || pathname === '/faq') return true;
    return false;
  }

  /**
   * 判断是否为静态文件
   */
  isStaticFile(pathname) {
    // 有扩展名且不是 .html
    return pathname.includes('.') && !pathname.endsWith('.html');
  }

  async handleAssetRequest(request, env, mailDomains) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    const JWT_TOKEN = env.JWT_TOKEN || env.JWT_SECRET || '';

    // API 路由已在 server.js 中处理，这里返回 404
    if (pathname.startsWith('/api/')) {
      return new Response('API Not Found', { status: 404 });
    }

    if (!env.ASSETS || !env.ASSETS.fetch) {
      return new Response('Assets binding not found', { status: 500 });
    }

    // 1. 静态资源文件（有扩展名且非 .html）直接返回
    if (this.isStaticFile(pathname)) {
      return env.ASSETS.fetch(request);
    }

    // 2. SPA 路由 - 返回 index.html
    if (this.isSpaRoute(pathname)) {
      // /app/* 需要认证，其余无需认证
      if (pathname.startsWith('/app/')) {
        const authResult = await this.checkAppRouteAuth(request, JWT_TOKEN, url);
        if (authResult) return authResult;
      }
      // 返回 index.html (SPA fallback)
      const fallbackUrl = new URL('/index.html', url).toString();
      return env.ASSETS.fetch(fallbackUrl);
    }

    // 3. 其他 .html 文件直接返回
    if (pathname.endsWith('.html')) {
      return env.ASSETS.fetch(request);
    }

    // 4. 默认尝试作为静态资源返回
    return env.ASSETS.fetch(request);
  }

  /**
   * 检查 /app/* 路由的认证
   */
  async checkAppRouteAuth(request, JWT_TOKEN, url) {
    const payload = await resolveAuthPayload(request, JWT_TOKEN);

    if (!payload) {
      // 未登录，重定向到登录页
      const loginUrl = new URL('/login', url);
      loginUrl.searchParams.set('redirect', url.pathname + url.search);
      return Response.redirect(loginUrl.toString(), 302);
    }

    // mailbox 角色只能访问邮箱相关页面
    if (payload.role === 'mailbox') {
      const allowedPaths = ['/app/mailbox', '/app/compose', '/app/sent', '/app/settings'];
      const isAllowed = allowedPaths.some(p => url.pathname.startsWith(p));
      if (!isAllowed) {
        return Response.redirect(new URL('/app/mailbox', url).toString(), 302);
      }
    }

    // admin, user, guest 可以访问所有 /app/* 路径
    const allowedRoles = ['admin', 'user', 'guest', 'mailbox'];
    if (!allowedRoles.includes(payload.role)) {
      return Response.redirect(new URL('/', url).toString(), 302);
    }

    return null; // 认证通过
  }

  getAccessLog(request) {
    const url = new URL(request.url);
    return {
      timestamp: new Date().toISOString(),
      method: request.method,
      path: url.pathname,
      userAgent: request.headers.get('User-Agent') || '',
      referer: request.headers.get('Referer') || '',
      ip: request.headers.get('CF-Connecting-IP') ||
        request.headers.get('X-Forwarded-For') ||
        request.headers.get('X-Real-IP') || 'unknown'
    };
  }
}

/**
 * 创建默认的资源管理器实例
 * @returns {AssetManager} 资源管理器实例
 */
export function createAssetManager() {
  return new AssetManager();
}