"use client";

import { useEffect, useRef } from "react";

import { gsap, registerGsap } from "@/motion/gsap";
import { useMotionCapability } from "@/motion/hooks/useMotionPreference";

import styles from "./caret.module.css";
import {
  CARET_ARRIVE_EVENT,
  CARET_LERP,
  CARET_OFFSET,
  pointer,
  type CaretArriveDetail,
} from "./pointer";

/** Milliseconds without movement before the caret starts blinking. */
const IDLE_AFTER = 450;

/** What the caret grows over. */
const PRESSABLE = "a, button, [role='button'], [data-cursor-target]";

/**
 * The site's one moving object.
 *
 * Mounted once in the locale layout so it survives navigation. It publishes
 * its eased position to {@link pointer} every frame, which is how the hero's
 * light and any later scene stay attached to the same bar rather than each
 * following the pointer on its own.
 */
export function Caret() {
  const ref = useRef<HTMLDivElement>(null);
  const { prefersReducedMotion, isCoarsePointer } = useMotionCapability();

  useEffect(() => {
    const element = ref.current;
    if (!element || prefersReducedMotion || isCoarsePointer) return;

    registerGsap();

    const setX = gsap.quickSetter(element, "x", "px");
    const setY = gsap.quickSetter(element, "y", "px");
    let idleTimer: number | undefined;

    const markMoving = () => {
      element.dataset.state = "moving";
      if (idleTimer !== undefined) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        element.dataset.state = "idle";
      }, IDLE_AFTER);
    };

    const handleMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
      if (!pointer.active) {
        // First contact: appear where the pointer is rather than sliding in
        // from the corner of the viewport.
        pointer.cx = pointer.x;
        pointer.cy = pointer.y;
        pointer.active = true;
      }
      element.dataset.visible = "true";
      markMoving();
    };

    // The opening's bar becomes this element: the caret starts from the bar's
    // last position and eases to the pointer from there.
    const handleArrive = (event: Event) => {
      const { x, y } = (event as CustomEvent<CaretArriveDetail>).detail;
      pointer.cx = x - CARET_OFFSET.x;
      pointer.cy = y - CARET_OFFSET.y;
      if (!pointer.active) {
        pointer.x = pointer.cx;
        pointer.y = pointer.cy;
        pointer.active = true;
      }
      element.dataset.visible = "true";
      element.dataset.state = "idle";
    };

    const handleOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target.closest(PRESSABLE) : null;
      element.dataset.hover = target ? "true" : "false";
    };

    const handleLeaveWindow = (event: MouseEvent) => {
      if (event.relatedTarget === null) element.dataset.visible = "false";
    };
    const handleEnterWindow = () => {
      if (pointer.active) element.dataset.visible = "true";
    };

    const tick = () => {
      if (!pointer.active) return;
      pointer.cx += (pointer.x - pointer.cx) * CARET_LERP;
      pointer.cy += (pointer.y - pointer.cy) * CARET_LERP;
      setX(pointer.cx + CARET_OFFSET.x);
      setY(pointer.cy + CARET_OFFSET.y);
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener(CARET_ARRIVE_EVENT, handleArrive);
    document.addEventListener("pointerover", handleOver, { passive: true });
    document.addEventListener("mouseout", handleLeaveWindow);
    document.addEventListener("mouseenter", handleEnterWindow);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener(CARET_ARRIVE_EVENT, handleArrive);
      document.removeEventListener("pointerover", handleOver);
      document.removeEventListener("mouseout", handleLeaveWindow);
      document.removeEventListener("mouseenter", handleEnterWindow);
      gsap.ticker.remove(tick);
      if (idleTimer !== undefined) window.clearTimeout(idleTimer);
    };
  }, [prefersReducedMotion, isCoarsePointer]);

  return (
    <div
      ref={ref}
      className={styles.caret}
      data-visible="false"
      data-state="idle"
      data-hover="false"
      aria-hidden="true"
    />
  );
}
