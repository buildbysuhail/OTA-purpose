// utils/dateFormatter.ts

import { format, Locale } from 'date-fns';
import { arSA, enUS, enIN } from 'date-fns/locale';
import { Countries } from '../../redux/slices/user-session/reducer';
import moment from 'moment';

// Step 1: Define supported locales
export type SupportedLocale = 'en-US' | 'ar-SA' | 'fr-FR' | 'de-DE' | 'hi-IN' | 'ms-MY';

// Step 2: Country-to-locale mapping
export const countryIdLocaleMap: Record<Countries, { jsLocale: SupportedLocale; dfLocale: Locale }> = {
  [Countries.Saudi]: { jsLocale: 'ar-SA', dfLocale: arSA },
  [Countries.India]:       { jsLocale: 'hi-IN', dfLocale: enIN },
  [Countries.Oman]:        { jsLocale: 'ar-SA', dfLocale: arSA },
  [Countries.Qatar]:       { jsLocale: 'ar-SA', dfLocale: arSA },
  [Countries.Kuwait]:      { jsLocale: 'ar-SA', dfLocale: arSA },
  [Countries.UAE]:         { jsLocale: 'ar-SA', dfLocale: arSA },
  [Countries.Malaysia]:    { jsLocale: 'ms-MY', dfLocale: enUS },
  [Countries.UnitedStates]:{ jsLocale: 'en-US', dfLocale: enUS },
};

// Step 3: Convert digits to localized script
export const toLocalizedDigits = (text: string, locale: string): string => {
  const formatter = new Intl.NumberFormat(locale, { useGrouping: false });
  return text.replace(/\d/g, d => formatter.format(Number(d)));
};

// Step 4: Options interface
export interface FormatDateOptions {
  formatStr?: string;             // Optional full format string like 'eeee، do MMMM yyyy'
  countryId?: Countries;          // Uses country ID to resolve locale
  localizeDigits?: boolean;       // Show Arabic digits, etc.
  separator?: string;             // Separator used in fallback format like '/', '-', '.'
  order?: 'DMY' | 'YMD' | 'MDY';  // Used if formatStr is not supplied
}

// Step 5: Build fallback format string from order
const buildFormatStr = (order: string, sep: string): string => {
  const parts = { D: 'dd', M: 'MM', Y: 'yyyy' };
  return order.split('').map(k => parts[k as keyof typeof parts]).join(sep);
};

// Step 6: Main formatting function
export const FormatDate = (
  date: Date | string,
  options?: FormatDateOptions
): string => {
  const {
    formatStr,
    countryId = Countries.UnitedStates,
    localizeDigits = false,
    separator = '/',
    order = 'DMY',
  } = options || {};

  const d = typeof date === 'string' ? moment(date).local().toDate() : date;

  debugger;
   if (isNaN(d.getTime())) {
    console.warn('Invalid date passed to formatDate:', date);
    return '';
  }

  // If valid date but missing time part (e.g., from a date-only string), apply a default time
  if (d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() === 0) {
    // Add default time: e.g., 10:00 AM
    d.setHours(10, 0, 0, 0);
  }
  debugger;
  const { jsLocale, dfLocale } = countryIdLocaleMap[countryId] ?? {
    jsLocale: 'en-US',
    dfLocale: enUS,
  };

  const formatToUse = formatStr ?? buildFormatStr(order, separator);

  let result = format(d, formatToUse, { locale: dfLocale });

  return localizeDigits ? toLocalizedDigits(result, jsLocale) : result;
};
