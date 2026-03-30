"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Sparkles,
  Code,
  Palette,
  TestTube,
  Layers,
  Bot,
  Zap,
  Search,
  Filter,
  ExternalLink,
  Star,
  TrendingUp
} from "lucide-react";

const categoryConfig = [
  { name: "全部", icon: Sparkles, slug: "all", color: "from-gray-500 to-gray-600", bgColor: "bg-gray-50" },
  { name: "产品设计", icon: Sparkles, slug: "product", color: "from-violet-500 to-purple-600", bgColor: "bg-violet-50" },
  { name: "UI/UX 设计", icon: Palette, slug: "design", color: "from-pink-500 to-rose-600", bgColor: "bg-pink-50" },
  { name: "前端开发", icon: Code, slug: "frontend", color: "from-blue-500 to-cyan-600", bgColor: "bg-blue-50" },
  { name: "后端开发", icon: Layers, slug: "backend", color: "from-emerald-500 to-teal-600", bgColor: "bg-emerald-50" },
  { name: "测试", icon: TestTube, slug: "test", color: "from-amber-500 to-orange-600", bgColor: "bg-amber-50" },
  { name: "AI 工具", icon: Bot, slug: "tools", color: "from-indigo-500 to-violet-600", bgColor: "bg-indigo-50" }
];

