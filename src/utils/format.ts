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

export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '۰';
  const numeric = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numeric)) return '۰';
  return faNumberFormatter.format(numeric);
}

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
