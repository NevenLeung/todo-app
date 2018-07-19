# todo app

一个使用原生js写的待办事项应用 :memo:

## 项目说明

### 项目整体

- 使用原生css和js实现，没有使用任何框架，仅仅使用了[normalize.css](https://github.com/necolas/normalize.css/)重置css的样式。
- 代码注释充足。变量、函数，选择器命名语义明确。
- 使用webpack、babel、PostCss对源码进行编译、压缩、打包。

### 逻辑功能 

- 实现了就地编辑(edit in place)功能。
- 利用原生拖放的api，实现了todo的拖放排序(sortable list)。
- 对IndexedDB的api进行了封装，每个操作方法都返回一个Promise。在本项目中使用IndexedDB实现数据的持久化管理。

### UI交互

- 所有元素都具有交互效果。
- 动画化todo的添加、删除过程。
- 根据todo的状态进行切换显示，edit in place的开启、关闭，都具有切换动画（构思中）。

## 项目相关资源

- [数据管理信息说明图 - ProcessOn](https://www.processon.com/view/link/5b1c09eee4b02e4b26ff4246): 包括，如何管理todo app中数据变化，todo list的DOM结构，DOM节点上相关数据的信息说明。
- [Project-todo-list - Trello](https://trello.com/b/D5nX2C2b/project-todo-list): 记录个人在项目过程中遇到的问题，以及问题的解决方案、思路。


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

build

```
npm run build
```