"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import * as motion from "motion/react-client";
import { EditorMockup } from "./editor-mockup";
import { Button } from "@/components/ui/button";

export function Hero() {
  const [yOffset, setYOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const offset = Math.min(scrollY / 300, 1) * -20;
      setYOffset(offset);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const baseTransform = {
    translateX: 2,
    scale: 1.2,
    rotateX: 47,
    rotateY: 31,
    rotateZ: 324,
  };

  const headingWords =
    "Resolve client portal issues with clarity and speed.".split(" ");
  const subtitleWords =
    "VSOP collects support tickets from VeriTrack portals, assigns your team, and tracks every fix — no more lost WhatsApp threads.".split(
      " ",
    );

  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-background">
      <div className="hero-glow" />
      <div className="relative z-10 pt-28 flex flex-col overflow-x-hidden">
        <div className="w-full flex justify-center mt-16 px-8 xl:-ms-30">
          <div className="w-full max-w-4xl">
            <motion.h1
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.04 } },
              }}
              className="text-4xl md:text-5xl lg:text-[56px] font-medium text-foreground leading-[1.1] text-balance"
            >
              {headingWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 15, filter: "blur(4px)" },
                    show: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.4,
                        ease: [0.23, 1, 0.32, 1],
                      },
                    },
                  }}
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.02, delayChildren: 0.3 } },
              }}
              className="mt-6 text-lg text-muted-foreground max-w-[65ch]"
            >
              {subtitleWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  variants={{
                    hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
                    show: {
                      opacity: 1,
                      y: 0,
                      filter: "blur(0px)",
                      transition: {
                        duration: 0.4,
                        ease: [0.23, 1, 0.32, 1],
                      },
                    },
                  }}
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.4,
                delay: 0.6,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="mt-8"
            >
              <Button asChild size="lg">
                <Link href="/login">Sign in</Link>
              </Button>
            </motion.div>
          </div>
        </div>
        <div className="relative mt-16 w-full pointer-events-none hero-mockup-stage">
          <div className="absolute bottom-0 left-0 right-0 h-72 z-10 pointer-events-none fade-to-bg" />
          <div
            style={{
              transform: `translateY(${yOffset}px)`,
              transition: "transform 0.1s ease-out",
              contain: "strict",
              perspective: "4000px",
              perspectiveOrigin: "100% 0",
              width: "100%",
              height: "100%",
              transformStyle: "preserve-3d",
              position: "relative",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.5,
                duration: 1,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              className="bg-background border border-border rounded-[10px] absolute inset-0 m-auto overflow-hidden"
              style={{
                transformOrigin: "0 0",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                width: "1600px",
                height: "900px",
                margin: "280px auto auto",
                transform: `translate(${baseTransform.translateX}%) scale(${baseTransform.scale}) rotateX(${baseTransform.rotateX}deg) rotateY(${baseTransform.rotateY}deg) rotate(${baseTransform.rotateZ}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              <EditorMockup />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
