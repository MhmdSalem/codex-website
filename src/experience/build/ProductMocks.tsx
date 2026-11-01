import { cn } from "@/lib/utils";

import styles from "./build.module.css";
import { Window } from "./Window";

const BARS = [30, 45, 38, 60, 52, 74, 68, 88, 100];

interface AccreditationMockProps {
  name: string;
  live: string;
  verified: string;
  admit: string;
  deny: string;
  checkins: string;
  guests: { a: string; b: string; c: string; d: string };
}

/**
 * Codex Accreditation at rest: a gate open, a badge verified, the queue
 * moving and the count where it stands. The same interface the homepage
 * assembles line by line, here already built.
 */
export function AccreditationMock(props: AccreditationMockProps) {
  return (
    <div data-reveal className={styles.app}>
      <div className={styles.appHd}>
        <b>{props.name}</b>
        <span className={styles.chip}>● {props.live}</span>
      </div>
      <div className={styles.appGrid}>
        <div className={styles.card}>
          <div className={styles.photo} />
          <div className={styles.l} />
          <div className={cn(styles.l, styles.lb)} />
          <span className={styles.ok}>{props.verified}</span>
        </div>
        <div className={styles.rows}>
          <div className={styles.row}>
            <i />
            {props.guests.a}
            <em>{props.admit}</em>
          </div>
          <div className={cn(styles.row, styles.rowDeny)}>
            <i />
            {props.guests.b}
            <em>{props.deny}</em>
          </div>
          <div className={styles.row}>
            <i />
            {props.guests.c}
            <em>{props.admit}</em>
          </div>
          <div className={styles.row}>
            <i />
            {props.guests.d}
            <em>{props.admit}</em>
          </div>
        </div>
        <div className={styles.chart}>
          {BARS.map((height, index) => (
            <i key={index} style={{ "--h": `${height}%` } as React.CSSProperties} />
          ))}
        </div>
        <div className={styles.count}>
          <b>1,284</b>
          <span>{props.checkins}</span>
        </div>
      </div>
    </div>
  );
}

interface DaawaMockProps {
  name: string;
  tag: string;
  rows: { label: string; status: string; accepted: boolean }[];
  summary: string;
}

/**
 * Daawa at rest: the invitation on one side, the list it produced on the
 * other — who was asked, who answered, how many are coming.
 */
export function DaawaMock({ name, tag, rows, summary }: DaawaMockProps) {
  return (
    <div data-reveal>
      <Window title={`${name.toLowerCase()} — ${tag}`} status="● live">
        <div className={styles.invite}>
          <div className={styles.inviteCard}>
            <span className={styles.meta}>INVITATION · #D-2041</span>
            <b>{name}</b>
            <div className={styles.l} />
            <div className={cn(styles.l, styles.lb)} />
            <div className={styles.qr}>
              {Array.from({ length: 25 }, (_, index) => (
                <i key={index} />
              ))}
            </div>
          </div>
          <div className={styles.rsvp}>
            {rows.map((row) => (
              <div key={row.label} className={cn(styles.row, !row.accepted && styles.rowDeny)}>
                <i />
                {row.label}
                <em>{row.status}</em>
              </div>
            ))}
            <div className={styles.rsvpBar}>
              <i />
            </div>
            <div className={styles.count}>
              <b>72%</b>
              <span>{summary}</span>
            </div>
          </div>
        </div>
      </Window>
    </div>
  );
}
