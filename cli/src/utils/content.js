import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { globby } from "globby";
import matter from "gray-matter";
import slugify from "slugify";
import pinyin from "pinyin";
import chalk from "chalk";

// 获取当前文件的目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 内容目录路径
const CONTENT_DIR = path.resolve(__dirname, "../../../src/content/blog");
const BASE_URL = "http://localhost:4321/blog/";

// 获取所有博客内容
export async function getAllContent() {
  const files = await globby(`${CONTENT_DIR}/*.md`);

  const contentList = await Promise.all(
    files.map(async (file) => {
      const content = await fs.readFile(file, "utf-8");
      const { data } = matter(content);
      return {
        ...data,
        filePath: file,
        fileName: path.basename(file),
      };
    })
  );

  return contentList;
}

// 获取所有项目
export async function getAllProjects() {
  const contentList = await getAllContent();
  return contentList.filter((item) => item.type === "project");
}

// 获取所有任务
export async function getAllTasks() {
  const contentList = await getAllContent();
  return contentList.filter((item) => item.type === "task");
}

// 通过ID查找项目或任务
export async function findById(id) {
  const contentList = await getAllContent();

  // 检查ID的前缀，判断应该优先查找项目还是任务
  const isProjectId = id.startsWith("p");
  const isTaskId = id.startsWith("t");

  // 如果是项目ID (以p开头)，优先查找type=project的项目
  if (isProjectId) {
    // 首先尝试查找匹配projectId且type=project的记录
    const project = contentList.find(
      (item) => item.projectId === id && item.type === "project"
    );

    if (project) return project;

    // 如果找不到，回退到查找任何匹配projectId的记录
    return contentList.find((item) => item.projectId === id);
  }

  // 如果是任务ID (以t开头)，优先查找type=task的任务
  if (isTaskId) {
    // 首先尝试查找匹配taskId且type=task的记录
    const task = contentList.find(
      (item) => item.taskId === id && item.type === "task"
    );

    if (task) return task;

    // 如果找不到，回退到查找任何匹配taskId的记录
    return contentList.find((item) => item.taskId === id);
  }

  // 如果不是p或t开头，则查找任何匹配projectId或taskId的记录
  return contentList.find(
    (item) => item.projectId === id || item.taskId === id
  );
}

// 生成项目ID
export async function generateProjectId() {
  const projects = await getAllProjects();
  const ids = projects.map((p) => parseInt(p.projectId.replace("p", ""), 10));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return `p${maxId + 1}`;
}

// 生成任务ID
export async function generateTaskId() {
  const tasks = await getAllTasks();
  const ids = tasks.map((t) => parseInt(t.taskId.replace("t", ""), 10));
  const maxId = ids.length > 0 ? Math.max(...ids) : 0;
  return `t${maxId + 1}`;
}

/**
 * 将中文转换为拼音
 * 如果没有pinyin库，则使用简单的转换逻辑
 */
function chineseToPinyin(text) {
  try {
    // 检查是否安装了pinyin库
    if (typeof pinyin === "function") {
      return pinyin(text, {
        style: pinyin.STYLE_NORMAL, // 输出拼音，不带声调
        segment: true, // 启用分词
      })
        .flat()
        .join("-");
    }
  } catch (e) {
    console.log(
      chalk.yellow("提示: 安装 pinyin 包可以获得更好的中文文件名支持")
    );
    console.log(chalk.dim("npm install pinyin --save"));
  }

  // 如果没有安装pinyin，或者处理出错，则使用简单的转换方案
  return (
    text.replace(/[\u4e00-\u9fa5]/g, "").trim() ||
    text.slice(0, 3) + "-" + Date.now().toString().slice(-6)
  );
}

/**
 * 处理文件名，使其符合文件系统要求
 * @param {string} text 原始文本
 * @returns {string} 处理后的安全文件名
 */
function sanitizeFilename(text) {
  // 移除文件名中不允许的字符 (/, \, :, *, ?, ", <, >, |)
  return text.replace(/[\/\\:*?"<>|]/g, "-");
}

// 创建文件名
export function createFileName(title, type) {
  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0];

  // 如果标题为空，使用类型和时间戳
  if (!title || title.trim() === "") {
    return `${formattedDate}-${type}-${Date.now().toString().slice(-6)}.md`;
  }

  // 处理标题，使其成为安全的文件名
  const safeTitle = sanitizeFilename(title.trim());

  // 如果处理后的标题为空，使用类型和时间戳
  if (!safeTitle) {
    return `${formattedDate}-${type}-${Date.now().toString().slice(-6)}.md`;
  }

  // 限制标题长度，避免文件名过长
  const maxTitleLength = 50;
  const truncatedTitle =
    safeTitle.length > maxTitleLength
      ? safeTitle.substring(0, maxTitleLength)
      : safeTitle;

  return `${formattedDate}-${truncatedTitle}.md`;
}

// 构建文件路径
export function buildFilePath(fileName) {
  return path.join(CONTENT_DIR, fileName);
}

// 构建访问URL
export function buildUrl(fileName) {
  // 移除日期前缀和.md扩展名
  const slug = fileName.replace(/^\d{4}-\d{2}-\d{2}-(.+)\.md$/, "$1");
  // 编码URL，确保中文等特殊字符能被正确处理
  return `${BASE_URL}${encodeURIComponent(slug)}`;
}

// 创建或更新内容
export async function saveContent(data, filePath) {
  // 准备frontmatter内容
  const frontmatter = matter.stringify("", data);
  await fs.writeFile(filePath, frontmatter);
  return filePath;
}

// 删除内容
export async function deleteContent(filePath) {
  await fs.unlink(filePath);
  return true;
}
