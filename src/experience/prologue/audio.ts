/**
 * Optional ambient sound for the prologue.
 *
 * Architecture only, as specified: nothing autoplays, no AudioContext is
 * constructed until the visitor asks for sound, and the film is designed to be
 * complete in silence. Sound is a layer on top of a finished experience.
 *
 * Browsers block audio until a user gesture anyway, so building the graph
 * lazily is both the polite and the only reliable option.
 */

export interface PrologueAudio {
  /** Starts the ambient bed. Must be called from a user gesture. */
  enable: () => Promise<void>;
  disable: () => void;
  /** Fires a one-shot cue keyed to a timeline marker. No-op while muted. */
  cue: (id: AudioCue) => void;
  dispose: () => void;
}

/** Cue points, one per scene beat that has a sound in the final grade. */
export type AudioCue = "first-light" | "first-mark" | "snap" | "colour" | "settle";

const PREFERENCE_KEY = "codex:prologue:sound";

export function readSoundPreference(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(PREFERENCE_KEY) === "on";
  } catch {
    return false;
  }
}

function writeSoundPreference(enabled: boolean): void {
  try {
    window.sessionStorage.setItem(PREFERENCE_KEY, enabled ? "on" : "off");
  } catch {
    // Storage can be unavailable in private modes. The session simply forgets.
  }
}

/**
 * Creates the audio controller.
 *
 * The graph is: bed → gain → destination, with cues routed through their own
 * gain so the bed can duck under them. Sources are attached in a later phase;
 * the shape is fixed now so scenes can call `cue()` as they are built.
 */
export function createPrologueAudio(): PrologueAudio {
  let context: AudioContext | null = null;
  let master: GainNode | null = null;
  let enabled = false;

  const enable = async (): Promise<void> => {
    if (typeof window === "undefined") return;

    if (!context) {
      const Ctor =
        window.AudioContext ??
        (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      context = new Ctor();
      master = context.createGain();
      master.gain.value = 0;
      master.connect(context.destination);
    }

    if (context.state === "suspended") await context.resume();

    enabled = true;
    writeSoundPreference(true);
    // Fade in rather than cut in: an ambient bed that starts abruptly is worse
    // than no sound at all.
    master?.gain.linearRampToValueAtTime(0.35, context.currentTime + 1.2);
  };

  const disable = (): void => {
    enabled = false;
    writeSoundPreference(false);
    if (context && master) {
      master.gain.linearRampToValueAtTime(0, context.currentTime + 0.4);
    }
  };

  const cue = (_id: AudioCue): void => {
    if (!enabled || !context || !master) return;
    // Cue sources land with the sound design pass in Phase 3.8.
  };

  const dispose = (): void => {
    void context?.close();
    context = null;
    master = null;
    enabled = false;
  };

  return { enable, disable, cue, dispose };
}
