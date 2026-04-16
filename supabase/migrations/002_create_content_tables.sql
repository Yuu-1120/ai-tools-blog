-- ================================================
-- AI Tools Blog - Categories, Tools, Articles Tables
-- Run this in Supabase Dashboard -> SQL Editor
-- ================================================

-- 0. 删除旧表（如果存在）
DROP TABLE IF EXISTS public.articles CASCADE;
DROP TABLE IF EXISTS public.tools CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- 1. 分类表
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT NOT NULL,
  description TEXT,
  intro_markdown TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 工具表
CREATE TABLE public.tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  logo_url TEXT,
  description TEXT,
  website_url TEXT NOT NULL,
  pricing TEXT DEFAULT 'free' CHECK (pricing IN ('free', 'freemium', 'paid')),
  tags TEXT[],
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 文章表
CREATE TABLE public.articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cover_image TEXT,
  excerpt TEXT,
  content_markdown TEXT NOT NULL,
  tags TEXT[],
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  featured BOOLEAN DEFAULT FALSE,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. RLS 策略
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

-- 公开读取策略
CREATE POLICY "Public read categories" ON public.categories
  FOR SELECT USING (true);

CREATE POLICY "Public read tools" ON public.tools
  FOR SELECT USING (true);

CREATE POLICY "Public read published articles" ON public.articles
  FOR SELECT USING (status = 'published');

-- Admin 写入策略
CREATE POLICY "Admin write categories" ON public.categories
  FOR ALL USING (public.is_admin() = true);

CREATE POLICY "Admin write tools" ON public.tools
  FOR ALL USING (public.is_admin() = true);

CREATE POLICY "Admin write articles" ON public.articles
  FOR ALL USING (public.is_admin() = true);

-- 5. 初始化 8 个分类
INSERT INTO public.categories (name, slug, icon, description, sort_order) VALUES
('图像', 'image', '🖼️', 'AI 生图、绘图、修图', 1),
('视频', 'video', '🎬', '文字/图片生成视频', 2),
('对话', 'chat', '💬', '聊天问答助手', 3),
('编程', 'code', '💻', '代码补全、debug', 4),
('设计', 'design', '🎨', 'UI/原型自动生成', 5),
('音频', 'audio', '🎙️', '配音、语音合成', 6),
('写作', 'writing', '✍️', '文章润色、翻译', 7),
('Agent', 'agent', '🤖', '自主执行任务的 AI', 8)
ON CONFLICT (slug) DO NOTHING;

-- 6. 初始化示例工具数据
INSERT INTO public.tools (category_id, name, logo_url, description, website_url, pricing, tags) VALUES
-- 图像分类
((SELECT id FROM public.categories WHERE slug = 'image'), 'Midjourney', 'https://cdn.midjourney.com/static/logo.png', '最流行的 AI 图像生成工具，支持 Discord 和 Web 端使用', 'https://www.midjourney.com', 'paid', ARRAY['热门', '艺术']),
((SELECT id FROM public.categories WHERE slug = 'image'), 'DALL-E', 'https://openai.com/dall-e-3.png', 'OpenAI 推出的 AI 生图工具，与 ChatGPT 集成', 'https://openai.com/dall-e-3', 'freemium', ARRAY['新手推荐']),
((SELECT id FROM public.categories WHERE slug = 'image'), 'Flux', 'https://flux-ai.io/logo.png', '新兴的 AI 生图模型，生成速度快', 'https://flux-ai.io', 'freemium', ARRAY['免费']),
-- 视频分类
((SELECT id FROM public.categories WHERE slug = 'video'), 'Sora', 'https://openai.com/sora.png', 'OpenAI 推出的视频生成模型', 'https://openai.com/sora', 'paid', ARRAY['热门']),
((SELECT id FROM public.categories WHERE slug = 'video'), 'Runway', 'https://runwayml.com/logo.png', '专业级 AI 视频编辑和生成平台', 'https://runwayml.com', 'freemium', ARRAY['专业']),
((SELECT id FROM public.categories WHERE slug = 'video'), 'Pika', 'https://pika.art/logo.png', '新兴的 AI 视频生成工具，适合社交媒体', 'https://pika.art', 'free', ARRAY['新手推荐']),
-- 对话分类
((SELECT id FROM public.categories WHERE slug = 'chat'), 'ChatGPT', 'https://openai.com/chatgpt.png', 'OpenAI 推出的对话 AI，支持 GPT-4', 'https://chat.openai.com', 'freemium', ARRAY['热门', '全能']),
((SELECT id FROM public.categories WHERE slug = 'chat'), 'Claude', 'https://anthropic.com/claude.png', 'Anthropic 推出的 AI 助手，擅长写作和分析', 'https://claude.ai', 'freemium', ARRAY['写作']),
-- 编程分类
((SELECT id FROM public.categories WHERE slug = 'code'), 'Cursor', 'https://cursor.sh/logo.png', 'AI 代码编辑器，基于 VS Code', 'https://cursor.sh', 'freemium', ARRAY['热门', '新手推荐']),
((SELECT id FROM public.categories WHERE slug = 'code'), 'GitHub Copilot', 'https://github.com/features/copilot.png', '微软推出的 AI 代码补全工具', 'https://github.com/features/copilot', 'paid', ARRAY['专业'])
ON CONFLICT DO NOTHING;
