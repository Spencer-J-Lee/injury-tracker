import {
  addDays,
  addWeeks,
  eachDayOfInterval,
  format,
  parseISO,
  startOfWeek,
  subWeeks,
} from "date-fns";

const DATE_FORMAT = "yyyy-MM-dd";

export function getWeekStart(dateStr: string): string {
  return format(
    startOfWeek(parseISO(dateStr), { weekStartsOn: 0 }),
    DATE_FORMAT,
  );
}

export function getWeekEnd(weekStartStr: string): string {
  return format(addDays(parseISO(weekStartStr), 6), DATE_FORMAT);
}

export function getWeekDates(weekStartStr: string): string[] {
  const start = parseISO(weekStartStr);
  return eachDayOfInterval({ start, end: addDays(start, 6) }).map((date) =>
    format(date, DATE_FORMAT),
  );
}

export function getPreviousWeekStart(weekStartStr: string): string {
  return format(subWeeks(parseISO(weekStartStr), 1), DATE_FORMAT);
}

export function getNextWeekStart(weekStartStr: string): string {
  return format(addWeeks(parseISO(weekStartStr), 1), DATE_FORMAT);
}

export function formatWeekRangeLabel(weekStartStr: string): string {
  const start = parseISO(weekStartStr);
  const end = addDays(start, 6);
  const sameYear = format(start, "yyyy") === format(end, "yyyy");
  const startLabel = format(start, sameYear ? "MMM d" : "MMM d, yyyy");
  const endLabel = format(end, "MMM d, yyyy");
  return `${startLabel} – ${endLabel}`;
}

export function getTodayDateString(): string {
  return format(new Date(), DATE_FORMAT);
}
