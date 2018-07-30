import domWrapper from './dom-operations.js';
import displayCtrlWrapper from './todo-display-ctrl.js';

import { $inputForm } from "./dom-elements.js";
import { addTodo, toggleTodoStatus, deleteTodo, todoEditInPlaceModule } from "./todo.js";

const domOperationModule = domWrapper();
const displayCtrlModule = displayCtrlWrapper(domOperationModule);

/**
 * inputFormOnSubmit
 *
 * 使用表单提交input的内容，目的是用于提交新增todo的内容
 */
function inputFormOnSubmit(event) {
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

export {
  inputFormOnSubmit,
  displayTabsOnClick,
  todoOnClick
};