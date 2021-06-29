import './App.css';

function App() {
  const MATRIX_SIZE = 3;
  const ANIMATION_DELAY = 100;
  const MAX_MOVES = MATRIX_SIZE * MATRIX_SIZE;
  const EMPTY_CELL = '&nbsp;&nbsp;&nbsp;';

  var gameState;
  var movesMade = 0;
  var hasAnyOneWon = false;

  const resetGame = () => {
    gameState = new Array(MATRIX_SIZE);
    for (let i = 0; i < MATRIX_SIZE; i++) {
      gameState[i] = new Array(MATRIX_SIZE);
      for (let j = 0; j < MATRIX_SIZE; j++) {
        gameState[i][j] = '';
        document.getElementById(getIdFromIndices(i, j)).innerHTML = EMPTY_CELL;
        document.getElementById("message").innerHTML = '';
      }
    }
    movesMade = 0;
    hasAnyOneWon = false;
  }

  const updateGameState = (i, j, val) => {
    let elem = document.getElementById(getIdFromIndices(i, j));
    elem.innerHTML = gameState[i][j] = val;
    fadeInAnimation(elem);
  }

  const fadeInAnimation = (elem) => {
    let currentOpacity = Number(elem.style.opacity);
    if (currentOpacity < 1) {
      elem.style.opacity = currentOpacity + 0.1;
      setTimeout(() => { fadeInAnimation(elem) }, ANIMATION_DELAY);
    }
  }

  const getIdFromIndices = (i, j) => {
    return "cell" + (i + 1) + (j + 1);
  }

  const canContinueGame = () => {
    return ((movesMade < MAX_MOVES) && !hasAnyOneWon);
  }

  const isCellFilled = (i, j) => {
    return gameState[i][j] !== '';
  }

  const playUsersMove = (i, j) => {
    if (!canContinueGame() || isCellFilled(i, j)) {
      return;
    }
    updateGameState(i, j, 'X');
    movesMade++;
    if (!hasPlayerWon('User', i, j, 'X')) {
      setTimeout(playComputersMove, 500);
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
      [ -1, -1, 0, 1, 1, 1, 0, -1 ],
      [ 0, 1, 1, 1, 0, -1, -1, -1 ],
      [ -2, -2, 0, 2, 2, 2, 0, -2 ],
      [ 0, 2, 2, 2, 0, -2, -2, -2 ],
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
      [ -1, -1, 0, 1 ],
      [ 0, 1, 1, 1 ],
      [ 1, 1, 0, -1 ],
      [ 0, -1, -1, -1 ],
      lasti,
      lastj,
      lastVal
    );

    if (hasWon){
      hasAnyOneWon = hasWon;
      document.getElementById("message").innerHTML = player + ' won the game!';
    } else if (movesMade >= MAX_MOVES) {
      document.getElementById("message").innerHTML ='It\'s a tie!';
    }
    return hasWon;
  }

  window.onload = resetGame;

  return (
    <div className="App">
      <table>
        <tbody>
          {Array.from(Array(MATRIX_SIZE).keys()).map((rowVal, i) => {
            return (
              <tr key={"row" + i}>
                {Array.from(Array(MATRIX_SIZE).keys()).map((cellVal, j) => {
                  let id = getIdFromIndices(i, j);
                  return <td key={"key-" + id} onClick={() => { playUsersMove(i, j) }}><p className="cell" id={id}/></td>
                })}
              </tr>)
          })}
        </tbody>
      </table>
      <br />
      <p id="message"></p>
      <br />
      <button onClick={()=>{resetGame()}}>Reset Game</button>
    </div>
  );
}

export default App;