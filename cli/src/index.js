#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { createCommand } from "./commands/create.js";
import { listCommand } from "./commands/list.js";
import { updateCommand } from "./commands/update.js";
import { deleteCommand } from "./commands/delete.js";
import { viewCommand } from "./commands/view.js";
import { showHelp } from "./commands/help.js";

const program = new Command();

// 自定义帮助信息
program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: (cmd) =>
    chalk.cyan(cmd.name()) + " " + chalk.yellow(cmd.usage()),
  subcommandDescription: (cmd) => cmd.description(),
  optionTerm: (option) => chalk.yellow(option.flags),
  optionDescription: (option) => option.description,
  commandUsage: (cmd) => chalk.yellow(cmd.usage()),
  argumentTerm: (arg) => chalk.yellow(`<${arg.name}>`),
  commandDescription: (cmd) => cmd.description(),
});

// 覆盖 formatHelp 方法以自定义输出格式
program.formatHelp = function (cmd, helper) {
  const termWidth = helper.padWidth(cmd, helper);
  const helpWidth = helper.helpWidth || 80;

  const output = [
    "",
    chalk.bold(chalk.green("OnePersonCompany 博客内容管理工具")),
    "",
    chalk.dim("用于快速创建和管理项目与任务的命令行工具"),
    "",
    chalk.bold("用法:"),
    "  " + chalk.yellow(`${cmd.name()} [选项] [命令]`),
    "",
    chalk.bold("选项:"),
    cmd.createOptionHelp().replace(/^/gm, "  "),
    "",
    chalk.bold("命令:"),
  ];

  const commandList = cmd.commands
    .map((cmd) => {
      const name = helper.subcommandTerm(cmd);
      const desc = helper.subcommandDescription(cmd);

      // 为描述添加颜色和格式
      const coloredDesc = desc
        .replace(/\(options:(.*?)\)/g, `(${chalk.cyan("选项")}: $1)`)
        .replace(/\(type:(.*?)\)/g, `(${chalk.cyan("类型")}: $1)`)
        .replace(/\(id:(.*?)\)/g, `(${chalk.cyan("ID")}: $1)`)
        .replace(/status:(.*?)\)/g, `${chalk.cyan("状态")}: $1)`)
        .replace(/project/g, chalk.green("project"))
        .replace(/task/g, chalk.green("task"))
        .replace(/p1\/t1/g, chalk.green("p1") + "/" + chalk.green("t1"))
        .replace(
          /todo\/in-progress\/completed/g,
          chalk.yellow("todo") +
            "/" +
            chalk.blue("in-progress") +
            "/" +
            chalk.green("completed")
        );

      return `  ${name}`.padEnd(termWidth + 4) + coloredDesc;
    })
    .join("\n");

  output.push(commandList);
  output.push("");
  output.push(
    chalk.dim("使用 ") +
      chalk.yellow(`${cmd.name()} help [命令]`) +
      chalk.dim(" 查看特定命令的帮助信息")
  );
  output.push("");

  return output.join("\n");
};

program
  .name("opc")
  .description("OnePersonCompany博客内容管理CLI")
  .version("0.1.0")
  .helpOption("-h, --help", "显示帮助信息")
  .on("--help", () => {
    showHelp();
  })
  .on("-h", () => {
    showHelp();
  });

// 自定义帮助命令
program
  .command("help")
  .description("显示详细的帮助信息")
  .action(() => {
    showHelp();
  });

// 列出项目或任务
program
  .command("list")
  .description(
    "列出所有项目或任务 (options: -p/--projects, -t/--tasks, --id <id>, --status <status>)"
  )
  .option("-p, --projects", "只列出项目")
  .option("-t, --tasks", "只列出任务")
  .option("--id <id>", "按ID筛选，例如: p1, t2")
  .option(
    "--status <status>",
    "按状态筛选，可选值: todo, in-progress, completed"
  )
  .action(listCommand);

// 创建项目或任务
program
  .command("create")
  .description("创建新的项目或任务 (type: project 或 task)")
  .argument("[type]", "创建类型: project 或 task，不提供时会交互式选择")
  .action(createCommand);

// 更新项目或任务状态
program
  .command("update")
  .description(
    "更新项目或任务状态 (id: p1/t1, status: todo/in-progress/completed)"
  )
  .argument("<id>", "项目ID(p1)或任务ID(t1)")
  .argument("[status]", "新状态: todo, in-progress, completed")
  .action(updateCommand);

// 删除项目或任务
program
  .command("delete")
  .description("删除项目或任务 (id: p1/t1)")
  .argument("<id>", "项目ID(p1)或任务ID(t1)")
  .action(deleteCommand);

// 查看项目或任务路径
program
  .command("view")
  .description("查看项目或任务的文件路径和访问URL (id: p1/t1)")
  .argument("<id>", "项目ID(p1)或任务ID(t1)")
  .action(viewCommand);

// 无参数时显示帮助
if (process.argv.length <= 2) {
  showHelp();
  process.exit(0);
}

program.parse(process.argv);
