'use strict';

import polyfills from './polyfills.js';
import indexedDBModule from './indexedDB.js';
import domWrapper from './dom-operations.js';
import todoEditInPlaceWrapper from './todo-edit-in-place.js';
import displayCtrlWrapper from './todo-display-ctrl.js';
import sortable from './sortable-list.js';

import {$inputForm, $displayCtrl, $todoList} from "./dom-elements";
import {createNewElementNode, stringToBoolean} from "./general-methods";

// 导入其他资源
import '../styles/normalize.css';
import '../styles/main.css';

// 使polyfill生效
polyfills();

// 初始化各个模块
const domOperationModule = domWrapper();
const todoEditInPlaceModule = todoEditInPlaceWrapper(domOperationModule);
const displayCtrlModule = displayCtrlWrapper(domOperationModule);

// 创建TodoApp的数据库管理实例
const todoStore = indexedDBModule('TodoApp', 1, 'todo', afterDataBaseConnected);

// data example
// const data = {
//   "todoList": [
//     {
//       "_id": 0,
//       "text": "Buy some fruit after school",
//       "isDone": false
//     },
//     {
//       "_id": 1,
//       "text": "Read the CLRS book to the page of 178",
//       "isDone": false
//     },
//     {
//       "_id": 2,
//       "text": "Discuss the Network problem with Bill",
//       "isDone": true
//     },
//     {
//       "_id": 3,
//       "text": "Finish the assignment of Database course",
//       "isDone": false
//     }
//   ]
// };


// ---------------------------- methods ----------------------------------

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

      domOperationModule.appendMultiChild($todoCheckbox, $hiddenCheckbox, $displayCheckbox);

      // 将checkbox和todo-content、delete-button节点分别添加到div节点，作为其子节点
      domOperationModule.appendMultiChild($todoMain, $todoCheckbox, $todoContent);

      $deleteButtonWrapper.appendChild($deleteButton);

      domOperationModule.appendMultiChild($todoDisplay, $dragHandle, $todoMain, $deleteButtonWrapper);

      $li.appendChild($todoDisplay);

      // 把li添加到todo-list上
      domOperationModule.appendMultiChild($todoList, $li, textNode);

      // 每个setTimeout的延时时间大致与前一个动画的持续时间相同
      setTimeout(() => {
        $todoDisplay.classList.add('show-todo');
      }, 20);

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
 * renderTodoList()
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
function renderTodoList(data) {
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

    domOperationModule.appendMultiChild($todoCheckbox, $hiddenCheckbox, $displayCheckbox);

    domOperationModule.appendMultiChild($todoMain, $todoCheckbox, $todoContent);

    $deleteButtonWrapper.appendChild($deleteButton);

    domOperationModule.appendMultiChild($todoDisplay, $dragHandle, $todoMain, $deleteButtonWrapper);

    $li.appendChild($todoDisplay);

    domOperationModule.appendMultiChild($todoList, $li, textNode);

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
    renderTodoList(queryResult);
  }
}

/**
 * initRenderTodoList()
 *
 * 初始化渲染todo list
 */
