import chalk from "chalk";
import path from "path";
import { findById, buildUrl, getAllContent } from "../utils/content.js";

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

export async function viewCommand(id) {
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

    // 构建访问URL
    const url = buildUrl(item.fileName);

    // 解析绝对路径
    const absolutePath = path.resolve(item.filePath);

    console.log(chalk.green(`\n🔍 ${type}路径信息:`));
    console.log(`${chalk.bold(type)}ID: ${chalk.bold(id)}`);
    console.log(`标题: ${chalk.bold(title)}`);
    console.log(`类型: ${chalk.cyan(item.type)}`);
    console.log(`状态: ${getStatusColor(item.status)}`);
    console.log(`本地文件路径: ${chalk.dim(absolutePath)}`);
    console.log(`浏览器访问URL: ${chalk.blue(url)}`);

    // 如果是任务，显示关联项目
    if (type === "任务") {
      console.log(
        `关联项目: ${chalk.green(item.projectTitle)} (${item.projectId})`
      );
    }

    // 检查是否有ID冲突
    const allContent = await getAllContent();

    // 查找所有匹配此ID的条目
    const matchingItems = allContent.filter(
      (content) => content.projectId === id || content.taskId === id
    );

    // 如果找到多个匹配项，显示警告
    if (matchingItems.length > 1) {
      console.log(
        "\n" + chalk.yellow("⚠️ 警告：") + chalk.dim(" 发现多个匹配此ID的条目")
      );
      console.log(chalk.dim("以下是所有匹配的条目："));

      matchingItems.forEach((match, index) => {
        const matchType = match.type === "project" ? "项目" : "任务";
        const matchTitle =
          match.type === "project"
            ? match.projectTitle || match.title
            : match.taskTitle || match.title;

        console.log(
          chalk.dim(
            `${index + 1}. ${matchType}: ${matchTitle} (${match.fileName})`
          )
        );
      });

      // 提供一个使用提示
      if (id.startsWith("p")) {
        console.log(chalk.dim(`提示: 使用 "opc list --id ${id}" 查看完整信息`));
      } else if (id.startsWith("t")) {
        console.log(chalk.dim(`提示: 使用 "opc list --id ${id}" 查看完整信息`));
      }
    }
  } catch (error) {
    console.error(chalk.red(`查看路径时出错: ${error.message}`));
  }
}
