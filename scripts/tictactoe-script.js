// tictactoe-script.js
import '../main.js';
import { updateScriptDescription, setResponse, setGameBoard } from '../main.js';

var i;
let keyupListener = null;
let gameBoardSize = '3';
let gamePlayerChar = 'X';
let gameComputerChar = 'O';
let description = '';
const wrapperId = 'script-wrapper';
const containerId = 'script-container';
const containerObject = document.getElementById(containerId);
const wrapperObject = document.getElementById(wrapperId);

export function init() {
    console.log('Tictactoe script is now running!');
    // Update the script description.
    updateDescription();
    setGameBoard(wrapperObject);

    if (keyupListener) {
        document.removeEventListener('keyup', keyupListener);
    }

    keyupListener = (event) => {
        if (event.key.toLowerCase() === '3') {
            gameBoardSize = 3;
            setResponse('Game board size is 3-by-3!');
        } else if (event.key.toLowerCase() === '4') {
            gameBoardSize = 4;
            setResponse('Game board size is 4-by-4!');
        } else if (event.key.toLowerCase() === '5') {
            gameBoardSize = 5;
            setResponse('Game board size is 5-by-5!');
        }

        if (event.key.toLowerCase() === 'x') {
            gamePlayerChar = 'X';
            gameComputerChar = 'O';
            setResponse('Player is X  -  Computer is O!');
        } else if (event.key.toLowerCase() === 'o') {
            gamePlayerChar = 'O';
            gameComputerChar = 'X';
            setResponse('Player is O  -  Computer is X!');
        }

        if (event.key.toLowerCase() === '0') {
            setResponse('Clearing the game board for a new game!');
            makeGameBoard();
        }
        updateDescription();
    }
    document.addEventListener('keyup', keyupListener)
}

export function cleanup() {
    if (keyupListener) {
        document.removeEventListener('keyup', keyupListener);
        keyupListener = null;
    }
}

function makeGameBoard(container = containerObject, size = gameBoardSize) {
    // Clear the container/game board.
    setGameBoard(wrapperObject);
    setResponse('Making new game board!');
    container = document.getElementById('script-container');

    // Set the grid template for the container (CSS Grid).
    Object.assign(container.style, {
        backgroundColor: '#540808',
        gridTemplateColumns: `repeat(${size}, 100px)`,
        gridTemplateRows: `repeat(${size}, 100px)`,
        height: 'fit-content',
        width: 'fit-content'
    });

    // Make the squares for the board.
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${row}-${col}`;
            cell.textContent = '';
            Object.assign(cell.style, {
                width: '100px',
                height: '100px',
                border: '1px solid black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '48px'
            });

            cell.addEventListener('click', () => {
                if (cell.textContent === '') {
                    cell.textContent = gamePlayerChar; // ᐁ
                }
            });
            container.appendChild(cell);
        }
    }
}

function updateDescription() {
    description = `Tic-Tac-Toe.` +
        `Press 3, 4 or 5 to set game board size, X or O to choose side. ` +
        `Current settings: [${gameBoardSize}-by-${gameBoardSize}] and [playing as ${gamePlayerChar}]`;
    updateScriptDescription('tictactoe-script', description);
}

// This is where the Tic-Tac-Toe game functionality would go if there was any