async function initRenderTodoList() {
  try {
    const queryResult = await todoStore.getAll();
    if (Array.isArray(queryResult) && queryResult.length !== 0) {
      renderTodoList(queryResult);
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
  const $todo = domOperationModule.findClosestAncestor($el, '.todo');
  const $todoContent = domOperationModule.query($todo, '.todo-content');
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
        }

      } else {
        $todoContent.classList.remove('todo-is-done');
        $todo.dataset.isDone = 'false';

        // 如果display option不是All，则在其他两个tab中，对todo的状态进行toggle操作，都是需要在当前的tab中使它消失
        if (!$displayOptionSelected.matches('.display-all')) {
          $todo.classList.add('todo-hidden');
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
  const $todo = domOperationModule.findClosestAncestor($el, '.todo');
  const $todoDisplay = domOperationModule.query($todo, '.todo-display');
  const $todoContent = domOperationModule.query($todo, '.todo-content');
  const id = parseInt($todo.dataset.id);
  const order = parseInt($todo.dataset.order);

  try {
    await todoStore.delete(id);

    // $todoContent.classList.remove('show-content');

    // 每个setTimeout的延时时间大致与前一个动画的持续时间相同
    // setTimeout(() => {
      $todoDisplay.classList.remove('show-todo');

      setTimeout(() => {
        $todoList.removeChild($todo);

        updatePositionChanged(undefined, undefined, order, $todoList, undefined);
      }, 300);

    // }, 200);


  }
  catch (err) {
    console.error(err);
  }
}

/**
 * displayCtrlInit()
 *
 * 初始化应用时，默认选中display all，显示所有的todo
 */
function displayCtrlInit() {
  const $buttonDisplayAll = domOperationModule.query($displayCtrl, 'display-all');

  // 应用初始化时，默认选中display all
  displayCtrlModule.selectAnOption($buttonDisplayAll);
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
 * displayTabsOnClick()
 *
 * 作为display tab中button的点击事件处理函数，绑定到display-ctrl节点
 */
function displayTabsOnClick(event) {
  const $el = event.target;
  if ($el.matches('.display-all')) {
    displayCtrlModule.displayTodoAll($el);
  }

  if ($el.matches('.display-done')) {
    displayCtrlModule.displayTodoIsDone($el);
  }

  if ($el.matches('.display-not-done')) {
    displayCtrlModule.displayTodoIsNotDone($el);
  }
}

/**
 * todoOnClick()
 *
 * 作为在todo上点击事件的事件处理函数，不同的点击元素会触发不同的处理事件
 */
function todoOnClick(event) {
  const $el = event.target;
  // 判断点击的元素是不是todo-checkbox中的hidden-checkbox，虽然hidden-checkbox不显示，但由于它在label里面，实际点击到的还是它
  if ($el.matches('.hidden-checkbox')) {
    toggleTodoStatus(event.target);
  }
  // 判断点击元素的是不是todo-content，是的话，开启edit in place功能
  if ($el.matches('.todo-content')) {
    todoEditInPlaceModule.activatedTodoEditInPlace(event.target);
  }
  // 判断点击的元素是不是删除按钮
  if ($el.matches('.button-delete-todo')) {
    deleteTodo(event.target);
  }
  // 判断点击的元素是不是save按钮
  if ($el.matches('.button-save-todo-edit')) {
    todoEditInPlaceModule.saveTodoEdit(event.target);
  }
  // 判断点击的元素是不是cancel按钮
  if ($el.matches('.button-cancel-todo-edit')) {
    todoEditInPlaceModule.cancelTodoEdit(event.target);
  }
}

/**
 * appInit()  应用的初始化函数，包括各种事件处理函数绑定，控制元素的渲染
 */
function appInit() {
  displayCtrlInit();

// 使用表单提交input的内容
  $inputForm.addEventListener('submit', function (event) {
    // 防止表单的提交
    event.preventDefault();

    const inputData = $inputForm.elements['todo-input'].value;

    // 不允许修改后，todo的内容为空，或者为纯空白字符
    if (inputData.trim().length === 0) {
      alert('You should type something in the input bar.');
    } else {
      addTodo(inputData);
    }

    // 重置表单数据
    $inputForm.reset();
  });

// 使用事件委托，将三种显示状态切换的点击绑定到display-ctrl节点上
  $displayCtrl.addEventListener('click', displayTabsOnClick);

// 使用事件委托，将点击事件绑定到todo-list上，一个是checkbox的点击，另一个是content的点击(开启edit in place), 还有删除按钮的点击。在处理函数内部加上event.target判断
  $todoList.addEventListener('click', todoOnClick);

  sortable($todoList, '.todo-drag-handle', '.todo', updatePositionChanged);
}

/**
 * afterDataBaseConnected()  包含需要在数据库初始化（连接）成功后，才能进行的操作。此函数在todoStore内部，当数据库连接成功后才会被调用
 */
async function afterDataBaseConnected() {
  await initRenderTodoList();
  appInit();
}

