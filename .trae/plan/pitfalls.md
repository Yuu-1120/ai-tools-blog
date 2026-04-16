# 开发踩坑记录

## AI 聊天相关

### SSE 流式输出解析

**问题**: 智谱 AI 返回的 SSE 数据容易丢失或解析不完整
**原因**: 流式数据可能被分割成多个小块
**解决**:

```typescript
// 使用 buffer 暂存未完成的行
let buffer = '';
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  const chunk = decoder.decode(value, { stream: true });
  buffer += chunk;
  const lines = buffer.split('\n');
  buffer = lines.pop() || ''; // 保留未完成的行
}
```

### API 路由中的请求体解析

**问题**: 重复解析 `request.json()`
**解决**: 只解析一次并解构

```typescript
// ✅ 正确
const { messages, stream = true } = await request.json();

// ❌ 错误
const body = await request.json();
const messages = body.messages;
```

### AbortController 取消请求

**问题**: 用户点击停止后需要正确取消 fetch
**解决**: 将 signal 传递给 fetch

```typescript
const controller = new AbortController();
const response = await fetch(url, { signal: controller.signal });
// 停止时
controller.abort();
```

## Next.js 相关

### 动态导入 with SSR disabled

**问题**: Three.js 组件在 SSR 时报错
**解决**:

```typescript
const Antigravity = dynamic(() => import('@/components/Antigravity'), {
  ssr: false,
  loading: () => null
});
```

### 客户端组件状态初始化

**问题**: `useState` 初始值与 SSR 不一致导致水合错误
**解决**: 使用 `mounted` 状态来延迟客户端特有逻辑

## Tailwind CSS 相关

### 自定义颜色未定义

**问题**: 使用 `bg-parchment` 但没在 tailwind.config 定义
**解决**: 先检查 `tailwind.config.ts` 中的 `colors` 配置

### 禁用冷色调

**项目规范**: 禁止使用 `#6B7280` 等冷灰色，所有中性色用暖色调

## Supabase 相关

### API 路由中使用 RLS 策略失败

**症状**: `new row violates row-level security policy for table "articles"`
**原因**: API 路由使用匿名客户端 (`createClient`)，无法传递用户身份给 RLS 策略，`auth.uid()` 返回 null
**解决**: 使用 `@supabase/ssr` 的 `createServerClient` 配合 cookies 来获取用户 session

```typescript
// 新建 src/lib/admin-server.ts
import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

export async function verifyAdmin(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        }
      }
    }
  );
  const {
    data: { user }
  } = await supabase.auth.getUser();
  // 检查用户是否为 admin
}
```

### 客户端和服务端 Supabase 客户端不一致

**症状**: 客户端已登录，但 API 路由返回 401；cookie 中没有 Supabase 认证信息
**原因**: 使用普通的 `createClient` 时，session 存在 localStorage；使用 `@supabase/ssr` 的 `createBrowserClient` 时，session 会同步存储在 cookie 中
**解决**:

1. 客户端使用 `createBrowserClient` 替代 `createClient`

```typescript
// src/lib/supabase.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}

export const supabase = createClient();
```

2. 已有项目需要**重新登录**才能将 session 写入 cookie

### RLS 策略导致数据获取失败

**症状**: 前端请求成功但数据为空
**排查**: 检查 Browser Network 面板的响应和 RLS 策略

### 环境变量命名

**注意**: Supabase 的 URL 和 Key 必须以 `SUPABASE_` 开头

### react-markdown className prop 被移除

**症状**: 报错 `Unexpected className prop, remove it`
**原因**: react-markdown v10+ 移除了 className prop
**解决**: 用外层 div 包裹，不要传 className 给 ReactMarkdown

```tsx
// ❌ 错误
<ReactMarkdown className='text-warm-700'>{content}</ReactMarkdown>

// ✅ 正确
<div className='text-warm-700'>
  <ReactMarkdown>{content}</ReactMarkdown>
</div>
```

## 常见错误排查流程

1. **检查浏览器控制台** - React 水合错误、网络请求失败
2. **检查 Network 面板** - API 响应状态码、返回数据
3. **检查 Supabase Dashboard** - RLS 策略、数据是否存在
4. **检查环境变量** - `.env.local` 是否正确配置
