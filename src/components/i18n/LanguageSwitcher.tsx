/**
 * Language Switcher Component
 * Dropdown menu for selecting from 11 supported languages
 */

import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SUPPORTED_LOCALES,
  type SupportedLocale,
  getLocaleConfig,
} from '@/config/i18n.config';
import { changeLanguage, getCurrentLanguage } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact' | 'footer';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className }: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const currentLocale = getCurrentLanguage();
  const currentConfig = getLocaleConfig(currentLocale);

  const handleLanguageChange = async (locale: SupportedLocale) => {
    setIsOpen(false);
    await changeLanguage(locale);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={variant === 'compact' ? 'icon' : 'sm'}
          className={cn(
            'text-white/90 hover:text-gold hover:bg-gold/10 gap-2',
            variant === 'footer' && 'text-white/60 hover:text-white',
            className
          )}
        >
          <Globe className="h-4 w-4" />
          {variant !== 'compact' && (
            <>
              <span className="hidden md:inline">{currentConfig.flag}</span>
              <span className="hidden md:inline">{currentConfig.code.toUpperCase()}</span>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-charcoal border-gold/20"
      >
        <ScrollArea className="h-80">
          <div className="p-2">
            <p className="px-2 py-1.5 text-xs font-medium text-white/50">
              Select Language
            </p>
            {SUPPORTED_LOCALES.map((locale) => (
              <DropdownMenuItem
                key={locale.code}
                onClick={() => handleLanguageChange(locale.code)}
                className={cn(
                  'flex items-center gap-3 px-2 py-2 cursor-pointer rounded-md',
                  'text-white hover:bg-gold/10 focus:bg-gold/10',
                  i18n.language === locale.code && 'bg-gold/5'
                )}
              >
                <span className="text-lg">{locale.flag}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{locale.nativeLabel}</p>
                  <p className="text-xs text-white/50">{locale.label}</p>
                </div>
                {i18n.language === locale.code && (
                  <Check className="h-4 w-4 text-gold" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
