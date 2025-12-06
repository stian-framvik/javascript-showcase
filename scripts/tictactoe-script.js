// tictactoe-script.js
import '../main.js';
import { updateScriptDescription, setResponse } from '../main.js';
import { wrapperId, wrapperObj, containerId, containerObj } from '../main.js';
import { setupEventListeners, removeEventListeners } from './event-handlers.js';


// Initial game state
let gameBoardSize = '3';
let currentPlayer = 'X';
let description = '';

const tictactoeHandlers = {
    // Key presses
    keyboard: {
        '0': () => makeGameBoard(),
        'Escape': () => alert('Game paused!'),
    },
    // Mouse clicks
    click: [
        (event) => {
            if (event.target.classList.contains('cell') && !event.target.textContent) {
                event.target.textContent = currentPlayer;
                currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // ?
            }
        }
    ],
    // Misc, e.g. cursor hovering
    custom: [
        {
            event: 'mouseover',
            selector: '.cell',
            callback: (event) => {
                event.target.style.backgroundColor = '#e0e0e0';
            }
        },
        {
            event: 'mouseout',
            selector: '.cell',
            callback: (event) => {
                event.target.style.backgroundColor = 'white';

            }
        }
    ],
};

export function init() {
    console.log('Initializing Tic-Tac-Toe script ...');
    // First the Tic-Tac-Toe UI.
    makeGameBoard();
    // Then the event listeners.
    setupEventListeners('tictactoe', tictactoeHandlers);
    // Update the script description.
    updateDescription();
}



export function cleanup() {
    removeEventListeners('tictactoe');
}

function makeGameBoard(container = containerObj, size = gameBoardSize) {
    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${size}, 100px)`;
    container.style.gridTemplateRows = `repeat(${size}, 100px)`;
    container.style.gap = '5px';

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const cell = makeCell(row, col);
            container.appendChild(cell);
        }
    }
}

function makeCell(row, col) {
    var c = document.createElement('div');
    c.className = 'cell';
    c.id = `cell-${row}-${col}`;
    return c;
};



function updateDescription() {
    description = `Tic-Tac-Toe.   You are 'X', press '0' to start the game.`;
    updateScriptDescription('tictactoe-script', description);
}

// This is where the Tic-Tac-Toe game functionality would go if there was any