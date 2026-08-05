import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import clsx from 'clsx';
import {
  faBold,
  faLink,
  faLinkSlash,
  faListCheck,
  faListOl,
  faListUl,
} from '@fortawesome/free-solid-svg-icons';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

// Prepend https:// to bare URLs (e.g. "example.com") while leaving explicit
// schemes (mailto:, tel:, http:, etc.) untouched.
function normalizeUrl(url: string) {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`;
}

// The stock TaskItem node view never re-binds its checkbox "change" listener
// after the first toggle, so it keeps closing over the pre-toggle `node`
// reference. `onReadOnlyChecked` only receives that stale node (no position),
// which works once but can't locate the node in the doc on later clicks. This
// variant reads the position fresh via `getPos()` on every click instead.
const ReadOnlyTaskItem = TaskItem.extend({
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

// Shared between the editable and read-only editors below so their schemas
// can't drift apart — content saved by one must always parse the same way in
// the other.
const richTextStarterKit = StarterKit.configure({
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

function richTextLink(openOnClick: boolean) {
  return Link.configure({
    openOnClick,
    autolink: true,
    linkOnPaste: true,
    defaultProtocol: 'https',
    protocols: ['http', 'https', 'mailto', 'tel'],
    HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
  });
}

const editableTaskItem = TaskItem.configure({ nested: true });
const readOnlyTaskItem = ReadOnlyTaskItem.configure({ nested: true });
const editableLink = richTextLink(false);
const readOnlyLink = richTextLink(true);

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Descriptions saved before rich text was introduced are plain strings (with
// literal newlines/"&"/"<") rather than HTML — detect and convert them so old
// data doesn't get mis-parsed as markup or lose its line breaks.
function toEditorHtml(value: string) {
  if (!value || /<[a-z][\s\S]*>/i.test(value)) return value;
  return value
    .split(/\n{2,}/)
    .map(
      (paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, '<br>')}</p>`,
    )
    .join('');
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  autoFocus,
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      richTextStarterKit,
      Placeholder.configure({ placeholder }),
      TaskList,
      editableTaskItem,
      editableLink,
    ],
    content: toEditorHtml(value),
    editorProps: {
      attributes: {
        class:
          'journal-rich-text min-h-20 text-ink-emphasis focus:outline-none',
      },
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    autofocus: autoFocus ? 'end' : false,
    onUpdate: ({ editor }) => {
      onChange(editor.getText().trim() ? editor.getHTML() : '');
    },
  });

  // Only fires for an external reset (e.g. clearing the draft after save) — typing
  // never sets `value` back to '' while the editor still has content.
  useEffect(() => {
    if (editor && value === '' && !editor.isEmpty) {
      editor.commands.clearContent();
    }
  }, [value, editor]);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor?.isActive('bold') ?? false,
      isBulletList: ctx.editor?.isActive('bulletList') ?? false,
      isOrderedList: ctx.editor?.isActive('orderedList') ?? false,
      isTaskList: ctx.editor?.isActive('taskList') ?? false,
      isLink: ctx.editor?.isActive('link') ?? false,
    }),
  });

  const [linkMenuOpen, setLinkMenuOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const linkMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!linkMenuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!linkMenuRef.current?.contains(event.target as Node)) {
        setLinkMenuOpen(false);
      }
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setLinkMenuOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [linkMenuOpen]);

  function openLinkMenu() {
    setLinkUrl(editor?.getAttributes('link').href ?? '');
    setLinkMenuOpen(true);
  }

  function applyLink() {
    const url = linkUrl.trim();
    if (url) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: normalizeUrl(url) })
        .run();
    } else {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    }
    setLinkMenuOpen(false);
  }

  function removeLink() {
    editor?.chain().focus().extendMarkRange('link').unsetLink().run();
    setLinkMenuOpen(false);
  }

  return (
    <div
      className={clsx(
        'border-strong bg-input focus-within:border-accent rounded-xl border',
        className,
      )}
    >
      <div className="border-subtle flex items-center gap-1 border-b px-2.5 py-1.5">
        <IconButton
          icon={faBold}
          label="Bold"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={clsx(
            editorState?.isBold && 'bg-accent-soft text-accent-soft-text',
          )}
        />
        <IconButton
          icon={faListUl}
          label="Bulleted list"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={clsx(
            editorState?.isBulletList && 'bg-accent-soft text-accent-soft-text',
          )}
        />
        <IconButton
          icon={faListOl}
          label="Numbered list"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={clsx(
            editorState?.isOrderedList &&
              'bg-accent-soft text-accent-soft-text',
          )}
        />
        <IconButton
          icon={faListCheck}
          label="Checklist"
          onClick={() => editor?.chain().focus().toggleTaskList().run()}
          className={clsx(
            editorState?.isTaskList && 'bg-accent-soft text-accent-soft-text',
          )}
        />
        <div className="relative" ref={linkMenuRef}>
          <IconButton
            icon={faLink}
            label="Insert link"
            onClick={() =>
              linkMenuOpen ? setLinkMenuOpen(false) : openLinkMenu()
            }
            className={clsx(
              editorState?.isLink && 'bg-accent-soft text-accent-soft-text',
            )}
          />
          {linkMenuOpen && (
            <div className="border-subtle bg-surface-raised absolute top-full left-0 z-10 mt-1 flex w-80 items-center gap-1 rounded-lg border p-3 shadow-lg">
              <div className="flex flex-1 gap-3">
                <Input
                  autoFocus
                  type="text"
                  inputMode="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      applyLink();
                    }
                  }}
                  placeholder="https://example.com"
                  className="px-3 py-2"
                />
                <Button
                  type="button"
                  size="sm"
                  className="shrink-0"
                  onClick={applyLink}
                >
                  {editorState?.isLink ? 'Update' : 'Add'}
                </Button>
              </div>
              {editorState?.isLink && (
                <IconButton
                  icon={faLinkSlash}
                  label="Remove link"
                  tone="danger"
                  onClick={removeLink}
                />
              )}
            </div>
          )}
        </div>
      </div>
      <EditorContent editor={editor} spellCheck className="px-4 py-3" />
    </div>
  );
}

export function RichTextContent({
  html,
  className,
  onChange,
}: {
  html: string;
  className?: string;
  onChange?: (html: string) => void;
}) {
  const lastEmittedHtml = useRef<string | null>(null);

  const editor = useEditor({
    extensions: [
      richTextStarterKit,
      TaskList,
      readOnlyTaskItem,
      readOnlyLink,
    ],
    content: toEditorHtml(html),
    editable: false,
    editorProps: {
      attributes: { class: 'journal-rich-text' },
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    onUpdate: ({ editor }) => {
      const nextHtml = editor.getHTML();
      lastEmittedHtml.current = nextHtml;
      onChange?.(nextHtml);
    },
  });

  useEffect(() => {
    if (!editor) return;
    const nextHtml = toEditorHtml(html);
    if (nextHtml === lastEmittedHtml.current) return;
    editor.commands.setContent(nextHtml);
  }, [html, editor]);

  return <EditorContent editor={editor} className={className} />;
}
