/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "js/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _DragZone = __webpack_require__(1);

	var _DragZone2 = _interopRequireDefault(_DragZone);

	var _DropTarget = __webpack_require__(4);

	var _DropTarget2 = _interopRequireDefault(_DropTarget);

	var _DragManager = __webpack_require__(5);

	var _DragManager2 = _interopRequireDefault(_DragManager);

	var _editor = __webpack_require__(6);

	var _editor2 = _interopRequireDefault(_editor);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var tree = document.getElementById('tree');
	var newDay = document.getElementById('new-day');
	var newNote = document.getElementById('new-note');
	var btnDay = document.getElementById('add-day-btn');
	var btnNote = document.getElementById('add-note-btn');

	new _editor2.default(newNote, tree, btnNote, true); //this one is for adding tasks
	new _editor2.default(newDay, tree, btnDay, false); //and another one for days
	new _DragZone2.default(tree);
	new _DropTarget2.default(tree);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = DragZone;

	var _DragAvatar = __webpack_require__(2);

	var _DragAvatar2 = _interopRequireDefault(_DragAvatar);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Define draggable zone
	 * Handles drag start
	 * @constructor
	 * @name DragZone
	 * @param elem DOM-elem of the zone
	 */
	function DragZone(elem) {
	    elem.dragZone = this;
	    this._elem = elem;
	}

	DragZone.prototype._makeAvatar = function () {
	    return new _DragAvatar2.default(this, this._elem);
	};

	/**
	 * @param downX - x-coordinate of the click
	 * @param downY - y-coordinate of the click
	 * @param mouse click event
	 */
	DragZone.prototype.onDragStart = function (downX, downY, event) {

	    var avatar = this._makeAvatar();

	    if (!avatar.initFromEvent(downX, downY, event)) return false;

	    return avatar;
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = DragAvatar;

	var _helpers = __webpack_require__(3);

	/* renders an 'avatar' of the DOM-element
	* avatar is a thing that we can drag instead of dragging that element
	*/
	function DragAvatar(dragZone, dragElem) {
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
	DragAvatar.prototype.initFromEvent = function (downX, downY, event) {
	  if (event.target.tagName != 'SPAN') return false;

	  this._dragZoneElem = event.target;
	  var elem = this._elem = this._dragZoneElem.cloneNode(true);
	  elem.className = 'avatar';

	  /* define shiftX and shiftY to accurate moving */
	  var coords = (0, _helpers.getCoords)(this._dragZoneElem);
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

	DragAvatar.prototype.getDragInfo = function (event) {
	  return {
	    elem: this._elem,
	    dragZoneElem: this._dragZoneElem,
	    dragZone: this._dragZone
	  };
	};

	DragAvatar.prototype.getTargetElem = function () {
	  return this._currentTargetElem;
	};

	DragAvatar.prototype.onDragMove = function (event) {
	  this._elem.style.left = event.pageX - this._shiftX + 'px';
	  this._elem.style.top = event.pageY - this._shiftY + 'px';

	  this._currentTargetElem = (0, _helpers.getElementUnderClientXY)(this._elem, event.clientX, event.clientY);
	};

	DragAvatar.prototype.onDragCancel = function () {
	  this._destroy();
	};

	DragAvatar.prototype.onDragEnd = function () {
	  this._destroy();
	};

	DragAvatar.prototype._destroy = function () {
	  this._elem.parentNode.removeChild(this._elem);
	};

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getCoords = getCoords;
	exports.getElementUnderClientXY = getElementUnderClientXY;
	function getCoords(elem) {
	  var box = elem.getBoundingClientRect();

	  return {
	    top: Math.round(box.top + pageYOffset),
	    left: Math.round(box.left + pageXOffset)
	  };
	}

	function getElementUnderClientXY(elem, clientX, clientY) {
	  var display = elem.style.display || '';
	  elem.style.display = 'none';
	  var target = document.elementFromPoint(clientX, clientY);
	  elem.style.display = display;
	  if (!target || target == document) {
	    target = document.body;
	  }
	  return target;
	}

/***/ },
/* 4 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = DropTarget;
	/**
	* A zone in which elements can be dropped
	* @constructor
	* @name DropTarget
	*/
	function DropTarget(elem) {
	  elem.dropTarget = this;
	  this._elem = elem;
	  this._targetElem = null;
	}

	/**
	 * @return DOM-elem that can be use as a drop field or undefined
	 */
	DropTarget.prototype._getTargetElem = function (avatar, event) {
	  return this._elem;
	};

	DropTarget.prototype.onDragMove = function (avatar, event) {

	  var newTargetElem = this._getTargetElem(avatar, event);

	  if (this._targetElem != newTargetElem) {

	    this._hideHoverIndication(avatar);
	    this._targetElem = newTargetElem;
	    this._showHoverIndication(avatar);
	  }
	};

	DropTarget.prototype.onDragEnd = function (avatar, event) {
	  this._hideHoverIndication(avatar);
	  this._targetElem = null;
	};

	DropTarget.prototype.onDragEnter = function (fromDropTarget, avatar, event) {};

	DropTarget.prototype.onDragLeave = function (toDropTarget, avatar, event) {
	  this._hideHoverIndication();
	  this._targetElem = null;
	};

	DropTarget.prototype._showHoverIndication = function () {
	  this._targetElem && this._targetElem.classList.add('hover');
	};

	DropTarget.prototype._hideHoverIndication = function () {
	  this._targetElem && this._targetElem.classList.remove('hover');
	};

	DropTarget.prototype._getTargetElem = function (avatar, event) {
	  var target = avatar.getTargetElem();
	  if (target.tagName != 'SPAN') {
	    return;
	  }

	  /** check if there is an attempt to chain a parend node to the child in the tree */
	  var elemToMove = avatar.getDragInfo(event).dragZoneElem.parentNode;
	  if (elemToMove.parentNode == avatar.getDragInfo(event).dragZone._elem) return;
	  if (elemToMove == avatar.getDragInfo(event).dragZone) return;
	  var elem = target;
	  while (elem) {
	    if (elem == elemToMove) return;
	    elem = elem.parentNode;
	  }

	  return target;
	};

	DropTarget.prototype.onDragEnd = function (avatar, event) {

	  if (!this._targetElem) {
	    avatar.onDragCancel();
	    return;
	  }

	  this._hideHoverIndication();

	  var avatarInfo = avatar.getDragInfo(event);

	  avatar.onDragEnd();

	  /** generating node thing */
	  var elemToMove = avatarInfo.dragZoneElem.parentNode;
	  var title = avatarInfo.dragZoneElem.innerHTML;

	  var ul = this._targetElem.parentNode.getElementsByTagName('UL')[0];
	  if (!ul) {
	    ul = document.createElement('UL');
	    this._targetElem.parentNode.appendChild(ul);
	  }

	  /** sorting nodes thing */
	  var li = null;
	  for (var i = 0; i < ul.children.length; i++) {
	    li = ul.children[i];
	    var childTitle = li.children[0].innerHTML;
	    if (childTitle > title) {
	      break;
	    }
	    li = null;
	  }

	  ul.insertBefore(elemToMove, li);

	  this._targetElem = null;
	};

/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	/**
	 * An object that manages all the stuff for mouse events
	 * It keeps all event listeners and adds it to the document
	 * It adds its to the document and checks whether the click occurred
	 * on the draggable object (using event bubbling/delegation)
	 * @constructor
	 * @name DragManager
	 * */

	var dragManager = exports.dragManager = new function () {
	    /*
	     * @param downX, downY - click event coordinates
	     * @param dragZone - a zone where drag event has occurred
	     * @param avatar - a 'copy' of the object to drag
	     * @param dropTarget - a zone where a user drops the avatar
	     * @param downX - x-coordinate of the click
	     * @param downY - y-coordinate of the click
	     */

	    var dragZone = void 0,
	        avatar = void 0,
	        dropTarget = void 0;
	    var downX = void 0,
	        downY = void 0;

	    var self = this;

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
	        var newDropTarget = findDropTarget(event);

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
	        var elm = event.target;
	        while (elm != document && !elm.dragZone) {
	            elm = elm.parentNode;
	        }
	        return elm.dragZone;
	    }

	    function findDropTarget(event) {
	        var elm = avatar.getTargetElem();

	        while (elm != document && !elm.dropTarget) {
	            elm = elm.parentNode;
	        }

	        if (!elm.dropTarget) {
	            return null;
	        }

	        return elm.dropTarget;
	    }

	    /** Cancel browsers' 'picture drag'*/
	    document.ondragstart = function () {
	        return false;
	    };

	    document.addEventListener('mousemove', mouseMoveHandler);
	    document.addEventListener('mouseup', mouseUpHandler);
	    document.addEventListener('mousedown', mouseDownHandler);
	}();

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.default = Editor;

	var _DragZone = __webpack_require__(1);

	var _DragZone2 = _interopRequireDefault(_DragZone);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/***
	* Manages user inputs, pretty date showing
	* @param note - task/day to add
	* @param tree - current list of tasks
	* @param btn - btn that adds task or day
	* @param draggable - true for task (can be dragged), false fot day (cant be dragged)
	* @constructor
	* @name Editor
	*/
	function Editor(note, tree, btn, draggable) {
	    this._note = note;
	    this._btn = btn;
	    this._tree = tree;
	    this._draggable = draggable;

	    var days = [];

	    var self = this;

	    /*** Sets and adds today and tomorrow dates to the list and adds data-date atrributes*/
	    var setInitialState = function setInititialDates() {
	        if (draggable) {
	            var now = new Date();
	            var tomorrow = now.setDate(now.getDate() + 1);
	            self._tree.children[0].setAttribute('data-date', +now);
	            self._tree.children[0].firstChild.textContent = prettyDate(now);
	            self._tree.children[1].setAttribute('data-date', +tomorrow);
	            self._tree.children[1].firstChild.textContent = prettyDate(new Date(tomorrow));
	        }
	    }();

	    function prettyDate(date) {
	        var options = {
	            year: 'numeric',
	            month: 'long',
	            day: 'numeric',
	            weekday: 'long',
	            timezone: 'UTC'
	        };
	        return date.toLocaleString("ru", options);
	    }

	    function createNote() {

	        if (!self._note.value) return;

	        var newNote = document.createElement('li');
	        var span = document.createElement('span');
	        newNote.appendChild(span);
	        span.textContent = self._note.value;
	        if (!draggable) addNote(newNote);else addDraggableNote(newNote);
	    }

	    function addNote(newNote) {

	        function checkDays() {
	            if (days.indexOf(newNote.textContent) == -1) {
	                days.push(newNote.textContent);
	                return true;
	            } else {
	                return false;
	            }
	        };

	        if (!checkDays()) return;

	        var ul = document.createElement('ul');
	        newNote.appendChild(ul);
	        /*** sorting thing */
	        var currentLi = null;
	        newNote.setAttribute('data-date', +new Date(newNote.firstChild.textContent));
	        for (var i = 0; i < self._tree.children.length; i++) {
	            if (+self._tree.children[i].getAttribute('data-date') > +newNote.getAttribute('data-date')) {
	                currentLi = self._tree.children[i];
	                break;
	            }
	        }
	        newNote.firstChild.textContent = prettyDate(new Date(newNote.firstChild.textContent));
	        self._tree.insertBefore(newNote, currentLi);
	        update();
	    }

	    function addDraggableNote(newNote) {
	        self._tree.lastElementChild.lastElementChild.appendChild(newNote);
	        update();
	    }

	    /*** Notify DragZone that there are new element in the tree */
	    function update() {
	        new _DragZone2.default(self._tree);
	    }

	    btn.onclick = createNote;
	}

/***/ }
/******/ ]);