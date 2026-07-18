// Sheet-wide keyboard chords are strictly Ctrl (never Cmd — Cmd+letter must keep
// its browser/macOS meaning, e.g. Cmd+Q quits). Pick letters that neither Chrome,
// macOS text fields (emacs bindings: Ctrl+A/E/F/B/N/P/K…), ProseMirror nor Tiptap
// bind: Q → notes editor, S → sheet fullscreen.
export const isCtrlChord = (e: KeyboardEvent, letter: string) =>
  e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === letter;
