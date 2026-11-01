import { Arrow } from "@/components/ui/Arrow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { glowAccent } from "@/experience/build/accent";
import styles from "@/experience/build/build.module.css";
import { routes } from "@/i18n/routes";
import { cn } from "@/lib/utils";

interface PageCtaProps {
  headline: string;
  body: string;
  label: string;
  href?: string;
  /** Shown beside the button when an address is configured. */
  email?: string;
  emailLabel?: string;
}

/**
 * The closing block of an inner page: one glass door with the invitation on
 * one side and the way through on the other. Quieter than the homepage's
 * typed prompt — it ends a page rather than a whole argument.
 */
export function PageCta({
  headline,
  body,
  label,
  href = routes.contact,
  email,
  emailLabel,
}: PageCtaProps) {
  return (
    <Section spacing="default" label={headline}>
      <Container>
        <div data-reveal className={cn(styles.glass, styles.door)}>
          <div>
            <h2 className={styles.h2}>{glowAccent(headline)}</h2>
            <p className={styles.lead}>{body}</p>
          </div>
          <div className={styles.doorActions}>
            <Button href={href} variant="primary" size="md" className="px-7">
              {label}
              <Arrow />
            </Button>
            {email ? (
              <span className="text-caption text-subtle">
                {emailLabel ? `${emailLabel} ` : null}
                <a href={`mailto:${email}`} className={styles.email}>
                  {email}
                </a>
              </span>
            ) : null}
          </div>
        </div>
      </Container>
    </Section>
  );
}
