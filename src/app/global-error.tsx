"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary: catches failures in the root layout itself, where no
 * provider, font or translation is guaranteed to exist. Everything here is
 * therefore inline and English-only by necessity.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#08080a",
          color: "#ece9e2",
          fontFamily: "system-ui, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "36rem" }}>
          <p style={{ fontSize: "0.75rem", letterSpacing: "0.1em", opacity: 0.6 }}>ERROR</p>
          <h1 style={{ fontSize: "2rem", margin: "0.5rem 0 1rem", lineHeight: 1.1 }}>
            Something went wrong.
          </h1>
          <p style={{ opacity: 0.7, lineHeight: 1.6 }}>
            An unexpected error occurred while loading the page.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              border: "none",
              // Literal values: this route renders when the stylesheet may not
              // have loaded, so it cannot reach the tokens. Kept in step with
              // `signal` and `ink` in tokens.css.
              backgroundColor: "#d77758",
              color: "#0e0e12",
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
