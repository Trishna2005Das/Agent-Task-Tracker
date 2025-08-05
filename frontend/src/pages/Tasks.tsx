import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Play,
  Pause,
  Trash2,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

// ✅ Task type aligned with backend response
type Task = {
  task_id: string;
  title: string;
  description: string;
  status: string;
  progress: number;
  type: string;
  createdAt: string;
  lastRun: string;
};

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<{ tasks: Task[] }>(
        `${import.meta.env.VITE_API_URL}/tasks`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { status: statusFilter },
        }
      );
      setTasks(response.data.tasks || []);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((task) => task.task_id !== taskId));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter]);

  const getStatusBadge = (status: string) => {
    const variants = {
      running: "bg-primary text-primary-foreground",
      completed: "bg-green-600 text-white",
      pending: "bg-muted text-muted-foreground",
      error: "bg-red-600 text-white",
    };
    return variants[status.toLowerCase() as keyof typeof variants] || "bg-muted";
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-primary" />
            Task Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage your AI automation tasks
          </p>
        </div>
        <Button asChild className="bg-gradient-primary hover:shadow-glow transition-smooth">
          <Link to="/create-task">
            <Plus className="w-4 h-4 mr-2" />
            Create New Task
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Grid */}
      <div className="grid gap-6">
        {filteredTasks.map((task) => (
          <Card
            key={task.task_id}
            className="bg-card border-border shadow-card hover:shadow-elegant transition-smooth"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <Badge className={getStatusBadge(task.status)}>{task.status}</Badge>
                    <Badge variant="outline" className="text-xs">
                      {task.type}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">{task.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  {task.status.toLowerCase() === "running" ? (
                    <Button size="sm" variant="outline" className="hover:bg-accent">
                      <Pause className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="hover:bg-accent">
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleDeleteTask(task.task_id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm text-muted-foreground">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Created:</span>
                    <span>{task.createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last run:</span>
                    <span>{task.lastRun || "Never"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline" className="text-xs">
                      {task.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {filteredTasks.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CheckSquare className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first AI automation task to get started"}
            </p>
            <Button asChild className="bg-gradient-primary">
              <Link to="/create-task">
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
