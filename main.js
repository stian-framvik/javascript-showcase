let activeScript = 'none';
let activeScriptCleanup = null;

// Cache DOM elements
const responseContent = document.getElementById("response-content");
const descriptionContent = document.getElementById("description-content");
const scriptContent = document.getElementById("script-content");

const contentStuff = document.querySelector('.content');
const topStuff = document.querySelector('.banner');
const sideStuff = document.querySelector('.sidebar');

// Load a script dynamically
function loadScript(scriptName) {
    return import(`./scripts/${scriptName}.js`)
        .then(module => {
            if (module.init) module.init(); // Call the script's init function.
            if (module.cleanup) activeScriptCleanup = module.cleanup;
        })
        .catch(error => {
            console.error(`Failed to load ${scriptName}:`, error);
            setResponse(`Error: Failed to load ${scriptName}.`);
        });
}

// Sidebar event listeners
document.querySelectorAll('.sideButton').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.sideButton').forEach(btn => {
            btn.classList.remove('active');
        })
        console.log(`Running the ${button.dataset.script}.js script now!`);

        // Toggle active class.
        button.classList.toggle('active');
        activeScript = button.dataset.script;
        updateDescription(button.dataset.script);
        runActiveScript(button.dataset.script);
    });

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

function setResponse(responseString) {
    responseContent.textContent = responseString;
    responseContent.style.display = "block";
}

// Run the selected script.
async function runActiveScript(scriptName) {
    // Clean up the previous script first.
    if (activeScriptCleanup) {
        activeScriptCleanup();
        activeScriptCleanup = null;
    }


    // Clear the script content.
    scriptContent.innerHTML = '';

    // Load the new script.

    try {
        await loadScript(scriptName);
        setResponse(`Script ${scriptName} loaded!`);
    } catch (error) {
        console.error(error);
    }
}

function updateDescription(scriptName) {
    const descriptions = {
        'none': 'Select a script from the sidebar to see it in action!',
        'circle': `Press 'c' to make a circle. Press 'd' to delete all circles.`,
        'tictactoe': 'A simple tic-tac-toe game I made for practice.',
        'bubbles': `Press 'b' to make a bubble at the cursor.`,
    };
    descriptionContent.textContent = descriptions[scriptName] || `No description available for ${scriptName}`;
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

