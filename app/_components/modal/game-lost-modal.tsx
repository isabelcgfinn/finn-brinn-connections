import { useState } from "react";
import { Word } from "@/app/_types";
import ControlButton from "../button/control-button";
import GuessHistory from "../guess-history";
import GameModal from "./game-modal";
import Leaderboard from "../leaderboard";

type GameLostModalProps = {
  isOpen: boolean;
  onClose: () => void;
  guessHistory: Word[][];
};

export default function GameLostModal(props: GameLostModalProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  return (
    <GameModal isOpen={props.isOpen} onClose={props.onClose}>
      <div className="flex flex-col items-center justify-center px-12">
        <h1 className="text-wedding-aubergine text-3xl font-black my-4 ml-4">
          {"Next time!"}
        </h1>

        <hr className="mb-2 md:mb-4 w-full border-wedding-aubergine" />

        {showLeaderboard ? (
          <>
            <Leaderboard />
            <div className="mt-6 flex gap-2">
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