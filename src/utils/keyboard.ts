// Sheet-wide keyboard chords are strictly Ctrl (never Cmd — Cmd+letter must keep
// its browser/macOS meaning, e.g. Cmd+Q quits). Pick letters that neither Chrome,
// macOS text fields (emacs bindings: Ctrl+A/E/F/B/N/P/K…), ProseMirror nor Tiptap
// bind: Q → notes editor, S → sheet fullscreen.
export const isCtrlChord = (e: KeyboardEvent, letter: string) =>
  e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === letter;

// Single-key shortcuts (no modifier): N → notes editor. Plain letters are unbound in
// browsers, but they are text, so they must never fire while the user is typing.
export const isTypingTarget = (target: EventTarget | null) => {
  const element = target as HTMLElement | null;
  return (
    element?.tagName === "INPUT" ||
    element?.tagName === "TEXTAREA" ||
    element?.tagName === "SELECT" ||
    !!element?.isContentEditable
  );
};

export const isPlainKey = (e: KeyboardEvent, letter: string) =>
  !e.ctrlKey &&
  !e.metaKey &&
  !e.altKey &&
  !e.shiftKey &&
  !e.repeat &&
  e.key.toLowerCase() === letter &&
  !isTypingTarget(e.target);
