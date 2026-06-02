'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';
import { t, isRTL } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CreditCard, Upload, CheckCircle, Clock, XCircle, FileText, Download } from 'lucide-react';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function StudentPayments() {
  const { language } = useAppStore();
  const rtl = isRTL(language);

  const payments = [
    { id: 'p1', course: 'إتقان الإنجليزية', amount: 15000, status: 'verified', date: '2025-09-01' },
    { id: 'p2', course: 'أساسيات الرياضيات', amount: 10000, status: 'verified', date: '2025-09-01' },
    { id: 'p3', course: 'مستكشف العلوم', amount: 14000, status: 'pending', date: '2025-10-15' },
  ];

  const totalPaid = payments.filter(p => p.status === 'verified').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

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
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input type="file" className="flex-1" accept=".pdf,.jpg,.jpeg,.png" />
              <Button className="bg-emerald-600 hover:bg-emerald-700 shrink-0">
                <Upload className="w-4 h-4 me-2" />
                {language === 'ar' ? 'رفع الملف' : 'Upload File'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {language === 'ar' ? 'PDF, JPG, PNG - الحد الأقصى 5MB' : 'PDF, JPG, PNG - Max 5MB'}
            </p>
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
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'الدورة' : 'Course'}</th>
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'المبلغ' : 'Amount'}</th>
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                    <th className="py-2 px-3 text-start font-medium text-muted-foreground">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id} className="border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-2.5 px-3 font-medium">{p.course}</td>
                      <td className="py-2.5 px-3">{p.amount.toLocaleString()} DZD</td>
                      <td className="py-2.5 px-3 text-muted-foreground">{p.date}</td>
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
