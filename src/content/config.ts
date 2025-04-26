// 定义Astro内容集合配置
import { z, defineCollection } from 'astro:content';

// 定义博客集合的schema
const blogCollection = defineCollection({
  schema: z.object({
    // 基本字段
    title: z.string(),
    description: z.string(),
    pubDate: z.string().or(z.date()).transform((val) => new Date(val)),
    author: z.string().default('博主'),
    layout: z.string().optional(),
    
    // 图片
    image: z.object({
      url: z.string().optional(),
      alt: z.string().optional(),
    }).optional(),
    
    // 标签
    tags: z.array(z.string()).default([]),
    
    // 内容分类元数据
    type: z.enum(['post', 'project', 'task']).default('post'),
    
    // 项目相关元数据
    projectId: z.string().optional(),
    projectTitle: z.string().optional(),
    
    // 任务相关元数据
    taskId: z.string().optional(),
    taskTitle: z.string().optional(),
    status: z.enum(['todo', 'in-progress', 'completed']).default('todo'),
  }),
});

// 导出集合配置
export const collections = {
  blog: blogCollection,
}; 