import {
  addDays,
  eachDayOfInterval,
  format,
  parseISO,
  startOfWeek,
  subDays,
} from "date-fns";

const DATE_FORMAT = "yyyy-MM-dd";

export function getWeekStart(dateStr: string): string {
  return format(
    startOfWeek(parseISO(dateStr), { weekStartsOn: 0 }),
    DATE_FORMAT,
  );
}

export function get4DayWindowStart(dateStr: string): string {
  return format(subDays(parseISO(dateStr), 2), DATE_FORMAT);
}

export function getWindowEnd(windowStartStr: string, size: number): string {
  return format(addDays(parseISO(windowStartStr), size - 1), DATE_FORMAT);
}

export function getWindowDates(windowStartStr: string, size: number): string[] {
  const start = parseISO(windowStartStr);
  return eachDayOfInterval({ start, end: addDays(start, size - 1) }).map(
    (date) => format(date, DATE_FORMAT),
  );
}

export function getPreviousWindowStart(
  windowStartStr: string,
  size: number,
): string {
  return format(subDays(parseISO(windowStartStr), size), DATE_FORMAT);
}

export function getNextWindowStart(
  windowStartStr: string,
  size: number,
): string {
  return format(addDays(parseISO(windowStartStr), size), DATE_FORMAT);
}

export function formatWindowRangeLabel(
  windowStartStr: string,
  size: number,
): string {
  const start = parseISO(windowStartStr);
  const end = addDays(start, size - 1);
  const sameYear = format(start, "yyyy") === format(end, "yyyy");
  const startLabel = format(start, sameYear ? "MMM d" : "MMM d, yyyy");
  const endLabel = format(end, "MMM d, yyyy");
  return `${startLabel} – ${endLabel}`;
}

export function getTodayDateString(): string {
  return format(new Date(), DATE_FORMAT);
}
