## 认证

- `src/contexts/auth-context.tsx` - useAuth() hook
- `src/app/auth/` - 登录/注册/忘记密码页面
- `supabase/migrations/001_create_profiles.sql` - 初始化脚本

角色：`admin`（管理员）/ `user`（普通用户）

## 数据库

首次部署执行 SQL：

1. `supabase/migrations/001_create_profiles.sql`
2. `supabase/migrations/002_create_content_tables.sql`

设置管理员：

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## API 路由

管理后台 API 路由统一使用 `src/lib/admin-server.ts` 中的 `verifyAdmin()` 进行认证：

```typescript
import { verifyAdmin } from '@/lib/admin-server';

export async function GET(request: NextRequest) {
  const { authorized, supabase } = await verifyAdmin(request);
  if (!authorized) {
    return NextResponse.json({ code: 401, error: '未授权' }, { status: 401 });
  }
  // 业务逻辑...
}
```

**禁止**：使用普通的 `createClient` 创建匿名客户端（会导致 RLS 策略中 `auth.uid()` 返回 null）
