import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import type { BlogStats, DayPublishData } from '@/lib/types';
import { getBlogStats, getPublishingCalendarData, mockTasks, mockProjects } from '@/lib/mock-data';

// 定义文章类型
type ArticleType = 'project' | 'task';

// 模拟的日期发布文章数据
interface ArticleInfo {
  id: string;
  title: string;
  type: ArticleType;
  projectId?: string;
  projectTitle?: string;
  taskId?: string;
  taskTitle?: string;
}

interface DayPublishDetail {
  date: string;
  articles: ArticleInfo[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<BlogStats | null>(null);
  const [calendarData, setCalendarData] = useState<DayPublishData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [publishDetails, setPublishDetails] = useState<DayPublishDetail | null>(null);
  const [unfinishedProjectTaskStats, setUnfinishedProjectTaskStats] = useState<{
    total: number;
    completed: number;
  }>({ total: 0, completed: 0 });

  useEffect(() => {
    // 获取统计数据
    const blogStats = getBlogStats();
    setStats(blogStats);

    // 获取日历数据（仅过去一个月）
    const publishData = getPublishingCalendarData();
    setCalendarData(publishData);

    // 默认选择有发布内容的最近一天
    const dayWithContent = publishData.find(day => day.count > 0);
    if (dayWithContent) {
      setSelectedDate(dayWithContent.date);
    }
    
    // 计算未完成项目的任务完成率
    const projects = mockProjects;
    const tasks = mockTasks;
    
    // 过滤未完成的项目
    const unfinishedProjects = projects.filter(project => project.status !== 'completed');
    const unfinishedProjectIds = new Set(unfinishedProjects.map(project => project.id));
    
    // 统计未完成项目中的任务
    const unfinishedProjectTasks = tasks.filter(task => 
      task.projectId && unfinishedProjectIds.has(task.projectId)
    );
    
    // 统计未完成项目中已完成的任务
    const completedUnfinishedProjectTasks = unfinishedProjectTasks.filter(
      task => task.status === 'completed'
    );
    
    // 保存到状态中供后续使用
    setUnfinishedProjectTaskStats({
      total: unfinishedProjectTasks.length,
      completed: completedUnfinishedProjectTasks.length
    });
    
  }, []);

  // 当选择日期变化时，获取该日期的发布详情
  useEffect(() => {
    if (!selectedDate) return;
    
    // 模拟获取发布详情数据
    const generateMockArticles = (date: string, count: number) => {
      const articles: ArticleInfo[] = [];
      const projectsMap = new Map(mockProjects.map(p => [p.id, p.title]));
      
      for (let i = 0; i < count; i++) {
        // 随机决定是项目文章还是任务文章 (30%概率是项目文章)
        const isProjectArticle = Math.random() < 0.3;
        
        if (isProjectArticle) {
          // 随机选择一个项目
          const randomProjectIndex = Math.floor(Math.random() * mockProjects.length);
          const project = mockProjects[randomProjectIndex];
          
          articles.push({
            id: `article-${date}-project-${i}`,
            title: `${project.title}总结与规划`,
            type: 'project',
            projectId: project.id,
            projectTitle: project.title
          });
        } else {
          // 随机选择一个任务
          const randomTaskIndex = Math.floor(Math.random() * mockTasks.length);
          const task = mockTasks[randomTaskIndex];
          const projectTitle = projectsMap.get(task.projectId) || '未知项目';
          
          articles.push({
            id: `article-${date}-task-${i}`,
            title: `关于${task.title}的思考和实践`,
            type: 'task',
            taskId: task.id,
            taskTitle: task.title,
            projectId: task.projectId,
            projectTitle: projectTitle
          });
        }
      }
      
      return {
        date,
        articles
      };
    };
    
    // 查找选中日期的发布数量
    const dayData = calendarData.find(day => day.date === selectedDate);
    if (dayData && dayData.count > 0) {
      // 生成模拟数据
      const details = generateMockArticles(selectedDate, dayData.count);
      setPublishDetails(details);
    } else {
      // 没有发布内容
      setPublishDetails({
        date: selectedDate,
        articles: []
      });
    }
  }, [selectedDate, calendarData]);

  if (!stats) {
    return <div>加载中...</div>;
  }

  return (
    <section id="dashboard" className="min-h-screen pt-16 pb-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">博客统计</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="总项目数"
            value={stats.totalProjects}
            description="创建的项目总数"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7h-3a2 2 0 0 1-2-2V2" />
                <path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2H9Z" />
              </svg>
            }
          />

          <StatCard
            title="总任务数"
            value={stats.totalTasks}
            description="创建的任务总数"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
          />

          <StatCard
            title="已完成任务"
            value={unfinishedProjectTaskStats.completed}
            description={`未完成项目任务完成率 ${
              unfinishedProjectTaskStats.total 
                ? Math.round((unfinishedProjectTaskStats.completed / unfinishedProjectTaskStats.total) * 100) 
                : 0
            }%`}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            }
          />

