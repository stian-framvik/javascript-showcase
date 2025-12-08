// generic-boardgame-script.js

import '../main.js';
import { updateScriptDescription, setResponse } from '../main.js';
import { wrapperId, wrapperObj, containerId, containerObj } from '../main.js';
import { setupEventListeners, removeEventListeners } from './event-handlers.js';

let scriptDescription = 'Generic Board Game™! Use arrow keys to move your piece.';
const boardSize = 7;
const scriptName = 'generic-boardgame-script';

const genericBoardgameHandlers = {
    // Key presses
    keyboard: {
        'ArrowUp': () => setResponse(`Going North!`),
        'ArrowDown': () => setResponse(`Going South!`),
        'ArrowLeft': () => setResponse(`Going West!`),
        'ArrowRight': () => setResponse(`Going East!`)
    },
    click: [
        (event) => {
            if (event.target.classList.contains('cell') && !event.target.classList.contains('tile')) {
                console.log(`That's an empty cell!`);
            }
        }
    ],
}

export function init() {
    console.log('Initializing Generic Board Game (tm) ...');
    updateScriptDescription('generic-boardgame', scriptDescription);
    // Initialisation function
    setupEventListeners('generic-boardgame-script', genericBoardgameHandlers);
    // Set up the game board
    const board = makeGameBoard();
    // Place a custom tile on the board.

    board.placeTile(new Tile(2, 3, 'water'), 2, 3)
    // Place a player piece at (0, 0)
    const player = new Piece('player', 'player1');
    board.placePiece(player, 0, 0);

    // Handle keyboard input
    genericBoardgameHandlers.keyboard = {
        'ArrowUp': () => player.move('ArrowUp', board),
        'ArrowDown': () => player.move('ArrowDown', board),
        'ArrowLeft': () => player.move('ArrowLeft', board),
        'ArrowRight': () => player.move('ArrowRight', board),
    };

}

class Board {
    constructor(rows = boardSize, cols = boardSize) {
        this.rows = rows;
        this.cols = cols;
        this.tiles = [];
        this.pieces = [];
        this.initTiles();
    }

    // First make an empty grid of rows*cols
    initTiles() {
        for (let row = 0; row < this.rows; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.tiles[row][col] = new Tile(row, col, 'empty');
            }
        }
    }   // EO: initTiles

    // Place a tile at (row, col)
    placeTile(tile, row, col) {
        this.tiles[row][col] = tile;
        // [TODO: Update the corresponding Cell's appearance]
    }   // EO: placeTile

    placePiece(piece, row, col) {
        const tile = this.tiles[row][col];
        tile.piece = piece;
        piece.row = row;
        piece.col = col;
        this.pieces.push(piece);
        // TODO: Update the Cell to show the piece
    }   // EO: placePiece

    movePiece(piece, newRow, newCol) {
        const oldTile = this.tiles[piece.row][piece.col];
        const newTile = this.tiles[newRow][newCol];

        // Check if the move is valid (e.g. tile is traversable)
        if (newTile.isTraversable && !newTile.piece) {
            oldTile.piece = null;
            newTile.piece = piece;
            piece.row = newRow;
            piece.col = newCol;
            // [TODO: Update the DOM to reflect the move]
            return true; // Move is allowed!
        }
        console.log(`Moving ${piece.pcId} from ${oldTile.tileId} to ${newTile.tileId} is not allowed!`);
        return false;   // Move is blocked!
    }   // EO: movePiece
}   // End of class Board

class Tile {
    constructor(row, col, type = 'empty') {
        this.row = row;
        this.col = col;
        this.type = type;
        this.isTraversable = true;
        this.isHidden = false;
        this.piece = null;
        this.effect = null;
    }
}

class Piece {
    constructor(type, owner) {
        this.type = type;
        this.owner = owner;
        this.row = null;
        this.col = null;
        this.inventory = [];
        this.health = 100;
    } // EO: constructor

    move(direction, board) {
        let newRow = this.row;
        let newCol = this.col;

        // Calculate new position based on direction.
        switch (direction) {
            case 'ArrowUp': newRow--; break;
            case 'ArrowDown': newRow++; break;
            case 'ArrowLeft': newCol--; break;
            case 'ArrowRight': newCol++; break;
        }

        // Ask the board to handle the move
        return board.movePiece(this, newRow, newCol);
    }   // EO: move()
    // [TODO: Add methods for interactions, attacks, inventory, etc.]

}   // EO: class Piece

class Cell {
    constructor(row, col, container) {
        this.row = row;
        this.col = col;
        this.element = document.createElement('div');
        this.element.className = 'cell';
        this.element.id = `cell-${row}-${col}`;
        this.updateAppearance(); // set initial appearance
        container.appendChild(this.element);
    } // EO: constructor

    // Set and/or update the appearance of the cell depending on its Tile, Piece and hidden...ness.
    updateAppearance() {
        // [TODO: Style the cell based on Tile.type or Piece.type]
        // Example:
        // if (tile.type === 'water) this.element.style.backgroundColor = 'blue';
        // if (piece) this.element.textContent = piece.-type[]; // Show first letter
    }

    //  [TODO: Add event listners for clicks, hover effects, etc.]
}   // EO: class Cell

function makeGameBoard(container = containerObj, rows = boardSize, cols = boardSize) {
    container.innerHTML = '';
    container.style.display = 'grid'; // Add this line!
    container.style.gridTemplateColumns = `repeat(${cols}, 100px)`; // Set column count
    container.style.gridTemplateRows = `repeat(${rows}, 100px)`; // Set row count
    container.style.gap = '0'; // Optional: Add gaps between cells

    const board = new Board(rows, cols);
    const cells = [];
    for (let row = 0; row < rows; row++) {
        cells[row] = [];
        for (let col = 0; col < cols; col++) {
            cells[row][col] = new Cell(row, col, container);
            board.tiles[row][col].cell = cells[row][col];
        }
    }
    return board;
}


export function cleanup() {
    removeEventListeners(scriptName);
    containerObj.innerHMTL = '';
    // if (menuContainer && menuContainer.parentNode === infoWrapper) {
    //     infoWrapper.removeChild(menuContainer);
    // }
}