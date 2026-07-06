'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { isRTL } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const contactInfo = [
  {
    icon: MapPin,
    titleAr: 'العنوان',
    titleEn: 'Address',
    titleFr: 'Adresse',
    valueAr: 'شارع ديدوش مراد، الجزائر العاصمة',
    valueEn: 'Didouche Mourad Street, Algiers',
    valueFr: 'Rue Didouche Mourad, Alger',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    icon: Phone,
    titleAr: 'الهاتف',
    titleEn: 'Phone',
    titleFr: 'Téléphone',
    valueAr: '+213 555 123 456',
    valueEn: '+213 555 123 456',
    valueFr: '+213 555 123 456',
    color: 'from-amber-400 to-yellow-500',
  },
  {
    icon: Mail,
    titleAr: 'البريد الإلكتروني',
    titleEn: 'Email',
    titleFr: 'Email',
    valueAr: 'info@chunks.school',
    valueEn: 'info@chunks.school',
    valueFr: 'info@chunks.school',
    color: 'from-blue-400 to-cyan-500',
  },
  {
    icon: Clock,
    titleAr: 'ساعات العمل',
    titleEn: 'Working Hours',
    titleFr: 'Horaires',
    valueAr: 'الأحد - الخميس: 8:00 - 17:00',
    valueEn: 'Sun - Thu: 8:00 AM - 5:00 PM',
    valueFr: 'Dim - Jeu: 8h00 - 17h00',
    color: 'from-violet-400 to-purple-500',
  },
];

export default function ContactSection() {
  const { language } = useAppStore();
  const rtl = isRTL(language);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send message');

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      toast.success(language === 'ar' ? 'تم إرسال رسالتك بنجاح!' : language === 'fr' ? 'Message envoyé avec succès!' : 'Message sent successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  const getTitle = (item: typeof contactInfo[0]) => {
    if (language === 'ar') return item.titleAr;
    if (language === 'fr') return item.titleFr;
    return item.titleEn;
  };

  const getValue = (item: typeof contactInfo[0]) => {
    if (language === 'ar') return item.valueAr;
    if (language === 'fr') return item.valueFr;
    return item.valueEn;
  };

  return (
    <section className="py-20 px-4 bg-background" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card px-4 py-2 text-sm font-semibold text-primary shadow-sm"
          >
            <MessageSquare className="size-4 text-accent" aria-hidden="true" />
            {language === 'ar' ? 'تواصل معنا' : language === 'fr' ? 'Contactez-nous' : 'Get in Touch'}
          </motion.div>
          <h2 className="text-4xl font-black text-primary md:text-5xl">
            {language === 'ar' ? 'نحن هنا لمساعدتك' : language === 'fr' ? 'Nous sommes là pour vous aider' : 'We Are Here to Help'}
          </h2>
          <p className="mt-4 mx-auto max-w-2xl text-lg text-muted-foreground">
            {language === 'ar'
              ? 'لا تتردد في التواصل معنا لأي استفسار أو اقتراح. فريقنا جاهز لمساعدتك.'
              : language === 'fr'
                ? 'N\'hésitez pas à nous contacter pour toute question ou suggestion. Notre équipe est prête à vous aider.'
                : 'Feel free to reach out to us with any questions or suggestions. Our team is ready to help.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {contactInfo.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: rtl ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5 flex items-start gap-4">
                      <div className={`shrink-0 size-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow`}>
                        <Icon className="size-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-primary">{getTitle(item)}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{getValue(item)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {/* Map Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="hidden lg:block"
            >
              <Card className="border-0 shadow-sm overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="size-8 text-primary/30 mx-auto mb-2" aria-hidden="true" />
                    <p className="text-xs text-muted-foreground">
                      {language === 'ar' ? 'الجزائر العاصمة، الجزائر' : language === 'fr' ? 'Alger Centre, Algérie' : 'Algiers, Algeria'}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: rtl ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 md:p-8">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16 text-center"
                  >
                    <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
                      <CheckCircle className="size-8 text-emerald-600" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">
                      {language === 'ar' ? 'تم الإرسال بنجاح!' : language === 'fr' ? 'Message envoyé!' : 'Message Sent!'}
                    </h3>
                    <p className="text-muted-foreground">
                      {language === 'ar'
                        ? 'سنتواصل معك في أقرب وقت ممكن.'
                        : language === 'fr'
                          ? 'Nous vous répondrons dans les plus brefs délais.'
                          : 'We will get back to you as soon as possible.'}
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-6"
                      onClick={() => setSubmitted(false)}
                    >
                      {language === 'ar' ? 'إرسال رسالة أخرى' : language === 'fr' ? 'Envoyer un autre message' : 'Send another message'}
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          {language === 'ar' ? 'الاسم الكامل' : language === 'fr' ? 'Nom Complet' : 'Full Name'}
                        </label>
                        <Input
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder={language === 'ar' ? 'أدخل اسمك' : language === 'fr' ? 'Votre nom' : 'Enter your name'}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-1.5 block">
                          {language === 'ar' ? 'البريد الإلكتروني' : language === 'fr' ? 'Email' : 'Email'}
                        </label>
                        <Input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="email@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        {language === 'ar' ? 'الموضوع' : language === 'fr' ? 'Sujet' : 'Subject'}
                      </label>
                      <Input
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder={language === 'ar' ? 'موضوع الرسالة' : language === 'fr' ? 'Sujet du message' : 'Message subject'}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">
                        {language === 'ar' ? 'الرسالة' : language === 'fr' ? 'Message' : 'Message'}
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : language === 'fr' ? 'Écrivez votre message ici...' : 'Write your message here...'}
                        className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                    </div>
                    <Button type="submit" disabled={submitting} className="w-full h-12 bg-accent text-accent-foreground hover:bg-accent/90 font-bold">
                      <Send className={`size-4 ${rtl ? 'ml-2' : 'mr-2'}`} aria-hidden="true" />
                      {submitting
                        ? (language === 'ar' ? 'جاري الإرسال...' : language === 'fr' ? 'Envoi...' : 'Sending...')
                        : (language === 'ar' ? 'إرسال الرسالة' : language === 'fr' ? 'Envoyer le Message' : 'Send Message')}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
