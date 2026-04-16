# AI Tools Blog 项目规划

## 项目阶段

### 阶段一：基础架构 ✅
- [x] Next.js 项目初始化
- [x] Tailwind + 设计系统配置
- [x] Supabase 认证系统
- [x] 基础页面结构（首页、分类、工具、文章）

### 阶段二：内容管理 ✅
- [x] 管理后台搭建
- [x] 分类管理 CRUD
- [x] 工具管理 CRUD
- [x] 文章管理 CRUD

### 阶段三：AI 聊天助手 ✅
- [x] 智谱 AI API 接入
- [x] 流式输出实现
- [x] 联网搜索功能
- [x] 深度思考功能
- [ ] RAG 知识库接入（待做）

### 阶段四：体验优化
- [ ] 首页背景效果优化（粒子效果位置问题待修复）
- [ ] 移动端适配检查
- [ ] 性能优化

### 阶段五：数据完善
- [ ] 更多 AI 工具数据录入
- [ ] 更多文章内容

## 技术栈

- **框架**: Next.js 16 + React 19
- **样式**: Tailwind CSS
- **数据库**: Supabase (PostgreSQL)
- **AI**: 智谱 GLM-4.5-Air
- **动画**: Framer Motion + Three.js (Antigravity)

## 关键依赖

```json
{
  "next": "16.2.3",
  "@react-three/fiber": "用于3D粒子背景",
  "@supabase/supabase-js": "数据库",
  "framer-motion": "页面动画",
  "lucide-react": "图标库",
  "zhipuai": "智谱AI SDK（可选）"
}
```
