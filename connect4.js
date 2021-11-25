/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard(width, height) {
  const rows = [];
  for(let i = 0; i < WIDTH; i++) {
    rows.push(null);
  }
  for(let i = 0; i < HEIGHT; i++) {
    board.push([...rows]);
  }
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"

  const htmlBoard = document.getElementById('board');
  

  // TODO: add comment for this code
  // creates non-playable tr to highlight  and listen for click in selected column for findSpotforCol() and placeInTable()
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  // Creates table rows of WIDTH # of td's and HEIGHT # of tr's and adds to htmlBoard.
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

function findSpotForCol(x) {
  //runs loop to check board array for next 'empty' row in column x
  for(let y = HEIGHT - 1; y >= 0; y --) {
    if(!board[y][x]) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  const piece = document.createElement('div');
  piece.classList.add(`player${currPlayer}`);
  const square = document.getElementById(`${y}-${x}`);
  square.append(piece);
  setTimeout(() => piece.classList.add('piece'), 100)
}

/** endGame: announce game end */



function endGame(msg) {
    alert(msg);
    location.reload();
  // TODO: pop up alert message
}

/** handleClick: handle click of column top to play piece */

// if (checkForWin()) {
//   let row = document.querySelectorAll("#column-top");
//   row.removeEventListener("click", handleClick);
// }

function handleClick(evt) {

  // get x from ID of clicked cell
  let x = parseInt(evt.target.id);


  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;


  placeInTable(y, x);

  // check for win

  // get DOM elements for event listeners for win
  let cell = document.getElementById(`${y}-${x}`);
  let evtTarget = document.getElementById("column-top");

  if (checkForWin()) {
    let winner = currPlayer;
    evtTarget.removeEventListener('click', handleClick);
    cell.addEventListener('animationend', () => {
      return endGame(`Player ${winner} won!`)});
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if (board.every(row => row.every(cell => cell))) {
    return endGame('It`s a tie!');
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    // check all four coordinates are on the board and belong to currPlayer
    // (this function will run 4 times for each array within the cells argument since for loops still define wins with coordinates off of board (ie. if x is width, horiz will be off board))
    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  // define four legal wins of four in a row horizontally, vertically diagonally right and diagonally left
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      // use x to see if 4 adjacent columns in row y are same player
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      // see if four adjacent rows in column y are same player
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      // check diagonal going down right of last played piece
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      // check diagonal going down left of last player piece for four of same player
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      // using y, x coordinates of last piece played, check for any four legal wins
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();