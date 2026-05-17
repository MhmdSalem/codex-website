import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground min-h-screen grid place-items-center font-sans">
        <div className="text-center px-6">
          <div className="text-7xl font-bold text-gradient-gold mb-4">404</div>
          <h1 className="text-2xl font-semibold mb-3">Page not found</h1>
          <p className="text-foreground-muted mb-8">
            The page you are looking for does not exist.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-gradient-gold text-foreground-inverse font-semibold shadow-gold-glow"
          >
            Back to home
          </Link>
        </div>
      </body>
    </html>
  );
}
