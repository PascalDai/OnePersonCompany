import chalk from "chalk";
import inquirer from "inquirer";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import {
  getAllProjects,
  generateProjectId,
  generateTaskId,
  createFileName,
  buildFilePath,
  buildUrl,
  saveContent,
} from "../utils/content.js";

// 获取当前文件的目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createCommand(type) {
  try {
    let createType = type;

    // 如果没有提供类型，则提示用户选择
    if (!createType) {
      const answers = await inquirer.prompt([
        {
          type: "list",
          name: "type",
          message: "选择要创建的类型:",
          choices: [
            {
              name: `${chalk.green("项目")} (project) - 创建一个新项目`,
              value: "project",
              short: "项目",
            },
            {
              name: `${chalk.green("任务")} (task) - 创建一个关联到项目的任务`,
              value: "task",
              short: "任务",
            },
          ],
        },
      ]);

      createType = answers.type;
      console.log(
        chalk.cyan(
          `\n开始创建${createType === "project" ? "项目" : "任务"}...\n`
        )
      );
    }

    // 检查类型是否有效
    if (createType !== "project" && createType !== "task") {
      console.error(chalk.red('无效的类型。请指定 "project" 或 "task"。'));
      return;
    }

    // 根据类型调用不同的创建函数
    if (createType === "project") {
      await createProject();
    } else {
      await createTask();
    }
  } catch (error) {
    console.error(chalk.red(`创建过程中出错: ${error.message}`));
  }
}

// 创建项目
async function createProject() {
  try {
    // 生成新的项目ID
    const projectId = await generateProjectId();

    // 收集项目信息
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "title",
        message: "项目标题:",
        validate: (input) => (input.trim() !== "" ? true : "标题不能为空"),
      },
      {
        type: "input",
        name: "description",
        message: "项目描述:",
        validate: (input) => (input.trim() !== "" ? true : "描述不能为空"),
      },
      {
        type: "input",
        name: "tags",
        message: "项目标签 (用逗号分隔):",
        default: "",
      },
      {
        type: "list",
        name: "status",
        message: "项目状态:",
        choices: ["todo", "in-progress", "completed"],
        default: "todo",
      },
      {
        type: "input",
        name: "imageUrl",
        message: "封面图片URL (可选):",
        default: "https://placehold.co/600x400?text=项目封面",
      },
      {
        type: "input",
        name: "imageAlt",
        message: "封面图片描述 (可选):",
        default: "项目封面图片",
      },
    ]);

    // 处理标签
    const tags = answers.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "")
      .map((tag) => `"${tag}"`);

    // 构建frontmatter数据
    const frontmatterData = {
      title: answers.title,
      description: answers.description,
      pubDate: new Date().toISOString().split("T")[0],
      author: "博主",
      type: "project",
      projectId,
      projectTitle: answers.title,
      status: answers.status,
      image: {
        url: answers.imageUrl,
        alt: answers.imageAlt,
      },
      tags: tags.length > 0 ? JSON.parse(`[${tags}]`) : [],
    };

    // 创建文件名和路径
    const fileName = createFileName(answers.title, "project");
    const filePath = buildFilePath(fileName);

    // 读取项目模板
    const templatePath = path.resolve(
      __dirname,
      "../templates/project-template.md"
    );
    let templateContent = await fs.readFile(templatePath, "utf-8");

    // 替换模板中的占位符
    templateContent = templateContent
      .replace("{{title}}", answers.title)
      .replace("{{description}}", answers.description);

    // 保存文件
    const frontmatter = `---\n${Object.entries(frontmatterData)
      .map(([key, value]) => {
        if (key === "tags") {
          return `${key}: ${JSON.stringify(value)}`;
        } else if (key === "image") {
          return `${key}: \n  url: ${value.url}\n  alt: ${value.alt}`;
        } else {
          return `${key}: ${JSON.stringify(value)}`.replace(/"/g, "");
        }
      })
      .join("\n")}\n---\n\n${templateContent}`;

    await fs.writeFile(filePath, frontmatter);

    // 输出结果
    const url = buildUrl(fileName);

    console.log(chalk.green("\n✅ 项目创建成功!"));
    console.log(`项目ID: ${chalk.bold(projectId)}`);
    console.log(`文件路径: ${chalk.dim(filePath)}`);
    console.log(`访问URL: ${chalk.blue(url)}`);
  } catch (error) {
    console.error(chalk.red(`创建项目时出错: ${error.message}`));
  }
}

