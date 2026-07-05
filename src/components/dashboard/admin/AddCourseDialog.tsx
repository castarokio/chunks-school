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

interface NewCourse {
  title: string;
  titleAr: string;
  description: string;
  category: string;
  level: string;
  price: number;
  capacity: number;
  teacherId: string;
}

import type { Language } from '@/lib/types';

interface TeacherOption {
  id: string;
  name: string;
}

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
  rtl: boolean;
  newCourse: NewCourse;
  setNewCourse: (course: NewCourse) => void;
  teachers: TeacherOption[];
  onSubmit: () => Promise<void>;
  submitting: boolean;
}

export function AddCourseDialog({
  open,
  onOpenChange,
  language,
  rtl,
  newCourse,
  setNewCourse,
  teachers,
  onSubmit,
  submitting,
}: AddCourseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" dir={rtl ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle>{language === 'ar' ? 'إضافة دورة جديدة' : 'Add New Course'}</DialogTitle>
          <DialogDescription>{language === 'ar' ? 'أدخل بيانات الدورة الجديدة' : 'Enter the new course details'}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'عنوان الدورة' : 'Course Title'}</Label>
              <Input
                value={newCourse.title}
                onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                placeholder="English Mastery"
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'العنوان بالعربية' : 'Title (Arabic)'}</Label>
              <Input
                value={newCourse.titleAr}
                onChange={(e) => setNewCourse({ ...newCourse, titleAr: e.target.value })}
                placeholder="إتقان الإنجليزية"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>{language === 'ar' ? 'الوصف' : 'Description'}</Label>
            <Input
              value={newCourse.description}
              onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
              placeholder={language === 'ar' ? 'وصف الدورة' : 'Course description'}
            />
          </div>
          <div className="space-y-2">
            <Label>{language === 'ar' ? 'المعلم' : 'Teacher'}</Label>
            <Select
              value={newCourse.teacherId}
              onValueChange={(v) => setNewCourse({ ...newCourse, teacherId: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder={language === 'ar' ? 'اختر المعلم' : 'Select teacher'} />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.id}>{teacher.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'التصنيف' : 'Category'}</Label>
              <Select
                value={newCourse.category}
                onValueChange={(v) => setNewCourse({ ...newCourse, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="language">{t('courses.category.language', language)}</SelectItem>
                  <SelectItem value="science">{t('courses.category.science', language)}</SelectItem>
                  <SelectItem value="math">{t('courses.category.math', language)}</SelectItem>
                  <SelectItem value="art">{t('courses.category.art', language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'المستوى' : 'Level'}</Label>
              <Select
                value={newCourse.level}
                onValueChange={(v) => setNewCourse({ ...newCourse, level: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">{t('courses.beginner', language)}</SelectItem>
                  <SelectItem value="intermediate">{t('courses.intermediate', language)}</SelectItem>
                  <SelectItem value="advanced">{t('courses.advanced', language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'السعر (د.ج)' : 'Price (DZD)'}</Label>
              <Input
                type="number"
                value={newCourse.price}
                onChange={(e) => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>{language === 'ar' ? 'السعة' : 'Capacity'}</Label>
              <Input
                type="number"
                value={newCourse.capacity}
                onChange={(e) => setNewCourse({ ...newCourse, capacity: Number(e.target.value) })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel', language)}
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            disabled={submitting}
            onClick={async () => {
              if (!newCourse.title || !newCourse.description || !newCourse.teacherId) {
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
