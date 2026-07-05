'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  User, Mail, Phone, Globe, Moon, Shield, Bell, Volume2,
  Save, Camera, CheckCircle2, Lock,
} from 'lucide-react';
import { toast } from 'sonner';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

export default function DashboardSettings() {
  const { language, user, setUser, setLanguage, isDark, toggleDark, soundEnabled, toggleSound } = useAppStore();
  const rtl = isRTL(language);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled || false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifPush, setNotifPush] = useState(true);
  const [notifSound, setNotifSound] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to load settings');
        if (!active) return;

        setName(data.user.name || '');
        setEmail(data.user.email || '');
        setPhone(data.user.phone || '');
        setTwoFactor(Boolean(data.user.twoFactorEnabled));
        setLanguage(data.user.language || language);
        setUser(data.user);

        const preferences = data.preferences || {};
        setNotifEmail(preferences.notifEmail !== false);
        setNotifPush(preferences.notifPush !== false);
        setNotifSound(preferences.notifSound !== false);
        setVolume([typeof preferences.volume === 'number' ? preferences.volume : 75]);
      } catch (error) {
        if (active) {
          toast.error(error instanceof Error ? error.message : 'Failed to load settings');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          language,
          twoFactorEnabled: twoFactor,
          preferences: {
            notifEmail,
            notifPush,
            notifSound,
            volume: volume[0],
            isDark,
            soundEnabled,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');

      setUser(data.user);
      toast.success(
        language === 'ar'
          ? 'تم حفظ الإعدادات بنجاح!'
          : language === 'fr'
          ? 'Paramètres enregistrés avec succès!'
          : 'Settings saved successfully!'
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-4xl">
      {loading && (
        <div className="rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
          {language === 'ar' ? 'جاري تحميل الإعدادات...' : 'Loading settings...'}
        </div>
      )}
      {/* Profile Section */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-600" />
              {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20 border-2 border-emerald-500/30">
                  <AvatarFallback className="bg-emerald-600 text-white text-2xl font-bold">
                    {name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 end-0 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:bg-emerald-700 transition-colors">
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <p className="font-semibold text-lg">{name}</p>
                <p className="text-sm text-muted-foreground">{email}</p>
                <Badge className="mt-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 text-[10px]">
                  {user?.role === 'student' ? (language === 'ar' ? 'طالب' : 'Student') :
                   user?.role === 'teacher' ? (language === 'ar' ? 'معلم' : 'Teacher') :
                   user?.role === 'parent' ? (language === 'ar' ? 'ولي أمر' : 'Parent') :
                   user?.role === 'admin' ? (language === 'ar' ? 'مدير' : 'Admin') :
                   (language === 'ar' ? 'مالك' : 'Owner')}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                </Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                </Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Language Preference */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-600" />
              {language === 'ar' ? 'تفضيلات اللغة' : 'Language Preferences'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={language}
              onValueChange={(val) => setLanguage(val as 'ar' | 'en' | 'fr')}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {[
                { value: 'ar', label: 'العربية', flag: '🇩🇿' },
                { value: 'en', label: 'English', flag: '🇬🇧' },
                { value: 'fr', label: 'Français', flag: '🇫🇷' },
              ].map((lang) => (
                <label
                  key={lang.value}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    language === lang.value
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10 shadow-sm'
                      : 'border-gray-200 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800'
                  }`}
                >
                  <RadioGroupItem value={lang.value} className="sr-only" />
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${language === lang.value ? 'text-emerald-700 dark:text-emerald-400' : ''}`}>
                      {lang.label}
                    </p>
                  </div>
                  {language === lang.value && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                </label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </motion.div>

      {/* Theme Toggle */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Moon className="w-4 h-4 text-emerald-600" />
              {language === 'ar' ? 'المظهر' : 'Theme'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDark ? 'bg-gray-700' : 'bg-amber-100'}`}>
                  {isDark ? <Moon className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-amber-600" />}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {isDark
                      ? (language === 'ar' ? 'الوضع الداكن' : 'Dark Mode')
                      : (language === 'ar' ? 'الوضع الفاتح' : 'Light Mode')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar'
                      ? 'تبديل بين الوضعين الفاتح والداكن'
                      : 'Toggle between light and dark modes'}
                  </p>
                </div>
              </div>
              <Switch checked={isDark} onCheckedChange={toggleDark} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two-Factor Authentication */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              {language === 'ar' ? 'المصادقة الثنائية' : 'Two-Factor Authentication'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${twoFactor ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  <Lock className={`w-5 h-5 ${twoFactor ? 'text-emerald-600' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'تفعيل المصادقة الثنائية' : 'Enable 2FA'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {twoFactor
                      ? (language === 'ar' ? 'مفعّل - حسابك محمي' : 'Enabled - Your account is protected')
                      : (language === 'ar' ? 'أضف طبقة حماية إضافية لحسابك' : 'Add an extra layer of security')}
                  </p>
                </div>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>
            {twoFactor && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-800"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      {language === 'ar' ? 'المصادقة الثنائية مفعّلة' : '2FA is enabled'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'ar'
                        ? 'سيتم إرسال رمز تحقق إلى بريدك الإلكتروني عند كل تسجيل دخول. يمكنك أيضاً استخدام تطبيق مصادقة مثل Google Authenticator.'
                        : 'A verification code will be sent to your email on each login. You can also use an authenticator app like Google Authenticator.'}
                    </p>
                    <ol className="text-xs text-muted-foreground mt-2 space-y-1 list-decimal ps-4">
                      <li>{language === 'ar' ? 'قم بتحميل تطبيق المصادقة' : 'Download an authenticator app'}</li>
                      <li>{language === 'ar' ? 'امسح رمز QR من الإعدادات' : 'Scan the QR code from settings'}</li>
                      <li>{language === 'ar' ? 'أدخل رمز التحقق المكون من 6 أرقام' : 'Enter the 6-digit verification code'}</li>
                    </ol>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              {language === 'ar' ? 'تفضيلات الإشعارات' : 'Notification Preferences'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              {
                icon: Mail, label: language === 'ar' ? 'إشعارات البريد' : 'Email Notifications',
                desc: language === 'ar' ? 'استلام الإشعارات عبر البريد الإلكتروني' : 'Receive notifications via email',
                checked: notifEmail, onChange: setNotifEmail,
              },
              {
                icon: Bell, label: language === 'ar' ? 'الإشعارات الفورية' : 'Push Notifications',
                desc: language === 'ar' ? 'استلام الإشعارات على جهازك' : 'Receive push notifications on your device',
                checked: notifPush, onChange: setNotifPush,
              },
              {
                icon: Volume2, label: language === 'ar' ? 'أصوات الإشعارات' : 'Notification Sounds',
                desc: language === 'ar' ? 'تشغيل صوت عند وصول إشعار' : 'Play sound when notification arrives',
                checked: notifSound, onChange: setNotifSound,
              },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                    <pref.icon className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </div>
                </div>
                <Switch checked={pref.checked} onCheckedChange={pref.onChange} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Sound Preferences */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-emerald-600" />
              {language === 'ar' ? 'تفضيلات الصوت' : 'Sound Preferences'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${soundEnabled ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <Volume2 className="w-4 h-4 text-gray-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {language === 'ar' ? 'تفعيل الأصوات' : 'Enable Sounds'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'ar' ? 'تشغيل المؤثرات الصوتية' : 'Play sound effects'}
                  </p>
                </div>
              </div>
              <Switch checked={soundEnabled} onCheckedChange={toggleSound} />
            </div>

            {soundEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="px-3"
              >
                <div className="flex items-center gap-4">
                  <Label className="text-xs shrink-0">
                    {language === 'ar' ? 'مستوى الصوت' : 'Volume'}
                  </Label>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-10 text-end">{volume[0]}%</span>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div variants={item} className="flex justify-end">
        <Button
          size="lg"
          onClick={handleSave}
          disabled={saving}
          className="px-8 bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {saving ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full me-2"
            />
          ) : (
            <Save className="w-5 h-5 me-2" />
          )}
          {saving
            ? (language === 'ar' ? 'جارٍ الحفظ...' : 'Saving...')
            : t('common.save', language)}
        </Button>
      </motion.div>
    </motion.div>
  );
}
