// Legacy entries were saved as plain text from a plain textarea, before rich text
// support existed — they never start with a tag, so this tells the two apart.
export function isRichTextHtml(text: string): boolean {
  return /^\s*</.test(text);
}
