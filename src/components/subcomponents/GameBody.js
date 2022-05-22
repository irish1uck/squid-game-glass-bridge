import React, { useState } from "react";
import { generateAnswersForBoard, playerWonForDBUpdate } from "../../utils";
import GlassBridge from "./GlassBridge";
import { CgProfile } from "react-icons/cg";
import Profile from "./Profile";
import Cookies from "universal-cookie";

function GameBody({
  player,
  difficulty,
  answers,
  extraLives,
  resetGame,
  setExtraLives,
  setAnswers,
  setShowAudioPlayer,
  playerProfile,
}) {
  const cookies = new Cookies();
  const storedProfile = cookies.get("playerProfile") || playerProfile;
  const [playersMoveCount, setPlayersMoveCount] = useState(0);
  const [wrongTileSelected, setWrongTileSelected] = useState(false);
  const [correctMovesMade, setCorrectMovesMade] = useState([]);
  const [displayInstructions, setDisplayInstructions] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const displayedDifficulty =
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  const toggleInstructions = () => {
    setDisplayInstructions(!displayInstructions);
    setShowAudioPlayer(true);
  };
  const tryAgain = (wonGame) => {
    let newAnswers;
    let updateLocalProfile;
    setShowAudioPlayer(true);
    setPlayersMoveCount(0);
    setWrongTileSelected(false);
    setCorrectMovesMade([]);
    setGameWon(false);

    if (difficulty === "hard") {
      newAnswers = generateAnswersForBoard(12);
      setAnswers(newAnswers);
      setExtraLives(5);
      updateLocalProfile = wonGame
        ? {
            ...storedProfile,
            difficultyPlayed: {
              ...storedProfile.difficultyPlayed,
              hard: storedProfile.difficultyPlayed.hard + 1,
            },
            difficultyWon: {
              ...storedProfile.difficultyWon,
              hard: storedProfile.difficultyWon.hard + 1,
            },
            gamesPlayed: storedProfile.gamesPlayed + 1,
          }
        : {
            ...storedProfile,
            difficultyPlayed: {
              ...storedProfile.difficultyPlayed,
              hard: storedProfile.difficultyPlayed.hard + 1,
            },
            gamesPlayed: storedProfile.gamesPlayed + 1,
          };
    } else if (difficulty === "medium") {
      newAnswers = generateAnswersForBoard(8);
      setAnswers(newAnswers);
      setExtraLives(4);
      updateLocalProfile = wonGame
        ? {
            ...storedProfile,
            difficultyPlayed: {
              ...storedProfile.difficultyPlayed,
              medium: storedProfile.difficultyPlayed.medium + 1,
            },
            difficultyWon: {
              ...storedProfile.difficultyWon,
              medium: storedProfile.difficultyWon.medium + 1,
            },
            gamesPlayed: storedProfile.gamesPlayed + 1,
          }
        : {
            ...storedProfile,
            difficultyPlayed: {
              ...storedProfile.difficultyPlayed,
              medium: storedProfile.difficultyPlayed.medium + 1,
            },
            gamesPlayed: storedProfile.gamesPlayed + 1,
          };
    } else {
      newAnswers = generateAnswersForBoard(5);
      setAnswers(newAnswers);
      setExtraLives(3);
      updateLocalProfile = wonGame
        ? {
            ...storedProfile,
            difficultyPlayed: {
              ...storedProfile.difficultyPlayed,
              easy: storedProfile.difficultyPlayed.easy + 1,
            },
            difficultyWon: {
              ...storedProfile.difficultyWon,
              easy: storedProfile.difficultyWon.easy + 1,
            },
            gamesPlayed: storedProfile.gamesPlayed + 1,
          }
        : {
            ...storedProfile,
            difficultyPlayed: {
              ...storedProfile.difficultyPlayed,
              easy: storedProfile.difficultyPlayed.easy + 1,
            },
            gamesPlayed: storedProfile.gamesPlayed + 1,
          };
    }
    cookies.set("playerProfile", updateLocalProfile, { path: "/" });
    cookies.set("answers", newAnswers, { path: "/" });
  };

  const backToMainMenuPressed = () => {
    playerWonForDBUpdate(player, difficulty, false, false, playerProfile);
    setGameWon(false);
    resetGame();
  };

  const playAgainAfterLoss = () => {
    if (
      (difficulty === "hard" && extraLives < 5) ||
      (difficulty === "medium" && extraLives < 4) ||
      (difficulty === "easy" && extraLives < 3)
    ) {
      playerWonForDBUpdate(player, difficulty, false, false, playerProfile);
      tryAgain(false);
    }
  };

  const playAgainAfterWin = () => {
    playerWonForDBUpdate(player, difficulty, true, true, playerProfile);
    tryAgain(true);
  };

  if (extraLives < 0) {
    setShowAudioPlayer(false);
    return (
      <>
        <div className={"title"}>YOU FELL TO YOUR DEATH!</div>
        <button
          onClick={backToMainMenuPressed}
          className="gameOptions__button  extraTopMargin"
        >
          Main Menu
        </button>
        <button onClick={playAgainAfterLoss} className="gameOptions__button">
          Try Again
        </button>
        <div className={"title extraTopMargin"}>GAME OVER</div>
      </>
    );
  }

  if (gameWon) {
    setShowAudioPlayer(false);
    return (
      <>
        <div className={"title"}>{`YOU WON THE SQUID GAME`}</div>
        <div className={"title extraTopMargin"}>{`${player}!`}</div>
        <button
          onClick={backToMainMenuPressed}
          className="gameOptions__button extraTopMargin"
        >
          Main Menu
        </button>
        <button
          onClick={playAgainAfterWin}
          className="gameOptions__button extraTopMargin"
        >
          Play Again
        </button>
        <div
          className={"title extraTopMargin"}
        >{`on ${displayedDifficulty}`}</div>
      </>
    );
  }

  if (displayInstructions) {
    setShowAudioPlayer(false);
    return (
      <div className="gameBody instructionsContainer">
        <div className="gameBody__details">{`To win the game you must cross the glass bridge. 
        As you move, you must choose the left or right path. If you choose correctly, the 
        glass tile will hold your weight (tile turns green) and you can continue to cross. 
        If you choose wrong, the glass tile will break (tile turns red and you start back at 
        the beginning). If you run out of lives, you will fall to your death and the game is 
        over. Start at the bottom row. Good luck ${player}!`}</div>
        <button
          onClick={toggleInstructions}
          className="gameBody__button extraTopMargin"
        >
          Back to the Game
        </button>
      </div>
    );
  }

  if (showProfile) {
    setShowAudioPlayer(false);
    return (
      <Profile
        player={player}
        setShowProfile={setShowProfile}
        setShowAudioPlayer={setShowAudioPlayer}
        playerProfile={storedProfile}
      />
    );
  }

  const classForLongNames = player.length > 5 ? "playerName" : "";

  return (
    <div className="gameBody">
      <GlassBridge
        numberOfRows={answers.length}
        answers={answers}
        extraLives={extraLives}
        setExtraLives={setExtraLives}
        playersMoveCount={playersMoveCount}
        setPlayersMoveCount={setPlayersMoveCount}
        wrongTileSelected={wrongTileSelected}
        setWrongTileSelected={setWrongTileSelected}
        correctMovesMade={correctMovesMade}
        setCorrectMovesMade={setCorrectMovesMade}
        setGameWon={setGameWon}
        playerProfile={playerProfile}
      />
      <div className="gameBody__buttonContainer">
        <button onClick={backToMainMenuPressed} className="gameBody__button">
          Main Menu
        </button>
        <button onClick={toggleInstructions} className="gameBody__button">
          How to Play
        </button>
        <button onClick={playAgainAfterLoss} className="gameBody__button">
          Reset Game
        </button>
      </div>
      <div className="gameBody__hudContainer">
        <div className={"gameBody__hud" + classForLongNames}>{player}</div>
        <br />
        <div className="gameBody__hud">{displayedDifficulty}</div>
        <div className="gameBody__hud">{"Mode"}</div>
        <br />
        <div className="gameBody__hud">{"Lives"}</div>
        <div className="gameBody__hud">{`x${extraLives}`}</div>
      </div>
      <button
        className="gameBody__profileButton"
        onClick={() => setShowProfile(true)}
      >
        <CgProfile className="gameBody__profileIcon" />
        <label className="gameBody__profileLabel">Profile</label>
      </button>
    </div>
  );
}

export default GameBody;
