# AI Tools Blog

基于 Next.js + Supabase 的 AI 工具导航博客平台。

## 技术栈

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (PostgreSQL + Auth)
- Framer Motion (动画)
- Three.js / React Three Fiber (3D 特效)

## 项目结构

```
src/
├── app/              # App Router 页面
│   ├── admin/       # 管理后台
│   ├── api/         # API Routes
│   ├── auth/        # 认证页面
│   ├── articles/    # 文章
│   ├── blog/        # 博客
│   ├── categories/  # 分类
│   └── tools/       # 工具导航
├── components/       # React 组件
│   ├── ui/         # shadcn/ui 组件
│   └── *.tsx       # 3D 特效组件
├── contexts/         # React Context (auth)
├── lib/              # 工具库 (supabase, utils)
└── types/            # TypeScript 类型
```

## 常用命令

```bash
npm run dev     # 启动开发服务器
npm run build   # 生产构建
npm run start   # 启动生产服务器
npm run lint    # 代码检查
```
