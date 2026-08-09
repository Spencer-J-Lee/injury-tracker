import { useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { TaskList } from '@tiptap/extension-task-list';
import {
  richTextStarterKit,
  readOnlyTaskItem,
  readOnlyLink,
  toEditorHtml,
} from '@/components/journal/richTextConfig';

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
    extensions: [richTextStarterKit, TaskList, readOnlyTaskItem, readOnlyLink],
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
