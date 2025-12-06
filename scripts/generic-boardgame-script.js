// generic-boardgame-script.js

import '../main.js';
import { updateScriptDescription, setResponse, setGameBoard } from '../main.js';

var i;
let keyupListener = null;
let gameBoardSize = '5';
let description = '';
const wrapperId = 'script-wrapper';
const containerId = 'script-container';
const containerObject = document.getElementById(containerId);
const wrapperObject = document.getElementById(wrapperId);

export function init() {
    // Initialisation function
}
