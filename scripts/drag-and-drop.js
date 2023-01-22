/* Drag and Drop Interface
   ========================================================================== */

const actionArea = document.querySelector('.action-area');
const duplicator = document.getElementById('duplicator');
const targetViewGrid = document.getElementById('target-view-grid');
const targetViewFreeLocation = document.getElementById('target-view-free-location');

actionArea.addEventListener('pointerdown', (event) => {
    if (event.target === duplicator) {
        const x = event.offsetX;
        const y = event.offsetY;
        const newBox = document.createElement('div');
        newBox.classList.add('action-area__box');
        // console.log(newBox);
        newBox.style.border = 'dashed';
        newBox.style.background = randomRGB();
        newBox.style.position = 'absolute';
        newBox.style.left = `${event.pageX - x}px`;
        newBox.style.top = `${event.pageY - y}px`;
        actionArea.appendChild(newBox);

        const move = function (event) {
            newBox.style.left = `${event.pageX - x}px`;
            newBox.style.top = `${event.pageY - y}px`;
        };

        actionArea.addEventListener('pointermove', move);

        const remove = function (event) {
            actionArea.removeChild(newBox);
            actionArea.removeEventListener('pointermove', move);
            actionArea.removeEventListener('pointerup', remove);
            const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            const dropBox = document.createElement('div');
            dropBox.classList.add('action-area__box');
            dropBox.style.border = newBox.style.border;
            dropBox.style.background = newBox.style.background;
            if (elemBelow === targetViewGrid) {
                targetViewGrid.appendChild(dropBox);
            } else if (elemBelow === targetViewFreeLocation) {
                const rect = targetViewFreeLocation.getBoundingClientRect();
                console.log(rect);
                dropBox.style.position = 'absolute';
                dropBox.style.left = `${event.pageX - rect.x - x - 3}px`;
                dropBox.style.top = `${event.pageY - rect.y - y - 3}px`;
                targetViewFreeLocation.appendChild(dropBox);
            }
        };
        actionArea.addEventListener('pointerup', remove);
    }
});

/* Color Generator
   ========================================================================== */

/**
 * 1. Function to Generate Random Number
 */

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

/**
 * 2. Function to Generate Random Color
 */

function randomRGB() {
    return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

/* Define a Drag Element
   ========================================================================== */

/**
 * 1. Capture Handler
 */

// function captureHandler(event) {}
