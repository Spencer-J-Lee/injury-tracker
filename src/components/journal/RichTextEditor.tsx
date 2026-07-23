import { useEffect, useRef, useState, type FormEvent } from "react";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import clsx from "clsx";
import {
  faLink,
  faLinkSlash,
  faListOl,
  faListUl,
} from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

// Prepend https:// to bare URLs (e.g. "example.com") while leaving explicit
// schemes (mailto:, tel:, http:, etc.) untouched.
function normalizeUrl(url: string) {
  return /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}`;
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
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
        protocols: ["http", "https", "mailto", "tel"],
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "journal-rich-text min-h-20 text-ink-emphasis focus:outline-none",
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
      isLink: ctx.editor?.isActive("link") ?? false,
    }),
  });

  const [linkMenuOpen, setLinkMenuOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const linkMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!linkMenuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!linkMenuRef.current?.contains(event.target as Node)) {
        setLinkMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLinkMenuOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [linkMenuOpen]);

  function openLinkMenu() {
    setLinkUrl(editor?.getAttributes("link").href ?? "");
    setLinkMenuOpen(true);
  }

  function applyLink(event: FormEvent) {
    event.preventDefault();
    const url = linkUrl.trim();
    if (url) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: normalizeUrl(url) })
        .run();
    } else {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    setLinkMenuOpen(false);
  }

  function removeLink() {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkMenuOpen(false);
  }

  return (
    <div
      className={clsx(
        "border-strong bg-input focus-within:border-accent rounded-xl border",
        className,
      )}
    >
      <div className="border-subtle flex items-center gap-1 border-b px-2.5 py-1.5">
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
        <div className="relative" ref={linkMenuRef}>
          <IconButton
            icon={faLink}
            label="Insert link"
            onClick={() =>
              linkMenuOpen ? setLinkMenuOpen(false) : openLinkMenu()
            }
            className={clsx(
              editorState?.isLink && "bg-accent-soft text-accent-soft-text",
            )}
          />
          {linkMenuOpen && (
            <div className="border-subtle bg-surface-raised absolute top-full left-0 z-10 mt-1 flex w-80 items-center gap-1 rounded-lg border p-3 shadow-lg">
              <form onSubmit={applyLink} className="flex flex-1 gap-3">
                <Input
                  autoFocus
                  type="text"
                  inputMode="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="px-3 py-2"
                />
                <Button type="submit" size="sm" className="shrink-0">
                  {editorState?.isLink ? "Update" : "Add"}
                </Button>
              </form>
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
