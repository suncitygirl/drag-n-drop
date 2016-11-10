import {getCoords} from './helpers';
import {getElementUnderClientXY} from './helpers';

/* renders an 'avatar' of the DOM-element
* avatar is a thing that we can drag instead of dragging that element
*/
export default function DragAvatar(dragZone, dragElem) {
  /** parent zone, draggable zone */
  this._dragZone = dragZone;

  /** elem to drag */
  this._dragZoneElem = dragElem;

  /** avatar thing that we see on the screen */
  this._elem = dragElem;
}

/**
 * init this._elem and make it absolutely positioned
 * define this._dragZoneElem
 * @param event - click event
 * @param downX - x-coordinate of the click
 * @param downY - y-coordinate of the click
 */
DragAvatar.prototype.initFromEvent = function(downX, downY, event) {
  if (event.target.tagName != 'SPAN') return false;

  this._dragZoneElem = event.target;
  let elem = this._elem = this._dragZoneElem.cloneNode(true);
  elem.className = 'avatar';

  /* define shiftX and shiftY to accurate moving */
  let coords = getCoords(this._dragZoneElem);
  this._shiftX = downX - coords.left;
  this._shiftY = downY - coords.top;

  document.body.appendChild(elem);
  elem.style.zIndex = 9999;
  elem.style.position = 'absolute';
  if (this._dragZoneElem.parentNode.parentNode == this._dragZone._elem) {
    this._destroy();
    return false;
  }
  return true;
};

DragAvatar.prototype.getDragInfo = function(event) {
  return {
    elem: this._elem,
    dragZoneElem: this._dragZoneElem,
    dragZone: this._dragZone
  };
};

DragAvatar.prototype.getTargetElem = function() {
  return this._currentTargetElem;
};

DragAvatar.prototype.onDragMove = function(event) {
  this._elem.style.left = event.pageX - this._shiftX + 'px';
  this._elem.style.top = event.pageY - this._shiftY + 'px';

  this._currentTargetElem = getElementUnderClientXY(this._elem, event.clientX, event.clientY);
};

DragAvatar.prototype.onDragCancel = function() {
  this._destroy();
};

DragAvatar.prototype.onDragEnd = function() {
  this._destroy();
};

DragAvatar.prototype._destroy = function() {
  this._elem.parentNode.removeChild(this._elem);
};
