/*
    Project: TicTacToe with AI minimax algorithm
    Revision History:
          Patricia Cortezzi, 2019-12-21: Created
          Patricia Cortezzi, 2019-12-21: UI Designed
          Patricia Cortezzi, 2019-12-21: Bug Fixed
*/

let originalBoard;
let allCellsFilled = 0;

const humanPlayer = '0';
const aiPlayer = 'X';
const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];
const cells = document.querySelectorAll('.cell');


/** Checks if all cells are filled and, if positive, handles the display and functionalities to user
 * @return {boolean}
 */
function CheckTie()
{
    /* Checking the number of empty cells and if either humanPlayer or aiPlayer won to determine the tie */
    if (EmptyCells().length === allCellsFilled &&
        (!CheckWin(originalBoard, humanPlayer) || !CheckWin(originalBoard, aiPlayer)))
    {
        for (let i = 0; i < cells.length; i++)
        {
            cells[i].style.backgroundColor = "lightGreen";
            cells[i].removeEventListener('click', TurnClick, false);
        }
        DeclareWinner("Tie game. That was tough!");
        return true;
    }
    return false;
}

/** Minimax algorithm to define recursively which next movement is better for the aiPlayer
 * @param {object} board
 * @param {string} player
 * @return {object}
 */
function Minimax(board, player)
{
    let availableSpots = EmptyCells(board);

    if (CheckWin(board, humanPlayer))
    {
        return {score: -10};
    }
    else if (CheckWin(board, aiPlayer))
    {
        return {score: 10};
    }
    else if (availableSpots.length === 0)
    {
        return {score: 0};
    }
    let moves = [];
    for (let i = 0; i < availableSpots.length; i++)
    {
        let move = {};
        move.index = board[availableSpots[i]];
        board[availableSpots[i]] = player;

        if (player === aiPlayer)
        {
            let result = Minimax(board, humanPlayer);
            move.score = result.score;
        }
        else
        {
            let result = Minimax(board, aiPlayer);
            move.score = result.score;
        }
        board[availableSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer)
    {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++)
        {
            if (moves[i].score > bestScore)
            {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    else
    {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++)
        {
            if (moves[i].score < bestScore)
            {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

/** Runs through originalBoard and return all cells that are numbers (empty), not X or O
 * @return {object}
 * */
function EmptyCells()
{
    return originalBoard.filter(element => typeof element == 'number');
}

/** Function to display who won the game
 * @param {string} whoWon
 * */
function DeclareWinner(whoWon)
{
    document.querySelector(".endOfGame").style.display = "block";
    document.querySelector(".endOfGame .text").innerHTML = whoWon;
}

/** A function that handles the game output after having a winner
 * @param {object} gameWon
 * */
function GameOver(gameWon)
{
    /* Using ternary operation to determine the background color change after winning*/
    for (let index of winningCombinations[gameWon.index])
    {
        document.getElementById(index).style.backgroundColor =
            (gameWon.player === humanPlayer ? "RoyalBlue" : "OrangeRed");
    }

    /* Making every cell non-clickable after winning the game */
    for (let i = 0; i < cells.length; i++)
    {
        cells[i].removeEventListener('click', TurnClick, false);
    }
    DeclareWinner(gameWon.player === humanPlayer
        ? "You win. Congrats!" : "The Robot wins. Better luck next time!");
}

/**
 * @param {object} board
 * @param {string} player
 * @return {object}
 * @return {(null|object)}
 */
function CheckWin(board, player)
{
    /* Reduce method will go through every element of board array, will check if the element is equal the player.
    It it is, it'll add the index to accumulator array, if it's not, it'll return accumulator just as it is.
    By doing that we can find every index the player has played so far.
    Accumulator is initialized as an empty array */
    let plays = board.reduce((accumulator, element, index) =>
        (element === player) ? accumulator.concat(index) : accumulator, []);
    let gameWon = null;

    /* for/of - loops through the values of an iterable object
    This loop will check if any player have won the game so far */
    for (let [index, win] of winningCombinations.entries())
    {
        /* win.every means going through every element of win (the array inside an array), it'll check if the index of
        plays is > -1, which means checking if the player has played in every spot for that win */
        if (win.every(element => plays.indexOf(element) > -1))
        {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

/** A function that can be called by the human and AI players
 * @param {(string|number)} cellId
 * @param {string} player
 */
function Turn(cellId, player)
{
    originalBoard[cellId] = player;
    document.getElementById(cellId).innerText = player;
    let gameWon = CheckWin(originalBoard, player);
    if (gameWon)
    {
        GameOver(gameWon);
    }
}

/** Calls the Turn function when it's the human player's turn
 * @param {object} cell
 * */
function TurnClick(cell)
{
    /* This command shows on console every cell's id clicked by the user
    console.log(cell.target.id); */

    /* Checking if anyone had already clicked on that cell */
    if (typeof originalBoard[cell.target.id] == 'number')
    {
        Turn(cell.target.id, humanPlayer);

        if (!CheckTie())
        {
            Turn(Minimax(originalBoard, aiPlayer).index, aiPlayer);
        }
    }
}

/** A function called at the beginning of every game to handle the game's output */
function StartGame()
{
    /* Every time the StartGame function runs, the end of game display will be set to none*/
    document.querySelector('.endOfGame').style.display = "none";

    /* Create an array of nine elements, get their keys and create another array from it
     to assign it to originalBoard variable */
    originalBoard = Array.from(Array(cells.length).keys());

    for (let i = 0; i < cells.length; i++)
    {
        cells[i].innerHTML = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', TurnClick, false);
    }
}

StartGame();

/*
 * Return tags source: https://jsdoc.app/tags-returns.html
 * Typeof variables: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
 */