// 创建任务
async function createTask() {
  try {
    // 获取所有项目
    const allProjects = await getAllProjects();

    // 只保留未完成的项目（排除status为completed的项目）
    const activeProjects = allProjects.filter(
      (project) => project.status !== "completed"
    );

    if (activeProjects.length === 0) {
      console.log(chalk.yellow("\n没有处于活跃状态的项目。"));

      if (allProjects.length > 0) {
        console.log(chalk.dim("所有项目都已标记为已完成。"));

        // 询问是否要显示所有项目
        const { showAllProjects } = await inquirer.prompt([
          {
            type: "confirm",
            name: "showAllProjects",
            message: "是否显示所有项目（包括已完成的项目）?",
            default: false,
          },
        ]);

        if (showAllProjects) {
          console.log(chalk.dim("\n显示所有项目，包括已完成的项目:"));
        } else {
          console.log(
            chalk.yellow("请先创建一个新项目或将现有项目设置为未完成状态。")
          );
          return;
        }
      } else {
        console.error(chalk.yellow("没有可用的项目。请先创建一个项目。"));
        return;
      }
    }

    // 确定要显示的项目列表
    const projectsToShow =
      activeProjects.length > 0 ? activeProjects : allProjects;

    // 生成新的任务ID
    const taskId = await generateTaskId();

    // 收集项目信息
    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "projectId",
        message: "选择关联项目:",
        choices: projectsToShow.map((project) => ({
          name: `${project.projectTitle || project.title} (${
            project.projectId
          }) ${project.status === "completed" ? chalk.dim("[已完成]") : ""}`,
          value: project.projectId,
          short: project.projectId,
        })),
      },
      {
        type: "input",
        name: "title",
        message: "任务标题:",
        validate: (input) => (input.trim() !== "" ? true : "标题不能为空"),
      },
      {
        type: "input",
        name: "description",
        message: "任务描述:",
        validate: (input) => (input.trim() !== "" ? true : "描述不能为空"),
      },
      {
        type: "input",
        name: "tags",
        message: "任务标签 (用逗号分隔):",
        default: "",
      },
      {
        type: "list",
        name: "status",
        message: "任务状态:",
        choices: ["todo", "in-progress", "completed"],
        default: "todo",
      },
      {
        type: "input",
        name: "imageUrl",
        message: "封面图片URL (可选):",
        default: "https://placehold.co/600x400?text=任务封面",
      },
      {
        type: "input",
        name: "imageAlt",
        message: "封面图片描述 (可选):",
        default: "任务封面图片",
      },
    ]);

    // 找到关联的项目
    const selectedProject = allProjects.find(
      (p) => p.projectId === answers.projectId
    );

    // 处理标签
    const tags = answers.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "")
      .map((tag) => `"${tag}"`);

    // 构建frontmatter数据
    const frontmatterData = {
      title: answers.title,
      description: answers.description,
      pubDate: new Date().toISOString().split("T")[0],
      author: "博主",
      type: "task",
      projectId: answers.projectId,
      projectTitle: selectedProject.projectTitle || selectedProject.title,
      taskId,
      taskTitle: answers.title,
      status: answers.status,
      image: {
        url: answers.imageUrl,
        alt: answers.imageAlt,
      },
      tags: tags.length > 0 ? JSON.parse(`[${tags}]`) : [],
    };

    // 创建文件名和路径
    const fileName = createFileName(answers.title, "task");
    const filePath = buildFilePath(fileName);

    // 读取任务模板
    const templatePath = path.resolve(
      __dirname,
      "../templates/task-template.md"
    );
    let templateContent = await fs.readFile(templatePath, "utf-8");

    // 替换模板中的占位符
    templateContent = templateContent
      .replace("{{title}}", answers.title)
      .replace("{{description}}", answers.description);

    // 保存文件
    const frontmatter = `---\n${Object.entries(frontmatterData)
      .map(([key, value]) => {
        if (key === "tags") {
          return `${key}: ${JSON.stringify(value)}`;
        } else if (key === "image") {
          return `${key}: \n  url: ${value.url}\n  alt: ${value.alt}`;
        } else {
          return `${key}: ${JSON.stringify(value)}`.replace(/"/g, "");
        }
      })
      .join("\n")}\n---\n\n${templateContent}`;

    await fs.writeFile(filePath, frontmatter);

    // 输出结果
    const url = buildUrl(fileName);

    console.log(chalk.green("\n✅ 任务创建成功!"));
    console.log(`任务ID: ${chalk.bold(taskId)}`);
    console.log(
      `关联项目: ${chalk.green(
        selectedProject.projectTitle || selectedProject.title
      )} (${answers.projectId})`
    );
    console.log(`文件路径: ${chalk.dim(filePath)}`);
    console.log(`访问URL: ${chalk.blue(url)}`);
  } catch (error) {
    console.error(chalk.red(`创建任务时出错: ${error.message}`));
  }
}
