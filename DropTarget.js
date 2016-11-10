/**
* A zone in which elements can be dropped
* @constructor
* @name DropTarget
*/
export default function DropTarget(elem) {
  elem.dropTarget = this;
  this._elem = elem;
  this._targetElem = null;
}

/**
 * @return DOM-elem that can be use as a drop field or undefined
 */
DropTarget.prototype._getTargetElem = function(avatar, event) {
  return this._elem;
};

DropTarget.prototype.onDragMove = function(avatar, event) {

  let newTargetElem = this._getTargetElem(avatar, event);

  if (this._targetElem != newTargetElem) {

    this._hideHoverIndication(avatar);
    this._targetElem = newTargetElem;
    this._showHoverIndication(avatar);
  }
};

DropTarget.prototype.onDragEnd = function(avatar, event) {
  this._hideHoverIndication(avatar);
  this._targetElem = null;
};

DropTarget.prototype.onDragEnter = function(fromDropTarget, avatar, event) {};

DropTarget.prototype.onDragLeave = function(toDropTarget, avatar, event) {
  this._hideHoverIndication();
  this._targetElem = null;
};

DropTarget.prototype._showHoverIndication = function() {
  this._targetElem && this._targetElem.classList.add('hover');
};

DropTarget.prototype._hideHoverIndication = function() {
  this._targetElem && this._targetElem.classList.remove('hover');
};

DropTarget.prototype._getTargetElem = function(avatar, event) {
  let target = avatar.getTargetElem();
  if (target.tagName != 'SPAN') {
    return;
  }

  /** check if there is an attempt to chain a parend node to the child in the tree */
  let elemToMove = avatar.getDragInfo(event).dragZoneElem.parentNode;
  if (elemToMove.parentNode == avatar.getDragInfo(event).dragZone._elem) return;
  if (elemToMove == avatar.getDragInfo(event).dragZone) return;
  let elem = target;
  while (elem) {
    if (elem == elemToMove) return;
    elem = elem.parentNode;
  }

  return target;
};

DropTarget.prototype.onDragEnd = function(avatar, event) {

  if (!this._targetElem) {
    avatar.onDragCancel();
    return;
  }

  this._hideHoverIndication();

  let avatarInfo = avatar.getDragInfo(event);

  avatar.onDragEnd();

  /** generating node thing */
  let elemToMove = avatarInfo.dragZoneElem.parentNode;
  let title = avatarInfo.dragZoneElem.innerHTML;

  let ul = this._targetElem.parentNode.getElementsByTagName('UL')[0];
  if (!ul) {
    ul = document.createElement('UL');
    this._targetElem.parentNode.appendChild(ul);
  }

  /** sorting nodes thing */
  let li = null;
  for (let i = 0; i < ul.children.length; i++) {
    li = ul.children[i];
    let childTitle = li.children[0].innerHTML;
    if (childTitle > title) {
      break;
    }
    li = null;
  }

  ul.insertBefore(elemToMove, li);

  this._targetElem = null;
};
