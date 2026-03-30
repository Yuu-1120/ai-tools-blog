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
  Calendar,
  Clock,
  Eye,
  Heart,
  MessageCircle,
  Tag
} from "lucide-react";

const categoryConfig = [
  { name: "全部", icon: Sparkles, slug: "all", color: "from-gray-500 to-gray-600" },
  { name: "产品设计", icon: Sparkles, slug: "product", color: "from-violet-500 to-purple-600" },
  { name: "UI/UX 设计", icon: Palette, slug: "design", color: "from-pink-500 to-rose-600" },
  { name: "前端开发", icon: Code, slug: "frontend", color: "from-blue-500 to-cyan-600" },
  { name: "后端开发", icon: Layers, slug: "backend", color: "from-emerald-500 to-teal-600" },
  { name: "测试", icon: TestTube, slug: "test", color: "from-amber-500 to-orange-600" }
];

const articlesData = [
  {
    id: "1",
    title: "如何使用 ChatGPT 进行产品需求分析",
    excerpt: "深入探讨如何利用 ChatGPT 辅助进行产品需求分析，提高需求文档质量和效率",
    category: "product",
    cover: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    author: { name: "张三", avatar: "Z" },
    publishedAt: "2024-01-15",
    readTime: "8 分钟",
    views: 1250,
    likes: 89,
    tags: ["ChatGPT", "需求分析", "产品经理"]
  },
  {
    id: "2",
    title: "Figma AI 实战：从零开始生成 UI 设计稿",
    excerpt: "手把手教你使用 Figma AI 功能，快速生成高质量的 UI 设计稿",
    category: "design",
    cover: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    author: { name: "李四", avatar: "L" },
    publishedAt: "2024-01-12",
    readTime: "12 分钟",
    views: 2340,
    likes: 156,
    tags: ["Figma", "UI 设计", "AI 工具"]
  },
  {
    id: "3",
    title: "Cursor vs GitHub Copilot：谁是最佳 AI 编程助手",
    excerpt: "全面对比两款主流 AI 编程工具，从功能、性能、价格等多维度分析",
    category: "frontend",
    cover: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
    author: { name: "王五", avatar: "W" },
    publishedAt: "2024-01-10",
    readTime: "15 分钟",
    views: 3890,
    likes: 234,
    tags: ["Cursor", "Copilot", "编程工具"]
  },
  {
    id: "4",
    title: "使用 Bolt.new 快速构建后端 API",
    excerpt: "探索 Bolt.new 在后端开发中的应用，快速搭建 RESTful API",
    category: "backend",
    cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    author: { name: "赵六", avatar: "Z" },
    publishedAt: "2024-01-08",
    readTime: "10 分钟",
    views: 1876,
    likes: 112,
    tags: ["Bolt.new", "后端", "API"]
  },
  {
    id: "5",
    title: "AI 测试工具实践：Applitools 视觉测试指南",
    excerpt: "利用 AI 进行自动化视觉测试，提高 UI 测试效率和覆盖率",
    category: "test",
    cover: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    author: { name: "钱七", avatar: "Q" },
    publishedAt: "2024-01-05",
    readTime: "11 分钟",
    views: 987,
    likes: 67,
    tags: ["Applitools", "视觉测试", "自动化测试"]
  },
  {
    id: "6",
    title: "Midjourney 提示词技巧：如何生成专业产品图",
    excerpt: "掌握 Midjourney 提示词技巧，快速生成高质量产品展示图",
    category: "design",
    cover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800",
    author: { name: "孙八", avatar: "S" },
    publishedAt: "2024-01-03",
    readTime: "9 分钟",
    views: 2100,
    likes: 178,
    tags: ["Midjourney", "AI 绘画", "产品图"]
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function BlogPage() {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category") || "all";
  const [activeCategory, setActiveCategory] = useState(categorySlug);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredArticles, setFilteredArticles] = useState(articlesData);

  useEffect(() => {
    setActiveCategory(categorySlug);
  }, [categorySlug]);

  useEffect(() => {
    let result = articlesData;
    
    if (activeCategory !== "all") {
      result = result.filter(article => article.category === activeCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredArticles(result);
  }, [activeCategory, searchQuery]);

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
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Product Development Blog</span>
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-[#1a1a1a] mb-4">
            产品落地 <span className="text-[#D5BDAF]">博客</span>
          </h1>
          
          <p className="text-lg text-[#6B6B6B] max-w-2xl mx-auto mb-8">
            记录产品从 0 到 1 的全过程，分享 AI 工具使用心得和实战经验
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="搜索文章标题、内容或标签..."
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
                    ? "bg-[#1a1a1a] text-white shadow-lg"
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
          <p className="text-[#6B6B6B] mb-8">
            共 <span className="font-semibold text-[#1a1a1a]">{filteredArticles.length}</span> 篇文章
            {activeCategory !== "all" && (
              <span className="ml-2">
                （{categoryConfig.find(c => c.slug === activeCategory)?.name}）
              </span>
            )}
          </p>
          
          {filteredArticles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#E5E0D8] flex items-center justify-center">
                <Search className="w-10 h-10 text-[#9CA3AF]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1a1a1a] mb-2">未找到相关文章</h3>
              <p className="text-[#6B6B6B]">试试其他关键词或分类</p>
            </motion.div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredArticles.map((article) => (
                <motion.article
                  key={article.id}
                  variants={item}
                  className="group bg-white rounded-2xl border-2 border-[#E5E0D8] hover:border-[#D5BDAF] overflow-hidden transition-all"
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/blog/${article.id}`}>
                    <div className="relative h-48 overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url(${article.cover})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${categoryConfig.find(c => c.slug === article.category)?.color}`}>
                          {categoryConfig.find(c => c.slug === article.category)?.name}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-[#1a1a1a] mb-3 line-clamp-2 group-hover:text-[#D5BDAF] transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-[#6B6B6B] text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 px-2 py-1 rounded-full bg-[#F5EBE0] text-[#6B6B6B] text-xs"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-[#E5E0D8]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D5BDAF] to-[#E5E0D8] flex items-center justify-center text-sm font-medium text-[#1a1a1a]">
                            {article.author.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1a1a1a]">{article.author.name}</p>
                            <p className="text-xs text-[#9CA3AF]">{article.publishedAt}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 text-[#9CA3AF] text-sm">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {article.readTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
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
