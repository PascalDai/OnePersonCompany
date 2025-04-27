import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs/promises";
import matter from "gray-matter";
import { findById } from "../utils/content.js";

// 有效的状态列表
const VALID_STATUSES = ["todo", "in-progress", "completed"];

// 获取状态的颜色
function getStatusColor(status) {
  switch (status) {
    case "todo":
      return chalk.yellow(status);
    case "in-progress":
      return chalk.blue(status);
    case "completed":
      return chalk.green(status);
    default:
      return chalk.dim(status);
  }
}

export async function updateCommand(id, status) {
  try {
    // 查找项目或任务
    const item = await findById(id);

    if (!item) {
      console.error(chalk.red(`未找到ID为 "${id}" 的项目或任务。`));
      return;
    }

    const type = item.type === "project" ? "项目" : "任务";
    const idType = item.type === "project" ? "项目ID" : "任务ID";
    const title =
      item.type === "project"
        ? item.projectTitle || item.title
        : item.taskTitle || item.title;

    // 显示当前状态
    console.log(`\n${chalk.bold(type)}信息:`);
    console.log(`${idType}: ${chalk.bold(id)}`);
    console.log(`标题: ${chalk.bold(title)}`);
    console.log(`当前状态: ${getStatusColor(item.status)}`);

    let newStatus = status;

    // 如果提供了状态，验证它的有效性
    if (newStatus) {
      if (!VALID_STATUSES.includes(newStatus)) {
        console.error(chalk.red(`\n无效的状态值: "${newStatus}"`));
        console.log(
          chalk.dim(
            `有效的状态值包括: ${VALID_STATUSES.map((s) =>
              getStatusColor(s)
            ).join(", ")}`
          )
        );
        return;
      }
    } else {
      // 如果没有提供状态，则提示用户选择
      console.log("\n请选择新状态:");

      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "status",
          message: `为 ${chalk.cyan(id)} 选择新状态:`,
          choices: VALID_STATUSES.map((status) => ({
            name: `${getStatusColor(status)}${
              status === item.status ? chalk.dim(" (当前)") : ""
            }`,
            value: status,
            short: status,
          })),
          default: VALID_STATUSES.indexOf(item.status),
        },
      ]);

      newStatus = answers.status;
    }

    // 如果状态没有变化，则提示用户
    if (newStatus === item.status) {
      console.log(
        chalk.yellow(`\n状态未变更，保持为 ${getStatusColor(newStatus)}`)
      );
      return;
    }

    // 读取文件内容
    const filePath = item.filePath;
    const content = await fs.readFile(filePath, "utf-8");

    // 解析frontmatter
    const { data, content: documentContent } = matter(content);

    // 更新状态
    data.status = newStatus;

    // 重新构建文件内容
    const updatedContent = matter.stringify(documentContent, data);

    // 保存文件
    await fs.writeFile(filePath, updatedContent);

    console.log(chalk.green(`\n✅ ${type}状态更新成功!`));
    console.log(`${idType}: ${chalk.bold(id)}`);
    console.log(`标题: ${chalk.bold(title)}`);
    console.log(
      `状态: ${getStatusColor(item.status)} → ${getStatusColor(newStatus)}`
    );
    console.log(`文件: ${chalk.dim(item.filePath)}`);
  } catch (error) {
    console.error(chalk.red(`更新状态时出错: ${error.message}`));
  }
}
