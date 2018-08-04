'use strict';

import './polyfills.js';
import indexedDBModule from './indexedDB.js';

import { todoListRenderInit, displayCtrlInit, sortableInit } from "./todo";
import eventListenerInit from './event-listeners';

// 导入其他资源
import '../styles/normalize.css';
import '../styles/main.css';

// 创建TodoApp的数据库管理实例，并启动应用
indexedDBModule('TodoApp', 1, 'todo', afterDataBaseConnected).init();

/**
 * appInit()  应用的初始化函数，包括各种事件处理函数绑定，控制元素的渲染
 */
function appInit() {
  displayCtrlInit();

  eventListenerInit();

  sortableInit();
}

/**
 * afterDataBaseConnected()  包含需要在数据库初始化（连接）成功后，才能进行的操作。此函数在todoStore内部，当数据库连接成功后才会被调用
 */
async function afterDataBaseConnected() {
  await todoListRenderInit();
  appInit();
}

