let activeScript = '';
let activeScriptCleanup = null;

// Cache DOM elements
const responseContent = document.getElementById("response-content");
const scriptDescriptionContent = document.getElementById("info-wrapper");
export const wrapperId = 'script-wrapper';
export const wrapperObj = document.getElementById(wrapperId);
export const containerId = 'script-container';
export const containerObj = document.getElementById(containerId);

async function loadScript(scriptName = 'none') {
    // Skip loading if scriptName is 'none' or empty.
    if (scriptName === 'none' || !scriptName) {
        console.log(`No script selected.`);
        updateScriptDescription('none');
        return;
    }
    // Import the chosen script.
    try {
        const module = await import(`./scripts/${scriptName}.js`);
        if (module.init) module.init();
        if (module.cleanup) activeScriptCleanup = module.cleanup;
    } catch (error) {
        console.error(`Failed to load ${scriptName}.js:`, error);
        setResponse(`Oopsie! Failed to load ${scriptName}`);
    }
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
        updateScriptDescription(button.dataset.script);
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

export function setResponse(responseString) {
    console.log(responseString);
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
    containerObj.innerHTML = '';
    console.log(`Loading ${scriptName}...`);

    // Load the new script.
    try {
        await loadScript(scriptName);
        setResponse(`Script ${scriptName} loaded and running!`);
    } catch (error) {
        console.error(`Failed to load ${scriptName}`, error);
    }
}

export function updateScriptDescription(scriptName = 'none', newScriptDescription = '') {
    // First we remove any current script description content.
    if (scriptDescriptionContent) {
        scriptDescriptionContent.textContent = '';
    }
    // Next we update the description.
    console.log(`Updated script description to ${scriptName}`);
    scriptDescriptionContent.textContent = newScriptDescription || `No description available for ${scriptName}`;
}

// Just experimenting a bit with event listeners
{
    // document.querySelector('#script-wrapper').addEventListener('click', (event) => {
    //     if (!event.target.closest('#script-container')) {
    //         setResponse("You clicked the script wrapper!");
    //     }
    // })

    // document.querySelector('#script-container').addEventListener('click', (event) => {
    //     if (event.target.closest('#script-container')) {
    //         setResponse("You clicked the script container!");
    //     }
    // })

    document.querySelector('.banner').addEventListener('click', () => {
        setResponse("You clicked the top banner!");
    })

    document.querySelector('.sidebar').addEventListener('click', (event) => {
        if (!event.target.closest('.sideButton')) {
            setResponse(`You clicked in the sidebar!`);
        }
    })
}