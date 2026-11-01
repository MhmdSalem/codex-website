import { Fragment } from "react";

/**
 * Renders `*marked*` fragments of a headline in the accent colour.
 *
 * A convention rather than a rich-text field: a headline arrives as one string
 * from the CMS or the message catalogue, and this is the smallest thing that
 * lets an editor choose which words carry the colour without being handed a
 * field that could also hand back a heading inside a heading.
 *
 * Keep punctuation that belongs to the marked phrase *inside* the markers. Text
 * left outside is its own node and a line can break between the two.
 */
export function withAccent(text: string) {
  // Odd indices are the captured groups — the fragments between the markers.
  return text.split(/\*([^*]+)\*/g).map((part, index) =>
    index % 2 === 1 ? (
      <span key={index} className="text-accent-text">
        {part}
      </span>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
