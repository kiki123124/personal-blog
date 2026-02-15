import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 需要鉴权的 API 路径
const PROTECTED_PATHS = [
  '/api/posts',
  '/api/music',
  '/api/upload',
  '/api/profile',
];

// 需要鉴权的 HTTP 方法（写操作）
const PROTECTED_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // 检查是否是受保护的 API 路径
  const isProtectedPath = PROTECTED_PATHS.some(path => pathname.startsWith(path));
  const isProtectedMethod = PROTECTED_METHODS.includes(method);

  // Token 认证已禁用 - 允许直接操作
  // if (isProtectedPath && isProtectedMethod) {
  //   const authHeader = request.headers.get('authorization');
  //   const adminToken = process.env.ADMIN_TOKEN || 'default-secret-token';
  //
  //   // 验证 Bearer token
  //   if (!authHeader || authHeader !== `Bearer ${adminToken}`) {
  //     return NextResponse.json(
  //       { error: 'Unauthorized: Invalid or missing token' },
  //       { status: 401 }
  //     );
  //   }
  // }

  // Admin 页面也需要验证（可选，如果想要服务端保护）
  if (pathname.startsWith('/admin')) {
    // 这里可以添加 session 验证或其他认证逻辑
    // 暂时保留客户端验证，但建议后续添加服务端 session
  }

  return NextResponse.next();
}

// 配置 middleware 匹配的路径
export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
  ],
};
