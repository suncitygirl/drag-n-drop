export function getCoords(elem) {
  const box = elem.getBoundingClientRect();

  return {
    top: Math.round(box.top + pageYOffset),
    left: Math.round(box.left + pageXOffset)
  };
}

export function getElementUnderClientXY(elem, clientX, clientY) {
  let display = elem.style.display || '';
  elem.style.display = 'none';
  let target = document.elementFromPoint(clientX, clientY);
  elem.style.display = display;
  if (!target || target == document) {
    target = document.body;
  }
  return target;
}
