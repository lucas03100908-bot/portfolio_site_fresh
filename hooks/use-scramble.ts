"use client";

import { useCallback, useEffect, useRef } from "react";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function useScramble(label: string) {
  const textRef = useRef<HTMLSpanElement>(null);
  const scrambleRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startScramble = useCallback(() => {
    let iter = 0;
    if (scrambleRef.current) clearInterval(scrambleRef.current);
    scrambleRef.current = setInterval(() => {
      if (textRef.current) {
        textRef.current.textContent = label
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < Math.floor(iter)) return label[i];
            return LETTERS[Math.floor(Math.random() * 26)];
          })
          .join("");
      }
      if (iter >= label.length) {
        clearInterval(scrambleRef.current!);
        scrambleRef.current = null;
        if (textRef.current) textRef.current.textContent = label;
      }
      iter += 1 / 3;
    }, 25);
  }, [label]);

  const stopScramble = useCallback(() => {
    if (scrambleRef.current) {
      clearInterval(scrambleRef.current);
      scrambleRef.current = null;
    }
    if (textRef.current) textRef.current.textContent = label;
  }, [label]);

  useEffect(() => {
    return () => {
      if (scrambleRef.current) clearInterval(scrambleRef.current);
    };
  }, []);

  return { textRef, startScramble, stopScramble };
}
