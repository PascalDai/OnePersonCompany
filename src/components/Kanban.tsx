import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import type { Project, Task } from '@/lib/types';
import { getProjectsWithTasks } from '@/lib/mock-data';

const statusColors = {
  'todo': 'secondary',
  'in-progress': 'warning',
  'completed': 'success'
} as const;

const statusLabels = {
  'todo': '待办',
  'in-progress': '进行中',
  'completed': '已完成'
} as const;

// 状态优先级排序：进行中 > 未开始 > 已完成
const statusPriority = {
  'in-progress': 1,
  'todo': 2,
  'completed': 3
} as const;

// 任务排序函数
const sortTasksByStatus = (tasks: Task[]) => {
  return [...tasks].sort((a, b) => 
    (statusPriority[a.status as keyof typeof statusPriority] || 999) - 
    (statusPriority[b.status as keyof typeof statusPriority] || 999)
  );
};

export default function Kanban() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks'>('projects');

  useEffect(() => {
    // 获取包含任务的项目数据
    const projectsWithTasks = getProjectsWithTasks();
    
    // 对每个项目的任务按状态优先级排序
    const sortedProjects = projectsWithTasks.map(project => ({
      ...project,
      tasks: sortTasksByStatus(project.tasks)
    }));
    
    setProjects(sortedProjects);
  }, []);

  return (
    <section id="kanban" className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">我的工作记录</h2>
          <div className="flex space-x-2 bg-muted p-1 rounded-lg">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'projects' ? 'bg-background shadow' : ''
              }`}
              onClick={() => setActiveTab('projects')}
            >
              项目
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'tasks' ? 'bg-background shadow' : ''
              }`}
              onClick={() => setActiveTab('tasks')}
            >
              任务
            </button>
          </div>
        </div>

        {activeTab === 'projects' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <TasksByStatus projects={projects} />
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  // 确保状态是有效的
  const status = (project.status || 'todo') as keyof typeof statusColors;
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.description}</CardDescription>
          </div>
          <Badge variant={statusColors[status]}>
            {statusLabels[status]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">任务:</span>
            <span className="font-medium">{project.tasks.length}个</span>
          </div>

          {/* 显示前3个任务（已按优先级排序：进行中 > 未开始 > 已完成） */}
          <div className="space-y-2">
            {project.tasks.slice(0, 3).map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                <span className="font-medium truncate mr-2">{task.title}</span>
                <Badge variant={statusColors[task.status] as any}>
                  {statusLabels[task.status]}
                </Badge>
              </div>
            ))}
          </div>
          
          {/* 使用Accordion组件收纳剩余任务 */}
          {project.tasks.length > 3 && (
            <Accordion type="single" collapsible className="border-t pt-2">
              <AccordionItem value="more-tasks" className="border-b-0">
                <AccordionTrigger className="py-2 text-sm text-muted-foreground">
                  查看全部{project.tasks.length}个任务
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pt-2">
                    {project.tasks.slice(3).map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <span className="font-medium truncate mr-2">{task.title}</span>
                        <Badge variant={statusColors[task.status] as any}>
                          {statusLabels[task.status]}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {project.tasks.length === 0 && (
            <div className="text-center py-3 text-sm text-muted-foreground">
              暂无任务
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TasksByStatus({ projects }: { projects: Project[] }) {
  // 合并所有任务
  const allTasks = projects.flatMap(project => 
    project.tasks.map(task => ({
      ...task,
      projectTitle: project.title
    }))
  );

  // 按状态分组
  const todoTasks = allTasks.filter(task => task.status === 'todo');
  const inProgressTasks = allTasks.filter(task => task.status === 'in-progress');
  const completedTasks = allTasks.filter(task => task.status === 'completed');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 按照新顺序排列：进行中 > 待办 > 已完成 */}
      <TaskColumn title="进行中" tasks={inProgressTasks} status="in-progress" />
      <TaskColumn title="待办" tasks={todoTasks} status="todo" />
      <TaskColumn title="已完成" tasks={completedTasks} status="completed" />
    </div>
  );
}

function TaskColumn({ 
  title, 
  tasks, 
  status 
}: { 
  title: string; 
  tasks: (Task & { projectTitle: string })[]; 
  status: keyof typeof statusColors 
}) {
  return (
    <div>
      <div className="flex items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <Badge variant={statusColors[status] as any} className="ml-2">
          {tasks.length}
        </Badge>
      </div>
      
      <div className="space-y-3">
        {tasks.map(task => (
          <Card key={task.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-base">{task.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {task.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {task.projectTitle}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(task.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {tasks.length === 0 && (
          <div className="text-center p-4 bg-muted/30 rounded-lg text-sm text-muted-foreground">
            暂无{title}的任务
          </div>
        )}
      </div>
    </div>
  );
} 