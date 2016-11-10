/**
 * An object that manages all the stuff for mouse events
 * It keeps all event listeners and adds it to the document
 * It adds its to the document and checks whether the click occurred
 * on the draggable object (using event bubbling/delegation)
 * @constructor
 * @name DragManager
 * */

export let dragManager = new function() {
    /*
     * @param downX, downY - click event coordinates
     * @param dragZone - a zone where drag event has occurred
     * @param avatar - a 'copy' of the object to drag
     * @param dropTarget - a zone where a user drops the avatar
     * @param downX - x-coordinate of the click
     * @param downY - y-coordinate of the click
     */

    let dragZone, avatar, dropTarget;
    let downX, downY;

    let self = this;

    function mouseDownHandler(event) {
        /** Check if it was left mouse btn click */
        if (event.which != 1) return false;
        /** Try to find a dragZone*/

        dragZone = findDragZone(event);

        if (!dragZone) return;

        /** Lets keep click coordinates to identify event.target later */
        downX = event.pageX;
        downY = event.pageY;
        /** Prevent selection */

        event.preventDefault();
    }

    function mouseMoveHandler(event) {
        /** If there wad mousedown event on in draggable area */
        if (!dragZone) return;

        /** There was a click, but no moving yet */
        if (!avatar) {
            if (Math.abs(event.pageX - downX) < 3 && Math.abs(event.pageY - downY) < 3) {
                return;
            }
            avatar = dragZone.onDragStart(downX, downY, event);
            /** smth went wrong, lets forget about it untill the next dragging attempt and clean all the stuff up */
            if (!avatar) {
                cleanUp();
                return;
            }
        }

        avatar.onDragMove(event);

        /** its mouse moving handler, so we should store zone under element every single move */
        let newDropTarget = findDropTarget(event);

        if (newDropTarget != dropTarget) {
            /** tell other parts about moving
             * dropTarget/newDropTarget can be null (e.g. trying to move outside the viewport)
             */

            dropTarget && dropTarget.onDragLeave(newDropTarget, avatar, event);
            newDropTarget && newDropTarget.onDragEnter(dropTarget, avatar, event);
        }

        dropTarget = newDropTarget;

        dropTarget && dropTarget.onDragMove(avatar, event);

        return false;
    }

    function mouseUpHandler(event) {

        if (event.which != 1) {
            return false;
        }

        if (avatar) {
            if (dropTarget) {
                dropTarget.onDragEnd(avatar, event);
            } else {
                avatar.onDragCancel();
            }

        }
        cleanUp();
    }

    function cleanUp() {
        dragZone = avatar = dropTarget = null;
    }

    /** Looking for draggable parent node */
    function findDragZone(event) {
        let elm = event.target;
        while (elm != document && !elm.dragZone) {
            elm = elm.parentNode;
        }
        return elm.dragZone;
    }

    function findDropTarget(event) {
        let elm = avatar.getTargetElem();

        while (elm != document && !elm.dropTarget) {
            elm = elm.parentNode;
        }

        if (!elm.dropTarget) {
            return null;
        }

        return elm.dropTarget;
    }

    /** Cancel browsers' 'picture drag'*/
    document.ondragstart = function() {
        return false;
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler)
    document.addEventListener('mousedown', mouseDownHandler);
};
