import { cn } from "@/lib/utils";
import { richTextClassName } from "@/components/richText/richTextStyles";

/** Tiptap emits an empty paragraph for a cleared editor — treat it as no content. */
export const isRichTextEmpty = (html: string | null | undefined): boolean =>
  !html || html.replace(/<[^>]*>/g, "").trim() === "";

/** Read-only rendering of rich-text HTML authored with the notes editor. */
export default function RichTextContent({
  html,
  placeholder,
  className,
}: {
  html: string | null;
  placeholder: string;
  className?: string;
}) {
  if (isRichTextEmpty(html)) {
    return <p className="text-sm italic leading-relaxed text-muted-foreground">{placeholder}</p>;
  }

  return (
    <div className={cn(richTextClassName, className)} dangerouslySetInnerHTML={{ __html: html! }} />
  );
}
