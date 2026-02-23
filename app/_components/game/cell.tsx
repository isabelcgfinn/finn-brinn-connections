"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Word } from "@/app/_types";

type CellProps = {
  cellValue: Word;
  onClick: (word: Word) => void;
  animateGuess: boolean;
  animateWrongGuess: boolean;
};

export default function Cell(props: CellProps) {
  const bgColor = props.cellValue.selected ? "bg-wedding-rose" : "bg-wedding-blush";
  const textColor = "text-wedding-aubergine";

  const handleClick = () => props.onClick(props.cellValue);

  const guessAnimation = props.animateGuess ? "transform -translate-y-2" : "";
  const wrongGuessAnimation = props.animateWrongGuess ? "animate-horizontal-shake" : "";

  const buttonRef = useRef<HTMLButtonElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  const raw = props.cellValue.word.toUpperCase().trim();

  const parts = useMemo(() => raw.split(/\s+/), [raw]);
  const isTwoWords = parts.length === 2;

  const [fontPx, setFontPx] = useState<number>(16);

  useEffect(() => {
    const el = buttonRef.current;
    const meas = measureRef.current;
    if (!el || !meas) return;

    const compute = () => {
      const rect = el.getBoundingClientRect();

      // Safe interior box (tweak if you change padding)
      const paddingX = 16;
      const paddingY = 24;

      const maxW = Math.max(40, rect.width - paddingX);
      const maxH = Math.max(24, rect.height - paddingY);

      const fit = (text: string, twoLine: boolean) => {
      const rect = el.getBoundingClientRect();

      // Different caps for mobile vs desktop
      const MAX_FONT = rect.width < 120 ? 22 : 28;

      let lo = 10;
      let hi = MAX_FONT;
      let best = lo;

        // Make measurer behave like real text
        meas.style.fontWeight = "700";
        meas.style.whiteSpace = twoLine ? "pre-line" : "nowrap";
        meas.style.width = twoLine ? `${maxW}px` : "auto";
        meas.style.lineHeight = twoLine ? "1.05" : "1.0";
        meas.textContent = text;

        while (lo <= hi) {
          const mid = Math.floor((lo + hi) / 2);
          meas.style.fontSize = `${mid}px`;

          const w = meas.scrollWidth;
          const h = meas.scrollHeight;

          const ok = w <= maxW && h <= maxH;

          if (ok) {
            best = mid;
            lo = mid + 1;
          } else {
            hi = mid - 1;
          }
        }
        return best;
      };

      if (isTwoWords) {
        // Force two lines, optimise for longest word (each line measured)
        const twoLineText = `${parts[0]}\n${parts[1]}`;
        setFontPx(fit(twoLineText, true));
      } else {
        // Single word (or >2 words) — keep on one line and shrink if needed
        setFontPx(fit(raw, false));
      }
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [raw, isTwoWords, parts]);

  return (
    <button
      ref={buttonRef}
      className={`
        ${bgColor}
        py-6
        rounded-md
        px-1
        transition
        ease-in-out
        duration-200
        ${guessAnimation}
        ${wrongGuessAnimation}
      `}
      onClick={handleClick}
    >
      <h2
        className={`
          ${textColor}
          text-center
          font-bold
          leading-tight
        `}
        style={{
          fontSize: `${fontPx}px`,
          wordBreak: "keep-all",
          overflowWrap: "normal",
        }}
      >
        {isTwoWords ? (
          <>
            <span className="block">{parts[0]}</span>
            <span className="block">{parts[1]}</span>
          </>
        ) : (
          raw
        )}
      </h2>

      {/* Hidden measurer */}
      <span
        ref={measureRef}
        className="absolute left-[-9999px] top-[-9999px] font-bold leading-tight"
        aria-hidden="true"
        style={{
          wordBreak: "keep-all",
          overflowWrap: "normal",
        }}
      />
    </button>
  );
}