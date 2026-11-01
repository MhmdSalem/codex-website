import type { Social } from "@/content/contact";
import { cn } from "@/lib/utils";

/**
 * Account marks, drawn as the same thin line as the rest of the chrome.
 *
 * Not icons-in-circles: a row of identical discs is a template, and these
 * accounts are two specific places, not a generic "follow us" strip. The
 * accessible name is the platform; the drawing is just the way there.
 */
export function SocialLinks({
  socials,
  className,
}: {
  socials: readonly Social[];
  className?: string;
}) {
  return (
    <ul className={cn("flex items-center gap-3", className)}>
      {socials.map((social) => (
        <li key={social.url}>
          <a
            href={social.url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={social.label}
            className={cn(
              "inline-flex size-10 items-center justify-center text-muted",
              "transition-colors duration-[var(--duration-fast)]",
              "hover:text-foreground",
            )}
          >
            <SocialGlyph platform={social.platform} />
          </a>
        </li>
      ))}
    </ul>
  );
}

function SocialGlyph({ platform }: { platform: string }) {
  switch (platform) {
    case "instagram":
      return <InstagramMark />;
    case "facebook":
      return <FacebookMark />;
    default:
      return <span className="font-mono text-micro uppercase">{platform.slice(0, 2)}</span>;
  }
}

function InstagramMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="4.5" y="4.5" width="15" height="15" rx="4" />
      <circle cx="12" cy="12" r="3.4" />
      <circle cx="16.4" cy="7.6" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14 8.2h2.4V5.4C15.8 5.2 14.9 5 14.1 5 11.8 5 10.2 6.4 10.2 9v2H8v3h2.2v7h3.1v-7H16l.5-3h-3.2V9.1c0-.6.2-.9.9-.9Z" />
    </svg>
  );
}
