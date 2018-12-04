/**
 * @module Event Listener Module
 *
 * 事件监听模块
 *
 * @export eventListenerInit
 */

// -------------------- module start -------------------

import { $inputForm, $displayCtrl, $todoList } from "../DOM/DOM-elements.js";
import { inputFormOnSubmit, displayTabsOnClick, todoOnClick } from "./event-handler.js";

function eventListenerInit() {
  // 使用表单提交todo的内容
  $inputForm.addEventListener('submit', inputFormOnSubmit, false);

  // 使用事件委托，将三种显示状态切换的点击绑定到display-ctrl节点上
  $displayCtrl.addEventListener('click', displayTabsOnClick, false);

  // 使用事件委托，将点击事件绑定到todo-list上，一个是checkbox的点击，另一个是content的点击(开启edit in place), 还有删除按钮的点击。在处理函数内部加上event.target判断
  $todoList.addEventListener('click', todoOnClick, false);
}

export default eventListenerInit;