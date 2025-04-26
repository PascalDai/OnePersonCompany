import { useState } from "react";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectTasksAccordionProps {
  tasks: Task[];
}

export default function ProjectTasksAccordion({ tasks }: ProjectTasksAccordionProps) {
  if (!tasks || tasks.length === 0) return null;
  
  return (
    <div className="mt-12 border-t pt-8">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="tasks">
          <AccordionTrigger className="text-2xl font-bold">
            相关任务 ({tasks.length})
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 mt-4">
              {tasks.map((task) => (
                <Card key={task.id} className="transition-all hover:shadow-sm">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg font-semibold mb-0">
                        <a href={`/blog/${task.slug}`} className="hover:text-primary transition-colors">
                          {task.title}
                        </a>
                      </CardTitle>
                      <Badge
                        variant={
                          task.status === "completed"
                            ? "success"
                            : task.status === "in-progress"
                            ? "warning"
                            : "secondary"
                        }
                        className="whitespace-nowrap text-xs"
                      >
                        {
                          task.status === "completed" 
                            ? "已完成" 
                            : task.status === "in-progress" 
                            ? "进行中" 
                            : "待办"
                        }
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 mt-2">
                      {task.description}
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-0 pb-4 px-4 text-xs text-muted-foreground">
                    <time dateTime={task.createdAt.toISOString()}>
                      {new Date(task.createdAt).toLocaleDateString('zh-CN')}
                    </time>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
} 