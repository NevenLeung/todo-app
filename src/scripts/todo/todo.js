/**
 * @module Todo Module
 *
 * 跟todo相关的所有操作的函数与功能模块集合地
 *
 * @export {addTodo, toggleTodoStatus, deleteTodo, todoEditInPlaceModule, todoListRenderInit, displayCtrlInit, sortableInit}
 */

// -------------------- module start -------------------

import { $todoList, $displayCtrl } from "../DOM/DOM-elements.js";
import {createNewElementNode, delay, stringToBoolean} from "../utility/general-functions.js";

import DOM_OperationModule from '../DOM/DOM-operations.js';
import todoEditInPlaceModule from './todo-edit-in-place.js';
import displayCtrlModule from './todo-display-ctrl.js';
import indexedDBModule from "../utility/indexedDB.js";
import sortable from "../features/sortable-list.js";

const todoStore = indexedDBModule('TodoApp', 1, 'todo');

/**
 * addTodo()
 *
 * 添加一条新的todo，同时将一个新的todo对象的加入data.todoList数组中
 *
 * @param text todo的文本内容
 */
async function addTodo(text) {
  const data = {
    text: text,
    isDone: false,
    order: $todoList.children.length
  };

  try {
    const result = await todoStore.create(data);
    if (result) {
      // 因为result只包含一个_id值，所以order直接使用提交时的order值
      const $li = createNewElementNode('li', 'todo stretch-fade', '', 'draggable', 'true', 'data-is-done', 'false', 'data-id', result._id, 'data-order', data.order);
      const $todoDisplay = createNewElementNode('div', 'todo-display');
      const $todoMain = createNewElementNode('div', 'todo-main');
      const $dragHandle = createNewElementNode('span', 'todo-drag-handle', '.. .. ..');
      const $todoCheckbox = createNewElementNode('label', 'todo-checkbox');
      const $hiddenCheckbox = createNewElementNode('input', 'hidden-checkbox', '',  'type', 'checkbox');
      const $displayCheckbox = createNewElementNode('span', 'display-checkbox');
      const $todoContent = createNewElementNode('span', 'todo-content', text);
      const $deleteButtonWrapper = createNewElementNode('div', 'delete-button-wrapper ');
      const $deleteButton = createNewElementNode('button', 'button button-delete-todo');
      const textNode = document.createTextNode(' ');

      DOM_OperationModule.appendMultiChild($todoCheckbox, $hiddenCheckbox, $displayCheckbox);

      // 将checkbox和todo-content、delete-button节点分别添加到div节点，作为其子节点
      DOM_OperationModule.appendMultiChild($todoMain, $todoCheckbox, $todoContent);

      $deleteButtonWrapper.appendChild($deleteButton);

      DOM_OperationModule.appendMultiChild($todoDisplay, $dragHandle, $todoMain, $deleteButtonWrapper);

      $li.appendChild($todoDisplay);

      // 把li添加到todo-list上
      DOM_OperationModule.appendMultiChild($todoList, $li, textNode);

      // 每个setTimeout的延时时间大致与前一个动画的持续时间相同
      // setTimeout(() => {
      //   $todoDisplay.classList.add('show-todo');
      // }, 20);

      await delay(20);

      $todoDisplay.classList.add('show-todo');

      // setTimeout(() => {
      //   $todoContent.classList.add('show-content');
      // }, 200);

    } else {
      console.log('Data creation is failed');
    }
  }
  catch (err) {
    console.error(err);
  }

}

/**
 * sortTodoInAscendingOrder()
 *
 * 将todoList数组中的todo根据order从小到大排列
 *
 * @param {Array} list  todo list array object
 */
function sortTodoInAscendingOrder(list) {
  if (Array.isArray(list)) {
    list.sort(function (prev, next) {
      return prev.order - next.order;
    })
  }
}

/**
 * todoListRender()
 *
 * 渲染todoList，并给相应的节点加上合适的属性
 *
 * @param {Array} data  一个包含todo数据的数组
 *
 * DOM 结构
 *
 <ul class="todo-list">
 <li class='todo'>
 <div class='todo-display'>
 <span class='todo-drag-handle'></span>
 <div class='todo-main'>
 <label class='todo-checkbox'>
 <input type='checkbox' class='hidden-checkbox'>
 <span class='display-checkbox'></span>
 </label>
 <span class='todo-content'></span>
 </div>
 <button class='button button-delete-todo'>X</button>
 </div>
 </li>
 </ul>
 *
 */
