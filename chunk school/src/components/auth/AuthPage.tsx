'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { mockUsers } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Mail, Lock, User, Phone, Shield, GraduationCap,
  BookOpen, Users, Eye, EyeOff, ArrowRight, ArrowLeft,
  Chrome, Facebook, CheckCircle,
} from 'lucide-react';
import Image from 'next/image';

export default function AuthPage() {
  const { language, setCurrentView, setUser, setDashboardTab, setLanguage } = useAppStore();
  const rtl = isRTL(language);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | 'parent'>('student');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || (language === 'ar' ? 'خطأ في تسجيل الدخول' : 'Login failed'));
        setLoading(false);
        return;
      }

      setUser(data.user);
      setCurrentView('dashboard');
      setDashboardTab('overview');

      const { setNotifications, setEnrollments, setGamification, setSkills, setCourses } = useAppStore.getState();
      const { mockNotifications, mockEnrollments, mockGamification, mockSkills, mockCourses } = await import('@/lib/mock-data');
      setNotifications(mockNotifications);
      setEnrollments(mockEnrollments);
      setGamification(mockGamification);
      setSkills(mockSkills);
      setCourses(mockCourses);
    } catch {
      let mockUser = mockUsers.student;
      if (email === 'teacher@champs.dz') mockUser = mockUsers.teacher;
      else if (email === 'parent@champs.dz') mockUser = mockUsers.parent;
      else if (email === 'admin@champs.dz') mockUser = mockUsers.admin;
      else if (email === 'owner@champs.dz') mockUser = mockUsers.owner;

      setUser(mockUser);
      setCurrentView('dashboard');
      setDashboardTab('overview');

      const { setNotifications, setEnrollments, setGamification, setSkills, setCourses } = useAppStore.getState();
      const { mockNotifications, mockEnrollments, mockGamification, mockSkills, mockCourses } = await import('@/lib/mock-data');
      setNotifications(mockNotifications);
      setEnrollments(mockEnrollments);
      setGamification(mockGamification);
      setSkills(mockSkills);
      setCourses(mockCourses);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: selectedRole, phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || (language === 'ar' ? 'خطأ في التسجيل' : 'Registration failed'));
        setLoading(false);
        return;
      }

      setUser(data.user);
      setCurrentView('dashboard');
      setDashboardTab('overview');
    } catch {
      setUser({
        id: 'new-' + Date.now(),
        email,
        name,
        role: selectedRole,
        language,
        twoFactorEnabled: false,
      });
      setCurrentView('dashboard');
      setDashboardTab('overview');
    } finally {
      setLoading(false);
    }
  };

  const demoLogins = [
    { email: 'student@champs.dz', role: language === 'ar' ? 'طالب' : 'Student', icon: GraduationCap },
    { email: 'teacher@champs.dz', role: language === 'ar' ? 'معلم' : 'Teacher', icon: BookOpen },
    { email: 'parent@champs.dz', role: language === 'ar' ? 'ولي أمر' : 'Parent', icon: Users },
    { email: 'admin@champs.dz', role: language === 'ar' ? 'مدير' : 'Admin', icon: Shield },
    { email: 'owner@champs.dz', role: language === 'ar' ? 'مالك' : 'Owner', icon: Shield },
  ];

  return (
    <div className="flex min-h-screen bg-background" dir={rtl ? 'rtl' : 'ltr'}>
      {/* Left Panel - Branding */}
      <div className="brand-shell school-grid relative hidden overflow-hidden lg:flex lg:w-1/2">
        <div className="absolute inset-0">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 50, repeat: Infinity, ease: 'linear' }} className="absolute top-20 start-20 w-64 h-64 border border-white/10 rounded-full" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} className="absolute bottom-20 end-20 w-96 h-96 border border-white/5 rounded-full" />
          <motion.div animate={{ y: [-20, 20, -20] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-1/3 end-1/4 w-20 h-20 bg-amber-400/20 rounded-2xl rotate-45" />
          <motion.div animate={{ x: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-1/3 start-1/4 w-16 h-16 bg-teal-400/20 rounded-full" />
        </div>

        <div className="relative z-10 flex w-full flex-col items-center justify-center p-12 text-primary">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <Image src="/champs-logo.png" alt="Champs School" fill className="object-contain" />
            </div>
            <h1 className="mb-3 text-4xl font-black">{language === 'ar' ? 'تشامبس سكول' : 'Champs School'}</h1>
            <p className="mx-auto max-w-md text-lg leading-8 text-muted-foreground">
              {language === 'ar' ? 'منصة تعليمية متقدمة تجمع بين التكنولوجيا والابتكار' : 'Advanced educational platform combining technology and innovation'}
            </p>

            <div className="mt-8 space-y-2">
              <p className="mb-3 text-sm font-medium text-muted-foreground">
                {language === 'ar' ? 'حسابات تجريبية (كلمة المرور: password123)' : 'Demo accounts (password: password123)'}
              </p>
              {demoLogins.map((demo) => (
                <motion.button
                  key={demo.email}
                  whileHover={{ scale: 1.02, x: rtl ? -4 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setEmail(demo.email); setPassword('password123'); }}
                  className="brand-card flex w-full items-center gap-3 rounded-lg p-3 text-start transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <demo.icon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{demo.role}</p>
                    <p className="text-xs text-muted-foreground">{demo.email}</p>
                  </div>
                  <ArrowLeft className={`size-4 text-muted-foreground ${rtl ? 'rotate-180' : ''}`} aria-hidden="true" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex flex-1 items-center justify-center bg-background p-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-3 relative">
              <Image src="/champs-logo.png" alt="Champs School" fill className="object-contain" />
            </div>
            <h1 className="text-2xl font-black text-primary" translate="no">Champs School</h1>
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {[
              { code: 'ar' as const, label: 'العربية' },
              { code: 'en' as const, label: 'English' },
              { code: 'fr' as const, label: 'Français' },
            ].map(lang => (
              <Button key={lang.code} variant={language === lang.code ? 'default' : 'ghost'} size="sm" onClick={() => setLanguage(lang.code)}>
                {lang.label}
              </Button>
            ))}
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t('auth.login', language)}</TabsTrigger>
              <TabsTrigger value="register">{t('auth.register', language)}</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email', language)}</Label>
                  <div className="relative">
                    <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${rtl ? 'right-3' : 'left-3'}`} />
                    <Input id="email" name="email" type="email" autoComplete="email" spellCheck={false} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@champs.dz" className={rtl ? 'pr-10' : 'pl-10'} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t('auth.password', language)}</Label>
                  <div className="relative">
                    <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${rtl ? 'right-3' : 'left-3'}`} />
                    <Input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={rtl ? 'pr-10 pl-10' : 'pl-10 pr-10'} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-1/2 flex size-9 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${rtl ? 'left-1' : 'right-1'}`} aria-label={showPassword ? 'Hide Password' : 'Show Password'}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="rounded-md bg-destructive/10 p-2 text-sm text-destructive" role="alert">{error}</motion.p>
                )}

                <Button type="submit" className="h-12 w-full" disabled={loading}>
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <span>{t('auth.login', language)} {rtl ? <ArrowLeft className="w-4 h-4 ms-2 inline" /> : <ArrowRight className="w-4 h-4 ms-2 inline" />}</span>
                  )}
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-gray-950 px-2 text-muted-foreground">{language === 'ar' ? 'أو' : 'Or'}</span></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant="outline" className="h-10" disabled><Chrome className="w-4 h-4 me-2" />Google</Button>
                  <Button type="button" variant="outline" className="h-10" disabled><Facebook className="w-4 h-4 me-2" />Facebook</Button>
                </div>
                <p className="text-[10px] text-center text-muted-foreground">{language === 'ar' ? 'التسجيل عبر وسائل التواصل قريباً' : 'Social login coming soon'}</p>

                <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary p-3">
                  <Shield className="size-4 shrink-0 text-primary" aria-hidden="true" />
                  <p className="text-xs text-primary">{language === 'ar' ? 'المصادقة الثنائية مفعّلة للحسابات الإدارية' : '2FA enabled for admin accounts'}</p>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label>{t('auth.role', language)}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { role: 'student' as const, icon: GraduationCap, label: t('auth.student', language) },
                      { role: 'teacher' as const, icon: BookOpen, label: t('auth.teacher', language) },
                      { role: 'parent' as const, icon: Users, label: t('auth.parent', language) },
                    ].map((r) => (
                      <motion.button key={r.role} type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setSelectedRole(r.role)}
                        className={`flex min-h-24 flex-col items-center gap-1.5 rounded-lg border-2 p-3 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          selectedRole === r.role ? 'border-primary bg-secondary text-primary' : 'border-border hover:border-primary/40'
                        }`}
                      >
                        <r.icon className="size-5" aria-hidden="true" />
                        <span className="text-xs font-medium">{r.label}</span>
                        {selectedRole === r.role && <CheckCircle className="size-3 text-primary" aria-hidden="true" />}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-name">{t('auth.name', language)}</Label>
                  <div className="relative">
                    <User className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${rtl ? 'right-3' : 'left-3'}`} />
                    <Input id="reg-name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'} className={rtl ? 'pr-10' : 'pl-10'} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">{t('auth.email', language)}</Label>
                  <div className="relative">
                    <Mail className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${rtl ? 'right-3' : 'left-3'}`} />
                    <Input id="reg-email" name="email" type="email" autoComplete="email" spellCheck={false} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className={rtl ? 'pr-10' : 'pl-10'} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-phone">{t('auth.phone', language)}</Label>
                  <div className="relative">
                    <Phone className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${rtl ? 'right-3' : 'left-3'}`} />
                    <Input id="reg-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+213 XXX XXX XXX" className={rtl ? 'pr-10' : 'pl-10'} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t('auth.password', language)}</Label>
                  <div className="relative">
                    <Lock className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${rtl ? 'right-3' : 'left-3'}`} />
                    <Input id="reg-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={rtl ? 'pr-10 pl-10' : 'pl-10 pr-10'} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute top-1/2 flex size-9 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${rtl ? 'left-1' : 'right-1'}`} aria-label={showPassword ? 'Hide Password' : 'Show Password'}>
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="rounded-md bg-destructive/10 p-2 text-sm text-destructive" role="alert">{error}</motion.p>
                )}
                <Button type="submit" className="h-12 w-full" disabled={loading}>
                  {loading ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  ) : (
                    <span>{t('auth.register', language)} {rtl ? <ArrowLeft className="w-4 h-4 ms-2 inline" /> : <ArrowRight className="w-4 h-4 ms-2 inline" />}</span>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <Button variant="ghost" className="w-full mt-6 text-muted-foreground" onClick={() => setCurrentView('landing')}>
            {rtl ? <ArrowRight className="w-4 h-4 me-2" /> : <ArrowLeft className="w-4 h-4 me-2" />}
            {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
