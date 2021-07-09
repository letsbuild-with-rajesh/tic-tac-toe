import { React } from 'react';
import './App.css';

function App() {
  const MATRIX_SIZE = 3;
  const ANIMATION_DELAY = 100;
  const MAX_MOVES = MATRIX_SIZE * MATRIX_SIZE;
  const EMPTY_CELL = '&nbsp;&nbsp;&nbsp;';
  const CELL_ID_PREFIX = 'cell';
  const ANIMATE_STEPS = 10;
  const STRIKE_ANIMATION_SECONDS = 0.5;

  var gameState;
  var movesMade = 0;
  var hasAnyOneWon = false;
  var isUserAllowedToPlay = true;
  var wonIds = [];

  const drawStrikeLine = (startId, endId, animate) => {
    let strikeLineEl = document.getElementById("strikeLine");
    let startEl = document.getElementById(startId);
    let endEl = document.getElementById(endId);

    let x1 = startEl.getBoundingClientRect().left + (startEl.offsetWidth / 2);
    let y1 = startEl.getBoundingClientRect().top + (startEl.offsetHeight / 2);
    let x2 = endEl.getBoundingClientRect().left + (endEl.offsetWidth / 2);
    let y2 = endEl.getBoundingClientRect().top + (endEl.offsetHeight / 2);

    if (animate) {
      let xperstep = (x2 - x1) / ANIMATE_STEPS;
      let yperstep = (y2 - y1) / ANIMATE_STEPS;

      const updateCoordinates = (iter = 1) => {
        if (iter === 1) {
          strikeLineEl.setAttribute('x1', x1);
          strikeLineEl.setAttribute('y1', y1);
        }

        strikeLineEl.setAttribute('x2', x1 + (xperstep * iter));
        strikeLineEl.setAttribute('y2', y1 + (yperstep * iter));

        if (iter <= ANIMATE_STEPS) {
          setTimeout(() => { updateCoordinates(iter + 1); }, (STRIKE_ANIMATION_SECONDS * 1000) / ANIMATE_STEPS);
        }
      }

      updateCoordinates();
    } else {
      strikeLineEl.setAttribute('x1', x1);
      strikeLineEl.setAttribute('y1', y1);
      strikeLineEl.setAttribute('x2', x2);
      strikeLineEl.setAttribute('y2', y2);
    }
  }

  const resetGame = () => {
    gameState = new Array(MATRIX_SIZE);
    for (let i = 0; i < MATRIX_SIZE; i++) {
      gameState[i] = new Array(MATRIX_SIZE);
      for (let j = 0; j < MATRIX_SIZE; j++) {
        gameState[i][j] = '';
        document.getElementById(getIdFromIndices(i, j)).innerHTML = EMPTY_CELL;
        document.getElementById("message").innerHTML = '&nbsp;';
      }
    }
    movesMade = 0;
    hasAnyOneWon = false;
    let strikeLineEl = document.getElementById("strikeLine");
    strikeLineEl.setAttribute('x1', 0);
    strikeLineEl.setAttribute('y1', 0);
    strikeLineEl.setAttribute('x2', 0);
    strikeLineEl.setAttribute('y2', 0);
  }

  const updateGameState = (i, j, val) => {
    let elem = document.getElementById(getIdFromIndices(i, j));
    elem.innerHTML = gameState[i][j] = val;
    elem.style.color = (val === "X" ? "#FFA500" : "#7B68EE");
    fadeInAnimation(elem);
  }

  const fadeInAnimation = (elem) => {
    let currentOpacity = Number(elem.style.opacity);
    if (currentOpacity < 1) {
      elem.style.opacity = currentOpacity + 0.1;
      setTimeout(() => { fadeInAnimation(elem) }, ANIMATION_DELAY);
    } else {
      isUserAllowedToPlay = true;
    }
  }

  const getIdFromIndices = (i, j) => {
    return CELL_ID_PREFIX + (i + 1) + (j + 1);
  }

  const canContinueGame = () => {
    return ((movesMade < MAX_MOVES) && !hasAnyOneWon);
  }

  const isCellFilled = (i, j) => {
    return gameState[i][j] !== '';
  }

  const playUsersMove = (i, j) => {
    if (!canContinueGame() || isCellFilled(i, j) || !isUserAllowedToPlay) {
      return;
    }
    isUserAllowedToPlay = false;

    updateGameState(i, j, 'X');
    movesMade++;
    if (!hasPlayerWon('User', i, j, 'X')) {
      setTimeout(playComputersMove, ANIMATION_DELAY * 3);
    }
  }

  const playComputersMove = () => {
    if (!canContinueGame()) {
      return;
    }

    let minRange = 0, maxRange = MATRIX_SIZE;
    let i, j;
    i = j = Math.floor(MATRIX_SIZE / 2);
    while (isCellFilled(i, j)) {
      i = Math.floor(Math.random() * (maxRange - minRange) + minRange);
      j = Math.floor(Math.random() * (maxRange - minRange) + minRange);
    }

    updateGameState(i, j, 'O');
    movesMade++;

    hasPlayerWon('Computer', i, j, 'O');
  }

  const hasPlayerWon = (player, lasti, lastj, lastVal) => {
    // for - First Outer Ring, Sor - Second Outer Ring
    const isItAStrike = (forx, fory, sorx, sory, li, lj, lv) => {
      for (let i = 0; i < forx.length; i++) {
        const calcforx = li + forx[i];
        const calcfory = lj + fory[i];
        const calcsorx = li + sorx[i];
        const calcsory = lj + sory[i];

        const pos1 = (gameState[calcforx] && gameState[calcforx][calcfory]) ? gameState[calcforx][calcfory] : '';
        const pos2 = (gameState[calcsorx] && gameState[calcsorx][calcsory]) ? gameState[calcsorx][calcsory] : '';
        const pos3 = lv;

        if (pos1 === pos3 && pos2 === pos3) {
          wonIds = [];
          wonIds.push(getIdFromIndices(Math.min(calcforx, calcsorx, li), Math.min(calcfory, calcsory, lj)));
          wonIds.push(getIdFromIndices(Math.max(calcforx, calcsorx, li), Math.max(calcfory, calcsory, lj)));

          drawStrikeLine(wonIds[0], wonIds[1], true);
          return true;
        }
      }
      return false;
    }

    let hasWon = false;
    /*

    *****
    *****
    **#**
    *****
    *****

    LeftHorizontal      -> [-1,  0][-2,  0]
    LeftTopDiagonal     -> [-1,  1][-2,  2]

    TopVertical         -> [ 0,  1][ 0,  2]
    RightTopDiagonal    -> [ 1,  1][ 2,  2]

    RightHorizontal     -> [ 1,  0][ 2,  0]
    RightBottomDiagonal -> [ 1, -1][ 2, -2]

    BottomVertical      -> [ 0, -1][ 0, -2]
    LeftBottomDiagonal  -> [-1, -1][-2, -2]
    */

    hasWon = isItAStrike(
      [-1, -1, 0, 1, 1, 1, 0, -1],
      [0, 1, 1, 1, 0, -1, -1, -1],
      [-2, -2, 0, 2, 2, 2, 0, -2],
      [0, 2, 2, 2, 0, -2, -2, -2],
      lasti,
      lastj,
      lastVal
    );

    /*
    ***
    *#*
    ***

    Horizontal     -> [-1,  0][ 1,  0]
    Diagonal       -> [-1,  1][ 1, -1]
    Vertical       -> [ 0,  1][ 0, -1]
    ReverseDiagnol -> [ 1,  1][-1, -1]
    */

    // Skip if already won with previous check
    hasWon = hasWon || isItAStrike(
      [-1, -1, 0, 1],
      [0, 1, 1, 1],
      [1, 1, 0, -1],
      [0, -1, -1, -1],
      lasti,
      lastj,
      lastVal
    );

    if (hasWon) {
      hasAnyOneWon = hasWon;
      document.getElementById("message").innerHTML = (player === "User" ? "You" : player) + ' won the game!';
    } else if (movesMade >= MAX_MOVES) {
      document.getElementById("message").innerHTML = 'It\'s a tie!';
    }
    return hasWon;
  }

  const redrawOnScreenChange = () => {
    if (hasAnyOneWon) {
      drawStrikeLine(wonIds[0], wonIds[1], false);
    }
  }

  window.onload = resetGame;
  window.onresize = redrawOnScreenChange;
  window.onscroll = redrawOnScreenChange;

  return (
    <div className="App">
      <h2>Tic Tac Toe!</h2>
      <h3>Shall we play? &#128512;</h3>
      <svg>
        <line id="strikeLine"></line>
      </svg>
      <table>
        <tbody>
          {Array.from(Array(MATRIX_SIZE).keys()).map((rowVal, i) => {
            return (
              <tr key={"row" + i}>
                {Array.from(Array(MATRIX_SIZE).keys()).map((cellVal, j) => {
                  let id = getIdFromIndices(i, j);
                  return <td key={"key-" + id} onClick={() => { playUsersMove(i, j) }}><p className="cell" id={id} /></td>
                })}
              </tr>)
          })}
        </tbody>
      </table>
      <br />
      <p id="message">&nbsp;</p>
      <br />
      <button onClick={() => { resetGame() }}>Reset Game</button>
    </div>
  );
}

export default App;