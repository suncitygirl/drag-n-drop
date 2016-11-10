import DragZone from "./DragZone";
import DropTarget from "./DropTarget";
import DragManager from './DragManager'
import Editor from './editor';

let tree = document.getElementById('tree');
let newDay = document.getElementById('new-day');
let newNote = document.getElementById('new-note');
let btnDay = document.getElementById('add-day-btn');
let btnNote = document.getElementById('add-note-btn');

new Editor(newNote, tree, btnNote, true); //this one is for adding tasks
new Editor(newDay, tree, btnDay, false); //and another one for days
new DragZone(tree);
new DropTarget(tree);
