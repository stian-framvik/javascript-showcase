// circle-script.js
import '../main.js';
import { updateScriptDescription, setResponse } from '../main.js';
import { wrapperId, wrapperObj, containerId, containerObj } from '../main.js';
import { setupEventListeners, removeEventListeners } from './event-handlers.js';

let countCircles = 0;
const description = `Press 'c' to make a circle. Press 'd' to delete all circles.`;

const circleHandlers = {
    keyboard: {
        'c': () => createRandomCircle(),
        'd': () => deleteAllCircles()
    }
};

export function init() {
    console.log('Initializing Circle script ...');
    // Define where the circles can appear.
    // setGameBoard();
    // Set up the event listeners.
    setupEventListeners('circle', circleHandlers);
    // Then update script description.
    updateScriptDescription('circle-script', description);

}

export function cleanup() {
    removeEventListeners('circle');
    deleteAllCircles();
}

function createRandomCircle(wrapper = wrapperObj, wrapperId) {
    console.log(`wrapper width: ${wrapper.offsetWidth}, height: ${wrapper.offsetHeight}`);

    if (!wrapper) {
        console.error(`Container ${wrapperId} not found!`, error)
        return;
    }

    const radius = Math.floor(Math.random() * 46) + 5; // 5-50 px radius
    const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    const left = Math.random() * ((wrapper.offsetWidth + 800) - radius * 2);
    const top = Math.random() * (wrapper.offsetHeight - radius * 2);
    const circle = document.createElement("div");
    circle.className = 'circle';
    Object.assign(circle.style, {
        position: "absolute",
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        borderRadius: "50%",
        backgroundColor: color,
        left: `${left}px`,
        top: `${top}px`
    });
    wrapper.appendChild(circle);
    countCircles += 1;
    setResponse(`You have made ${countCircles} circles!`);
    return circle;
}
function deleteAllCircles(wrapper = document.getElementById('main-container')) {
    var circles = document.getElementsByClassName('circle');
    while (circles[0]) {
        circles[0].parentNode.removeChild(circles[0]);
    }
    countCircles = 0;
}