import type { PositionItem, DepartmentItem } from '../api/dashboard';

const persianNumberFormatter = new Intl.NumberFormat('fa-IR', {
  useGrouping: true,
});

const persianDateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

const persianDateTimeFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatPersianNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === '') return '۰';
  const numeric = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numeric)) return '۰';
  return persianNumberFormatter.format(numeric);
}

export function formatPersianDate(
  dateInput: string | number | Date | null | undefined,
  includeTime = false
): string {
  if (!dateInput) return '-';
  try {
    const d = typeof dateInput === 'object' && dateInput instanceof Date ? dateInput : new Date(dateInput);
    if (Number.isNaN(d.getTime())) return '-';
    return includeTime ? persianDateTimeFormatter.format(d) : persianDateFormatter.format(d);
  } catch {
    return '-';
  }
}

export function percent(part: number, total: number): number {
  if (!total || total <= 0 || !part || part <= 0) return 0;
  const val = Math.round((part / total) * 100);
  return Math.min(Math.max(val, 0), 100);
}

export interface DepartmentPositionGroup {
  departmentId: number | string | null;
  departmentTitle: string;
  positions: PositionItem[];
  count: number;
  percent: number;
}

export function groupPositionsByDepartment(
  positions: PositionItem[],
  departments: DepartmentItem[],
  unassignedLabel = 'بدون واحد سازمانی'
): DepartmentPositionGroup[] {
  if (!positions || positions.length === 0) return [];

  const deptMap = new Map<number | string, string>();
  for (const dept of departments) {
    deptMap.set(dept.id, dept.title);
  }

  const groupsMap = new Map<string, { departmentId: number | string | null; positions: PositionItem[] }>();

  for (const pos of positions) {
    const deptId = pos.departmentId ?? null;
    const title = deptId !== null && deptMap.has(deptId) ? deptMap.get(deptId)! : unassignedLabel;

    if (!groupsMap.has(title)) {
      groupsMap.set(title, { departmentId: deptId, positions: [] });
    }
    groupsMap.get(title)!.positions.push(pos);
  }

  const total = positions.length;
  const groups: DepartmentPositionGroup[] = [];

  for (const [departmentTitle, data] of groupsMap.entries()) {
    const count = data.positions.length;
    groups.push({
      departmentId: data.departmentId,
      departmentTitle,
      positions: data.positions,
      count,
      percent: percent(count, total),
    });
  }

  groups.sort((a, b) => b.count - a.count);
  return groups;
}
