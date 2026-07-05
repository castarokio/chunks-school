'use client';

import { Check, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppStore } from '@/lib/store';
import type { Language } from '@/lib/types';

const languages: { code: Language; label: string; short: string }[] = [
  { code: 'ar', label: 'العربية', short: 'AR' },
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'fr', label: 'Français', short: 'FR' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useAppStore();

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-foreground hover:bg-secondary"
          aria-label="Change Language"
        >
          <Globe className="size-4" aria-hidden="true" />
          <span className="text-sm font-bold">{currentLang.short}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer gap-2 ${language === lang.code ? 'bg-secondary text-primary' : ''}`}
          >
            <span className="rounded bg-muted px-1.5 py-0.5 text-xs font-black">{lang.short}</span>
            <span className="font-medium">{lang.label}</span>
            {language === lang.code && (
              <Check className="ms-auto size-4 text-primary" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
