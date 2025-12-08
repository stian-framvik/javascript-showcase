// mapmaker-script.js

// Import utilities
import { updateScriptDescription, setResponse, containerId, containerObj } from '../main.js';
import { setupEventListeners, removeEventListeners } from './event-handlers.js';

//  Metadata
const scriptName = 'Map Maker';
const scriptDescription = ' '; //'Terrain Editor: Click tiles to change their type. Use the menu to select tools.';
let mapRows = 5, mapCols = 5;
let mapSize = 5;

// DOM Elements
const infoWrapper = document.getElementById('info-wrapper');
const menuContainer = document.createElement('div');
menuContainer.id = 'mapmaker-menu';
menuContainer.innerHTML = `
    <h3>MAP SETTINGS</h3>
    <div class="menu-buttons">
        <button id="tool-grass" class="tool-button">Grass</button>
        <button id="tool-water" class="tool-button">Water</button>
        <button id="tool-hill" class="tool-button">Hill</button>
        <button id="tool-reset" class="tool-button">Reset</button>
        <button id="tool-save" class="tool-button">Save Map</button>
        <button id="tool-load" class="tool-button">Load Map</button>
    </div>
    <input type="file" id="file-input" accept=".json" style="display: none;">
`;
const contextMenu = document.createElement('div');
contextMenu.id = 'tile-context-menu';
contextMenu.innerHTML = `
    <ul>
        <li id="context-type">Type: <span></span></li>
        <li id="context-symbol">Symbol: <span></span></li>
        <li id="context-color">Colour: <span></span></li>
        <li id="context-traversable">Traversable: <span></span></li>
        <li id="context-coords">Coordinates: <span></span></li>
    </ul>`;
document.body.appendChild(contextMenu);


// Terrain types
const TERRAIN_TYPES = {
    empty: { symbol: ' ', color: '#f0f0f0', traversable: true },
    grass: { symbol: '.', color: '#4CAF50', traversable: true },
    water: { symbol: '~', color: '#2196F3', traversable: true },
    hill: { symbol: '^', color: '#795548', traversable: true },
}


// Active tool (default: grass)
let activeTool = 'grass';

// Core classes
class Tile {
    constructor(row, col, type = 'empty') {
        this.row = row;
        this.col = col;
        this.type = type;
        this.symbol = TERRAIN_TYPES[type].symbol;
        this.color = TERRAIN_TYPES[type].color;
        this.traversable = TERRAIN_TYPES[type].traversable;
    }
}

class Cell {
    constructor(row, col, container) {
        this.row = row;
        this.col = col;
        this.element = document.createElement('div');
        this.element.className = 'cell';
        this.element.id = `cell-${row}-${col}`;
        this.element.style.fontFamily = 'monospace';
        this.element.style.fontSize = '24px';
        this.element.style.display = 'flex';
        this.element.style.justifyContent = 'center';
        this.element.style.alignItems = 'center';
        container.appendChild(this.element);
    }

    updateAppearance(tile) {
        this.element.textContent = tile.symbol;
        this.element.style.backgroundColor = tile.color;
    }
}

class Map {
    constructor(rows = mapSize, cols = mapSize) {
        this.rows = rows;
        this.cols = cols;
        this.tiles = [];
        this.initTiles();
    }

    initTiles() {
        for (let row = 0; row < this.rows; row++) {
            this.tiles[row] = [];
            for (let col = 0; col < this.cols; col++) {
                this.tiles[row][col] = new Tile(row, col, 'empty');
            }
        }
    }

    setTile(row, col, type) {
        this.tiles[row][col] = new Tile(row, col, type);
        this.render();
    }

    render() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const tile = this.tiles[row][col];
                const cellId = `cell-${row}-${col}`;
                const cell = document.getElementById(cellId);
                if (cell) {
                    cell.textContent = tile.symbol;
                    cell.style.backgroundColor = tile.color;
                }
            }
        }
    }
}

// Map Maker functions
function makeMap(container = containerObj, rows = mapSize, cols = mapSize, existingMap = null) {
    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = `repeat(${cols}, 100px)`;
    container.style.gridTemplateRows = `repeat(${rows}, 100px)`;
    container.style.gap = '2px';
    container.style.justifyContent = 'center';

    const map = existingMap || new Map(rows, cols);
    const cells = [];


    // Create cells
    for (let row = 0; row < rows; row++) {
        cells[row] = [];
        for (let col = 0; col < cols; col++) {
            cells[row][col] = new Cell(row, col, container);
            cells[row][col].element.addEventListener('click', () => {
                map.setTile(row, col, activeTool);
            });
            // Add right-click handler
            cells[row][col].element.addEventListener('contextmenu', (event) => {
                event.preventDefault(); // Prevent default context menu
                showTileContextMenu(event, map.tiles[row][col], row, col);
            });
        }
    }



    return map;
}

