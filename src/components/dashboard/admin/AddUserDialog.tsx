'use client';

import { t } from '@/lib/i18n';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

interface NewUser {
  name: string;
  email: string;
  password: string;
  role: string;
  phone: string;
}

import type { Language } from '@/lib/types';

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  rtl: boolean;
  newUser: NewUser;
  setNewUser: (user: NewUser) => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
}

export function AddUserDialog({
  open,
  onOpenChange,
  language,
  rtl,
  newUser,
  setNewUser,
  onSubmit,
  submitting,
}: AddUserDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir={rtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>{language === 'ar' ? 'إضافة مستخدم جديد' : 'Add New User'}</DialogTitle>
          <DialogDescription>{language === 'ar' ? 'أدخل بيانات المستخدم الجديد' : 'Enter the new user details'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>{language === 'ar' ? 'الاسم الكامل' : 'Full Name'}</Label>
            <Input
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder={language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
            />
          </div>
          <div className="space-y-2">
            <Label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
            <Input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="email@chunks.school"
            />
          </div>
          <div className="space-y-2">
            <Label>{language === 'ar' ? 'كلمة المرور' : 'Password'}</Label>
            <Input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <div className="space-y-2">
            <Label>{language === 'ar' ? 'الدور' : 'Role'}</Label>
            <Select
              value={newUser.role}
              onValueChange={(v) => setNewUser({ ...newUser, role: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">{language === 'ar' ? 'طالب' : 'Student'}</SelectItem>
                <SelectItem value="teacher">{language === 'ar' ? 'معلم' : 'Teacher'}</SelectItem>
                <SelectItem value="parent">{language === 'ar' ? 'ولي أمر' : 'Parent'}</SelectItem>
                <SelectItem value="admin">{language === 'ar' ? 'مدير' : 'Admin'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</Label>
            <Input
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              placeholder="+213 XXX XXX XXX"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel', language)}
          </Button>
          <Button
            className="bg-primary text-primary-foreground hover:bg-[#d91d24]"
            disabled={submitting}
            onClick={async () => {
              if (!newUser.name || !newUser.email || !newUser.password) {
                toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
                return;
              }
              await onSubmit();
            }}
          >
            {submitting ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : t('common.save', language)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
