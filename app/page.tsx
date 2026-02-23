"use client";

import { useCallback, useState } from "react";
import ControlButton from "./_components/button/control-button";
import Grid from "./_components/game/grid";
import GameLostModal from "./_components/modal/game-lost-modal";
import GameWonModal from "./_components/modal/game-won-modal";
import Popup from "./_components/popup";
import useAnimation from "./_hooks/use-animation";
import useGameLogic from "./_hooks/use-game-logic";
import usePopup from "./_hooks/use-popup";
import { SubmitResult, Word } from "./_types";
import { getPerfection } from "./_utils";
import PlayerModal from "./_components/modal/player-modal";
import { supabase } from "./_lib/supabase";

export default function Home() {
  const [popupState, showPopup] = usePopup();
  const {
    gameWords,
    selectedWords,
    clearedCategories,
    mistakesRemaining,
    isWon,
    isLost,
    guessHistoryRef,
    selectWord,
    shuffleWords,
    deselectAllWords,
    getSubmitResult,
    handleWin,
    handleLoss,
  } = useGameLogic();

  const [showGameWonModal, setShowGameWonModal] = useState(false);
  const [showGameLostModal, setShowGameLostModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [playerName, setPlayerName] = useState<string | null>(null);
  const [startMs, setStartMs] = useState<number | null>(null);

  const {
    guessAnimationState,
    wrongGuessAnimationState,
    animateGuess,
    animateWrongGuess,
  } = useAnimation();

  const TOTAL_MISTAKES = 4;

  const saveResult = async (status: "win" | "loss") => {
    if (!playerName || !startMs) return;

    const mistakesUsed =
      status === "loss"
        ? TOTAL_MISTAKES
        : TOTAL_MISTAKES - mistakesRemaining;

    const durationMs = Date.now() - startMs;

    const playerId = localStorage.getItem("playerId");

    const { error } = await supabase.from("leaderboard_entries").insert({
      event_slug: process.env.NEXT_PUBLIC_EVENT_SLUG,
      player_name: playerName,
      player_id: playerId,
      status,
      mistakes_used: mistakesUsed,
      duration_ms: durationMs,
    });

    if (error) console.error("Save result error:", error);
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    await animateGuess(selectedWords);

    const result: SubmitResult = getSubmitResult();

    switch (result.result) {
      case "same":
        showPopup("You've already guessed that!");
        break;
      case "one-away":
        animateWrongGuess();
        showPopup("One away...");
        break;
      case "loss":
        showPopup("Better luck next time!");
        await handleLoss();
        await saveResult("loss");
        setShowGameLostModal(true);
        break;
      case "win":
        showPopup(getPerfection(mistakesRemaining));
        await handleWin();
        await saveResult("win");
        setShowGameWonModal(true);
        break;
      case "incorrect":
        animateWrongGuess();
        break;
    }
    setSubmitted(false);
  };

  const onClickCell = useCallback(
    (word: Word) => {
      selectWord(word);
    },
    [selectWord]
  );

  const renderControlButtons = () => {
    const showResultsWonButton = (
      <ControlButton
        text="Show Results"
        onClick={() => {
          setShowGameWonModal(true);
        }}
      />
    );

    const showResultsLostButton = (
      <ControlButton
        text="Show Results"
        onClick={() => {
          setShowGameLostModal(true);
        }}
      />
    );

    const inProgressButtons = (
      <div className="flex gap-2 mb-12">
        <ControlButton
          text="Shuffle"
          onClick={shuffleWords}
          unclickable={submitted}
        />
        <ControlButton
          text="Deselect All"
          onClick={deselectAllWords}
          unclickable={selectedWords.length === 0 || submitted}
        />
        <ControlButton
          text="Submit"
          unclickable={selectedWords.length !== 4 || submitted}
          onClick={handleSubmit}
        />
      </div>
    );

    if (isWon) {
      return showResultsWonButton;
    } else if (isLost) {
      return showResultsLostButton;
    } else {
      return inProgressButtons;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
        <h1 className="text-wedding-blush text-4xl font-heading my-4 text-center">
          Finn-Brinn Connections
        </h1>
        <hr className="mb-4 md:mb-4 w-full"></hr>
        <h1 className="text-wedding-blush mb-4">Create four groups of four!</h1>
        <div className="relative w-full">
          <Popup show={popupState.show} message={popupState.message} />
          <Grid
            words={gameWords}
            selectedWords={selectedWords}
            onClick={onClickCell}
            clearedCategories={clearedCategories}
            guessAnimationState={guessAnimationState}
            wrongGuessAnimationState={wrongGuessAnimationState}
          />
        </div>
        <h2 className="text-wedding-blush my-4 md:my-8 mx-8">
          Mistakes Remaining:{" "}
          {mistakesRemaining > 0 ? Array(mistakesRemaining).fill("•") : ""}
        </h2>
        {renderControlButtons()}
      </div>
      <PlayerModal
        isOpen={!playerName}
        onStart={(name) => {
          const id = crypto.randomUUID();
          localStorage.setItem("playerId", id);
          localStorage.setItem("playerName", name);
          
          setPlayerName(name);
          setStartMs(Date.now());
          localStorage.setItem("playerName", name);
        }}
      />
      <GameWonModal
        isOpen={showGameWonModal}
        onClose={() => setShowGameWonModal(false)}
        guessHistory={guessHistoryRef.current}
        perfection={getPerfection(mistakesRemaining)}
      />
      <GameLostModal
        isOpen={showGameLostModal}
        onClose={() => setShowGameLostModal(false)}
        guessHistory={guessHistoryRef.current}
      />
    </>
  );
}