// Event Handlers

const mapmakerHandlers = {
    click: [
        (event) => {
            if (event.target.classList.contains('tool-button')) {
                activeTool = event.target.id.replace('tool-', '');
                setResponse(`Selected tool: ${activeTool}`);
            }
        }
    ]
};

//  Init

export function init() {
    updateScriptDescription(scriptName, scriptDescription);
    setupEventListeners(scriptName, mapmakerHandlers);

    // Prepend menu to info wrapper.
    infoWrapper.prepend(menuContainer);

    // Initialize map
    const map = makeMap();

    // Set up tool buttons
    document.getElementById('tool-grass').addEventListener('click', () => {
        activeTool = 'grass';
    });
    document.getElementById('tool-water').addEventListener('click', () => {
        activeTool = 'water';
    });
    document.getElementById('tool-hill').addEventListener('click', () => {
        activeTool = 'hill';
    });
    document.getElementById('tool-reset').addEventListener('click', () => {
        map.initTiles();
        map.render();
        setResponse(`Map reset to ${map.rows}x${map.cols}`);
    });

    // The Save Map button
    document.getElementById('tool-save').addEventListener('click', () => {
        saveMap(map);
        setResponse(`Map saved to Downloads as map_${map.rows}x${map.cols}.json`);
    });
    // The Load Map button
    document.getElementById('tool-load').addEventListener('click', async () => {
        try {
            await loadMap(map);
        } catch (error) {
            console.error('Failed to load map:', error);
        }
    });
}

export function cleanup() {
    removeEventListeners(scriptName);
    containerObj.innerHTML = '';
    if (menuContainer && menuContainer.parentNode === infoWrapper) {
        infoWrapper.removeChild(menuContainer);
    }
    if (contextMenu && contextMenu.parentNode === document.body) {
        document.body.removeChild(contextMenu);
    }
}

function saveMap(map) {
    const mapData = {
        rows: map.rows,
        cols: map.cols,
        tiles: map.tiles.map(row =>
            row.map(tile => ({
                row: tile.row,
                col: tile.col,
                type: tile.type,
                symbol: tile.symbol,
                color: tile.color,
                traversable: tile.traversable
            }))
        )
    };

    const jsonStr = JSON.stringify(mapData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `map_${map.rows}x${map.cols}.json`;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

function loadMap(map) {
    return new Promise((resolve, reject) => {
        const fileInput = document.getElementById('file-input');
        fileInput.click();

        fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (!file) {
                setResponse('No file selected.');
                return resolve(false);
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const mapData = JSON.parse(e.target.result);

                    // Validate map data structure
                    if (!mapData.rows || !mapData.cols || !mapData.tiles) {
                        throw new Error('Invalid map file structure.');
                    }

                    // Update the map
                    map.rows = mapData.rows;
                    map.cols = mapData.cols;
                    map.tiles = mapData.tiles.map(row =>
                        row.map(tileData => new Tile(
                            tileData.row,
                            tileData.col,
                            tileData.type
                        ))
                    );

                    // Re-render the map with the new map data
                    containerObj.innerHTML = '';
                    const updatedMap = makeMap(containerObj, map.rows, map.cols, map);
                    map.render();
                    setResponse(`Map loaded: ${map.rows}x${map.cols}`);
                    resolve(true);
                } catch (error) {
                    setResponse(`Error loading map: ${error.message}`);
                    reject(error);
                } finally {
                    fileInput.value = '';
                }
            };
            reader.readAsText(file);
        };
    });
}

function showTileContextMenu(event, tile, row, col) {
    // Update context menu content
    document.getElementById('context-type').querySelector('span').textContent = tile.type;
    document.getElementById('context-symbol').querySelector('span').textContent = tile.symbol;
    document.getElementById('context-color').querySelector('span').textContent = tile.color;
    document.getElementById('context-traversable').querySelector('span').textContent = tile.traversable ? 'Yes' : 'No';
    document.getElementById('context-coords').querySelector('span').textContent = `${row}, ${col}`;

    // Position the menu near the mouse
    contextMenu.style.display = 'block';
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.top = `${event.pageY}px`;

    // Close menu when clicking elsewhere
    const closeMenu = () => {
        contextMenu.style.display = 'none';
        document.removeEventListener('click', closeMenu);
    };
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 0)
}