# todo app

一个使用原生js写的待办事项应用 :memo:

## 数据管理

[数据管理信息说明图](https://www.processon.com/view/link/5b1c09eee4b02e4b26ff4246)：包括，如何管理todo app中数据变化，todo list的DOM结构，DOM节点上相关数据的信息说明。

## 功能

### 基础功能

- [x] todo的展示
- [x] todo的输入、添加
- [x] todo的状态toggle（未完成、已完成）
- [x] 点击已添加的todo进入可编辑状态
- [x] 删除已添加的todo
- [x] 按todo的状态作展示（全部、未完成、已完成）

### 可强化功能

- [x] 使用鼠标拖拽，调整todo的排列顺序
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

compile with babel

```
npm run compile
```