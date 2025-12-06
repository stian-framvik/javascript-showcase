// Store all active listeners by script name
const scriptListeners = {};

/**
 * Register event listeners for a script.
 * @param {string} scriptName - Name of the script (e.g., 'tictactoe').
 * @param {Object} handlers - Object with event types and callbacks.
 * Example:
 * {
 *   keyboard: { 'ArrowUp': () => {}, 'ArrowDown': () => {} },
 *   click: [() => {}], // Array of click handlers
 *   custom: [{ event: 'mouseover', selector: '.cell', callback: () => {} }]
 * }
 */
export function setupEventListeners(scriptName, handlers) {
    // Clean up any existing listeners for this script
    removeEventListeners(scriptName);

    // Initialize storage for this script
    scriptListeners[scriptName] = {};

    // Register keyboard handlers
    if (handlers.keyboard) {
        const keyboardCallback = (event) => {
            const handler = handlers.keyboard[event.key];
            if (handler) {
                event.preventDefault();
                handler(event);
            }
        };
        document.addEventListener('keydown', keyboardCallback);
        scriptListeners[scriptName].keyboard = keyboardCallback;
    }

    // Register click handlers
    if (handlers.click) {
        handlers.click.forEach((callback, index) => {
            const clickCallback = (event) => callback(event);
            document.addEventListener('click', clickCallback);
            scriptListeners[scriptName][`click-${index}`] = clickCallback;
        });
    }

    // Register custom event handlers (e.g., mouseover on specific elements)
    if (handlers.custom) {
        handlers.custom.forEach((customHandler, index) => {
            const { event, selector, callback } = customHandler;
            const elements = document.querySelectorAll(selector);
            const customCallback = (event) => callback(event);

            elements.forEach(element => {
                element.addEventListener(event, customCallback);
            });

            scriptListeners[scriptName][`custom-${index}`] = {
                event,
                selector,
                callback: customCallback,
                elements
            };
        });
    }
}

/**
 * Remove all event listeners for a script.
 * @param {string} scriptName - Name of the script.
 */
export function removeEventListeners(scriptName) {
    if (!scriptListeners[scriptName]) return;

    // Remove keyboard listener
    if (scriptListeners[scriptName].keyboard) {
        document.removeEventListener('keydown', scriptListeners[scriptName].keyboard);
    }

    // Remove click listeners
    Object.keys(scriptListeners[scriptName]).forEach(key => {
        if (key.startsWith('click-')) {
            const clickCallback = scriptListeners[scriptName][key];
            document.removeEventListener('click', clickCallback);
        }
    });

    // Remove custom event listeners
    Object.keys(scriptListeners[scriptName]).forEach(key => {
        if (key.startsWith('custom-')) {
            const { event, selector, callback, elements } = scriptListeners[scriptName][key];
            elements.forEach(element => {
                element.removeEventListener(event, callback);
            });
        }
    });

    // Delete the script's listeners
    delete scriptListeners[scriptName];
}
