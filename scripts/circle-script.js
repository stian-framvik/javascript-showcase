// circle-script.js
import '../main.js';
import { updateScriptDescription, setGameBoard, setResponse } from '../main.js';

let keyupListener = null;
let countCircles = 0;
const description = `Press 'c' to make a circle. Press 'd' to delete all circles.`;
const containerId = 'script-container';
const wrapperId = 'script-wrapper';
const containerObject = document.getElementById(containerId);
const wrapperObject = document.getElementById(wrapperId);

export function init() {
    console.log('Circle script activated!');
    // Update the script description.
    setGameBoard(wrapperObject);

    updateScriptDescription('circle-script', description);

    if (keyupListener) {
        document.removeEventListener('keyup', keyupListener)
    }

    keyupListener = (event) => {
        if (event.key.toLowerCase() === 'c') {
            createRandomCircle();
            setResponse(`You've made ${countCircles} random circles!`);
        } else if (event.key.toLowerCase() === 'd') {
            deleteAllCircles();
            setResponse('All the circles are gone!');
        }
    };
    document.addEventListener('keyup', keyupListener)
}

export function cleanup() {
    if (keyupListener) {
        document.removeEventListener('keyup', keyupListener);
        keyupListener = null;
    }
}

function createRandomCircle(wrapper = wrapperObject, wrapperId) {
    if (!wrapper) {
        console.error(`Container ${wrapperId} not found!`, error)
        return;
    }

    const radius = Math.floor(Math.random() * 46) + 5; // 5-50 px radius
    const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    const left = Math.random() * (wrapper.offsetWidth - radius * 2);
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
    return circle;
}
function deleteAllCircles(wrapper = document.getElementById('main-container')) {
    var circles = document.getElementsByClassName('circle');
    while (circles[0]) {
        circles[0].parentNode.removeChild(circles[0]);
    }
    countCircles = 0;
}