const draggables = document.querySelectorAll('.draggable') //QuerySelectorAll selects all elements by related css tags, in this case elements with class="draggable" 
const containers = document.querySelectorAll('.container') //selects all elements by class="container"

// for each loop.  This is essentially taking element with class draggable and turning it into something else.
// Specifically: each element with class draggable
// (here named with draggable in the arrow function, but could be named with anything) has two eventListeners added to it.
// these event listeners are defined in-line, and add and remove classes which monitor whether the element is being dragged.
draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging')
  })

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging')
  })
})

//For each again.  This time for each container (contains draggable elements, refer to html), we add a listener for dragover
// look at docs for this event listener.
// preventing default should remove the cancel sign (test this if you want to).
// then we get which element comes after it using getDragAFterElement
// and append into containers (divs) based on that.
containers.forEach(container => {
  container.addEventListener('dragover', e => {
    e.preventDefault()
    const afterElement = getDragAfterElement(container, e.clientY) //passes in the event.clientY and current container. https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/clientY
    // This should switch containers automatically once the dragover goes to another container 
    const draggable = document.querySelector('.dragging')
    if (afterElement == null) {
      container.appendChild(draggable)
    } else {
      container.insertBefore(draggable, afterElement)
    }
  })
})

//This function is setting all elements with class="draggable" but not class="dragging".
//The ellipsis in the [] creates an array which automatically indexes each of these elements starting at 0 with the
//top element.
//it then reduces these elements to find the offset (how far away from center of closest element)
// this element is and returns 
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

  return draggableElements.reduce(
      (closest, child) => { //closest and child are arbitrary closest is the accumulator(starts index 0) and child(starts index 1) is the currentValue.
        const box = child.getBoundingClientRect() //gets bounding box/ DOM rect of currentElement
        const offset = y - box.top - box.height / 2 //subtracts y - current element's top - current element's height /2  
        //(this sets to center of box.  think of css styling, top is distance from top of screen, y is your y in relation to bounding Box)
        if (offset < 0 && offset > closest.offset) { //if offset is less than 0, or the offset is greater than the accumulator's -infinity, (closer to 0),
        // we want to return.
          return { offset: offset, element: child } //returns object with offset being our current offset, and the element being the child or currentValue.
        } else {
          return closest //returns the accumulator (will be an element bc array has elements stored at indices)
        }
      }, { offset: Number.NEGATIVE_INFINITY } // sets initialValue of reduce() - value to use as first argument to first call of callBack (arrow funct)
  ).element //only returns element (child) instead of full object.
}