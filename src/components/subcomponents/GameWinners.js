import React, { useEffect, useState } from "react";
import { gamePiecesArray, refreshPlayersAndWinners } from "../../utils";
import Loader from "./Loader";
import Title from "./Title";

function GameWinners({ setShowGameWinners, allWinners }) {
  const [loading, setLoading] = useState(true);
  const [displayedWinners, setDisplayedWinners] = useState(allWinners);
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1250);
    return () => clearTimeout(timer);
  }, []);

  const winnersListDefault = () => {
    return (
      <div className="gameWinners__list whiteTitle">
        No one has beat this mode yet
      </div>
    );
  };

  const refreshButtonPressed = () => {
    if (!refreshed) {
      setLoading(true);
      const timer = setTimeout(() => {
        refreshPlayersAndWinners(setDisplayedWinners);
        setLoading(false);
        setRefreshed(true);
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
    return null;
  };

  const sortedWinnersList = (listOfWinners) =>
    listOfWinners
      .split("*")
      .sort(
        (a, b) =>
          parseInt(b.charAt(b.length - 2) + b.charAt(b.length - 1)) -
          parseInt(a.charAt(a.length - 2) + a.charAt(a.length - 1))
      )
      .filter((a) => a !== "")
      .map((winner) =>
        winner.charAt(winner.length - 2) === "0" &&
        winner.charAt(winner.length - 1) === "1"
          ? winner.split("0").join("") + " win"
          : winner.charAt(winner.length - 2) === "0"
          ? winner.split("0").join("") + " wins"
          : winner + " wins"
      )
      .map((winner, index) => (
        <div className="gameWinners__listRow">
          <div className="gameWinners__listItem">
            {index + 1}
            {") "}
          </div>
          <img
            className="gameWinners__playerIcon"
            src={gamePiecesArray[parseInt(winner.charAt(0), 0) || 0]}
            alt="players last game piece"
          />
          <div className="gameWinners__listItem">
            {new RegExp(`^[0-9]`).test(winner) ? winner.slice(1) : winner}
          </div>
        </div>
      ));

  if (loading) {
    return (
      <div className={"loaderContainer"}>
        <Loader />
      </div>
    );
  }

  if (
    !displayedWinners.easyWinners &&
    !displayedWinners.mediumWinners &&
    !displayedWinners.hardWinners
  ) {
    return (
      <div className="gameOptions maxWidth90">
        <div className="whiteTitle profile__error">
          The database is temporarily offline for maintainence
          <br />
          <br />
          Should be back online tomorrow.
        </div>
        <button
          onClick={() => setShowGameWinners(false)}
          className="gameBody__button"
        >
          Back
        </button>
      </div>
    );
  }

  const finalWinnersListHard =
    sortedWinnersList(displayedWinners.hardWinners).length > 10
      ? sortedWinnersList(displayedWinners.hardWinners).slice(0, 10)
      : sortedWinnersList(displayedWinners.hardWinners);
  const finalWinnersListMedium =
    sortedWinnersList(displayedWinners.mediumWinners).length > 10
      ? sortedWinnersList(displayedWinners.mediumWinners).slice(0, 10)
      : sortedWinnersList(displayedWinners.mediumWinners);
  const finalWinnersListEasy =
    sortedWinnersList(displayedWinners.easyWinners).length > 10
      ? sortedWinnersList(displayedWinners.easyWinners).slice(0, 10)
      : sortedWinnersList(displayedWinners.easyWinners);

  return (
    <>
      <Title str={"Top Game Winners"} classNm={"title"} />
      <div className="gameOptions gameWinners">
        <div>
          <Title str={"Hard mode"} classNm={"title whiteTitle"} />
          <div className="gameWinners__list">
            {displayedWinners.hardWinners
              ? finalWinnersListHard
              : winnersListDefault()}
          </div>
        </div>
        <div>
          <Title str={"Medium mode"} classNm={"title whiteTitle"} />
          <div className="gameWinners__list">
            {displayedWinners.mediumWinners
              ? finalWinnersListMedium
              : winnersListDefault()}
          </div>
        </div>
        <div>
          <Title str={"Easy mode"} classNm={"title whiteTitle"} />
          <div className="gameWinners__list">
            {displayedWinners.easyWinners
              ? finalWinnersListEasy
              : winnersListDefault()}
          </div>
        </div>
        {!refreshed && (
          <button
            onClick={refreshButtonPressed}
            className="gameBody__button extraHorizontalPadding"
          >
            <label className="gameWinners__buttonText">Refresh</label>
          </button>
        )}
        <button
          onClick={() => setShowGameWinners(false)}
          className="gameBody__button extraHorizontalPadding  extraTopMargin"
        >
          <label className="gameWinners__buttonText">Back</label>
        </button>
      </div>
    </>
  );
}

export default GameWinners;
