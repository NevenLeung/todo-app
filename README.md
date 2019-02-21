# Todo App

一个使用原生 JS 写的待办事项应用 :memo: 。

## 项目说明

### 项目整体

- 使用原生 CSS 和 JS 实现，没有使用任何框架，仅使用 [normalize.css](https://github.com/necolas/normalize.css/) 重置了 CSS 的样式。
- 代码注释充足。变量、函数，选择器命名语义明确。
- 使用 babel、webpack 对源码进行编译、压缩、打包。

### 逻辑功能

- 利用原生拖放的 API，实现了todo的拖放排序（sortable list）。
- 实现了就地编辑（edit in place）功能。对 todo 使用就地编辑，再点击其他的 todo 会自动保存已做的修改。
- 使用 IndexedDB 实现数据的持久化管理，并对 IndexedDB 的 API 进行了封装，每个操作方法都返回一个 Promise。

### UI 交互

- 所有元素都具有交互效果。
- 动画化 todo 的添加、删除过程。
- 根据 todo 的状态进行切换显示，edit in place 的开启、关闭，都具有切换动画（未完成，构思中）。

## 项目相关资源

- [数据管理信息说明图 - ProcessOn](https://www.processon.com/view/link/5b1c09eee4b02e4b26ff4246)
  - 如何管理 Todo App 中数据变化
  - todo list 的 DOM 结构
  - DOM 节点上相关数据的信息说明
- [Project-todo-app - Trello](https://trello.com/b/D5nX2C2b/project-todo-list)
  - 记录个人在项目过程中遇到的问题，以及问题的解决思路、方案。

## Demo

[Demo Url](https://nevenleung.github.io/todo-app/)

<p align="center">
  <img src="https://github.com/NevenLeung/todo-app/blob/master/demo/add-and-delete-todo.gif" alt="Add and delete todo"/>
</p>

<p align="center">Add and delete todo</p>
<p align="center">添加，删除todo</p>


---

<p align="center">
  <img src="https://github.com/NevenLeung/todo-app/blob/master/demo/status-toggle-and-display-control.gif" alt="Toggle todo status and display control"/>
</p>

<p align="center">Toggle todo status and display control</p>
<p align="center">改变todo的完成状态，根据完成情况显示todo</p>


---

<p align="center">
  <img src="https://github.com/NevenLeung/todo-app/blob/master/demo/edit-in-place.gif" alt="Edit todo in place"/>
</p>

<p align="center">Edit todo in place (click the content to activate it)</p>
<p align="center">就地编辑 (点击内容部分启动该功能)</p>

---

<p align="center">
  <img src="https://github.com/NevenLeung/todo-app/blob/master/demo/reorder-by-drag%26drop.gif" alt="Reorder todo by drag&drop"/>
</p>

<p align="center">Reorder todo by drag&drop</p>
<p align="center">拖放todo进行排序</p>


## 功能列表

### 基础功能

- [x] todo的展示
- [x] todo的输入、添加
- [x] todo的状态toggle（未完成、已完成）
- [x] 点击已添加的todo进入可编辑状态
- [x] 删除已添加的todo
- [x] 按todo的状态作展示（全部、未完成、已完成）

### 可强化功能

- [x] 使用鼠标拖拽，调整todo的排列顺序
- [ ] 交互动画、过渡动画（部分已经完成）
- [ ] 选择截止时间
- [ ] 给todo设置背景颜色，作视觉的分类
- [ ] 父子todo，可设置层级关系
- [ ] 设置分类（项目）对todo进行分组，项目的添加、删除、编辑、排序
- [ ] 拖拽todo加入分类（项目）

### 强化体验功能

- [ ] 在todo中使用特定符号及相应文本，为todo添加不同的属性（所属项目、优先级、标签）
- [ ] 快捷键
- [ ] 右键菜单
- [ ] 全文搜索
- [ ] 标签
- [ ] 智能识别日期
- [ ] 项目名称补全
- [ ] 过滤器
- [ ] 评论系统

## scripts

run dev server

```
npm run dev
```

build project files

```
npm run build
```

## License

MIT © Neven Leung