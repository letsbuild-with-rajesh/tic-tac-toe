import { React, useState, useRef } from 'react';
import * as GameMoveMath from './GameMoveMath';
import './App.css';

function App() {
  const MATRIX_SIZE = 3;
  const ANIMATION_DELAY = 100;
  const MAX_MOVES = MATRIX_SIZE * MATRIX_SIZE;
  const CELL_ID_PREFIX = 'cell';
  const ANIMATE_STEPS = 10;
  const STRIKE_ANIMATION_SECONDS = 0.5;

  const getIdFromIndices = (i, j) => {
    return CELL_ID_PREFIX + (i + 1) + (j + 1);
  }

  const [ message, setDisplayMessage ] = useState('');
  const [ gameState, setGameState ] = useState([...Array(MATRIX_SIZE)].map(e => Array(MATRIX_SIZE).fill('')));
  const [ wonState, setWonState ] = useState(false);
  const [ wonPositions, setWonPositions ] = useState([getIdFromIndices(0, 0) , getIdFromIndices(2, 2)]);
  const [ isUserAllowedToPlay, setUserAllowedToPlay ] = useState(true);
  const movesMadeRef= useRef(0);

  const updateGameState = (i, j, val) => {
    let elem = document.getElementById(getIdFromIndices(i, j));
    let tmpState = [...gameState];
    tmpState[i][j] = val;

    movesMadeRef.current++;
    setGameState(tmpState);
    fadeInAnimation(elem);
  }

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

  const fadeInAnimation = (elem) => {
    let currentOpacity = Number(elem.style.opacity);
    if (currentOpacity < 1) {
      elem.style.opacity = currentOpacity + 0.1;
      setTimeout(() => { fadeInAnimation(elem) }, ANIMATION_DELAY);
    } else {
      setUserAllowedToPlay(true);
    }
  }

  const canContinueGame = () => {
    return ((movesMadeRef.current < MAX_MOVES) && !wonState);
  }

  const isCellFilled = (i, j) => {
    return gameState[i][j] !== '';
  }

  const playUsersMove = (i, j) => {
    if (!canContinueGame() || isCellFilled(i, j) || !isUserAllowedToPlay) {
      return;
    }
    setUserAllowedToPlay(false);
    updateGameState(i, j, 'X');
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
    hasPlayerWon('Computer', i, j, 'O');
  }

  const hasPlayerWon = (player, lasti, lastj, lastVal) => {
    // for - First Outer Ring, Sor - Second Outer Ring
    const isItAStrike = (data) => {
      for (let i = 0; i < data[0].length; i++) {
        const calcforx = lasti + data[0][i];
        const calcfory = lastj + data[1][i];
        const calcsorx = lasti + data[2][i];
        const calcsory = lastj + data[3][i];

        const pos1 = (gameState[calcforx] && gameState[calcforx][calcfory]) ? gameState[calcforx][calcfory] : '';
        const pos2 = (gameState[calcsorx] && gameState[calcsorx][calcsory]) ? gameState[calcsorx][calcsory] : '';
        const pos3 = lastVal;

        if (pos1 === pos3 && pos2 === pos3) {
          let orderedIndexes = [];
          for (let m = 0; m < 3; m++) {
            for (let n = 0; n < 3; n++) {
              if ((n === calcforx && m === calcfory) ||
                  (n === calcsorx && m === calcsory) ||
                  (n === lasti && m === lastj)) {
                // Order indexes from left to right positions
                orderedIndexes.push([n, m]);
              }
            }
          }

          let wonIds = [];
          wonIds.push(getIdFromIndices(orderedIndexes[0][0], orderedIndexes[0][1]));
          wonIds.push(getIdFromIndices(orderedIndexes[2][0], orderedIndexes[2][1]));

          setWonPositions([wonIds[0], wonIds[1]]);
          drawStrikeLine(wonIds[0], wonIds[1], true);
          return true;
        }
      }
      return false;
    }

    let hasWon = false;

    hasWon = isItAStrike(GameMoveMath.ora);
    hasWon = hasWon || isItAStrike(GameMoveMath.ira);

    if (hasWon) {
      setWonState(hasWon);
      setDisplayMessage((player === "User" ? "You" : player) + ' won the game!');
    } else if (movesMadeRef.current >= MAX_MOVES) {
      setDisplayMessage('It\'s a tie!');
    }
    return hasWon;
  }

  const resetGame = () => {
    setGameState([...Array(MATRIX_SIZE)].map(e => Array(MATRIX_SIZE).fill('')));
    setDisplayMessage('');
    movesMadeRef.current = 0;
    setWonState(false);

    let strikeLineEl = document.getElementById("strikeLine");
    strikeLineEl.setAttribute('x1', 0);
    strikeLineEl.setAttribute('y1', 0);
    strikeLineEl.setAttribute('x2', 0);
    strikeLineEl.setAttribute('y2', 0);
  }

  const redrawOnScreenChange = () => {
    if (wonState) {
      drawStrikeLine(wonPositions[0], wonPositions[1], false);
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
        <line id="strikeLine"/>
      </svg>
      <table>
        <tbody>
          {gameState.map((rowVal, i) => {
            return (
              <tr key={"row" + i}>
                {rowVal.map((cellVal, j) => {
                  let id = getIdFromIndices(i, j);
                  return (<td key={"key-" + id} onClick={() => { playUsersMove(i, j) }}>
                           <p className="cell" style={{color: (cellVal === "X"? "#FFA500": "#7B68EE")}} id={id}>
                             {cellVal === '' ? <>&nbsp;&nbsp;&nbsp;</> : cellVal}
                           </p>
                         </td>);
                })}
              </tr>)
          })}
        </tbody>
      </table>
      <br />
      <p id="message">{message === '' ? <>&nbsp;</> : message}</p>
      <br />
      <button onClick={() => { resetGame() }}>Reset Game</button>
    </div>
  );
}

export default App;
