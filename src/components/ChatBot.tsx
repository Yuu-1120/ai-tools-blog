'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Bot, User, Loader2, Globe, Wifi, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBotProps {
  systemPrompt?: string;
}

export default function ChatBot({
  systemPrompt = '你是 AI Tools Blog 的智能助手，帮助用户了解网站上的 AI 工具和使用方法。'
}: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input.trim() };
    const assistantMessage: Message = { role: 'assistant', content: '' };

    setMessages([...messages, userMessage, assistantMessage]);
    setInput('');
    setLoading(true);

    abortControllerRef.current = new AbortController();

    try {
      const allMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: input.trim() }
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: allMessages, stream: true, web_search: webSearch, thinking }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error('No reader available');

      let buffer = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    content: updated[updated.length - 1].content + content
                  };
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            ...updated[updated.length - 1],
            content: updated[updated.length - 1].content + ' [已停止]'
          };
          return updated;
        });
      } else {
        console.error('Chat error:', error);
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: 'assistant', content: '抱歉，服务出现问题，请稍后再试。' }
        ]);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = () => {
    abortControllerRef.current?.abort();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-terracotta text-ivory shadow-lg hover:bg-coral transition-transform duration-200 hover:scale-110 flex items-center justify-center'
        aria-label='打开聊天'
      >
        <Bot className='w-6 h-6' />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-40'
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className='fixed bottom-24 right-6 z-50 w-[500px] h-[550px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-120px)] rounded-2xl bg-ivory border border-border-cream shadow-xl flex flex-col overflow-hidden'
          >
            <div className='flex items-center justify-between px-5 py-4 border-b border-border-cream bg-parchment'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-terracotta/10 flex items-center justify-center'>
                  <Bot className='w-5 h-5 text-terracotta' />
                </div>
                <div>
                  <h3 className='font-medium text-nearBlack'>AI 助手</h3>
                  <p className='text-xs text-olive-gray'>GLM-4.5-Air</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className='w-8 h-8 rounded-lg hover:bg-warmSand flex items-center justify-center transition-colors'
              >
                <X className='w-4 h-4 text-charcoalWarm' />
              </button>
            </div>

            <div className='flex-1 overflow-y-auto p-5 space-y-4'>
              {messages.length === 0 && (
                <div className='text-center text-olive-gray py-8'>
                  <Bot className='w-12 h-12 mx-auto mb-3 opacity-30' />
                  <p className='text-sm'>有什么可以帮助你的吗？</p>
                  <p className='text-xs mt-1'>可以问我关于 AI 工具的问题</p>
                  {webSearch && <p className='text-xs mt-2 text-terracotta'>🌐 联网搜索已开启</p>}
                </div>
              )}

              {messages.map((msg, idx) => {
                const isLastAssistantLoading =
                  loading && idx === messages.length - 1 && msg.role === 'assistant' && !msg.content;
                if (isLastAssistantLoading) return null;

                return (
                  <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div
                      className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                        msg.role === 'user' ? 'bg-terracotta' : 'bg-parchment border border-border-cream'
                      }`}
                    >
                      {msg.role === 'user' ? (
                        <User className='w-4 h-4 text-ivory' />
                      ) : (
                        <Bot className='w-4 h-4 text-terracotta' />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-terracotta text-ivory rounded-tr-md'
                          : 'bg-parchment text-nearBlack rounded-tl-md border border-border-cream'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {loading &&
                messages[messages.length - 1]?.role === 'assistant' &&
                !messages[messages.length - 1]?.content && (
                  <div className='flex gap-3'>
                    <div className='w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-parchment border border-border-cream'>
                      <Bot className='w-4 h-4 text-terracotta' />
                    </div>
                    <div className='bg-parchment px-4 py-3 rounded-2xl rounded-tl-md border border-border-cream'>
                      <Loader2 className='w-4 h-4 animate-spin text-terracotta' />
                    </div>
                  </div>
                )}

              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className='p-4 border-t border-border-cream space-y-3'>
              <div className='flex items-center gap-2'>
                <button
                  type='button'
                  onClick={() => setWebSearch(!webSearch)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    webSearch
                      ? 'bg-terracotta/10 text-terracotta border border-terracotta/20'
                      : 'bg-parchment text-charcoalWarm border border-border-cream hover:bg-warmSand'
                  }`}
                >
                  {webSearch ? <Wifi className='w-3 h-3' /> : <Globe className='w-3 h-3' />}
                  {webSearch ? '联网' : '联网'}
                </button>
                <button
                  type='button'
                  onClick={() => setThinking(!thinking)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${
                    thinking
                      ? 'bg-terracotta/10 text-terracotta border border-terracotta/20'
                      : 'bg-parchment text-charcoalWarm border border-border-cream hover:bg-warmSand'
                  }`}
                >
                  <Brain className={`w-3 h-3 ${thinking ? 'text-terracotta' : ''}`} />
                  深度思考
                </button>
              </div>
              <div className='flex gap-3'>
                <input
                  type='text'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={loading ? '生成中...' : '输入消息...'}
                  disabled={loading}
                  className='flex-1 px-4 py-3 rounded-xl bg-parchment border border-border-cream focus:border-terracotta focus:outline-none text-sm transition-colors disabled:opacity-50'
                />
                {loading ? (
                  <button
                    type='button'
                    onClick={stopGeneration}
                    className='w-12 h-12 rounded-xl bg-warmSand text-charcoalWarm hover:bg-border-warm transition-colors flex items-center justify-center'
                  >
                    <X className='w-4 h-4' />
                  </button>
                ) : (
                  <button
                    type='submit'
                    disabled={!input.trim() || loading}
                    className='w-12 h-12 rounded-xl bg-terracotta text-ivory hover:bg-coral transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
                  >
                    <Send className='w-4 h-4' />
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
