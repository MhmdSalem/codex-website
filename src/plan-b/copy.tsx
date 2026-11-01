import type { ReactNode } from "react";

/**
 * Renders `*marked*` fragments of a string in the accent.
 *
 * A convention rather than a rich-text field: a headline arrives as one string
 * from the message catalogue, and this is the smallest thing that lets whoever
 * writes it choose which words carry the colour. Keep punctuation that belongs
 * to the marked phrase inside the markers — text left outside is its own node,
 * and a line can break between the two.
 */
export function accent(text: string): ReactNode[] {
  // Odd indices are the captured groups: the fragments between the markers.
  return text.split(/\*([^*]+)\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="text-accent-text">
        {part}
      </span>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
}
