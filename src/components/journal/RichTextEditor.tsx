import { useEffect } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import clsx from "clsx";
import { faListOl, faListUl } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@/components/ui/IconButton";

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
      StarterKit.configure({
        blockquote: false,
        bold: false,
        code: false,
        codeBlock: false,
        heading: false,
        horizontalRule: false,
        italic: false,
        link: false,
        strike: false,
        underline: false,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "journal-rich-text min-h-[78px] text-[13px] text-ink-emphasis focus:outline-none",
      },
    },
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    autofocus: autoFocus ? "end" : false,
    onUpdate: ({ editor }) => {
      onChange(editor.getText().trim() ? editor.getHTML() : "");
    },
  });

  // Only fires for an external reset (e.g. clearing the draft after save) — typing
  // never sets `value` back to '' while the editor still has content.
  useEffect(() => {
    if (editor && value === "" && !editor.isEmpty) {
      editor.commands.clearContent();
    }
  }, [value, editor]);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isBulletList: ctx.editor?.isActive("bulletList") ?? false,
      isOrderedList: ctx.editor?.isActive("orderedList") ?? false,
    }),
  });

  return (
    <div
      className={clsx(
        "border-strong bg-input focus-within:border-accent rounded-[10px] border",
        className,
      )}
    >
      <div className="border-subtle flex items-center gap-1 border-b px-2 py-1">
        <IconButton
          icon={faListUl}
          label="Bulleted list"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={clsx(
            editorState?.isBulletList && "bg-accent-soft text-accent-soft-text",
          )}
        />
        <IconButton
          icon={faListOl}
          label="Numbered list"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={clsx(
            editorState?.isOrderedList &&
              "bg-accent-soft text-accent-soft-text",
          )}
        />
      </div>
      <EditorContent editor={editor} spellCheck className="px-3 py-[9px]" />
    </div>
  );
}

export function RichTextContent({
  html,
  className,
}: {
  html: string;
  className?: string;
}) {
  return (
    <div
      className={clsx("journal-rich-text", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