function todoListRender(data) {
  // 根据order属性，对todo进行从小到大排序
  sortTodoInAscendingOrder(data);

  data.forEach(function (todo) {
    // 由sortable()对初始化时的todo节点，写入data-order，因此data-order不在这里添加
    const $li = createNewElementNode('li', 'todo stretch-fade', '', 'data-is-done', todo.isDone, 'data-id', todo._id);
    const $todoDisplay = createNewElementNode('div', 'todo-display show-todo');
    const $todoMain = createNewElementNode('div', 'todo-main');
    const $dragHandle = createNewElementNode('span', 'todo-drag-handle', '.. .. ..');
    const $todoCheckbox = createNewElementNode('label', 'todo-checkbox');
    const $hiddenCheckbox = createNewElementNode('input', 'hidden-checkbox', '',  'type', 'checkbox');
    const $displayCheckbox = createNewElementNode('span', 'display-checkbox');
    const $todoContent = createNewElementNode('span', 'todo-content', todo.text);
    const $deleteButtonWrapper = createNewElementNode('div', 'delete-button-wrapper ');
    const $deleteButton = createNewElementNode('button', 'button button-delete-todo');
    const textNode = document.createTextNode(' ');

    if (todo.isDone) {
      // 为todo-content添加class 'todo-is-done'
      $todoContent.classList.add('todo-is-done');
      // 由于todo为已完成状态，需要将checkbox设置为已勾选状态
      $hiddenCheckbox.setAttribute('checked', 'checked');
    }

    DOM_OperationModule.appendMultiChild($todoCheckbox, $hiddenCheckbox, $displayCheckbox);

    DOM_OperationModule.appendMultiChild($todoMain, $todoCheckbox, $todoContent);

    $deleteButtonWrapper.appendChild($deleteButton);

    DOM_OperationModule.appendMultiChild($todoDisplay, $dragHandle, $todoMain, $deleteButtonWrapper);

    $li.appendChild($todoDisplay);

    DOM_OperationModule.appendMultiChild($todoList, $li, textNode);

    // 只在todo的添加、删除使用动画，这样可以让打开app时，更快的显示内容，同时不会由于todo太多，需要加载太多的动画

    // setTimeout(() => {
    //   $todoDisplay.classList.add('show-todo');
    // }, 20);
    //
    // setTimeout(() => {
    //   $todoContent.classList.add('show-content');
    // }, 200);
  });
}

/**
 * addMockData()
 *
 * 如果数据库没有数据，写入用作演示的数据
 */
async function addMockData() {
  const mockData = [
    {
      text: "Finish the assignment of geometry",
      isDone: false,
      order: 0
    },
    {
      text: "Call sam to discuss supper ",
      isDone: true,
      order: 1
    }
  ];

  // 添加模拟的数据
  const createPromises = mockData.map(item => {
    return todoStore.create(item);
  });
  await Promise.all(createPromises);

  // 在数据添加的完成后，再进行getAll操作
  const queryResult = await todoStore.getAll();
  if (Array.isArray(queryResult) && queryResult.length !== 0) {
    todoListRender(queryResult);
  }
}

/**
 * todoListRenderInit()
 *
 * 初始化渲染todo list
 */
async function todoListRenderInit() {
  try {
    const queryResult = await todoStore.getAll();
    if (Array.isArray(queryResult) && queryResult.length !== 0) {
      todoListRender(queryResult);
    } else {
      await addMockData();
    }
  }
  catch (err) {
    console.error(err);
  }
}

/**
 * toggleTodoStatus()
 *
 * 切换todo的完成状态，更改显示样式，更改data中的数据，用作事件处理函数
 *
 * $el为todo-checkbox节点中的hidden-checkbox
 */
async function toggleTodoStatus($el) {
  // 每一个todo的todo-content是checkbox的下一个同级元素
  const $todo = DOM_OperationModule.findClosestAncestor($el, '.todo');
  const $todoContent = DOM_OperationModule.query($todo, '.todo-content');
  const $displayOptionSelected = displayCtrlModule.getDisplayOption();

  const id = parseInt($todo.dataset.id);
  const data = {
    isDone: !stringToBoolean($todo.dataset.isDone)
  };


  try {
    const result = await todoStore.update(id, data);
    if (result) {
      if ($todo.dataset.isDone === 'false') {
        $todoContent.classList.add('todo-is-done');
        $todo.dataset.isDone = 'true';

        // 如果display option不是All，则在其他两个tab中，对todo的状态进行toggle操作，都是需要在当前的tab中使它消失
        if (!$displayOptionSelected.matches('.display-all')) {
          $todo.classList.add('todo-hidden');
          console.log('1');
        }

      } else {
        $todoContent.classList.remove('todo-is-done');
        $todo.dataset.isDone = 'false';

        // 如果display option不是All，则在其他两个tab中，对todo的状态进行toggle操作，都是需要在当前的tab中使它消失
        if (!$displayOptionSelected.matches('.display-all')) {
          $todo.classList.add('todo-hidden');
          console.log('2');
        }

      }
    }
  }
  catch (err) {
    console.error(err);
  }

}

