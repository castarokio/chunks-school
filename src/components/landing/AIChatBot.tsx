'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Calendar, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { icon: Sparkles, labelKey: 'courses', query: 'What courses do you recommend for me?' },
  { icon: Calendar, labelKey: 'schedule', query: 'Help me with my class schedule' },
  { icon: HelpCircle, labelKey: 'faq', query: 'What are the frequently asked questions?' },
];

const quickLabels: Record<string, Record<string, string>> = {
  courses: { ar: 'اقتراح دورات', en: 'Course Suggestions', fr: 'Suggestions de cours' },
  schedule: { ar: 'مساعدة الجدول', en: 'Schedule Help', fr: 'Aide emploi du temps' },
  faq: { ar: 'الأسئلة الشائعة', en: 'FAQ', fr: 'FAQ' },
};

export default function AIChatBot() {
  const { chatOpen, setChatOpen, language } = useAppStore();
  const rtl = isRTL(language);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        language === 'ar'
          ? 'مرحباً! أنا مساعد تشامبس سكول الذكي. كيف يمكنني مساعدتك اليوم؟'
          : language === 'fr'
            ? 'Bonjour! Je suis l\'assistant intelligent de Champs School. Comment puis-je vous aider aujourd\'hui?'
            : 'Hello! I\'m the Champs School AI assistant. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (chatOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [chatOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text.trim(),
          role: 'student',
          language,
        }),
      });

      const data = await response.json();

      if (data.success && data.suggestion) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.suggestion,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errorMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content:
            language === 'ar'
              ? 'عذراً، لم أتمكن من معالجة طلبك. يرجى المحاولة مرة أخرى.'
              : language === 'fr'
                ? 'Désolé, je n\'ai pas pu traiter votre demande. Veuillez réessayer.'
                : 'Sorry, I couldn\'t process your request. Please try again.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      }
    } catch {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content:
          language === 'ar'
            ? 'حدث خطأ في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى.'
            : language === 'fr'
              ? 'Erreur de connexion. Veuillez vérifier votre connexion et réessayer.'
              : 'Connection error. Please check your internet and try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className={`fixed bottom-6 z-50 ${rtl ? 'left-6' : 'right-6'}`}
        initial={false}
        animate={{ scale: 1 }}
      >
        <AnimatePresence>
          {!chatOpen && (
            <motion.button
              initial={false}
              exit={{ opacity: 0, scale: 0.92 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setChatOpen(true)}
              className="relative flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(16,42,67,0.18)] transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open Champs Assistant"
            >
              <MessageCircle className="size-6" aria-hidden="true" />
              <span className="absolute -right-0.5 -top-0.5 size-4 rounded-full border-2 border-primary bg-accent" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Panel */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`fixed bottom-6 z-50 ${rtl ? 'left-6' : 'right-6'} w-[calc(100vw-3rem)] sm:w-96`}
            dir={rtl ? 'rtl' : 'ltr'}
          >
            <div className="flex max-h-[70vh] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-[0_18px_48px_rgba(16,42,67,0.14)]">
              {/* Header */}
              <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15">
                    <Bot className="size-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">
                      {language === 'ar' ? 'مساعد تشامبس' : language === 'fr' ? 'Assistant Champs' : 'Champs Assistant'}
                    </p>
                    <p className="text-xs text-primary-foreground/70">
                      {isTyping
                        ? (language === 'ar' ? 'يكتب…' : 'Typing…')
                        : (language === 'ar' ? 'متصل' : 'Online')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/10 transition-colors hover:bg-primary-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Close Champs Assistant"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 h-[300px]" ref={scrollRef}>
                <div className="flex flex-col gap-3">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex gap-2 ${msg.role === 'user' ? (rtl ? 'flex-row-reverse' : 'flex-row-reverse') : 'flex-row'}`}
                    >
                      <div
                        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                          msg.role === 'user'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {msg.role === 'user' ? (
                          <User className="size-4" aria-hidden="true" />
                        ) : (
                          <Bot className="size-4" aria-hidden="true" />
                        )}
                      </div>
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-se-sm'
                            : 'bg-secondary text-secondary-foreground rounded-ss-sm'
                        }`}
                      >
                        {msg.role === 'assistant' ? (
                          <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Typing indicator */}
                  {isTyping && (
                    <div className="flex gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                        <Bot className="size-4" aria-hidden="true" />
                      </div>
                      <div className="flex items-center gap-1 rounded-2xl rounded-ss-sm bg-secondary px-4 py-3">
                        <span className="size-2 rounded-full bg-muted-foreground opacity-50" />
                        <span className="size-2 rounded-full bg-muted-foreground opacity-70" />
                        <span className="size-2 rounded-full bg-muted-foreground" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Quick Actions */}
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                {quickActions.map((action) => {
                  const ActionIcon = action.icon;
                  return (
                    <button
                      key={action.labelKey}
                      onClick={() => sendMessage(action.query)}
                      disabled={isLoading}
                      className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
                    >
                      <ActionIcon className="size-3.5" aria-hidden="true" />
                      {quickLabels[action.labelKey]?.[language] || action.labelKey}
                    </button>
                  );
                })}
              </div>

              {/* Input */}
              <form onSubmit={handleSubmit} className="border-t border-border p-3">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={
                      language === 'ar'
                        ? 'اكتب رسالتك...'
                        : language === 'fr'
                          ? 'Écrivez votre message...'
                          : 'Type your message...'
                    }
                    disabled={isLoading}
                    aria-label={language === 'ar' ? 'رسالة المساعد' : language === 'fr' ? 'Message assistant' : 'Assistant Message'}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!inputValue.trim() || isLoading}
                    className="shrink-0"
                    aria-label="Send Message"
                  >
                    {isLoading ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="size-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
