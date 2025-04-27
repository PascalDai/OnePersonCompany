import chalk from "chalk";
import { getAllProjects, getAllTasks } from "../utils/content.js";

export async function listCommand(options) {
  try {
    // 根据选项确定要显示的内容类型
    let projects = [];
    let tasks = [];

    if (!options.tasks || options.projects) {
      projects = await getAllProjects();

      // 按ID筛选
      if (options.id) {
        projects = projects.filter(
          (project) => project.projectId === options.id
        );
      }

      // 按状态筛选
      if (options.status) {
        projects = projects.filter(
          (project) => project.status === options.status
        );
      }
    }

    if (!options.projects || options.tasks) {
      tasks = await getAllTasks();

      // 按ID筛选
      if (options.id) {
        tasks = tasks.filter((task) => task.taskId === options.id);
      }

      // 按状态筛选
      if (options.status) {
        tasks = tasks.filter((task) => task.status === options.status);
      }
    }

    // 显示项目列表
    if (projects.length > 0 && (!options.tasks || options.projects)) {
      console.log(chalk.bold("\n项目列表:"));
      console.log("=" + "=".repeat(60));

      projects.forEach((project) => {
        console.log(chalk.green(`项目ID: ${chalk.bold(project.projectId)}`));
        console.log(
          `标题: ${chalk.bold(project.projectTitle || project.title)}`
        );
        console.log(`状态: ${getStatusColor(project.status)(project.status)}`);
        console.log(`文件: ${project.fileName}`);
        console.log("-".repeat(62));
      });
    }

    // 显示任务列表
    if (tasks.length > 0 && (!options.projects || options.tasks)) {
      console.log(chalk.bold("\n任务列表:"));
      console.log("=" + "=".repeat(60));

      tasks.forEach((task) => {
        console.log(chalk.blue(`任务ID: ${chalk.bold(task.taskId)}`));
        console.log(`标题: ${chalk.bold(task.taskTitle || task.title)}`);
        console.log(`项目: ${chalk.green(task.projectTitle)}`);
        console.log(`状态: ${getStatusColor(task.status)(task.status)}`);
        console.log(`文件: ${task.fileName}`);
        console.log("-".repeat(62));
      });
    }

    const totalCount = projects.length + tasks.length;

    if (totalCount === 0) {
      console.log(chalk.yellow("\n没有找到匹配的项目或任务。"));
    } else {
      console.log(
        chalk.dim(
          `\n共找到 ${projects.length} 个项目和 ${tasks.length} 个任务。`
        )
      );
    }
  } catch (error) {
    console.error(chalk.red(`列出项目或任务时出错: ${error.message}`));
  }
}

// 根据状态获取对应的颜色
function getStatusColor(status) {
  switch (status) {
    case "todo":
      return chalk.yellow;
    case "in-progress":
      return chalk.blue;
    case "completed":
      return chalk.green;
    default:
      return chalk.dim;
  }
}
