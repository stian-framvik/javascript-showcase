// generic-boardgame-script.js

import '../main.js';
import { updateScriptDescription, setResponse } from '../main.js';
import { wrapperId, wrapperObj, containerId, containerObj } from '../main.js';
import { setupEventListeners, removeEventListeners } from './event-handlers.js';

let gameBoardSize = '10';
let scriptDescription = 'Generic Board Game™! Use arrow keys to move your piece.';
let scriptName = 'Generic Boardgame';

const genericBoardgameHandlers = {
    // Key presses
    keyboard: {
        'ArrowUp': () => setResponse(`Going North!`),
        'ArrowDown': () => setResponse(`Going South!`),
        'ArrowRight': () => setResponse(`Going East!`),
        'ArrowLeft': () => setResponse(`Going West!`)
    }
}

export function init() {
    console.log('Initializing Generic Board Game (tm) ...');
    updateScriptDescription('generic-boardgame', scriptDescription);
    // Initialisation function
    setupEventListeners('genericBoardGame', genericBoardgameHandlers);
    // Set up the board
    makeGameBoard();

}

function makeGameBoard(container = containerObj, size = gameBoardSize) {
    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${size}, 100px)`;
    container.style.gridTemplateRows = `repeat(${size}, 100px)`;
    container.style.gap = '5px';

    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            // cell.id = `cell-${row}-${col}`;
            const cell = makeCell(row, col);
            container.appendChild(cell);
        }
    }
}

function makeCell(row, col) {
    var cell = document.createElement('div');
    cell.className = 'cell';
    cell.id = `cell-${row}-${col}`;
    return cell;
}