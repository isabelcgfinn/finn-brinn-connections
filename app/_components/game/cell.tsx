"use client";

import React from "react";
import { Word } from "@/app/_types";

type CellProps = {
  cellValue: Word;
  onClick: (word: Word) => void;
  animateGuess: boolean;
  animateWrongGuess: boolean;
};

export default function Cell(props: CellProps) {
  // Background colour
  const bgColor = props.cellValue.selected
    ? "bg-wedding-rose"
    : "bg-wedding-blush";

  // Text colour (same in both states)
  const textColor = "text-wedding-aubergine";

  const handleClick = () => {
    props.onClick(props.cellValue);
  };

  const guessAnimation = props.animateGuess ? "transform -translate-y-2" : "";
  const wrongGuessAnimation = props.animateWrongGuess
    ? "animate-horizontal-shake"
    : "";

  const textRef = React.useRef<HTMLHeadingElement>(null);
  const [fontPx, setFontPx] = React.useState<number | null>(null);

  const word = props.cellValue.word.toUpperCase();

  // Shrink only if it overflows
  React.useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;

    // Start at a reasonable default (roughly your md:text-lg equivalent on many setups)
    let next = 18;
    const min = 11;

    // Reset to default before measuring
    el.style.fontSize = `${next}px`;

    // Shrink until it fits
    while (next > min && el.scrollWidth > el.clientWidth) {
      next -= 1;
      el.style.fontSize = `${next}px`;
    }

    setFontPx(next);
  }, [word]);

  return (
    <button
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
        ref={textRef}
        className={`
          ${textColor}
          text-xs
          md:text-lg
          text-center
          font-bold
          leading-tight
          whitespace-normal
          break-words
        `}
        style={fontPx ? { fontSize: `${fontPx}px` } : undefined}
      >
        {word}
      </h2>
    </button>
  );
}