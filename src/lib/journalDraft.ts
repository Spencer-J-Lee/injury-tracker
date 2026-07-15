const KEY = "journal:draft";

export function getJournalDraft(): string {
  return localStorage.getItem(KEY) ?? "";
}

export function setJournalDraft(draft: string) {
  if (draft.trim().length === 0) {
    localStorage.removeItem(KEY);
  } else {
    localStorage.setItem(KEY, draft);
  }
}
