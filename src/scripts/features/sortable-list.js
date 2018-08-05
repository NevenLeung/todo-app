/**
 * sortable  function for sortable list
 *
 * @param rootEl  需要设置为draggable的元素的直接父元素
 * @param handleSelector  鼠标点击符合handleSelector的元素，才会触发拖拽事件
 * @param dndSelector  符合dndSelector的元素，才能进行排序，防止放置到预期外的位置上
 * @param onUpdate  在拖放完成后，会触发该回调函数。在元素原地拾起，并在该元素上释放，不会触发该回调函数
 */

function sortable(rootEl, handleSelector, dndSelector, onUpdate){
  let dragEl, nextEl, mouseDownEl, clientYBefore, isMouseMoveDown, sortedFlag, positionBefore, positionAfter;

  // make all children draggable
  let sortingList = [];
  sortingList.push(...rootEl.children);

  sortingList.forEach((itemEl) => {
    itemEl.draggable = true;
    itemEl.dataset.order = sortingList.indexOf(itemEl);
  });

  // Sorting start
  rootEl.addEventListener('mousedown', _onMouseDown, false);
  rootEl.addEventListener('dragstart', _onDragStart, false);

  function _onMouseDown(evt) {
    mouseDownEl = evt.target;
  }

  function _onDragStart(evt) {

    if (mouseDownEl.matches(handleSelector)) {
      // Remember the element that will move
      dragEl = evt.target;
      // Remember the nextSibling for judging valid movement
      nextEl = dragEl.nextSibling;

      // 使用sortingList作为判断节点位置初始位置的依据
      sortingList = [];
      sortingList.push(...rootEl.children);

      // 使用sortingList中的位置，而不使用rootEl中的位置，是因为假如鼠标移动得太快，positionBefore的值有一定几率会是错误的。
      // 在dragover过程中如果很快的完成了节点插入，这就会影响到了positionBefore的值并不是一开始的位置值，而变成插入位置的值。
      // 同时也就使得了后续其他节点位置不能正确的更新。
      // 上面的这个解释不一定完全正确，但确实避免了positionBefore错误的情况。
      positionBefore = sortingList.indexOf(dragEl);

      // Limit the type of dragging
      evt.dataTransfer.effectAllowed = 'move';

      // Text未被使用
      evt.dataTransfer.setData('Text', dragEl.textContent);

      // We are writing about events with dnd
      rootEl.addEventListener('dragover', _onDragOver, false);
      rootEl.addEventListener('dragend', _onDragEnd, false);

      dragEl.classList.add('grabbing');
    } else {
      evt.preventDefault();
    }
  }

  // Function responsible for sorting, the dragEl is hovering above the target element
  function _onDragOver(evt) {
    sortedFlag = false;
    const target = evt.target;

    // dragover事件的target有可能是item中的其他元素，或者item本身。element.closest()包括元素本身的这种情况。
    let dropPlace = target.closest(dndSelector);

    // 当item已经被移动另一个位置，但鼠标原地并未释放时，dropPlace和dragEl是同一个元素，这时不再重复触发节点插入。
    if(dropPlace && dropPlace !== dragEl){
      // use evt.preventDefault() to allow drop
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'move';

      isMouseMoveDown = evt.clientY >= clientYBefore;

      // 从上到下，插入到target当前的位置
      if (isMouseMoveDown && target.nextSibling && !sortedFlag) {
        rootEl.insertBefore(dragEl, dropPlace.nextSibling);
        sortedFlag = true;
      }

      // 从下到上，插入到target的前一个位置
      if (!isMouseMoveDown && !sortedFlag) {
        rootEl.insertBefore(dragEl, dropPlace);
        sortedFlag = true;
      }

      // 保存当前的鼠标纵坐标，用作之后判断鼠标移动方向
      clientYBefore = evt.clientY;
    }
  }

  // End of Sorting
  function _onDragEnd(evt) {
    evt.preventDefault();

    dragEl.classList.remove('grabbing');

    rootEl.removeEventListener('dragover', _onDragOver, false);
    rootEl.removeEventListener('dragend', _onDragEnd, false);

    // 防止鼠标拾起之后，又原地放开，减少不必要的更新操作
    if (nextEl !== dragEl.nextSibling) {
      positionAfter = [].indexOf.call(rootEl.children, dragEl);

      // console.log(`positionBefore: ${positionBefore}, positionAfter: ${positionAfter}`);

      onUpdate(positionBefore, positionAfter, undefined, rootEl, isMouseMoveDown);
    }
  }
}

export default sortable;