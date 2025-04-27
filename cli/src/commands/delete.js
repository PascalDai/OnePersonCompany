import chalk from "chalk";
import inquirer from "inquirer";
import { findById, deleteContent } from "../utils/content.js";

export async function deleteCommand(id) {
  try {
    // 查找项目或任务
    const item = await findById(id);

    if (!item) {
      console.error(chalk.red(`未找到ID为 "${id}" 的项目或任务。`));
      return;
    }

    const type = item.type === "project" ? "项目" : "任务";
    const title =
      item.type === "project"
        ? item.projectTitle || item.title
        : item.taskTitle || item.title;

    // 确认是否删除
    const answers = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: `确定要删除${type} "${title}" (${id}) 吗?`,
        default: false,
      },
    ]);

    if (!answers.confirm) {
      console.log(chalk.yellow(`已取消删除操作。`));
      return;
    }

    // 执行删除
    await deleteContent(item.filePath);

    console.log(chalk.green(`\n✅ ${type}已成功删除!`));
    console.log(`${type}ID: ${chalk.bold(id)}`);
    console.log(`标题: ${chalk.bold(title)}`);
    console.log(`文件: ${chalk.dim(item.filePath)}`);
  } catch (error) {
    console.error(chalk.red(`删除时出错: ${error.message}`));
  }
}
