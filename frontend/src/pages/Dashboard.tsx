import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckSquare,
  Plus,
  Zap,
  TrendingUp,
  Clock,
  Users,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

interface Task {
  task_id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  type: string;
}

export default function Dashboard() {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const tasks = (response.data as { tasks: Task[] }).tasks;

        setRecentTasks(tasks.slice(0, 4)); // First 4 tasks

        const running = tasks.filter((t) => t.status === "running").length;
        const completed = tasks.filter((t) => t.status === "completed").length;
        const pending = tasks.filter((t) => t.status === "pending").length;

        setStats([
          {
            title: "Active Tasks",
            value: `${tasks.length}`,
            change: "+12%",
            icon: CheckSquare,
            color: "text-primary",
          },
          {
            title: "Running Tasks",
            value: `${running}`,
            change: "+5%",
            icon: Zap,
            color: "text-success",
          },
          {
            title: "Pending Tasks",
            value: `${pending}`,
            change: "-3%",
            icon: Clock,
            color: "text-info",
          },
          {
            title: "Completed Tasks",
            value: `${completed}`,
            change: "+8%",
            icon: TrendingUp,
            color: "text-warning",
          },
        ]);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      running: "bg-primary text-primary-foreground",
      completed: "bg-success text-white",
      pending: "bg-muted text-muted-foreground",
    };
    return variants[status.toLowerCase()] || "bg-muted";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome back, {name || "there"}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your AI support automation today.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="bg-gradient-primary hover:shadow-glow transition-smooth">
            <Link to="/create-task">
              <Plus className="w-4 h-4 mr-2" />
              Create Task
            </Link>
          </Button>
          <Button variant="outline" asChild className="hover:bg-accent transition-smooth">
            <Link to="/run-ai">
              <Zap className="w-4 h-4 mr-2" />
              Run AI
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="hover:shadow-elegant transition-smooth cursor-pointer group bg-card border-border"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon
                className={`h-5 w-5 ${stat.color} group-hover:scale-110 transition-smooth`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-success mt-1">{stat.change} from last week</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <Card className="lg:col-span-2 bg-card border-border shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-primary" />
                  Recent Tasks
                </CardTitle>
                <CardDescription>Your latest AI automation tasks</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild className="hover:bg-accent">
                <Link to="/tasks">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task.task_id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gradient-glow border border-border hover:shadow-card transition-smooth"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge className={getStatusBadge(task.status)}>{task.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <Progress value={task.progress} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-12">
                        {task.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Badge variant="outline" className="text-xs">
                      {task.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card border-border shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              asChild
              variant="outline"
              className="w-full justify-start hover:bg-accent transition-smooth"
            >
              <Link to="/create-task">
                <Plus className="w-4 h-4 mr-2" />
                Create New Task
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start hover:bg-accent transition-smooth"
            >
              <Link to="/run-ai">
                <Zap className="w-4 h-4 mr-2" />
                Run AI Analysis
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start hover:bg-accent transition-smooth"
            >
              <Link to="/logs">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full justify-start hover:bg-accent transition-smooth"
            >
              <Link to="/profile">
                <Users className="w-4 h-4 mr-2" />
                Team Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