/**
 * deleteTodo()
 *
 * 删除todo，从DOM上移除相应的$todo与相应的数据
 *
 * $el为button-delete-todo节点
 */
async function deleteTodo($el) {
  const $todo = DOM_OperationModule.findClosestAncestor($el, '.todo');
  const $todoDisplay = DOM_OperationModule.query($todo, '.todo-display');
  const $todoContent = DOM_OperationModule.query($todo, '.todo-content');
  const id = parseInt($todo.dataset.id);
  const order = parseInt($todo.dataset.order);

  try {
    await todoStore.delete(id);

    // $todoContent.classList.remove('show-content');

    // 每个setTimeout的延时时间大致与前一个动画的持续时间相同
    // setTimeout(() => {
    $todoDisplay.classList.remove('show-todo');

    // setTimeout(() => {
    //   $todoList.removeChild($todo);
    //
    //   updatePositionChanged(undefined, undefined, order, $todoList, undefined);
    // }, 300);

    // }, 200);

    await delay(300);

    $todoList.removeChild($todo);

    updatePositionChanged(undefined, undefined, order, $todoList, undefined);


  }
  catch (err) {
    console.error(err);
  }
}

/**
 * updatePositionChanged()
 *
 * 负责更新位置发生改变的节点信息。只有dragEl移动前后位置之间的节点，以及dragEL本身的位置信息需要更新，同时包括数据库的更新
 *
 * @param {number} positionBefore  dragEl被移动前所处的位置
 * @param {number} positionAfter  dragEl被移动后所处的位置
 * @param {number} deleteElPosition  被删除的todo节点所处的位置
 * @param rootEl  sortable list的直接父元素
 * @param {boolean} isMouseMoveDown  鼠标在纵坐标上是否是向下移动
 */
async function updatePositionChanged(positionBefore, positionAfter, deleteElPosition, rootEl, isMouseMoveDown) {
  const sortingList = [];
  sortingList.push(...rootEl.children);

  if (typeof deleteElPosition !== 'undefined') {
    // 从删除的元素的位置开始，遍历到rootEle的最后一个元素
    for (let i = deleteElPosition; i < rootEl.children.length; i++) {
      const node = rootEl.children[i];
      const id = parseInt(node.dataset.id);
      const orderValue = sortingList.indexOf(node);

      node.dataset.order = orderValue;

      try {
        await todoStore.update(id, {order: orderValue});
      } catch (err) {
        console.error(err);
      }
    }
    return;
  }

  if (typeof isMouseMoveDown !== 'undefined' && isMouseMoveDown) {
    // 从上方移动到下方，中间节点位置减1。dragEl在移动之前，位于数值较小的positionBefore
    for (let i = positionBefore; i <= positionAfter; i++) {
      const node = rootEl.children[i];
      const id = parseInt(node.dataset.id);
      const orderValue = sortingList.indexOf(node);

      node.dataset.order = orderValue;

      try {
        await todoStore.update(id, {order: orderValue});
      } catch (err) {
        console.error(err);
      }

      // console.log(node);
    }
  } else {
    // 从下方移动到上方，中间节点位置加1。dragEl在移动之前，位于数值较大的positionBefore
    for (let i = positionAfter; i <= positionBefore; i++) {
      const node = rootEl.children[i];
      const id = parseInt(node.dataset.id);
      const orderValue = sortingList.indexOf(node);

      node.dataset.order = orderValue;

      try {
        await todoStore.update(id, {order: orderValue});
      } catch (err) {
        console.error(err);
      }

      // console.log(node);
    }
  }
}

/**
 * displayCtrlInit()
 *
 * 初始化应用时，默认选中display all，显示所有的todo
 */
function displayCtrlInit() {
  const $buttonDisplayAll = DOM_OperationModule.query($displayCtrl, 'display-all');

  // 应用初始化时，默认选中display all
  displayCtrlModule.selectAnOption($buttonDisplayAll);
}

/**
 * sortableInit()
 *
 * 为todoList添加拖放行为
 */
function sortableInit() {
  sortable($todoList, '.todo-drag-handle', '.todo', updatePositionChanged);
}

export {
  addTodo,
  toggleTodoStatus,
  deleteTodo,
  todoEditInPlaceModule,
  todoListRenderInit,
  displayCtrlInit,
  sortableInit
};