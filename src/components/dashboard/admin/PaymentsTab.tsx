'use client';

import { motion } from 'framer-motion';
import { t } from '@/lib/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { CheckCircle2, XCircle, Eye } from 'lucide-react';
import { toast } from 'sonner';

import type { Language } from '@/lib/types';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

interface PaymentStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}

interface PaymentsTabProps {
  language: Language;
  paymentStats: PaymentStats;
  payments: AdminPayment[];
  onUpdatePayment: (paymentId: string, status: 'verified' | 'rejected') => Promise<void>;
  updatingPaymentId: string | null;
}

export interface AdminPayment {
  id: string;
  studentName: string;
  courseName: string;
  amount: number;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt?: string;
  createdAt?: string;
}

export function PaymentsTab({ language, paymentStats, payments, onUpdatePayment, updatingPaymentId }: PaymentsTabProps) {
  return (
    <div className="space-y-4 mt-4">
      {/* Payment Stats */}
      <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">{language === 'ar' ? 'إجمالي المدفوعات' : 'Total Payments'}</p>
            <p className="text-lg font-bold">{paymentStats.total.toLocaleString()} DZD</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">{language === 'ar' ? 'معلّق' : 'Pending'}</p>
            <p className="text-lg font-bold text-amber-600">{paymentStats.pending}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">{language === 'ar' ? 'موثّق' : 'Verified'}</p>
            <p className="text-lg font-bold text-emerald-600">{paymentStats.verified}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">{language === 'ar' ? 'مرفوض' : 'Rejected'}</p>
            <p className="text-lg font-bold text-red-500">{paymentStats.rejected}</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Payments Table */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'ar' ? 'الطالب' : 'Student'}</TableHead>
                    <TableHead>{language === 'ar' ? 'الدورة' : 'Course'}</TableHead>
                    <TableHead>{language === 'ar' ? 'المبلغ' : 'Amount'}</TableHead>
                    <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                    <TableHead>{language === 'ar' ? 'التاريخ' : 'Date'}</TableHead>
                    <TableHead className="text-end">{language === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium text-sm">{payment.studentName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{payment.courseName}</TableCell>
                      <TableCell className="text-sm font-medium">{payment.amount.toLocaleString()} DZD</TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${
                          payment.status === 'verified' ? 'bg-emerald-100 text-emerald-700' :
                          payment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {payment.status === 'verified' ? (language === 'ar' ? 'موثّق' : 'Verified') :
                           payment.status === 'pending' ? (language === 'ar' ? 'معلّق' : 'Pending') :
                           (language === 'ar' ? 'مرفوض' : 'Rejected')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{payment.submittedAt || payment.createdAt}</TableCell>
                      <TableCell className="text-end">
                        {payment.status === 'pending' ? (
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-2 h-7"
                              disabled={updatingPaymentId === payment.id}
                              onClick={async () => {
                                await onUpdatePayment(payment.id, 'verified');
                                toast.success(language === 'ar' ? 'تمت الموافقة على الدفع' : 'Payment approved!');
                              }}
                            >
                              <CheckCircle2 className="w-3 h-3 me-1" />
                              {language === 'ar' ? 'موافقة' : 'Approve'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 text-xs px-2 h-7"
                              disabled={updatingPaymentId === payment.id}
                              onClick={async () => {
                                await onUpdatePayment(payment.id, 'rejected');
                                toast.error(language === 'ar' ? 'تم رفض الدفع' : 'Payment rejected!');
                              }}
                            >
                              <XCircle className="w-3 h-3 me-1" />
                              {language === 'ar' ? 'رفض' : 'Reject'}
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-xs h-7">
                            <Eye className="w-3 h-3 me-1" />
                            {t('common.view', language)}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
