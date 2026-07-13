"use client";

import { useState } from "react";
import GameModal from "./game-modal";
import ControlButton from "../button/control-button";

export default function PlayerModal(props: {
  isOpen: boolean;
  onStart: (playerName: string) => void;
}) {
  const [name, setName] = useState("");

  return (
    <GameModal isOpen={props.isOpen} onClose={() => {}}>
      <div className="flex flex-col items-center justify-center px-10 gap-4">
        <h1 className="font-display text-2xl text-wedding-aubergine text-center whitespace-nowrap">
          Enter your name
        </h1>

        <p className="text-wedding-aubergine text-center">
          (Or a team name / group of names)
        </p>

        <input
          className="w-full max-w-sm rounded-md px-4 py-3 bg-wedding-cream text-wedding-aubergine outline-none text-center"
          placeholder="Name / team"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <ControlButton
          text="Start"
          onClick={() => props.onStart(name.trim() || "Anonymous")}
          unclickable={name.trim().length === 0}
          className="!border-wedding-purple !text-wedding-purple hover:!bg-wedding-aubergine hover:!text-wedding-cream"
        />
      </div>
    </GameModal>
  );
}