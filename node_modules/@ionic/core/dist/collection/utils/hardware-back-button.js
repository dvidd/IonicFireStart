export function startHardwareBackButton(win) {
    let busy = false;
    win.document.addEventListener('backbutton', () => {
        if (busy) {
            return;
        }
        const handlers = [];
        const ev = new CustomEvent('ionBackButton', {
            bubbles: false,
            detail: {
                register(priority, handler) {
                    handlers.push({ priority, handler });
                }
            }
        });
        win.document.dispatchEvent(ev);
        if (handlers.length > 0) {
            let selectedPriority = Number.MIN_SAFE_INTEGER;
            let selectedHandler;
            handlers.forEach(({ priority, handler }) => {
                if (priority >= selectedPriority) {
                    selectedPriority = priority;
                    selectedHandler = handler;
                }
            });
            busy = true;
            executeAction(selectedHandler).then(() => busy = false);
        }
    });
}
async function executeAction(handler) {
    try {
        if (handler) {
            const result = handler();
            if (result != null) {
                await result;
            }
        }
    }
    catch (e) {
        console.error(e);
    }
}
