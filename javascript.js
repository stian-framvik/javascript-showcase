// JavaScript for showcase page

let activeScript = 'none';

// Prevents opening the context menu on right click.
tablink.addEventListener("contextmenu", function (ev) {
    ev.preventDefault();
    setResponse("Right click!");
    return false;
});

// Triggers on pressing down left mouse key.
tablink.addEventListener("mousedown", () => {
    setResponse("Press and hold!");
});

// Triggers on releasing left mouse key.
tablink.addEventListener("mouseup", () => {
    setResponse("Left click!");
});

// Displays the string input in the top banner
function setResponse(responseString) {
    response = document.getElementById("responseText");
    response.innerHTML = `<span>${responseString}</span>`;
    response.style.display = "block";
};

document.addEventListener('keyup', (event) => {
    if (event.key.toLowerCase() === 'c') {
        for (let i = 0; i < 1; i++) {
            createRandomCircle();
        }
    } else if (event.key.toLowerCase() === 'd') {
        deleteAllCircles();
    }
});

// Add event listeners to all sidebar buttons.
document.querySelectorAll('.sidebarButton').forEach(button => {
    // When button is clicked...
    button.addEventListener('mouseenter', () => {
        // We first remove active class from all buttons...
        document.querySelectorAll('.sidebarButton').forEach(btn => {
            btn.classList.remove('active');
        });

        // Then add active class to the current button...
        button.classList.add('active');
        // Update the active script...
        activeScript = button.dataset.script;
        // Update the content of the description for the active script...
        updateDescription(button.dataset.script);
        // And lastly we run the script.
        runActiveScript(button.dataset.script);
    });
});

function updateDescription(scriptName) {
    const descriptions = {
        'none': 'Select a script from the sidebar to see it in action!',
        'circle-script': `Press \'c\' to make a circle. Press \'d\' to delete all circles.`,
        'tictactoe-script': 'A simple tic-tac-toe game I made for practice.',
        'bubbles-script': `Press \'b\' to make a bubble at the cursor.`,
    };
    document.getElementById('description-content').textContent = descriptions[scriptName];
}

function runActiveScript(scriptName) {
    // Clear previous script content
    document.getElementById('script-content').innerHTML = '';

    // Run the selected script.
    switch (scriptName) {
        case 'none':
            // Literally nothing.
            break;
        case 'circle-script':
            initCircleScript();
            break;
        default:
            console.error(`Unknown script: ${scriptName}`);
    }
}

function initCircleScript() {
    console.log('\"Circle Script\" is now active.');
    document.addEventListener('keydown', handleCircleKeypress)
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
    circle.style.position = "absolute";
    circle.style.width = `${radius * 2}px`;
    circle.style.height = `${radius * 2}px`;
    circle.style.borderRadius = "50%"; // Makes it a circle
    circle.style.backgroundColor = color;
    circle.style.left = `${left}px`;
    circle.style.top = `${top}px`;

    container.appendChild(circle);

    return circle;

}

function deleteAllCircles(containerId = "circle-container") {
    const container = document.getElementById(containerId);
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
}