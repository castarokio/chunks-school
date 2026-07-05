'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Brain, Send, Sparkles, BookOpen, Lightbulb, Loader2 } from 'lucide-react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickActions = [
  { label: { ar: 'اقترح دورة', en: 'Suggest Course', fr: 'Suggérer un Cours' }, icon: BookOpen },
  { label: { ar: 'خطة دراسية', en: 'Study Plan', fr: 'Plan d\'Étude' }, icon: Lightbulb },
  { label: { ar: 'تحليل أدائي', en: 'Performance Analysis', fr: 'Analyse de Performance' }, icon: Sparkles },
];

export default function StudentAISuggestions() {
  const { language } = useAppStore();
  const rtl = isRTL(language);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: language === 'ar'
        ? 'مرحباً! أنا مساعدك الذكي في تشامبس سكول. يمكنني مساعدتك في اختيار الدورات، وضع خطط دراسية، وتحليل أدائك. كيف يمكنني مساعدتك اليوم؟'
        : 'Hello! I\'m your AI assistant at Champs School. I can help you choose courses, create study plans, and analyze your performance. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input, language }),
      });
      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.suggestion || data.message || (language === 'ar' ? 'عذراً، لم أتمكن من معالجة طلبك.' : 'Sorry, I couldn\'t process your request.'),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'ar'
          ? 'بناءً على تحليل أدائك الحالي، أنصحك بالتركيز على: 1) تحسين مهارات الكتابة الإنجليزية - حاول الانضمام لدورة الكتابة الإبداعية 2) المواظبة على الحضور في حصص الرياضيات 3) المشاركة في الأنشطة العلمية لرفع نقاطك. هل تريد تفاصيل أكثر عن أي نقطة؟'
          : 'Based on your current performance analysis, I recommend: 1) Improving your English writing skills - try joining the Creative Writing course 2) Maintaining attendance in Math classes 3) Participating in science activities to boost your points. Would you like more details on any point?',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (label: string) => {
    setInput(label);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action, i) => (
          <motion.div key={i} variants={item}>
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer group" onClick={() => handleQuickAction(action.label[language as keyof typeof action.label] || action.label.en)}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 text-white group-hover:scale-110 transition-transform">
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">{action.label[language as keyof typeof action.label] || action.label.en}</p>
                  <p className="text-xs text-muted-foreground">{language === 'ar' ? 'اسأل الذكاء الاصطناعي' : 'Ask AI'}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Chat Interface */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Brain className="w-4 h-4 text-violet-600" />
              {language === 'ar' ? 'مساعد الذكاء الاصطناعي' : 'AI Assistant'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 overflow-y-auto space-y-3 mb-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-sm'
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-bl-sm'
                  }`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Brain className="w-3 h-3 text-violet-500" />
                        <span className="text-[10px] font-medium text-violet-500">AI</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 rounded-xl rounded-bl-sm">
                    <div className="flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 animate-spin text-violet-500" />
                      <span className="text-xs text-muted-foreground">{language === 'ar' ? 'يفكر...' : 'Thinking...'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={language === 'ar' ? 'اكتب سؤالك هنا...' : 'Type your question here...'}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-emerald-600 hover:bg-emerald-700 shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* AI Course Recommendations */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/10 dark:to-purple-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {language === 'ar' ? 'دورات مقترحة لك' : 'Recommended Courses for You'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { name: 'الفرنسية المتوسطة', nameEn: 'French Intermediate', reason: language === 'ar' ? 'يتناسب مع مستواك في اللغات' : 'Matches your language level', match: 95 },
                { name: 'الأدب العربي', nameEn: 'Arabic Literature', reason: language === 'ar' ? 'يعزز مهاراتك الأدبية' : 'Enhances your literary skills', match: 87 },
                { name: 'مستكشف العلوم', nameEn: 'Science Explorer', reason: language === 'ar' ? 'يملأ فجوة في مسارك العلمي' : 'Fills a gap in your science track', match: 82 },
              ].map((c, i) => (
                <motion.div key={i} whileHover={{ scale: 1.03 }} className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-violet-100 dark:border-violet-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 text-xs">
                      {c.match}% {language === 'ar' ? 'تطابق' : 'match'}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-sm">{language === 'ar' ? c.name : c.nameEn}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{c.reason}</p>
                  <Button size="sm" className="mt-3 w-full bg-violet-600 hover:bg-violet-700 text-xs" >
                    {language === 'ar' ? 'سجّل الآن' : 'Enroll Now'}
                  </Button>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
