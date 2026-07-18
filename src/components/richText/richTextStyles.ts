/**
 * Shared typography for rich-text HTML produced by the Tiptap editor.
 * Applied both to the editable ProseMirror surface and to the read-only
 * rendering (Bio tab) so notes look identical in both places.
 */
export const richTextClassName = [
  "text-sm leading-relaxed text-foreground/90",
  "[&_h1]:mb-2 [&_h1]:mt-4 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-foreground [&_h1:first-child]:mt-0",
  "[&_h2]:mb-1.5 [&_h2]:mt-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-foreground [&_h2:first-child]:mt-0",
  "[&_h3]:mb-1 [&_h3]:mt-2.5 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3:first-child]:mt-0",
  "[&_p]:my-1",
  "[&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5",
  "[&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5",
  "[&_li>p]:my-0",
  "[&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground",
  "[&_hr]:my-3 [&_hr]:border-border",
  "[&_a]:text-sky-400 [&_a]:underline [&_a]:underline-offset-2",
  "[&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs",
  "[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted [&_pre]:p-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0",
  "[&_strong]:font-bold [&_strong]:text-foreground",
].join(" ");
