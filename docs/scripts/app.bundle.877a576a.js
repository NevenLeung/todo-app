!function(e){function t(t){for(var o,d,i=t[0],l=t[1],s=t[2],u=0,f=[];u<i.length;u++)d=i[u],r[d]&&f.push(r[d][0]),r[d]=0;for(o in l)Object.prototype.hasOwnProperty.call(l,o)&&(e[o]=l[o]);for(c&&c(t);f.length;)f.shift()();return a.push.apply(a,s||[]),n()}function n(){for(var e,t=0;t<a.length;t++){for(var n=a[t],o=!0,i=1;i<n.length;i++){var l=n[i];0!==r[l]&&(o=!1)}o&&(a.splice(t--,1),e=d(d.s=n[0]))}return e}var o={},r={1:0},a=[];function d(t){if(o[t])return o[t].exports;var n=o[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,d),n.l=!0,n.exports}d.m=e,d.c=o,d.d=function(e,t,n){d.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},d.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},d.t=function(e,t){if(1&t&&(e=d(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(d.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)d.d(n,o,function(t){return e[t]}.bind(null,o));return n},d.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return d.d(t,"a",t),t},d.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},d.p="";var i=window.webpackJsonp=window.webpackJsonp||[],l=i.push.bind(i);i.push=t,i=i.slice();for(var s=0;s<i.length;s++)t(i[s]);var c=l;a.push([101,0]),n()}({101:function(e,t,n){"use strict";var o=s(n(17)),r=s(n(16)),a=function(){var e=(0,r.default)(o.default.mark(function e(){return o.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,i.todoListRenderInit)();case 2:c();case 3:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}();n(71);var d=s(n(19)),i=n(35),l=s(n(58));function s(e){return e&&e.__esModule?e:{default:e}}function c(){(0,i.displayCtrlInit)(),(0,l.default)(),(0,i.sortableInit)()}n(56),n(54),(0,d.default)("TodoApp",1,"todo",a).init()},11:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=document.querySelector(".input-form"),r=document.querySelector(".display-ctrl"),a=document.getElementsByClassName("todo-list")[0];t.$inputForm=o,t.$displayCtrl=r,t.$todoList=a},18:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){return e&&e.__esModule?e:{default:e}}(n(12));t.default={appendMultiChild:function(e){try{for(var t=arguments.length,n=Array(t>1?t-1:0),o=1;o<t;o++)n[o-1]=arguments[o];e instanceof Node&&0!==n.length?n.forEach(function(t){if(!(t instanceof Node))throw new Error(t+" is not of type 'Node'");e.appendChild(t)}):console.log("ParentNode or childrenNodes is not defined.")}catch(e){console.error(e)}},query:function(e,t){try{if(e instanceof Node&&"string"==typeof t){if(e instanceof Document)return e.querySelector(t);var n=e.getAttribute("id"),o=n||"temp";e.setAttribute("id",o),t="#"+o+" "+t;var r=e.querySelector(t);return n||e.removeAttribute("id"),r}}catch(e){console.error(e)}},queryAll:function(e,t){try{if(e instanceof Node&&"string"==typeof t){if(e instanceof Document)return e.querySelectorAll(t);var n=e.getAttribute("id"),o=n||"temp";e.setAttribute("id",o),t="#"+o+" "+t;var r=e.querySelectorAll(t);return n||e.removeAttribute("id"),r}}catch(e){console.error(e)}},findClosestAncestor:function(e,t){try{return e instanceof Element&&"string"==typeof t?e.closest(t)===e?e.parentElement instanceof Element?e.parentElement.closest(t):null:e.closest(t):null}catch(e){console.error(e)}},findSibling:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"backward";try{return"backward"===n?function e(t,n){return t instanceof Element&&"string"==typeof n&&t.nextElementSibling?t.nextElementSibling.matches(n)?t.nextElementSibling:e(t.nextElementSibling,n):null}(e,t):"forward"===n?function e(t,n){return t instanceof Element&&"string"==typeof n&&t.previousElementSibling?t.previousElementSibling.matches(n)?t.previousElementSibling:e(t.previousElementSibling,n):null}(e,t):null}catch(e){console.error(e)}},findSiblings:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"all";try{if(e instanceof Element&&"string"==typeof t&&e.parentElement instanceof Element){var r,a,d,i,l,s,c=[];return"all"===n?((r=c).push.apply(r,(0,o.default)(e.parentElement.children)),a=c.indexOf(e),c.splice(a,1),c=c.filter(function(e){return e.matches(t)})):"backward"===n?((d=c).push.apply(d,(0,o.default)(e.parentElement.children)),i=c.indexOf(e),c.splice(0,i+1),c=c.filter(function(e){return e.matches(t)})):"forward"===n?((l=c).push.apply(l,(0,o.default)(e.parentElement.children)),s=c.indexOf(e),c.splice(s,c.length-s),c=c.filter(function(e){return e.matches(t)})):null}}catch(e){console.error(e)}}}},19:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=i(n(17)),r=i(n(70)),a=i(n(16)),d=i(n(32));function i(e){return e&&e.__esModule?e:{default:e}}t.default=function(e,t,n){var i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:function(){};function l(o,r){return new d.default(function(a,d){var l=window.indexedDB.open(e,t);l.onerror=function(e){console.log("Something bad happened while trying to open: "+e.target.errorCode),d(e.target)},l.onupgradeneeded=function(){l.result.createObjectStore(n,{keyPath:"_id",autoIncrement:!0})},l.onsuccess=function(){var e=l.result;if("init"===o)i(),a("App init."),e.close();else{var t=e.transaction(n,"readwrite"),s=t.objectStore(n);t.onabort=function(e){console.log("tx has been aborted."),console.log(e.target)};var c=void 0;switch(o){case"getAll":c=s.getAll();break;case"get":c=s.get(r);break;case"post":c=s.add(r);break;case"put":c=s.put(r);break;case"delete":c=s.delete(r);break;case"removeAll":c=s.clear()}c.onerror=function(e){console.log(e.target),d(e.target)},c.onsuccess=function(e){switch(o){case"getAll":case"get":a(c.result);break;case"post":console.log("Item with _id "+c.result+" has been added."),a({_id:c.result});break;case"put":console.log("Item with _id "+c.result+" has been updated."),a({_id:c.result});break;case"delete":console.log("Item has been removed."),a("Item has been removed.");break;case"removeAll":console.log("All items have been removed."),a("All items have been removed.");break;default:console.log("Database operation is not valid.")}},t.oncomplete=function(){e.close()}}}})}return{init:function(){return l("init","")},getAll:function(){return l("getAll","")},get:function(e){return l("get",e)},create:function(e){return l("post",e)},update:function(){var e=(0,a.default)(o.default.mark(function e(t,n){var a,d;return o.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,l("get",t);case 3:if(void 0===(a=e.sent)){e.next=9;break}return d=(0,r.default)(a,n),e.abrupt("return",l("put",d));case 9:console.log("Can not find the data according to the query");case 10:e.next=15;break;case 12:e.prev=12,e.t0=e.catch(0),console.error(e.t0);case 15:case"end":return e.stop()}},e,this,[[0,12]])}));return function(t,n){return e.apply(this,arguments)}}(),delete:function(e){return l("delete",e)},removeAll:function(){return l("removeAll","")}}}},33:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=d(n(12)),r=n(11),a=d(n(18));function d(e){return e&&e.__esModule?e:{default:e}}var i=void 0;function l(e){void 0===i?(i=a.default.query(r.$displayCtrl,".display-all")).classList.add("selected"):(i.classList.remove("selected"),e.classList.add("selected"),i=e)}t.default={getDisplayOption:function(){return i},selectAnOption:l,displayTodoAll:function(e){if(e.matches(".display-all")){var t=[];t.push.apply(t,(0,o.default)(r.$todoList.children)),t.forEach(function(e){e.classList.remove("todo-hidden")}),l(e)}},displayTodoIsDone:function(e){if(e.matches(".display-done")){var t=[];t.push.apply(t,(0,o.default)(r.$todoList.children)),t.forEach(function(e){"true"===e.dataset.isDone?e.classList.remove("todo-hidden"):e.classList.add("todo-hidden")}),l(e)}},displayTodoIsNotDone:function(e){if(e.matches(".display-not-done")){var t=[];t.push.apply(t,(0,o.default)(r.$todoList.children)),t.forEach(function(e){"true"===e.dataset.isDone?e.classList.add("todo-hidden"):e.classList.remove("todo-hidden")}),l(e)}}}},34:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.createNewElementNode=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",o=document.createElement(e);""!==n&&(o.textContent=n),""!==t&&(o.className=t);for(var r=arguments.length,a=Array(r>3?r-3:0),d=3;d<r;d++)a[d-3]=arguments[d];if(0!==a.length)for(var i=0;i<a.length;i+=2)o.setAttribute(a[i],a[i+1]);return o},t.stringToBoolean=function(e){if("string"==typeof e)return"true"===e}},35:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.sortableInit=t.displayCtrlInit=t.todoListRenderInit=t.todoEditInPlaceModule=t.deleteTodo=t.toggleTodoStatus=t.addTodo=void 0;var o=x(n(12)),r=x(n(32)),a=x(n(17)),d=x(n(16)),i=function(){var e=(0,d.default)(a.default.mark(function e(t){var n,o,r,d,i,l,s,c,u,f,m,b,y;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n={text:t,isDone:!1,order:p.$todoList.children.length},e.prev=1,e.next=4,w.create(n);case 4:(o=e.sent)?(r=(0,h.createNewElementNode)("li","todo stretch-fade","","draggable","true","data-is-done","false","data-id",o._id,"data-order",n.order),d=(0,h.createNewElementNode)("div","todo-display"),i=(0,h.createNewElementNode)("div","todo-main"),l=(0,h.createNewElementNode)("span","todo-drag-handle",".. .. .."),s=(0,h.createNewElementNode)("label","todo-checkbox"),c=(0,h.createNewElementNode)("input","hidden-checkbox","","type","checkbox"),u=(0,h.createNewElementNode)("span","display-checkbox"),f=(0,h.createNewElementNode)("span","todo-content",t),m=(0,h.createNewElementNode)("div","delete-button-wrapper "),b=(0,h.createNewElementNode)("button","button button-delete-todo"),y=document.createTextNode(" "),v.default.appendMultiChild(s,c,u),v.default.appendMultiChild(i,s,f),m.appendChild(b),v.default.appendMultiChild(d,l,i,m),r.appendChild(d),v.default.appendMultiChild(p.$todoList,r,y),setTimeout(function(){d.classList.add("show-todo")},20)):console.log("Data creation is failed"),e.next=11;break;case 8:e.prev=8,e.t0=e.catch(1),console.error(e.t0);case 11:case"end":return e.stop()}},e,this,[[1,8]])}));return function(t){return e.apply(this,arguments)}}(),l=function(){var e=(0,d.default)(a.default.mark(function e(){var t,n;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=[{text:"Finish the assignment of geometry",isDone:!1,order:0},{text:"Call sam to discuss supper ",isDone:!0,order:1}].map(function(e){return w.create(e)}),e.next=4,r.default.all(t);case 4:return e.next=6,w.getAll();case 6:n=e.sent,Array.isArray(n)&&0!==n.length&&E(n);case 8:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}(),s=function(){var e=(0,d.default)(a.default.mark(function e(){var t;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,w.getAll();case 3:if(t=e.sent,!Array.isArray(t)||0===t.length){e.next=8;break}E(t),e.next=10;break;case 8:return e.next=10,l();case 10:e.next=15;break;case 12:e.prev=12,e.t0=e.catch(0),console.error(e.t0);case 15:case"end":return e.stop()}},e,this,[[0,12]])}));return function(){return e.apply(this,arguments)}}(),c=function(){var e=(0,d.default)(a.default.mark(function e(t){var n,o,r,d,i;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=v.default.findClosestAncestor(t,".todo"),o=v.default.query(n,".todo-content"),r=b.default.getDisplayOption(),d=parseInt(n.dataset.id),i={isDone:!(0,h.stringToBoolean)(n.dataset.isDone)},e.prev=5,e.next=8,w.update(d,i);case 8:e.sent&&("false"===n.dataset.isDone?(o.classList.add("todo-is-done"),n.dataset.isDone="true",r.matches(".display-all")||(n.classList.add("todo-hidden"),console.log("1"))):(o.classList.remove("todo-is-done"),n.dataset.isDone="false",r.matches(".display-all")||(n.classList.add("todo-hidden"),console.log("2")))),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(5),console.error(e.t0);case 15:case"end":return e.stop()}},e,this,[[5,12]])}));return function(t){return e.apply(this,arguments)}}(),u=function(){var e=(0,d.default)(a.default.mark(function e(t){var n,o,r,d;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=v.default.findClosestAncestor(t,".todo"),o=v.default.query(n,".todo-display"),v.default.query(n,".todo-content"),r=parseInt(n.dataset.id),d=parseInt(n.dataset.order),e.prev=5,e.next=8,w.delete(r);case 8:o.classList.remove("show-todo"),setTimeout(function(){p.$todoList.removeChild(n),f(void 0,void 0,d,p.$todoList,void 0)},300),e.next=15;break;case 12:e.prev=12,e.t0=e.catch(5),console.error(e.t0);case 15:case"end":return e.stop()}},e,this,[[5,12]])}));return function(t){return e.apply(this,arguments)}}(),f=function(){var e=(0,d.default)(a.default.mark(function e(t,n,r,d,i){var l,s,c,u,f,p,h,v,m,b,y,g,x;return a.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if((l=[]).push.apply(l,(0,o.default)(d.children)),void 0===r){e.next=21;break}s=r;case 4:if(!(s<d.children.length)){e.next=20;break}return c=d.children[s],u=parseInt(c.dataset.id),f=l.indexOf(c),c.dataset.order=f,e.prev=9,e.next=12,w.update(u,{order:f});case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(9),console.error(e.t0);case 17:s++,e.next=4;break;case 20:return e.abrupt("return");case 21:if(void 0===i||!i){e.next=41;break}p=t;case 23:if(!(p<=n)){e.next=39;break}return h=d.children[p],v=parseInt(h.dataset.id),m=l.indexOf(h),h.dataset.order=m,e.prev=28,e.next=31,w.update(v,{order:m});case 31:e.next=36;break;case 33:e.prev=33,e.t1=e.catch(28),console.error(e.t1);case 36:p++,e.next=23;break;case 39:e.next=58;break;case 41:b=n;case 42:if(!(b<=t)){e.next=58;break}return y=d.children[b],g=parseInt(y.dataset.id),x=l.indexOf(y),y.dataset.order=x,e.prev=47,e.next=50,w.update(g,{order:x});case 50:e.next=55;break;case 52:e.prev=52,e.t2=e.catch(47),console.error(e.t2);case 55:b++,e.next=42;break;case 58:case"end":return e.stop()}},e,this,[[9,14],[28,33],[47,52]])}));return function(t,n,o,r,a){return e.apply(this,arguments)}}(),p=n(11),h=n(34),v=x(n(18)),m=x(n(60)),b=x(n(33)),y=x(n(19)),g=x(n(59));function x(e){return e&&e.__esModule?e:{default:e}}var w=(0,y.default)("TodoApp",1,"todo");function E(e){!function(e){Array.isArray(e)&&e.sort(function(e,t){return e.order-t.order})}(e),e.forEach(function(e){var t=(0,h.createNewElementNode)("li","todo stretch-fade","","data-is-done",e.isDone,"data-id",e._id),n=(0,h.createNewElementNode)("div","todo-display show-todo"),o=(0,h.createNewElementNode)("div","todo-main"),r=(0,h.createNewElementNode)("span","todo-drag-handle",".. .. .."),a=(0,h.createNewElementNode)("label","todo-checkbox"),d=(0,h.createNewElementNode)("input","hidden-checkbox","","type","checkbox"),i=(0,h.createNewElementNode)("span","display-checkbox"),l=(0,h.createNewElementNode)("span","todo-content",e.text),s=(0,h.createNewElementNode)("div","delete-button-wrapper "),c=(0,h.createNewElementNode)("button","button button-delete-todo"),u=document.createTextNode(" ");e.isDone&&(l.classList.add("todo-is-done"),d.setAttribute("checked","checked")),v.default.appendMultiChild(a,d,i),v.default.appendMultiChild(o,a,l),s.appendChild(c),v.default.appendMultiChild(n,r,o,s),t.appendChild(n),v.default.appendMultiChild(p.$todoList,t,u)})}t.addTodo=i,t.toggleTodoStatus=c,t.deleteTodo=u,t.todoEditInPlaceModule=m.default,t.todoListRenderInit=s,t.displayCtrlInit=function(){var e=v.default.query(p.$displayCtrl,"display-all");b.default.selectAnOption(e)},t.sortableInit=function(){(0,g.default)(p.$todoList,".todo-drag-handle",".todo",f)}},54:function(e,t,n){},56:function(e,t,n){},57:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.todoOnClick=t.displayTabsOnClick=t.inputFormOnSubmit=void 0;var o=n(11),r=n(35),a=function(e){return e&&e.__esModule?e:{default:e}}(n(33));t.inputFormOnSubmit=function(e){e.preventDefault();var t=o.$inputForm.elements["todo-input"].value;0===t.trim().length?alert("You should type something in the input bar."):(0,r.addTodo)(t),o.$inputForm.reset()},t.displayTabsOnClick=function(e){var t=e.target;t.matches(".display-all")&&a.default.displayTodoAll(t),t.matches(".display-done")&&a.default.displayTodoIsDone(t),t.matches(".display-not-done")&&a.default.displayTodoIsNotDone(t)},t.todoOnClick=function(e){var t=e.target;t.matches(".hidden-checkbox")&&(0,r.toggleTodoStatus)(e.target),t.matches(".todo-content")&&r.todoEditInPlaceModule.activatedTodoEditInPlace(e.target),t.matches(".button-delete-todo")&&(0,r.deleteTodo)(e.target),t.matches(".button-save-todo-edit")&&r.todoEditInPlaceModule.saveTodoEdit(e.target),t.matches(".button-cancel-todo-edit")&&r.todoEditInPlaceModule.cancelTodoEdit(e.target)}},58:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(11),r=n(57);t.default=function(){o.$inputForm.addEventListener("submit",r.inputFormOnSubmit,!1),o.$displayCtrl.addEventListener("click",r.displayTabsOnClick,!1),o.$todoList.addEventListener("click",r.todoOnClick,!1)}},59:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(e){return e&&e.__esModule?e:{default:e}}(n(12));t.default=function(e,t,n,r){var a,d=void 0,i=void 0,l=void 0,s=void 0,c=void 0,u=void 0,f=void 0,p=void 0,h=[];function v(t){u=!1;var o=t.target,r=o.closest(n);r&&r!==d&&(t.preventDefault(),t.dataTransfer.dropEffect="move",(c=t.clientY>=s)&&o.nextSibling&&!u&&(e.insertBefore(d,r.nextSibling),u=!0),c||u||(e.insertBefore(d,r),u=!0),s=t.clientY)}function m(t){t.preventDefault(),d.classList.remove("grabbing"),e.removeEventListener("dragover",v,!1),e.removeEventListener("dragend",m,!1),i!==d.nextSibling&&(p=[].indexOf.call(e.children,d),r(f,p,void 0,e,c))}(a=h).push.apply(a,(0,o.default)(e.children)),h.forEach(function(e){e.draggable=!0,e.dataset.order=h.indexOf(e)}),e.addEventListener("mousedown",function(e){l=e.target},!1),e.addEventListener("dragstart",function(n){var r;l.matches(t)?(d=n.target,i=d.nextSibling,(r=h=[]).push.apply(r,(0,o.default)(e.children)),f=h.indexOf(d),n.dataTransfer.effectAllowed="move",n.dataTransfer.setData("Text",d.textContent),e.addEventListener("dragover",v,!1),e.addEventListener("dragend",m,!1),d.classList.add("grabbing")):n.preventDefault()},!1)}},60:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=s(n(17)),r=s(n(16)),a=function(){var e=(0,r.default)(o.default.mark(function e(t){var n,r,a,d,i,s,f;return o.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(!t.matches(".button-save-todo-edit")){e.next=22;break}if(n=l.default.findClosestAncestor(t,".todo"),r=l.default.findClosestAncestor(t,".todo-edit"),a=l.default.query(r,".todo-edit-input"),d=l.default.query(n,".todo-display"),i=l.default.query(d,".todo-content"),0!==a.value.trim().length){e.next=10;break}alert("The content of todo should not be empty. Please write something you need to do."),e.next=22;break;case 10:return s=parseInt(n.dataset.id),f={text:a.value},e.prev=12,e.next=15,c.update(s,f);case 15:e.sent&&(i.textContent=a.value,d.classList.remove("todo-display-hidden"),r.classList.remove("todo-edit-show"),u=void 0),e.next=22;break;case 19:e.prev=19,e.t0=e.catch(12),console.error(e.t0);case 22:case"end":return e.stop()}},e,this,[[12,19]])}));return function(t){return e.apply(this,arguments)}}(),d=function(){var e=(0,r.default)(o.default.mark(function e(){var t,n,r,a,d,i;return o.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if(void 0===u){e.next=17;break}return t=l.default.query(u,".todo-display"),n=l.default.query(t,".todo-content"),r=l.default.query(u,".todo-edit"),a=l.default.query(r,".todo-edit-input").value,d=parseInt(u.dataset.id),i={text:a},e.prev=7,e.next=10,c.update(d,i);case 10:e.sent&&(n.textContent=a,t.classList.remove("todo-display-hidden"),r.classList.remove("todo-edit-show")),e.next=17;break;case 14:e.prev=14,e.t0=e.catch(7),console.error(e.t0);case 17:case"end":return e.stop()}},e,this,[[7,14]])}));return function(){return e.apply(this,arguments)}}(),i=n(34),l=s(n(18));function s(e){return e&&e.__esModule?e:{default:e}}var c=(0,s(n(19)).default)("TodoApp",1,"todo"),u=void 0;t.default={activatedTodoEditInPlace:function(e){if(e.matches(".todo-content")&&"none"!==e.style.display){void 0!==u&&d();var t=l.default.findClosestAncestor(e,".todo-display"),n=l.default.findClosestAncestor(t,".todo");if(null===l.default.query(n,".todo-edit")){t.classList.add("todo-display-hidden");var o=(0,i.createNewElementNode)("div","todo-edit todo-edit-show"),r=(0,i.createNewElementNode)("div","input-bar"),a=(0,i.createNewElementNode)("input","todo-edit-input","","type","text","value",e.textContent),s=(0,i.createNewElementNode)("span","focus-border"),c=(0,i.createNewElementNode)("button","button button-save-todo-edit","save"),f=(0,i.createNewElementNode)("button","button button-cancel-todo-edit","cancel");l.default.appendMultiChild(r,a,s),l.default.appendMultiChild(o,r,c,f),n.appendChild(o)}else{var p=l.default.query(n,".todo-edit"),h=l.default.query(p,".todo-edit-input");t.classList.add("todo-display-hidden"),p.classList.add("todo-edit-show"),h.value=e.textContent}u=n}},saveTodoEdit:a,cancelTodoEdit:function(e){if(e.matches(".button-cancel-todo-edit")){var t=l.default.findClosestAncestor(e,".todo-edit");l.default.findSibling(t,".todo-display","forward").classList.remove("todo-display-hidden"),t.classList.remove("todo-edit-show"),u=void 0}}}},71:function(e,t,n){"use strict";Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||Element.prototype.webkitMatchesSelector||function(e){for(var t=(this.document||this.ownerDocument).querySelectorAll(e),n=t.length;--n>=0&&t.item(n)!==this;);return n>-1}),Element.prototype.closest||(Element.prototype.closest=function(e){var t=this;if(!document.documentElement.contains(t))return null;do{if(t.matches(e))return t;t=t.parentElement}while(null!==t);return null})}});