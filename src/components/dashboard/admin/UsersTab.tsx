'use client';

import { motion } from 'framer-motion';
import { t } from '@/lib/i18n';
import type { Language, UserRole } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Search, Plus, Eye, Edit, Trash2 } from 'lucide-react';

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
};

const roleBadgeClass: Record<string, string> = {
  student: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  teacher: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  parent: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
  admin: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  owner: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
};

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: string;
  joinedAt: string;
}

interface UsersTabProps {
  language: Language;
  rtl: boolean;
  userSearch: string;
  setUserSearch: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  setAddUserOpen: (value: boolean) => void;
  filteredUsers: User[];
}

export function UsersTab({
  language,
  rtl,
  userSearch,
  setUserSearch,
  roleFilter,
  setRoleFilter,
  setAddUserOpen,
  filteredUsers,
}: UsersTabProps) {
  return (
    <div className="space-y-4 mt-4">
      {/* Search & Filter */}
      <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${rtl ? 'right-3' : 'left-3'}`} />
          <Input
            placeholder={t('common.search', language)}
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className={rtl ? 'pr-10' : 'pl-10'}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder={language === 'ar' ? 'الدور' : 'Role'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === 'ar' ? 'الكل' : 'All'}</SelectItem>
            <SelectItem value="student">{language === 'ar' ? 'طالب' : 'Student'}</SelectItem>
            <SelectItem value="teacher">{language === 'ar' ? 'معلم' : 'Teacher'}</SelectItem>
            <SelectItem value="parent">{language === 'ar' ? 'ولي أمر' : 'Parent'}</SelectItem>
            <SelectItem value="admin">{language === 'ar' ? 'مدير' : 'Admin'}</SelectItem>
          </SelectContent>
        </Select>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => setAddUserOpen(true)}>
          <Plus className="w-4 h-4 me-1.5" />
          {language === 'ar' ? 'إضافة مستخدم' : 'Add User'}
        </Button>
      </motion.div>

      {/* Users Table */}
      <motion.div variants={item}>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === 'ar' ? 'الاسم' : 'Name'}</TableHead>
                    <TableHead>{language === 'ar' ? 'البريد' : 'Email'}</TableHead>
                    <TableHead>{language === 'ar' ? 'الدور' : 'Role'}</TableHead>
                    <TableHead>{language === 'ar' ? 'الحالة' : 'Status'}</TableHead>
                    <TableHead>{language === 'ar' ? 'تاريخ الانضمام' : 'Joined'}</TableHead>
                    <TableHead className="text-end">{language === 'ar' ? 'إجراءات' : 'Actions'}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.name}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{u.email}</TableCell>
                      <TableCell>
                        <Badge className={`text-[10px] ${roleBadgeClass[u.role] || ''}`}>
                          {language === 'ar'
                            ? u.role === 'student' ? 'طالب' : u.role === 'teacher' ? 'معلم' : u.role === 'parent' ? 'ولي أمر' : u.role === 'admin' ? 'مدير' : 'مالك'
                            : u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.status === 'active' ? 'default' : 'secondary'} className={`text-[10px] ${u.status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30' : 'bg-gray-100 text-gray-500'}`}>
                          {u.status === 'active' ? (language === 'ar' ? 'نشط' : 'Active') : (language === 'ar' ? 'غير نشط' : 'Inactive')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{u.joinedAt}</TableCell>
                      <TableCell className="text-end">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="w-7 h-7"><Eye className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="w-7 h-7"><Edit className="w-3.5 h-3.5" /></Button>
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                        </div>
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
