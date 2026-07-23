const KEY = "strengthening:guidelines-ack-date";

export function getGuidelinesAckDate(): string | null {
  return localStorage.getItem(KEY);
}

export function setGuidelinesAckDate(date: string) {
  localStorage.setItem(KEY, date);
}
