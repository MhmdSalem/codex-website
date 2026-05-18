"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Wrench, Sparkles } from "lucide-react";

type Props = {
  message?: {
    ar: string;
    en: string;
  };
};

const DEFAULT_MESSAGE = {
  ar: "نعمل على تحسينات الموقع، يرجى العودة قريباً.",
  en: "We're polishing things up. We'll be back shortly.",
};

export function UnderConstruction({ message }: Props) {
  const m = message ?? DEFAULT_MESSAGE;

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-background text-foreground flex flex-col items-center px-6 pt-8 sm:pt-12 pb-16"
    >
      {/* ── Background layers ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-aurora pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-grid-pattern bg-[size:60px_60px] opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-gold/10 blur-[140px] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-48 right-1/4 w-[600px] h-[400px] rounded-full bg-gold/8 blur-[140px] pointer-events-none"
      />

      {/* Floating orbs */}
      <FloatingOrbs />

      {/* ── 1. MAINTENANCE badge — at the very top, large ──────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-gold/40 bg-background-surface/50 backdrop-blur-md shadow-[0_8px_32px_rgba(217,119,87,0.18)]"
      >
        <motion.div
          animate={{ rotate: [0, -15, 0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
        </motion.div>
        <span className="text-base sm:text-xl font-bold uppercase tracking-[0.3em] text-gold">
          Maintenance
        </span>
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
        </motion.div>
      </motion.div>

      {/* ── 2. Main content (big centered logo + title + message) ──────── */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center py-10 sm:py-14">
        <div className="w-full max-w-3xl mx-auto text-center">
          {/* Big centered logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative inline-flex items-center justify-center mb-10 sm:mb-12"
          >
            <motion.div
              className="absolute -inset-12 rounded-full bg-gold/20 blur-3xl"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -inset-4 rounded-3xl bg-gold/30 blur-xl"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <div className="relative">
              <Image
                src="/codex-icon.png"
                alt="Codex"
                width={220}
                height={220}
                priority
                className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 rounded-[2rem] shadow-[0_30px_80px_rgba(217,119,87,0.45)]"
              />
            </div>
          </motion.div>

          {/* Arabic headline — generous leading + padding so nothing clips */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-balance text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.25] pb-2"
          >
            <span className="text-gradient-fade">الموقع تحت </span>
            <span className="text-gradient-gold italic inline-block px-1">
              الصيانة
            </span>
          </motion.h1>

          {/* English subtitle */}
          <motion.p
            dir="ltr"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-3 font-display italic text-foreground-muted text-base sm:text-lg md:text-xl tracking-wide"
          >
            Under construction · We&apos;ll be back soon
          </motion.p>

          {/* Message card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.65 }}
            className="mt-10 mx-auto max-w-xl rounded-3xl border border-border/60 bg-background-surface/40 backdrop-blur-md p-6 sm:p-8"
          >
            <p className="text-foreground text-sm sm:text-base leading-relaxed text-balance">
              {m.ar}
            </p>
            <div className="my-4 mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <p
              dir="ltr"
              className="text-foreground-muted text-xs sm:text-sm leading-relaxed text-balance"
            >
              {m.en}
            </p>
          </motion.div>

          {/* Animated progress strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.95 }}
            className="mt-10 mx-auto max-w-xs h-1 rounded-full bg-background-surface/60 overflow-hidden"
          >
            <motion.div
              className="h-full w-1/3 bg-gradient-to-r from-transparent via-gold to-transparent"
              animate={{ x: ["-100%", "300%"] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Big background mark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-x-0 -bottom-16 sm:-bottom-24 font-display font-bold text-[18vw] sm:text-[14vw] leading-[0.9] text-center text-gradient-gold-static opacity-[0.05]"
      >
        CODEX
      </div>
    </main>
  );
}

function FloatingOrbs() {
  const orbs = [
    { left: "10%", top: "15%", size: 6, delay: 0 },
    { left: "85%", top: "25%", size: 4, delay: 0.4 },
    { left: "20%", top: "70%", size: 5, delay: 0.8 },
    { left: "80%", top: "75%", size: 7, delay: 1.2 },
    { left: "50%", top: "85%", size: 3, delay: 1.6 },
    { left: "92%", top: "55%", size: 4, delay: 2 },
  ];
  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
      {orbs.map((orb, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold/40 blur-sm"
          style={{
            left: orb.left,
            top: orb.top,
            width: orb.size,
            height: orb.size,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.9, 0.3],
          }}
          transition={{
            duration: 4 + (i % 3),
            repeat: Infinity,
            delay: orb.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
