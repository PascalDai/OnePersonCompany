import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectInfo {
  id: string;
  title: string;
  description: string;
  slug?: string;
  status: 'in-progress' | 'completed';
}

interface ProjectInfoCardProps {
  project: ProjectInfo;
}

export default function ProjectInfoCard({ project }: ProjectInfoCardProps) {
  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-4">所属项目</h2>
      <Card className="transition-all hover:shadow-lg">
        <div className="flex-1 flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl mb-2 hover:text-primary transition-colors">
                {project.slug ? (
                  <a href={`/blog/${project.slug}`}>{project.title}</a>
                ) : (
                  <a href={`/tasks?project=${project.id}`}>
                    {project.title}
                  </a>
                )}
              </CardTitle>
              <Badge
                variant={
                  project.status === "completed"
                    ? "success"
                    : "secondary"
                }
              >
                {project.status === "completed" ? "已完成" : "进行中"}
              </Badge>
            </div>
            <CardDescription>
              {project.description}
            </CardDescription>
          </CardHeader>

          <CardFooter className="pt-0 text-xs text-muted-foreground">
            <a
              href={`/tasks?project=${project.id}`}
              className="text-xs hover:text-primary transition-colors"
            >
              查看所有相关任务
            </a>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
} 