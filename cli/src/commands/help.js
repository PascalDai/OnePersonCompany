import chalk from "chalk";

export function showHelp() {
  console.log("");
  console.log(chalk.bold(chalk.green("OnePersonCompany 博客内容管理工具")));
  console.log("");
  console.log(chalk.dim("用于快速创建和管理项目与任务的命令行工具"));
  console.log("");

  console.log(chalk.bold("用法:"));
  console.log(
    `  ${chalk.yellow("opc")} ${chalk.yellow("[选项]")} ${chalk.yellow(
      "[命令]"
    )}`
  );
  console.log("");

  console.log(chalk.bold("选项:"));
  console.log(`  ${chalk.yellow("-V, --version")}             查看版本号`);
  console.log(`  ${chalk.yellow("-h, --help")}                显示帮助信息`);
  console.log("");

  console.log(chalk.bold("命令:"));

  // list命令
  console.log(`  ${chalk.cyan("list")} ${chalk.yellow("[选项]")}`);
  console.log(`    列出所有项目或任务`);
  console.log(`    ${chalk.dim("选项:")}`);
  console.log(`      ${chalk.yellow("-p, --projects")}          只列出项目`);
  console.log(`      ${chalk.yellow("-t, --tasks")}             只列出任务`);
  console.log(
    `      ${chalk.yellow("--id")} ${chalk.green(
      "<id>"
    )}                按ID筛选，例如: ${chalk.green("p1")}, ${chalk.green(
      "t2"
    )}`
  );
  console.log(
    `      ${chalk.yellow("--status")} ${chalk.green(
      "<status>"
    )}        按状态筛选，可选值: ${chalk.yellow("todo")}, ${chalk.blue(
      "in-progress"
    )}, ${chalk.green("completed")}`
  );
  console.log("");

  // create命令
  console.log(`  ${chalk.cyan("create")} ${chalk.green("<type>")}`);
  console.log(`    创建新的项目或任务`);
  console.log(`    ${chalk.dim("参数:")}`);
  console.log(
    `      ${chalk.green("<type>")}                  创建类型: ${chalk.green(
      "project"
    )} 或 ${chalk.green("task")}`
  );
  console.log(`    ${chalk.dim("特性:")}`);
  console.log(
    `      ${chalk.cyan("- 支持中文标题")}           可直接使用中文命名文件`
  );
  console.log(
    `      ${chalk.cyan("- 自动净化文件名")}         自动移除不安全字符`
  );
  console.log(
    `      ${chalk.cyan("- URL自动编码")}            自动处理中文URL`
  );
  console.log("");

  // update命令
  console.log(
    `  ${chalk.cyan("update")} ${chalk.green("<id>")} ${chalk.yellow(
      "[status]"
    )}`
  );
  console.log(`    更新项目或任务状态`);
  console.log(`    ${chalk.dim("参数:")}`);
  console.log(
    `      ${chalk.green("<id>")}                    项目ID(${chalk.green(
      "p1"
    )})或任务ID(${chalk.green("t1")})`
  );
  console.log(
    `      ${chalk.yellow("[status]")}               新状态: ${chalk.yellow(
      "todo"
    )}, ${chalk.blue("in-progress")}, ${chalk.green("completed")}`
  );
  console.log("");

  // delete命令
  console.log(`  ${chalk.cyan("delete")} ${chalk.green("<id>")}`);
  console.log(`    删除项目或任务`);
  console.log(`    ${chalk.dim("参数:")}`);
  console.log(
    `      ${chalk.green("<id>")}                    项目ID(${chalk.green(
      "p1"
    )})或任务ID(${chalk.green("t1")})`
  );
  console.log("");

  // view命令
  console.log(`  ${chalk.cyan("view")} ${chalk.green("<id>")}`);
  console.log(`    查看项目或任务的文件路径和访问URL`);
  console.log(`    ${chalk.dim("参数:")}`);
  console.log(
    `      ${chalk.green("<id>")}                    项目ID(${chalk.green(
      "p1"
    )})或任务ID(${chalk.green("t1")})`
  );
  console.log("");

  console.log(chalk.bold("文件名处理:"));
  console.log(`  ${chalk.dim("- 支持直接使用中文标题作为文件名")}`);
  console.log(
    `  ${chalk.dim('- 自动移除文件名中的非法字符 (/ \\ : * ? " < > |)')}`
  );
  console.log(`  ${chalk.dim("- 限制文件名长度，避免过长")}`);
  console.log(`  ${chalk.dim("- 自动为URL编码，确保中文字符可正确访问")}`);
  console.log("");

  console.log(chalk.dim("示例:"));
  console.log(
    `  ${chalk.yellow("opc list")}                   列出所有项目和任务`
  );
  console.log(`  ${chalk.yellow("opc list --projects")}        只列出项目`);
  console.log(`  ${chalk.yellow("opc create project")}         创建新项目`);
  console.log(
    `  ${chalk.yellow("opc update t1 completed")}    将任务t1标记为已完成`
  );
  console.log(
    `  ${chalk.yellow("opc view p1")}                查看项目p1的路径信息`
  );
  console.log("");
}