          <StatCard
            title="连续发布"
            value={stats.publishingStreak}
            description="天"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" />
                <path d="m13 12-3 5h5l-3 5" />
              </svg>
            }
          />
        </div>

        <div className="rounded-lg border bg-card shadow-sm">
          <CardHeader className="px-6">
            <CardTitle>文章发布记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* 左侧：日历 */}
              <div className="md:col-span-3">
                <PublishingCalendar 
                  data={calendarData} 
                  selectedDate={selectedDate}
                  onSelectDate={(date) => setSelectedDate(date)}
                />
              </div>
              
              {/* 右侧：选中日期的发布详情 */}
              <div className="md:col-span-2">
                <h3 className="text-lg font-medium mb-2">
                  {selectedDate ? `${new Date(selectedDate).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}发布内容` : '选择日期查看详情'}
                </h3>
                
                {publishDetails && (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {publishDetails.articles.length > 0 ? (
                      publishDetails.articles.map(article => (
                        <Card key={article.id} className="overflow-hidden">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">{article.title}</h4>
                            <div className="flex flex-col gap-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">类型:</span>
                                <Badge variant={article.type === 'project' ? 'secondary' : 'default'}>
                                  {article.type === 'project' ? '项目' : '任务'}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">项目:</span>
                                <Badge variant="outline" className="bg-primary/10">
                                  {article.projectTitle}
                                </Badge>
                              </div>
                              
                              {article.type === 'task' && (
                                <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">任务:</span>
                                  <span className="font-medium">{article.taskTitle}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center p-8 bg-muted/30 rounded-lg">
                        <p className="text-muted-foreground">该日期没有发布内容</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </section>
  );
}

function StatCard({ 
  title, 
  value, 
  description,
  icon
}: { 
  title: string; 
  value: number; 
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PublishingCalendar({ 
  data, 
  selectedDate,
  onSelectDate
}: { 
  data: DayPublishData[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}) {
  // 按月份分组
  const monthsData: { [month: string]: DayPublishData[] } = {};
  
  data.forEach(day => {
    const monthYear = day.date.substring(0, 7); // YYYY-MM
    if (!monthsData[monthYear]) {
      monthsData[monthYear] = [];
    }
    monthsData[monthYear].push(day);
  });

  // 排序月份（仅保留最近一个月）
  const sortedMonths = Object.keys(monthsData).sort().reverse().slice(0, 1);

  return (
    <div className="space-y-4">
      {sortedMonths.map(month => (
        <div key={month}>
          <h4 className="text-sm font-medium mb-2">
            {new Date(month + '-01').toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' })}
          </h4>
          <div className="grid grid-cols-7 gap-2">
            {['一', '二', '三', '四', '五', '六', '日'].map(day => (
              <div key={day} className="text-xs text-center font-medium text-muted-foreground">
                {day}
              </div>
            ))}
            <CalendarMonth 
              month={month} 
              days={monthsData[month]} 
              selectedDate={selectedDate}
              onSelectDate={onSelectDate}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarMonth({ 
  month, 
  days, 
  selectedDate,
  onSelectDate
}: { 
  month: string; 
  days: DayPublishData[];
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}) {
  const firstDay = new Date(month + '-01');
  // 调整从周一开始（0 = 周一，6 = 周日）
  const firstDayOfWeek = (firstDay.getDay() + 6) % 7; // 将周日的0转换为6，其他天-1
  
  // 计算该月的天数
  const lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // 创建日历网格
  const calendarCells = [];
  
  // 添加上个月的空白日期
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-14" />);
  }
  
  // 添加当月日期
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${month}-${day.toString().padStart(2, '0')}`;
    const dayData = days.find(d => d.date === date);
    const count = dayData ? dayData.count : 0;
    const isSelected = date === selectedDate;
    
    let bgColor = 'bg-muted/30';
    if (count === 1) bgColor = 'bg-primary/30';
    if (count === 2) bgColor = 'bg-primary/60';
    if (count >= 3) bgColor = 'bg-primary';
    
    // 选中状态样式
    const selectedStyle = isSelected 
      ? 'ring-2 ring-primary ring-offset-2' 
      : '';
    
    calendarCells.push(
      <div 
        key={date} 
        className={`h-14 rounded-md flex items-center justify-center text-xs font-medium ${bgColor} ${selectedStyle} ${count > 0 ? 'text-primary-foreground cursor-pointer' : 'text-muted-foreground'} transition-all`}
        onClick={() => count > 0 && onSelectDate(date)}
        role={count > 0 ? "button" : undefined}
        tabIndex={count > 0 ? 0 : undefined}
        aria-label={count > 0 ? `${date}，有${count}篇文章` : undefined}
      >
        {day}
      </div>
    );
  }
  
  return <>{calendarCells}</>;
} 