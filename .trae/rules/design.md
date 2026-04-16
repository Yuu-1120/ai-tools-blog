---
alwaysApply: true
---

# 设计系统规范

本项目使用 Claude (Anthropic) 设计风格，完整规范见 `../../design/DESIGN.md`。

## 颜色（禁止冷色调）

| 用途     | 变量       | 色值    |
| -------- | ---------- | ------- |
| 主背景   | parchment  | #f5f4ed |
| 卡片背景 | ivory      | #faf9f5 |
| 品牌强调 | terracotta | #c96442 |

中性色全部使用暖色调。

## 禁止事项

- ❌ 冷色调灰色（如 #6B7280）作为主色调
- ❌ 纯黑/纯白作为背景
- ❌ 无衬线字体作为标题
- ❌ 硬编码颜色（如 `border-black`）
- ❌ 使用 `shadow-lg`、`shadow-xl`
- ❌ 圆角小于 6px

## 开发前必读

1. `../../design/DESIGN.md` - 完整设计规范
2. `../../design/preview.html` - 视觉预览
3. `../../tailwind.config.ts` - 已定义的 Tailwind 类名
4. `../../src/app/globals.css` - 全局 CSS 变量
