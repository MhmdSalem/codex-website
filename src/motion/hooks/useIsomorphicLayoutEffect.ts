"use client";

import { useEffect, useLayoutEffect } from "react";

/**
 * `useLayoutEffect` in the browser, `useEffect` on the server.
 * Animations must measure before paint, but React warns if layout effects run
 * during SSR — this keeps both happy.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
