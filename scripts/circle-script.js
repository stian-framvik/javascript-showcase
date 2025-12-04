// circle-script.js

let keyupListener = null;

export function init() {
    console.log('Circle script activated!');

    if (keyupListener) {
        document.removeEventListener('keyup', keyupListener)
    }

    keyupListener = (event) => {
        if (event.key.toLowerCase() === 'c') {
            createRandomCircle();
        } else if (event.key.toLowerCase() === 'd') {
            deleteAllCircles();
        }
    };
    document.addEventListener('keyup', keyupListener)
}

// function handleKeypress(event) {
//     if (event.key.toLowerCase() === 'c') {
//         createRandomCircle();
//     } else if (event.key.toLowerCase() === 'd') {
//         deleteAllCircles();
//     }
// }

export function cleanup() {
    console.log(`Circle script DE-activated!`);

    if (keyupListener) {
        document.removeEventListener('keyup', keyupListener);
        keyupListener = null;
    }
}

function createRandomCircle(containerId = "circle-container") {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found!`)
        return;
    }

    const radius = Math.floor(Math.random() * 46) + 5; // 5-50 px radius
    const color = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
    const left = Math.random() * (container.offsetWidth - radius * 2);
    const top = Math.random() * (container.offsetHeight - radius * 2);
    const circle = document.createElement("div");
    Object.assign(circle.style, {
        position: "absolute",
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        borderRadius: "50%",
        backgroundColor: color,
        left: `${left}px`,
        top: `${top}px`
    });
    container.appendChild(circle);
    return circle;
}

function deleteAllCircles(containerId = "circle-container") {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    } else {
        console.error(`Container ${containerId} not found!`);
    }
}