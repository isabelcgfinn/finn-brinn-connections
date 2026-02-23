import { useState } from "react";
import { Word } from "@/app/_types";
import ControlButton from "../button/control-button";
import GuessHistory from "../guess-history";
import GameModal from "./game-modal";
import Leaderboard from "../leaderboard";

type GameWonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  guessHistory: Word[][];
  perfection: string;
};

export default function GameWonModal(props: GameWonModalProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <GameModal isOpen={props.isOpen} onClose={props.onClose}>
      <div className="flex flex-col items-center justify-center px-12">
        <h1 className="text-wedding-aubergine text-4xl font-heading my-4 ml-4">
          {props.perfection}
        </h1>

        <hr className="mb-2 md:mb-4 w-full border-wedding-aubergine" />

        <h2 className="text-wedding-aubergine mb-2">
          {"You've won the game!"}
        </h2>

        {showLeaderboard ? (
          <>
            {/* Sticky buttons at top */}
            <div className="sticky top-0 z-10 bg-wedding-blush py-3 flex gap-2 justify-center border-b border-wedding-plum/30">
              <ControlButton
                text="Back"
                onClick={() => setShowLeaderboard(false)}
                className="!border-wedding-plum !text-wedding-plum hover:!bg-wedding-aubergine hover:!text-wedding-blush"
              />
              <ControlButton
                text="Exit"
                onClick={props.onClose}
                className="!border-wedding-plum !text-wedding-plum hover:!bg-wedding-aubergine hover:!text-wedding-blush"
              />
            </div>

            {/* Scrollable leaderboard */}
            <div className="max-h-[60vh] overflow-y-auto mt-4">
              <Leaderboard />
            </div>
          </>
        ) : (
          <>
            <GuessHistory guessHistory={props.guessHistory} />
            <div className="mt-6 flex gap-2">
              <ControlButton
                text="View leaderboard"
                onClick={() => setShowLeaderboard(true)}
                className="!border-wedding-plum !text-wedding-plum hover:!bg-wedding-aubergine hover:!text-wedding-blush"
              />
              <ControlButton
                text="Exit"
                onClick={props.onClose}
                className="!border-wedding-plum !text-wedding-plum hover:!bg-wedding-aubergine hover:!text-wedding-blush"
              />
            </div>
          </>
        )}
      </div>
    </GameModal>
  );
}