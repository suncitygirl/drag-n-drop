import DragZone from './DragZone';

/***
* Manages user inputs, pretty date showing
* @param note - task/day to add
* @param tree - current list of tasks
* @param btn - btn that adds task or day
* @param draggable - true for task (can be dragged), false fot day (cant be dragged)
* @constructor
* @name Editor
*/
export default function Editor(note, tree, btn, draggable) {
    this._note = note;
    this._btn = btn;
    this._tree = tree;
    this._draggable = draggable;

    let days = [];

    const self = this;

    /*** Sets and adds today and tomorrow dates to the list and adds data-date atrributes*/
    let setInitialState = (function setInititialDates() {
        if (draggable) {
            let now = new Date;
            let tomorrow =  (now.setDate(now.getDate() + 1));
            self._tree.children[0].setAttribute('data-date', +now);
            self._tree.children[0].firstChild.textContent = prettyDate(now);
            self._tree.children[1].setAttribute('data-date', +tomorrow);
            self._tree.children[1].firstChild.textContent = prettyDate(new Date(tomorrow));
        }
    })();

    function prettyDate(date) {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
            timezone: 'UTC'
        }
        return date.toLocaleString("ru", options);
    }

    function createNote() {

        if (!self._note.value) return;

        let newNote = document.createElement('li');
        let span = document.createElement('span');
        newNote.appendChild(span);
        span.textContent = self._note.value;
        if (!draggable) addNote(newNote);
        else addDraggableNote(newNote);
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

        let ul = document.createElement('ul');
        newNote.appendChild(ul);
        /*** sorting thing */
        let currentLi = null;
        newNote.setAttribute('data-date', +new Date(newNote.firstChild.textContent));
        for (let i = 0; i < self._tree.children.length; i++) {
              if(+self._tree.children[i].getAttribute('data-date') > +newNote.getAttribute('data-date')) {
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
        new DragZone(self._tree);
    }

    btn.onclick = createNote;
}
