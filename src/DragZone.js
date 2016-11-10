import DragAvatar from './DragAvatar';

/**
 * Define draggable zone
 * Handles drag start
 * @constructor
 * @name DragZone
 * @param elem DOM-elem of the zone
 */
export default function DragZone(elem) {
    elem.dragZone = this;
    this._elem = elem;
}

DragZone.prototype._makeAvatar = function() {
    return new DragAvatar(this, this._elem);
};

/**
 * @param downX - x-coordinate of the click
 * @param downY - y-coordinate of the click
 * @param mouse click event
 */
DragZone.prototype.onDragStart = function(downX, downY, event) {

    let avatar = this._makeAvatar();

    if (!avatar.initFromEvent(downX, downY, event)) return false;

    return avatar;
};
