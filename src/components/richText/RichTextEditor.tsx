"use client";

import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { ElementType, ReactNode } from "react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { richTextClassName } from "@/components/richText/richTextStyles";

const isMac = typeof navigator !== "undefined" && /Mac|iP(hone|ad|od)/.test(navigator.userAgent);

const KEY_LABELS: Record<string, [mac: string, pc: string]> = {
  Mod: ["⌘", "Ctrl"],
  Alt: ["⌥", "Alt"],
  Shift: ["⇧", "Maj"],
};

/** "Mod-Alt-1" → "⌘⌥1" on Mac, "Ctrl + Alt + 1" elsewhere. */
const formatShortcut = (shortcut: string) =>
  shortcut
    .split("-")
    .map((key) => KEY_LABELS[key]?.[isMac ? 0 : 1] ?? key.toUpperCase())
    .join(isMac ? "" : " + ");

/** Tooltip showing the control's name and, when it has one, its keyboard shortcut. */
function ToolbarTooltip({
  label,
  shortcut,
  children,
}: {
  label: string;
  shortcut?: string;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="flex items-center gap-2 text-xs">
        {label}
        {shortcut && (
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-sans text-tiny text-muted-foreground">
            {formatShortcut(shortcut)}
          </kbd>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

function ToolbarToggle({
  icon: Icon,
  label,
  shortcut,
  pressed,
  onPressedChange,
}: {
  icon: ElementType;
  label: string;
  shortcut?: string;
  pressed: boolean;
  onPressedChange: () => void;
}) {
  return (
    <ToolbarTooltip label={label} shortcut={shortcut}>
      <Toggle size="sm" aria-label={label} pressed={pressed} onPressedChange={onPressedChange}>
        <Icon />
      </Toggle>
    </ToolbarTooltip>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <TooltipProvider delayDuration={350}>
      <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 p-1.5">
        <ToolbarToggle
          icon={Bold}
          label="Gras"
          shortcut="Mod-B"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
        />
        <ToolbarToggle
          icon={Italic}
          label="Italique"
          shortcut="Mod-I"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        />
        <ToolbarToggle
          icon={Underline}
          label="Souligné"
          shortcut="Mod-U"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
        />
        <ToolbarToggle
          icon={Strikethrough}
          label="Barré"
          shortcut="Mod-Shift-S"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        />

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarToggle
          icon={Heading1}
          label="Titre 1"
          shortcut="Mod-Alt-1"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        />
        <ToolbarToggle
          icon={Heading2}
          label="Titre 2"
          shortcut="Mod-Alt-2"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        />
        <ToolbarToggle
          icon={Heading3}
          label="Titre 3"
          shortcut="Mod-Alt-3"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        />

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarToggle
          icon={List}
          label="Liste à puces"
          shortcut="Mod-Shift-8"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        />
        <ToolbarToggle
          icon={ListOrdered}
          label="Liste numérotée"
          shortcut="Mod-Shift-7"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        />
        <ToolbarToggle
          icon={Quote}
          label="Citation"
          shortcut="Mod-Shift-B"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        />
        <ToolbarTooltip label="Séparateur">
          <Button
            variant="ghost"
            size="sm"
            className="min-w-9 px-2.5"
            aria-label="Séparateur"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <Minus />
          </Button>
        </ToolbarTooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarTooltip label="Annuler" shortcut="Mod-Z">
          <Button
            variant="ghost"
            size="sm"
            className="min-w-9 px-2.5"
            aria-label="Annuler"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo2 />
          </Button>
        </ToolbarTooltip>
        <ToolbarTooltip label="Rétablir" shortcut="Mod-Shift-Z">
          <Button
            variant="ghost"
            size="sm"
            className="min-w-9 px-2.5"
            aria-label="Rétablir"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo2 />
          </Button>
        </ToolbarTooltip>
      </div>
    </TooltipProvider>
  );
}

/** Tiptap editor emitting HTML on every change. `content` is only read on mount. */
export default function RichTextEditor({
  content,
  onChange,
  className,
}: {
  content: string;
  onChange: (html: string) => void;
  className?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Placeholder.configure({ placeholder: "Prenez vos notes ici…" }),
    ],
    content,
    immediatelyRender: false,
    shouldRerenderOnTransaction: true,
    editorProps: {
      attributes: {
        class: cn("h-full min-h-full focus:outline-none", richTextClassName),
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-xl border border-border", className)}>
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="min-h-0 flex-1 cursor-text overflow-y-auto p-4 [&>div]:h-full"
        onClick={() => editor.chain().focus().run()}
      />
    </div>
  );
}
