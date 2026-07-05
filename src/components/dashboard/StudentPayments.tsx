'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CreditCard, Upload, CheckCircle, Clock, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function StudentPayments() {
  const { language, enrollments } = useAppStore();
  const rtl = isRTL(language);

  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState('');
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const getPayments = async (signal?: AbortSignal) => {
    const res = await fetch('/api/payments', { signal });
    if (!res.ok) return [];

    const data = await res.json();
    return data.payments || [];
  };

  const fetchPayments = useCallback(async () => {
    setPaymentsList(await getPayments());
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    getPayments(controller.signal).then((payments) => {
      if (!controller.signal.aborted) setPaymentsList(payments);
    }).catch((e) => {
      if (!controller.signal.aborted) console.error(e);
    });

    return () => controller.abort();
  }, [fetchPayments]);

  const selectedEnrollment = enrollments.find((en) => en.id === selectedEnrollmentId);
  const totalPaid = paymentsList.filter(p => p.status === 'verified').reduce((s, p) => s + p.amount, 0);
  const totalPending = paymentsList.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 opacity-80" />
                <div>
                  <p className="text-sm opacity-80">{language === 'ar' ? 'إجمالي المدفوع' : 'Total Paid'}</p>
                  <p className="text-2xl font-bold">{totalPaid.toLocaleString()} DZD</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-400 to-amber-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 opacity-80" />
                <div>
                  <p className="text-sm opacity-80">{language === 'ar' ? 'قيد الانتظار' : 'Pending'}</p>
                  <p className="text-2xl font-bold">{totalPending.toLocaleString()} DZD</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-8 h-8 text-gray-400" />
                <div>
                  <p className="text-sm text-muted-foreground">{language === 'ar' ? 'إجمالي المستحق' : 'Total Due'}</p>
                  <p className="text-2xl font-bold">{(totalPaid + totalPending).toLocaleString()} DZD</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upload Proof */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" />
              {language === 'ar' ? 'رفع إثبات الدفع' : 'Upload Payment Proof'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir={rtl ? 'rtl' : 'ltr'}>
              <div className="space-y-2">
                <label className="text-sm font-medium">{language === 'ar' ? 'اختر الدورة' : 'Select Course'}</label>
                <select
                  className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  value={selectedEnrollmentId}
                  onChange={(e) => setSelectedEnrollmentId(e.target.value)}
                >
                  <option value="">{language === 'ar' ? '-- اختر الدورة --' : '-- Select a course --'}</option>
                  {enrollments.map((en) => (
                    <option key={en.id} value={en.id}>
                      {language === 'ar' ? (en.course?.titleAr || en.course?.title) : en.course?.title} ({en.status})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{language === 'ar' ? 'المبلغ المستحق (د.ج)' : 'Amount Due (DZD)'}</label>
                <div className="flex h-10 items-center rounded-lg border border-gray-200 px-3 text-sm dark:border-gray-800">
                  {selectedEnrollment?.course?.price
                    ? `${selectedEnrollment.course.price.toLocaleString()} ${selectedEnrollment.course.currency || 'DZD'}`
                    : (language === 'ar' ? 'اختر دورة' : 'Select a course')}
                </div>
              </div>
            </div>

            <div className="space-y-2" dir={rtl ? 'rtl' : 'ltr'}>
              <label className="text-sm font-medium">{language === 'ar' ? 'صورة الوصل أو رقم المعاملة' : 'Receipt Image or Transaction Proof'}</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="file"
                  className="flex-1"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) => setProofFile(event.target.files?.[0] || null)}
                />
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700 shrink-0 text-white"
                  disabled={submitting}
                  onClick={async () => {
                    if (!selectedEnrollmentId || !proofFile) {
                      toast.error(language === 'ar' ? 'يرجى اختيار الدورة وإرفاق الوصل' : 'Please select course and attach receipt');
                      return;
                    }
                    setSubmitting(true);
                    try {
                      const uploadData = new FormData();
                      uploadData.append('file', proofFile);
                      const uploadRes = await fetch('/api/uploads/payment-proof', {
                        method: 'POST',
                        body: uploadData,
                      });
                      const uploadBody = await uploadRes.json();
                      if (!uploadRes.ok) throw new Error(uploadBody.error || 'Failed to upload proof');

                      const res = await fetch('/api/payments', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          enrollmentId: selectedEnrollmentId,
                          proofKey: uploadBody.proofKey
                        })
                      });
                      const body = await res.json();
                      if (!res.ok) throw new Error(body.error || 'Failed to submit proof');

                      toast.success(language === 'ar' ? 'تم تقديم إثبات الدفع بنجاح!' : 'Payment proof submitted successfully!');
                      setSelectedEnrollmentId('');
                      setProofFile(null);
                      fetchPayments();
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : 'Network error');
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {submitting ? (language === 'ar' ? 'جاري الرفع...' : 'Uploading...') : (language === 'ar' ? 'تقديم الوصل' : 'Submit Receipt')}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {language === 'ar' ? 'PDF, JPG, PNG - الحد الأقصى 5MB' : 'PDF, JPG, PNG - Max 5MB'}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payment History */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              {language === 'ar' ? 'سجل المدفوعات' : 'Payment History'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" dir={rtl ? 'rtl' : 'ltr'}>
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'الدورة' : 'Course'}</th>
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'المبلغ' : 'Amount'}</th>
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentsList.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-6 px-3 text-center text-muted-foreground">
                        {language === 'ar' ? 'لا توجد مدفوعات بعد.' : 'No payments yet.'}
                      </td>
                    </tr>
                  )}
                  {paymentsList.map((p) => (
                    <tr key={p.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-2.5 px-3 font-medium">
                        {language === 'ar' ? (p.courseTitleAr || p.courseTitle) : p.courseTitle}
                      </td>
                      <td className="py-2.5 px-3">{p.amount.toLocaleString()} DZD</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{p.createdAt || p.submittedAt || p.date}</td>
                      <td className="py-2.5 px-3">
                        <Badge className={`text-xs ${
                          p.status === 'verified' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                          p.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                          'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                          {p.status === 'verified' ? (language === 'ar' ? 'مؤكد' : 'Verified') :
                           p.status === 'pending' ? (language === 'ar' ? 'معلّق' : 'Pending') :
                           (language === 'ar' ? 'مرفوض' : 'Rejected')}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Export */}
      <motion.div variants={item}>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          {language === 'ar' ? 'تصدير ملخص PDF' : 'Export PDF Summary'}
        </Button>
      </motion.div>
    </motion.div>
  );
}
