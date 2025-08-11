import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Zap,
  Play,
  Square,
  RefreshCw,
  CheckCircle,
  Cpu,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function RunAI() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState<any>(null);

  // Fetch tasks from backend on mount
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setTasks(data.tasks || []);
        } else {
          toast({
            title: "Failed to fetch tasks",
            description: data.error || "Unknown error",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch tasks",
          variant: "destructive",
        });
      }
    };

    fetchTasks();
  }, [toast]);

  const handleRunAI = async () => {
    if (!selectedTaskId || !inputText.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a task and provide input text.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setProgress(0);
    setResults(null);

    const token = localStorage.getItem("token");

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return Math.min(prev + Math.random() * 10 + 5, 90);
        });
      }, 300);

      // Adjust API endpoint for running AI on the selected task
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/tasks/${selectedTaskId}/run-ai`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ input: inputText }),
        }
      );

      const data = await response.json();
      clearInterval(progressInterval);

      if (!response.ok) {
        throw new Error(data.error || "AI processing failed");
      }

      setProgress(100);
      const task = tasks.find((t) => t.task_id === selectedTaskId);

      setResults({
        taskTitle: task?.title || selectedTaskId,
        input: inputText,
        confidence: Math.random() * 0.3 + 0.7,
        processingTime: Math.random() * 2 + 0.5,
        result: data.ai_response,
      });

      toast({
        title: "AI Processing Complete",
        description: "Your request has been processed successfully.",
      });
    } catch (error: any) {
      setIsRunning(false);
      setProgress(0);
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setProgress(0);
    toast({
      title: "Processing Stopped",
      description: "AI processing has been cancelled.",
    });
  };

  const handleClear = () => {
    setInputText("");
    setSelectedTaskId("");
    setProgress(0);
    setResults(null);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Zap className="w-8 h-8 text-primary" />
          AI Processing Hub
        </h1>
        <p className="text-muted-foreground mt-1">
          Run AI models on your created tasks
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Selection */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-primary" />
                Select Task
              </CardTitle>
              <CardDescription>
                Choose one of your created tasks to run AI on
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedTaskId} onValueChange={setSelectedTaskId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a Task" />
                </SelectTrigger>
               <SelectContent>
  {tasks.length === 0 && (
    <SelectItem value="none" disabled>
      No tasks found
    </SelectItem>
  )}
  {tasks.map((task) => (
    <SelectItem key={task.task_id} value={task.task_id}>
      <div className="flex flex-col">
        <div className="font-medium">{task.title}</div>
        <div className="text-xs text-muted-foreground">
          Status: {task.status} • Created: {task.createdAt}
        </div>
      </div>
    </SelectItem>
  ))}
</SelectContent>

              </Select>

              {selectedTaskId && (
                <div className="mt-4 p-4 bg-gradient-glow rounded-lg border">
                  {(() => {
                    const task = tasks.find((t) => t.task_id === selectedTaskId);
                    return (
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{task?.title}</h4>
                          <p className="text-sm text-muted-foreground">{task?.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline">{task?.status}</Badge>
                          <Badge variant={task?.status === "pending" ? "secondary" : "default"}>
                            Created {task?.createdAt}
                          </Badge>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Input Text */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Input Data</CardTitle>
              <CardDescription>
                Provide the text or data to be processed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input">Text Input</Label>
                <Textarea
                  id="input"
                  placeholder="Paste your input text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={6}
                  disabled={isRunning}
                />
              </div>

              <div className="flex gap-3">
                {!isRunning ? (
                  <Button
                    onClick={handleRunAI}
                    className="bg-gradient-primary hover:shadow-glow transition-smooth"
                    disabled={!selectedTaskId || !inputText.trim()}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run AI Analysis
                  </Button>
                ) : (
                  <Button
                    onClick={handleStop}
                    variant="destructive"
                    className="hover:shadow-glow transition-smooth"
                  >
                    <Square className="w-4 h-4 mr-2" />
                    Stop Processing
                  </Button>
                )}
                <Button variant="outline" onClick={handleClear} className="hover:bg-accent">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Processing Progress */}
          {isRunning && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-primary animate-spin" />
                  Processing...
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Progress value={progress} className="h-3" />
                <div className="flex items-center justify-between text-sm text-muted-foreground mt-2">
                  <span>Working on your request...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {results && !isRunning && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Results
                </CardTitle>
                <CardDescription>AI processing completed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gradient-glow rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Task</div>
                    <div className="font-medium">{results.taskTitle}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Confidence</div>
                    <div className="font-medium">{(results.confidence * 100).toFixed(1)}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Processing Time</div>
                    <div className="font-medium">{results.processingTime.toFixed(2)}s</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Analysis Result:</h4>
                  <div className="bg-muted/50 p-4 rounded-lg overflow-auto">
                    {typeof results.result === "string" ? (
                      <p className="text-sm whitespace-pre-wrap">{results.result}</p>
                    ) : (
                      <pre className="text-sm">{JSON.stringify(results.result, null, 2)}</pre>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-gradient-glow border-border">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Runs Today</span>
                <Badge>42</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Success Rate</span>
                <Badge variant="outline">98.5%</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg. Time</span>
                <Badge variant="secondary">1.2s</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
