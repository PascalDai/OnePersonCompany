import type { Project, Task, BlogStats, DayPublishData } from './types';

// 创建模拟的Project数据
export const mockProjects: Project[] = [
  {
    id: 'p1',
    title: 'Astro博客建设',
    description: '使用Astro框架构建一个现代化的博客网站',
    tasks: [],
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2023-12-01')
  },
  {
    id: 'p2',
    title: 'Web3学习笔记',
    description: '关于区块链、智能合约和去中心化应用的学习笔记',
    tasks: [],
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2023-11-20')
  },
  {
    id: 'p3',
    title: 'AI应用开发',
    description: '探索和实践各种AI应用开发的项目',
    tasks: [],
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2023-10-30')
  },
  {
    id: 'p4',
    title: '前端框架对比',
    description: '对比分析React、Vue、Angular等主流前端框架',
    tasks: [],
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2023-09-25')
  }
];

// 创建模拟的Task数据
export const mockTasks: Task[] = [
  {
    id: 't1',
    title: '设计博客首页',
    description: '设计一个简洁现代的博客首页，包含基本的导航和布局',
    status: 'completed',
    projectId: 'p1',
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2023-11-15')
  },
  {
    id: 't2',
    title: '实现Kanban板',
    description: '实现一个可视化的Kanban板，用来管理项目和任务',
    status: 'in-progress',
    projectId: 'p1',
    createdAt: new Date('2023-11-16'),
    updatedAt: new Date('2023-11-25')
  },
  {
    id: 't3',
    title: '添加数据分析仪表盘',
    description: '实现一个仪表盘，展示博客的数据分析',
    status: 'todo',
    projectId: 'p1',
    createdAt: new Date('2023-11-26'),
    updatedAt: new Date('2023-11-26')
  },
  {
    id: 't4',
    title: '学习Solidity基础',
    description: '学习Solidity语言的基础语法和智能合约开发',
    status: 'completed',
    projectId: 'p2',
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2023-10-30')
  },
  {
    id: 't5',
    title: '开发简单的DApp',
    description: '开发一个简单的去中心化应用，实践智能合约集成',
    status: 'in-progress',
    projectId: 'p2',
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2023-11-20')
  },
  {
    id: 't6',
    title: '探索OpenAI API',
    description: '研究OpenAI API的功能和使用方法',
    status: 'completed',
    projectId: 'p3',
    createdAt: new Date('2023-09-05'),
    updatedAt: new Date('2023-09-20')
  },
  {
    id: 't7',
    title: '构建AI聊天机器人',
    description: '使用OpenAI API构建一个智能聊天机器人',
    status: 'in-progress',
    projectId: 'p3',
    createdAt: new Date('2023-09-21'),
    updatedAt: new Date('2023-10-15')
  },
  {
    id: 't8',
    title: '框架性能比较',
    description: '对几个主流前端框架进行性能基准测试和比较',
    status: 'completed',
    projectId: 'p4',
    createdAt: new Date('2023-08-20'),
    updatedAt: new Date('2023-09-10')
  },
  {
    id: 't9',
    title: '编写框架对比文章',
    description: '撰写一篇关于不同前端框架的深入对比文章',
    status: 'in-progress',
    projectId: 'p4',
    createdAt: new Date('2023-09-11'),
    updatedAt: new Date('2023-09-25')
  }
];

// 将任务关联到对应的项目中
export const getProjectsWithTasks = (): Project[] => {
  return mockProjects.map(project => ({
    ...project,
    tasks: mockTasks.filter(task => task.projectId === project.id)
  }));
};

// 获取博客统计数据
export const getBlogStats = (): BlogStats => {
  const projects = mockProjects;
  const tasks = mockTasks;
  const completedTasks = tasks.filter(task => task.status === 'completed');
  
  // 模拟发布连续天数
  const publishingStreak = 15;
  
  return {
    totalProjects: projects.length,
    totalTasks: tasks.length,
    completedTasks: completedTasks.length,
    publishingStreak,
    lastPublished: new Date('2023-12-01')
  };
};

// 生成过去30天的发布数据
export const getPublishingCalendarData = (): DayPublishData[] => {
  const data: DayPublishData[] = [];
  const today = new Date();
  
  // 生成过去30天的数据
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // 随机生成发布计数（0-3），周末概率更高
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const count = isWeekend 
      ? Math.floor(Math.random() * 3) + 1 // 1-3
      : Math.floor(Math.random() * 2);    // 0-1
    
    data.push({
      date: date.toISOString().split('T')[0],
      count
    });
  }
  
  return data;
}; 