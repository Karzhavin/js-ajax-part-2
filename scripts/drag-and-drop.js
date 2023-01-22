/* Get User Device
   ========================================================================== */

const getDeviceType = () => {
    const ua = navigator.userAgent;

    const types = [
        {
            type: 'tablet',
            value: /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua),
        },
        {
            type: 'mobile',
            value: /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
                ua
            ),
        },
    ];
    try {
        return types.filter((type) => type.value)[0].type;
    } catch (error) {
        return 'desktop';
    }
};

const device = getDeviceType();
const action = {};

switch (device) {
    case 'desktop':
        action.start = 'pointerdown';
        action.move = 'pointermove';
        action.end = 'pointerup';
        break;
    default:
        action.start = 'touchstart';
        action.move = 'touchmove';
        action.end = 'touchend';
}

/* Drag and Drop Interface
   ========================================================================== */

const actionArea = document.querySelector('.action-area');
const duplicator = document.querySelector('.duplicator');
const targetViewGrid = document.querySelector('.action-area__view_grid');
const targetViewFreeLocation = document.querySelector('.action-area__view_free-location');

/**
 * 1. Define a Drag Action
 */

actionArea.addEventListener(action.start, (event) => {
    if (event.target === duplicator) {
        const cursorOnDuplicatorX = event.offsetX;
        const cursorOnDuplicatorY = event.offsetY;
        const dragBox = boxCreater(
            'action-area__box',
            'absolute',
            randomRGB(),
            'dashed',
            event.pageX - cursorOnDuplicatorX,
            event.pageY - cursorOnDuplicatorY
        );
        actionArea.appendChild(dragBox);

        /**
         * 2. Define a Move Action
         */

        const desktopMoveHandler = (event) => {
            dragBox.style.left = `${event.pageX - cursorOnDuplicatorX}px`;
            dragBox.style.top = `${event.pageY - cursorOnDuplicatorY}px`;
        };
        const mobileMoveHandler = (event) => {
            const touchLocation = event.targetTouches[0];
            dragBox.style.left = `${touchLocation.pageX} + px`;
            dragBox.style.top = `${touchLocation.pageY} + px`;
        };

        let moveHandler;

        if (action.move === 'pointermove') {
            moveHandler = desktopMoveHandler;
        } else {
            moveHandler = mobileMoveHandler;
        }

        actionArea.addEventListener(action.move, moveHandler);

        /**
         * 3. Define a Drop Action
         */

        const dropHandler = function (event) {
            actionArea.removeChild(dragBox);
            actionArea.removeEventListener(action.move, moveHandler);
            actionArea.removeEventListener(action.end, dropHandler);
            const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
            const dropBox = boxCreater(
                'action-area__box',
                null,
                dragBox.style.background,
                dragBox.style.border,
                null,
                null
            );
            if (elemBelow === targetViewGrid) {
                targetViewGrid.appendChild(dropBox);
            } else if (elemBelow === targetViewFreeLocation) {
                const rect = targetViewFreeLocation.getBoundingClientRect();
                dropBox.style.position = 'absolute';
                dropBox.style.left = `${event.pageX - rect.x - cursorOnDuplicatorX - 3}px`;
                dropBox.style.top = `${event.pageY - rect.y - cursorOnDuplicatorY - 3}px`;
                targetViewFreeLocation.appendChild(dropBox);
            }
        };
        actionArea.addEventListener(action.end, dropHandler);
    }
});

/* Box Creater
   ========================================================================== */

function boxCreater(classList, position, color, border, axisX, axisY) {
    const box = document.createElement('div');
    box.classList.add(classList);
    if (position) {
        box.style.position = position;
    }
    box.style.background = color;
    box.style.border = border;
    if (axisX) {
        box.style.left = `${axisX}px`;
    }
    if (axisY) {
        box.style.top = `${axisY}px`;
    }
    return box;
}

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
