/**
 * Formatting utilities for numbers, currencies, Jalali dates, and contact names.
 * All formatting utilizes standard Intl APIs for Persian (fa-IR) locale.
 */

const faNumberFormatter = new Intl.NumberFormat('fa-IR', {
  useGrouping: true,
});

const faJalaliDateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

const faJalaliDateTimeFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

/**
 * Formats a number with Persian digits and thousands separators.
 * Example: 1250000 -> "۱٬۲۵۰٬۰۰۰"
 */
export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '۰';
  const numeric = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numeric)) return '۰';
  return faNumberFormatter.format(numeric);
}

/**
 * Formats an amount with Persian digits, grouping, and currency label.
 * Defaults to 'IRR' ('ریال').
 * Example: 5000000 -> "۵٬۰۰۰٬۰۰۰ ریال"
 */
export function formatMoney(
  amount: number | string | null | undefined,
  currency = 'IRR'
): string {
  const formattedNum = formatNumber(amount);
  const currencyLabel = currency === 'IRR' ? 'ریال' : currency;
  return `${formattedNum} ${currencyLabel}`;
}

/**
 * Formats a Gregorian/ISO date string or timestamp into a Jalali (Persian) date string.
 * Example: "2026-10-19" -> Jalali date string
 */
export function formatDate(
  dateInput: string | number | Date | null | undefined,
  includeTime = false
): string {
  if (!dateInput) return '-';

  try {
    const d = typeof dateInput === 'object' && dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (Number.isNaN(d.getTime())) return '-';

    return includeTime ? faJalaliDateTimeFormatter.format(d) : faJalaliDateFormatter.format(d);
  } catch {
    return '-';
  }
}

/**
 * Generates the full name of a contact, properly joined and trimmed.
 */
export function fullName(
  contact: { firstName?: string | null; lastName?: string | null } | null | undefined
): string {
  if (!contact) return '-';
  const parts = [contact.firstName, contact.lastName].filter(
    (part): part is string => typeof part === 'string' && part.trim().length > 0
  );
  return parts.length > 0 ? parts.join(' ').trim() : '-';
}