const toolsData = [
  { id: "1", name: "ChatGPT", category: "product", users: "180M+", desc: "OpenAI 开发的大型语言模型，支持多轮对话、代码生成、内容创作等", tags: ["AI 对话", "代码生成", "内容创作"], featured: true },
  { id: "2", name: "Claude", category: "product", users: "25M+", desc: "Anthropic 开发的 AI 助手，擅长编程、写作和长文本分析", tags: ["AI 对话", "编程助手", "长文本"], featured: true },
  { id: "3", name: "Cursor", category: "frontend", users: "4M+", desc: "基于 VS Code 的 AI 编程工具，支持智能代码补全和生成", tags: ["IDE", "代码补全", "AI 编程"], featured: true },
  { id: "4", name: "Figma AI", category: "design", users: "10M+", desc: "Figma 内置的 AI 功能，支持智能生成设计稿、自动布局等", tags: ["设计工具", "UI 设计", "AI 生成"], featured: true },
  { id: "5", name: "GitHub Copilot", category: "frontend", users: "2M+", desc: "GitHub 推出的 AI 代码助手，支持多种编程语言实时补全", tags: ["代码补全", "AI 编程", "GitHub"], featured: false },
  { id: "6", name: "Midjourney", category: "design", users: "15M+", desc: "强大的 AI 图像生成工具，可以通过文字描述生成精美图片", tags: ["AI 绘画", "图像生成", "创意设计"], featured: false },
  { id: "7", name: "Notion AI", category: "product", users: "20M+", desc: "Notion 的 AI 助手，支持智能写作、总结、头脑风暴等", tags: ["笔记", "AI 写作", "效率工具"], featured: false },
  { id: "8", name: "v0", category: "frontend", users: "500K+", desc: "Vercel 推出的 AI UI 生成工具，快速生成 React 组件", tags: ["UI 生成", "React", "前端开发"], featured: false },
  { id: "9", name: "Bolt.new", category: "backend", users: "300K+", desc: "AI 全栈开发平台，支持快速构建和部署 Web 应用", tags: ["全栈开发", "AI 编程", "快速开发"], featured: false },
  { id: "10", name: "Claude Code", category: "backend", users: "100K+", desc: "Anthropic 推出的 CLI 编程助手，支持代码生成和项目构建", tags: ["CLI", "编程助手", "代码生成"], featured: false },
  { id: "11", name: "Applitools", category: "test", users: "500K+", desc: "AI 驱动的视觉测试平台，自动检测 UI 视觉回归", tags: ["视觉测试", "自动化测试", "UI 测试"], featured: false },
  { id: "12", name: "Miro AI", category: "product", users: "60M+", desc: "Miro 的 AI 功能，支持智能白板、思维导图生成", tags: ["白板", "思维导图", "协作工具"], featured: false }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function ToolsPage() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(categorySlug);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTools, setFilteredTools] = useState(toolsData);

  useEffect(() => {
    setActiveCategory(categorySlug);
  }, [categorySlug]);

  useEffect(() => {
    let result = toolsData;
    
    if (activeCategory !== "all") {
      result = result.filter(tool => tool.category === activeCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tool => 
        tool.name.toLowerCase().includes(query) ||
        tool.desc.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredTools(result);
  }, [activeCategory, searchQuery]);

  const activeConfig = categoryConfig.find(c => c.slug === activeCategory) || categoryConfig[0];

  return (
    <main className="min-h-screen bg-[#F5EBE0]">
      <div className="gradient-mesh fixed inset-0 -z-10" />
      
      <section className="relative py-20 px-4 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-[#D5CFC5] text-sm font-medium text-[#6B6B6B] mb-6"
          >
            <Zap className="w-4 h-4 text-amber-500" />
            <span>AI Tools Collection</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-[#1a1a1a] mb-4">
            <span className="text-[#D5BDAF]">AI</span> 工具库
          </h1>
          
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto mb-8">
            发现并探索产品落地各阶段的最佳 AI 工具
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="搜索工具名称、功能或标签..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white border border-[#E5E0D8] focus:border-[#D5BDAF] focus:outline-none focus:ring-2 focus:ring-[#D5BDAF]/20 transition-all shadow-sm"
            />
          </div>
        </motion.div>
      </section>

      <section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex flex-wrap gap-3 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {categoryConfig.map((category) => (
              <motion.button
                key={category.slug}
                onClick={() => setActiveCategory(category.slug)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium text-sm transition-all ${
                  activeCategory === category.slug
                    ? `bg-[#1a1a1a] text-white shadow-lg`
                    : "bg-white text-[#6B6B6B] border border-[#E5E0D8] hover:border-[#D5BDAF]"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <category.icon className="w-4 h-4" />
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[#6B6B6B]">
              共 <span className="font-semibold text-[#1a1a1a]">{filteredTools.length}</span> 个工具
              {activeCategory !== "all" && (
                <span className="ml-2">
                  （{categoryConfig.find(c => c.slug === activeCategory)?.name}）
                </span>
              )}
            </p>
          </div>
          
          {filteredTools.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#E5E0D8] flex items-center justify-center">
                <Search className="w-10 h-10 text-[#9CA3AF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">未找到相关工具</h3>
              <p className="text-[#6B6B6B]">试试其他关键词或分类</p>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredTools.map((tool) => (
                <motion.div
                  key={tool.id}
                  variants={item}
                  className="group relative bg-white rounded-2xl border-2 border-[#E5E0D8] hover:border-[#D5BDAF] transition-all overflow-hidden"
                  whileHover={{ y: -5 }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#D5BDAF] to-[#E5E0D8] flex items-center justify-center text-xl font-bold text-[#1a1a1a]">
                          {tool.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-[#1a1a1a]">{tool.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-[#9CA3AF]">
                            <TrendingUp className="w-3 h-3" />
                            <span>{tool.users} 用户</span>
                          </div>
                        </div>
                      </div>
                      {tool.featured && (
                        <span className="px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium">
                          热门
                        </span>
                      )}
                    </div>
                    
                    <p className="text-[#6B6B6B] text-sm mb-4 line-clamp-2">
                      {tool.desc}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 rounded-full bg-[#F5EBE0] text-[#6B6B6B] text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
                      <Link
                        href={`/tools/${tool.id}`}
                        className="flex items-center gap-1 text-sm font-medium text-[#1a1a1a] group-hover:text-[#D5BDAF] transition-colors"
                      >
                        查看详情
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                      <button className="p-2 rounded-full hover:bg-[#F5EBE0] transition-colors">
                        <ExternalLink className="w-4 h-4 text-[#9CA3AF]" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <footer className="py-12 px-4 border-t border-[#E5E0D8]">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[#6B6B6B]">© 2024 AI Tools Blog · 产品落地全流程 AI 工具分享</p>
        </div>
      </footer>
    </main>
  );
}
