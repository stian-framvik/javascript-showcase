// JavaScript for showcase page

let activeScript = 'none';
const responseContent = document.getElementById("response-text");
const descriptionContent = document.getElementById("description-content");
const scriptContent = document.getElementById("script-content");

const contentStuff = document.querySelector('.content');
const topStuff = document.querySelector('.banner');
const sideStuff = document.querySelector('.sidebar');


document.querySelectorAll('.sideButton').forEach(button => {
    // Right-click context menu
    button.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();
        setResponse(`Pressing right mouse key on ${button.textContent}!`);
        return false;
    });

    // Left mouse down
    button.addEventListener('mousedown', () => {
        setResponse(`Pressing left mouse key on ${button.textContent}!`);
    });

    // Left mouse up (fixed: was incorrectly labeled as right mouse key)
    button.addEventListener('mouseup', () => {
        setResponse(`Released left mouse key on ${button.textContent}!`);
    });

    // Hover effects
    button.addEventListener('mouseover', () => {
        setResponse(`Hovering over ${button.textContent}!`);
    });

    button.addEventListener('mouseleave', () => {
        setResponse(`No longer hovering over ${button.textContent}!`);
    });
});


// Displays the string input in the top banner
function setResponse(responseString) {
    responseContent.textContent = responseString;
    responseContent.style.display = "block";
}

function updateDescription(scriptName) {
    const descriptions = {
        'none': 'Select a script from the sidebar to see it in action!',
        'circle-script': `Press 'c' to make a circle. Press 'd' to delete all circles.`,
        'tictactoe-script': 'A simple tic-tac-toe game I made for practice.',
        'bubbles-script': `Press 'b' to make a bubble at the cursor.`,
    };
    descriptionContent.textContent = descriptions[scriptName] || `No description available for ${scriptName}`;
}

function runActiveScript(scriptName) {
    // Clear previous script content
    scriptContent.innerHTML = '';

    if (activeScript === 'circle-script') {
        document.removeEventListener('keyup', handleCircleKeypress);
    }

    // Run the selected script.
    switch (scriptName) {
        case 'none':
            // Literally nothing.
            break;
        case 'circle-script':
            initCircleScript();
            break;
        case 'tictactoe-script':
            initTicTacToeScript();
            break;
        case 'bubbles-script':
            initBubblesScript();
            break;
        default:
            console.error(`Unknown script: ${scriptName}`);
    }
}

// Code pertaining to the circles
{
    function initCircleScript() {
        console.log('\"Circle Script\" is now active.');
        document.removeEventListener('keyup', handleCircleKeypress);
        document.addEventListener('keyup', handleCircleKeypress);
    }

    function handleCircleKeypress(event) {
        if (activeScript !== 'circle-script') return;

        if (event.key.toLowerCase() === 'c') {
            createRandomCircle();
        } else if (event.key.toLowerCase() === 'd') {
            deleteAllCircles();
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
}

// Just experimenting a bit with event listeners
{
    contentStuff.addEventListener('click', () => {
        setResponse("You clicked the content!");
    })

    topStuff.addEventListener('click', () => {
        setResponse("You clicked the top banner!");
    })

    sideStuff.addEventListener('click', (event) => {
        if (!event.target.closest('.sideButton')) {
            setResponse(`You clicked in the sidebar!`);
        }
    })

}