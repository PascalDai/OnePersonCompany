# OPC CLI 工具

OnePersonCompany博客内容管理命令行工具，用于快速创建和管理项目与任务。

## 安装与设置

如果你是从本项目的根目录使用，可以直接运行：

```bash
npm run opc <command>
```

或者全局安装（推荐）：

```bash
npm link ./cli
```

然后可以在任意目录使用：

```bash
opc <command>
```

## 命令

### 列出项目和任务

```bash
# 列出所有项目和任务
opc list

# 只列出项目
opc list --projects

# 只列出任务
opc list --tasks

# 按状态筛选
opc list --status in-progress
```

### 创建项目或任务

```bash
# 创建新项目
opc create project

# 创建新任务
opc create task
```

### 更新状态

```bash
# 更新项目或任务状态，会提示选择新状态
opc update p1

# 直接指定新状态
opc update t1 completed
```

### 删除项目或任务

```bash
# 删除项目或任务
opc delete p1
```

### 查看路径信息

```bash
# 查看项目或任务的文件路径和访问URL
opc view t1
```

## 项目结构

- `src/index.js` - 主入口文件
- `src/commands/` - 命令实现
- `src/templates/` - Markdown模板
- `src/utils/` - 工具函数 