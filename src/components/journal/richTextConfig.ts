import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { TaskItem } from '@tiptap/extension-task-item';

// Prepend https:// to bare URLs (e.g. "example.com") while leaving explicit
// schemes (mailto:, tel:, http:, etc.) untouched.
export function normalizeUrl(url: string) {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`;
}

// The stock TaskItem node view never re-binds its checkbox "change" listener
// after the first toggle, so it keeps closing over the pre-toggle `node`
// reference. `onReadOnlyChecked` only receives that stale node (no position),
// which works once but can't locate the node in the doc on later clicks. This
// variant reads the position fresh via `getPos()` on every click instead.
export const ReadOnlyTaskItem = TaskItem.extend({
  addNodeView() {
    return ({ node, HTMLAttributes, getPos, editor }) => {
      const listItem = document.createElement('li');
      const checkboxWrapper = document.createElement('label');
      const checkboxStyler = document.createElement('span');
      const checkbox = document.createElement('input');
      const content = document.createElement('div');

      checkboxWrapper.contentEditable = 'false';
      checkbox.type = 'checkbox';
      checkbox.addEventListener('mousedown', (event) => event.preventDefault());
      checkbox.addEventListener('change', () => {
        const checked = checkbox.checked;
        const pos = typeof getPos === 'function' ? getPos() : undefined;
        const currentNode =
          typeof pos === 'number' ? editor.state.doc.nodeAt(pos) : undefined;
        if (typeof pos !== 'number' || !currentNode) {
          checkbox.checked = !checkbox.checked;
          return;
        }
        editor.view.dispatch(
          editor.state.tr.setNodeMarkup(pos, undefined, {
            ...currentNode.attrs,
            checked,
          }),
        );
      });

      Object.entries(this.options.HTMLAttributes).forEach(([key, value]) => {
        listItem.setAttribute(key, value);
      });
      listItem.dataset.checked = node.attrs.checked;
      checkbox.checked = node.attrs.checked;
      checkboxWrapper.append(checkbox, checkboxStyler);
      listItem.append(checkboxWrapper, content);
      Object.entries(HTMLAttributes).forEach(([key, value]) => {
        listItem.setAttribute(key, value);
      });

      return {
        dom: listItem,
        contentDOM: content,
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) return false;
          listItem.dataset.checked = updatedNode.attrs.checked;
          checkbox.checked = updatedNode.attrs.checked;
          return true;
        },
      };
    };
  },
});

// Shared between the editable and read-only editors so their schemas can't
// drift apart — content saved by one must always parse the same way in the
// other.
export const richTextStarterKit = StarterKit.configure({
  blockquote: false,
  code: false,
  codeBlock: false,
  heading: false,
  horizontalRule: false,
  italic: false,
  link: false,
  strike: false,
  underline: false,
});

export function richTextLink(openOnClick: boolean) {
  return Link.configure({
    openOnClick,
    autolink: true,
    linkOnPaste: true,
    defaultProtocol: 'https',
    protocols: ['http', 'https', 'mailto', 'tel'],
    HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
  });
}

export const editableTaskItem = TaskItem.configure({ nested: true });
export const readOnlyTaskItem = ReadOnlyTaskItem.configure({ nested: true });
export const editableLink = richTextLink(false);
export const readOnlyLink = richTextLink(true);

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Descriptions saved before rich text was introduced are plain strings (with
// literal newlines/"&"/"<") rather than HTML — detect and convert them so old
// data doesn't get mis-parsed as markup or lose its line breaks.
export function toEditorHtml(value: string) {
  if (!value || /<[a-z][\s\S]*>/i.test(value)) return value;
  return value
    .split(/\n{2,}/)
    .map(
      (paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`,
    )
    .join('');
}
