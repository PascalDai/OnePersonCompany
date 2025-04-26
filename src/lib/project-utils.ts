import type { Project, Task } from './types';

/**
 * 获取项目的正确链接地址
 * 如果项目有slug，直接使用；否则返回任务过滤页面链接
 * @param project 项目对象
 * @returns 正确的链接地址
 */
export function getProjectLink(project: Project): string {
  if (project.slug) {
    return `/blog/${project.slug}`;
  }
  
  return `/tasks?project=${project.id}`;
} 