// JavaScript for showcase page

let activeScript = 'none';

// tablink = document.querySelectorAll("sideButton");

document.querySelectorAll('.sideButton').forEach(button => {
    // Trigger on right mouse key.
    button.addEventListener("contextmenu", function (ev) {
        ev.preventDefault();
        setResponse("Pressing right mouse key!");
        return false;
    })
    // Trigger on pressing down left mouse key.
    button.addEventListener('mousedown', () => {
        setResponse("Pressing left mouse key!");
    });

    // Trigger on pressing down right mouse key.
    button.addEventListener('mouseup', () => {
        setResponse("Releasing left mouse key!");
    });

});

// Add event listeners to all sidebar buttons.
document.querySelectorAll('.sideButton').forEach(button => {
    // When button is clicked...
    button.addEventListener('mouseenter', () => {
        // We first remove active class from all buttons...
        document.querySelectorAll('.sideButton').forEach(btn => {
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

// Displays the string input in the top banner
function setResponse(responseString) {
    response = document.getElementById("responseText");
    response.innerHTML = `<span>${responseString}</span>`;
    response.style.display = "block";
};

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