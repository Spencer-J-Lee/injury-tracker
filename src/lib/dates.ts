import {
  format,
  formatDistanceToNow,
  subDays,
  isAfter,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const formattedDate = format(date, "MMM d, yyyy");
  const day = isToday(date)
    ? `Today • ${formattedDate}`
    : isYesterday(date)
      ? `Yesterday • ${formattedDate}`
      : formattedDate;
  return `${day} • ${format(date, "h:mm a")}`;
}

export function formatFullDate(isoDate: string): string {
  const date = parseISO(isoDate);
  const formattedDate = format(date, "EEEE, MMMM d, yyyy");
  if (isToday(date)) return `Today • ${formattedDate}`;
  if (isYesterday(date)) return `Yesterday • ${formattedDate}`;
  return formattedDate;
}

export function formatShortDate(iso: string): string {
  return format(new Date(iso), "MMM d");
}

export function formatRelative(iso: string): string {
  return formatDistanceToNow(new Date(iso), { addSuffix: true });
}

export function toDatetimeLocalValue(iso: string): string {
  const date = new Date(iso);
  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}

export function fromDatetimeLocalValue(value: string): string {
  return new Date(value).toISOString();
}

export type TrendRange = "7d" | "30d" | "90d" | "all";

export function isWithinRange(iso: string, range: TrendRange): boolean {
  if (range === "all") return true;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  return isAfter(new Date(iso), subDays(new Date(), days));
}
