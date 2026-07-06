'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  Shield,
  User,
  Users,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const schoolPhoto = 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&h=1600&q=82';

const roleLogins = [
  { email: 'try.student@chunks.school', role: 'Student', icon: GraduationCap },
  { email: 'try.parent@chunks.school', role: 'Parent', icon: Users },
  { email: 'try.teacher@chunks.school', role: 'Teacher', icon: BookOpen },
  { email: 'try.admin@chunks.school', role: 'Admin', icon: Shield },
  { email: 'try.manager@chunks.school', role: 'Admin Manager', icon: Shield },
  { email: 'try.owner@chunks.school', role: 'Owner', icon: Shield },
];

function AuthHeading({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <h1 className={`font-[Impact,'Arial_Narrow',sans-serif] text-[3.8rem] uppercase leading-[0.84] tracking-normal text-[#111] md:text-[5.4rem] ${className}`}>
      {children}
    </h1>
  );
}

export default function AuthPage() {
  const { language, currentView, setCurrentView, setUser, setDashboardTab, setLanguage } = useAppStore();
  const rtl = isRTL(language);
  const authMode = currentView === 'register' ? 'register' : 'login';
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState<'student' | 'parent'>('student');

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
      await useAppStore.getState().hydrateStore(data.user);
    } catch {
      setError(language === 'ar' ? 'تعذر الاتصال بالخادم' : 'Unable to reach the server');
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
      await useAppStore.getState().hydrateStore(data.user);
    } catch {
      setError(language === 'ar' ? 'تعذر الاتصال بالخادم' : 'Unable to reach the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ee] text-[#111]" dir={rtl ? 'rtl' : 'ltr'}>
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden p-4 lg:block">
          <div className="relative h-full min-h-[calc(100vh-2rem)] overflow-hidden rounded-[1.45rem] bg-[#111]">
            <img src={schoolPhoto} alt="Chunks School classroom" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/34 to-black/5" />
            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className="absolute left-10 top-9 z-10 grid size-16 place-items-center rounded-full border-4 border-white bg-[#ef232a] text-xs font-black uppercase text-white shadow-[0_12px_26px_rgba(0,0,0,0.25)]"
            >
              CH
            </button>

            <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white xl:p-16">
              <div />
              <div className="max-w-[38rem]">
                <p className="mb-4 text-sm font-black uppercase tracking-normal">Secure School Access</p>
                <h2 className="font-[Impact,'Arial_Narrow',sans-serif] text-[5.4rem] uppercase leading-[0.82] tracking-normal xl:text-[7rem]">
                  Chunks <br /> School <br /> Portal
                </h2>
                <p className="mt-7 max-w-[32rem] text-sm font-bold uppercase leading-7 text-white/78">
                  One place for students, parents, teachers, and school leadership to manage learning, payments,
                  attendance, and progress.
                </p>
              </div>

              <div className="grid max-w-[42rem] grid-cols-3 gap-3">
                {['Role Based', 'Secure Sessions', 'Live Data'].map((item) => (
                  <div key={item} className="rounded-2xl border border-white/14 bg-white/10 p-4 backdrop-blur">
                    <p className="font-[Impact,'Arial_Narrow',sans-serif] text-2xl uppercase leading-none">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-4 py-8 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-[34rem]"
          >
            <div className="mb-8 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentView('landing')}
                className="grid size-14 place-items-center rounded-full border-4 border-white bg-[#ef232a] text-xs font-black uppercase text-white shadow-[0_12px_26px_rgba(0,0,0,0.14)]"
              >
                CH
              </button>
              <div className="flex gap-1 rounded-full bg-white p-1 shadow-[0_10px_28px_rgba(0,0,0,0.08)]">
                {[
                  { code: 'ar' as const, label: 'AR' },
                  { code: 'en' as const, label: 'EN' },
                  { code: 'fr' as const, label: 'FR' },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`h-9 rounded-full px-4 text-xs font-black uppercase transition ${
                      language === lang.code ? 'bg-[#111] text-white' : 'text-[#6b6662] hover:bg-[#f4f1ee]'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <p className="mb-2 text-sm font-black uppercase text-[#ef232a]">
              {authMode === 'login' ? 'Welcome Back' : 'Start With Chunks'}
            </p>
            <AuthHeading className="mb-7">
              {authMode === 'login' ? (
                <>Login To <span className="text-[#ef232a]">Portal</span></>
              ) : (
                <>Create <span className="text-[#ef232a]">Account</span></>
              )}
            </AuthHeading>

            <div className="rounded-[1.35rem] bg-white p-3 shadow-[0_18px_48px_rgba(0,0,0,0.12)]">
              <Tabs
                value={authMode}
                onValueChange={(value) => setCurrentView(value === 'register' ? 'register' : 'login')}
                className="w-full"
              >
                <TabsList className="mb-6 grid h-13 w-full grid-cols-2 rounded-full bg-[#f4f1ee] p-1">
                  <TabsTrigger value="login" className="rounded-full text-xs font-black uppercase data-[state=active]:bg-[#111] data-[state=active]:text-white">
                    {t('auth.login', language)}
                  </TabsTrigger>
                  <TabsTrigger value="register" className="rounded-full text-xs font-black uppercase data-[state=active]:bg-[#111] data-[state=active]:text-white">
                    {t('auth.register', language)}
                  </TabsTrigger>
                </TabsList>

                <div className="px-2 pb-2 md:px-4 md:pb-4">
                  <TabsContent value="login" className="mt-0">
                    <form onSubmit={handleLogin} className="space-y-5">
                      <Field
                        id="email"
                        label={t('auth.email', language)}
                        icon={Mail}
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="try.student@chunks.school"
                        autoComplete="email"
                        rtl={rtl}
                      />
                      <PasswordField
                        id="password"
                        label={t('auth.password', language)}
                        value={password}
                        onChange={setPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        autoComplete="current-password"
                        rtl={rtl}
                      />

                      <ErrorMessage error={error} />
                      <SubmitButton loading={loading} rtl={rtl}>
                        {t('auth.login', language)}
                      </SubmitButton>
                    </form>

                    <div className="mt-7">
                      <p className="mb-3 text-xs font-black uppercase text-[#6b6662]">
                        Try role accounts. Password: <span className="text-[#111]">TryAllRoles!2026</span>
                      </p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {roleLogins.map((demo) => {
                          const Icon = demo.icon;
                          return (
                            <button
                              type="button"
                              key={demo.email}
                              onClick={() => {
                                setEmail(demo.email);
                                setPassword('TryAllRoles!2026');
                              }}
                              className="flex items-center gap-3 rounded-2xl border border-[#e5dfda] bg-[#f4f1ee] p-3 text-start transition hover:-translate-y-0.5 hover:border-[#ef232a]/40 hover:bg-white"
                            >
                              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#111] text-white">
                                <Icon className="size-4" aria-hidden="true" />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-xs font-black uppercase text-[#111]">{demo.role}</span>
                                <span className="block truncate text-[0.68rem] font-bold text-[#6b6662]">{demo.email}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="register" className="mt-0">
                    <form onSubmit={handleRegister} className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-[#111]">{t('auth.role', language)}</Label>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            { role: 'student' as const, icon: GraduationCap, label: t('auth.student', language) },
                            { role: 'parent' as const, icon: Users, label: t('auth.parent', language) },
                          ].map((role) => {
                            const Icon = role.icon;
                            const active = selectedRole === role.role;
                            return (
                              <button
                                key={role.role}
                                type="button"
                                onClick={() => setSelectedRole(role.role)}
                                className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-2xl border-2 p-4 text-sm font-black uppercase transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef232a] ${
                                  active ? 'border-[#ef232a] bg-[#ef232a] text-white' : 'border-[#e5dfda] bg-[#f4f1ee] text-[#111] hover:border-[#ef232a]/50'
                                }`}
                              >
                                <Icon className="size-5" aria-hidden="true" />
                                {role.label}
                                {active && <CheckCircle className="size-4" aria-hidden="true" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <Field
                        id="reg-name"
                        label={t('auth.name', language)}
                        icon={User}
                        value={name}
                        onChange={setName}
                        placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                        autoComplete="name"
                        rtl={rtl}
                      />
                      <Field
                        id="reg-email"
                        label={t('auth.email', language)}
                        icon={Mail}
                        type="email"
                        value={email}
                        onChange={setEmail}
                        placeholder="email@example.com"
                        autoComplete="email"
                        rtl={rtl}
                      />
                      <Field
                        id="reg-phone"
                        label={t('auth.phone', language)}
                        icon={Phone}
                        type="tel"
                        value={phone}
                        onChange={setPhone}
                        placeholder="+213 XXX XXX XXX"
                        autoComplete="tel"
                        rtl={rtl}
                        required={false}
                      />
                      <PasswordField
                        id="reg-password"
                        label={t('auth.password', language)}
                        value={password}
                        onChange={setPassword}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        autoComplete="new-password"
                        rtl={rtl}
                      />

                      <ErrorMessage error={error} />
                      <SubmitButton loading={loading} rtl={rtl}>
                        {t('auth.register', language)}
                      </SubmitButton>
                    </form>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            <Button
              variant="ghost"
              className="mt-6 h-11 w-full rounded-full text-xs font-black uppercase text-[#6b6662] hover:bg-white hover:text-[#111]"
              onClick={() => setCurrentView('landing')}
            >
              {rtl ? <ArrowRight className="me-2 size-4" /> : <ArrowLeft className="me-2 size-4" />}
              {language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
            </Button>
          </motion.div>
        </section>
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  autoComplete,
  rtl,
  type = 'text',
  required = true,
}: {
  id: string;
  label: string;
  icon: typeof Mail;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoComplete: string;
  rtl: boolean;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-black uppercase text-[#111]">{label}</Label>
      <div className="relative">
        <Icon className={`absolute top-1/2 size-4 -translate-y-1/2 text-[#6b6662] ${rtl ? 'right-4' : 'left-4'}`} />
        <Input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`h-13 rounded-2xl border-[#e5dfda] bg-[#f4f1ee] text-sm font-bold text-[#111] placeholder:text-[#9b9691] focus-visible:ring-[#ef232a]/35 ${rtl ? 'pr-11' : 'pl-11'}`}
          required={required}
        />
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  showPassword,
  setShowPassword,
  autoComplete,
  rtl,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  showPassword: boolean;
  setShowPassword: (value: boolean) => void;
  autoComplete: string;
  rtl: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-xs font-black uppercase text-[#111]">{label}</Label>
      <div className="relative">
        <Lock className={`absolute top-1/2 size-4 -translate-y-1/2 text-[#6b6662] ${rtl ? 'right-4' : 'left-4'}`} />
        <Input
          id={id}
          name={id}
          type={showPassword ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="********"
          className={`h-13 rounded-2xl border-[#e5dfda] bg-[#f4f1ee] text-sm font-bold text-[#111] placeholder:text-[#9b9691] focus-visible:ring-[#ef232a]/35 ${rtl ? 'pl-12 pr-11' : 'pl-11 pr-12'}`}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className={`absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full text-[#6b6662] transition hover:bg-white hover:text-[#111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ef232a] ${rtl ? 'left-1.5' : 'right-1.5'}`}
          aria-label={showPassword ? 'Hide Password' : 'Show Password'}
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}

function ErrorMessage({ error }: { error: string }) {
  if (!error) return null;
  return (
    <motion.p
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-[#ef232a]/20 bg-[#ef232a]/10 p-3 text-sm font-bold text-[#d91d24]"
      role="alert"
    >
      {error}
    </motion.p>
  );
}

function SubmitButton({ children, loading, rtl }: { children: React.ReactNode; loading: boolean; rtl: boolean }) {
  return (
    <Button
      type="submit"
      className="h-13 w-full rounded-full bg-[#ef232a] text-xs font-black uppercase text-white shadow-[0_12px_28px_rgba(239,35,42,0.25)] hover:bg-[#d91d24]"
      disabled={loading}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="size-5 rounded-full border-2 border-white/30 border-t-white"
        />
      ) : (
        <span className="inline-flex items-center gap-2">
          {children}
          {rtl ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
        </span>
      )}
    </Button>
  );
}
