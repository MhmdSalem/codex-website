import styles from "./field.module.css";

/**
 * The hero's backdrop: grid, lamp and blueprint.
 *
 * A server component — nothing here needs state. The hero's client scene finds
 * the layers by data attribute: it writes the lamp position to
 * `[data-hero-field]` and draws `[data-hero-blueprint]` on with the entrance.
 *
 * The blueprint is a picture of what the company sells: an operations screen
 * with a credential card, a queue of records and a live count. It is drawn in
 * hairlines, the brand's own mark of structure, and the accent is spent on the
 * few elements that would be live in the real product.
 */
export function HeroField() {
  return (
    <div data-hero-field className={styles.field} aria-hidden="true">
      <div className={styles.grid} />
      <div className={styles.light} />

      {/*
        Two boxes, two owners. The outer one is placed by the stylesheet; the
        inner one is moved by the scene — drift under the pointer, lift on
        scroll. A single element cannot carry both: GSAP owns an element's
        transform outright, and the first drift would discard the centring.
      */}
      <div className={styles.blueprint}>
        <div data-hero-blueprint>
          <svg viewBox="0 0 640 440" focusable="false">
            {/* window */}
            <rect x="40" y="30" width="560" height="380" />
            <line x1="40" y1="78" x2="600" y2="78" />
            <line x1="176" y1="78" x2="176" y2="410" />
            <circle cx="62" cy="54" r="4" className={styles.faint} />
            <circle cx="78" cy="54" r="4" className={styles.faint} />
            <circle cx="94" cy="54" r="4" className={styles.faint} />
            <rect x="420" y="44" width="150" height="20" className={styles.faint} />

            {/* sidebar */}
            <line x1="60" y1="108" x2="150" y2="108" />
            <line x1="60" y1="138" x2="130" y2="138" className={styles.accent} />
            <line x1="60" y1="168" x2="142" y2="168" className={styles.faint} />
            <line x1="60" y1="198" x2="124" y2="198" className={styles.faint} />
            <line x1="60" y1="228" x2="138" y2="228" className={styles.faint} />
            <line x1="60" y1="378" x2="120" y2="378" className={styles.faint} />

            {/* credential card */}
            <rect x="204" y="106" width="176" height="236" />
            <rect x="222" y="124" width="60" height="72" className={styles.wash} />
            <line x1="298" y1="134" x2="362" y2="134" />
            <line x1="298" y1="154" x2="348" y2="154" className={styles.faint} />
            <line x1="298" y1="174" x2="356" y2="174" className={styles.faint} />
            <line x1="222" y1="220" x2="362" y2="220" className={styles.faint} />
            <rect x="222" y="236" width="14" height="14" />
            <rect x="242" y="236" width="14" height="14" className={styles.faint} />
            <rect x="262" y="236" width="14" height="14" />
            <rect x="222" y="256" width="14" height="14" className={styles.faint} />
            <rect x="242" y="256" width="14" height="14" />
            <rect x="262" y="256" width="14" height="14" className={styles.faint} />
            <line x1="298" y1="243" x2="362" y2="243" className={styles.faint} />
            <line x1="298" y1="263" x2="340" y2="263" className={styles.faint} />
            <rect x="222" y="298" width="72" height="24" className={styles.accent} />
            <line x1="306" y1="310" x2="362" y2="310" className={styles.faint} />

            {/* records */}
            <rect x="404" y="106" width="176" height="52" />
            <circle cx="426" cy="132" r="7" className={styles.accent} />
            <line x1="444" y1="126" x2="540" y2="126" />
            <line x1="444" y1="142" x2="508" y2="142" className={styles.faint} />
            <rect x="404" y="170" width="176" height="52" />
            <circle cx="426" cy="196" r="7" />
            <line x1="444" y1="190" x2="526" y2="190" />
            <line x1="444" y1="206" x2="500" y2="206" className={styles.faint} />
            <rect x="404" y="234" width="176" height="52" />
            <circle cx="426" cy="260" r="7" className={styles.accent} />
            <line x1="444" y1="254" x2="548" y2="254" />
            <line x1="444" y1="270" x2="512" y2="270" className={styles.faint} />

            {/* live count */}
            <rect x="404" y="298" width="176" height="92" />
            <line x1="420" y1="318" x2="470" y2="318" className={styles.faint} />
            <polyline
              className={styles.accent}
              points="420,372 446,362 472,366 498,344 524,348 550,326 568,318"
            />
            <circle cx="568" cy="318" r="4" className={styles.wash} />

            {/* annotation */}
            <line x1="204" y1="366" x2="380" y2="366" className={styles.faint} />
            <line x1="204" y1="384" x2="320" y2="384" className={styles.faint} />
          </svg>
        </div>
      </div>
    </div>
  );
}
