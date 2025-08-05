import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";

export default function CreateTask() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    priority: "",
    schedule: "",
    notifications: false,
    autoRetry: false,
  });

  const handleChange = (key: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (action: "save" | "run") => {
    if (!formData.name || !formData.type) {
      toast({
        title: "Missing Required Fields",
        description: "Task Name and Type are required.",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.name,
          description: formData.description,
          type: formData.type,
          priority: formData.priority,
          schedule: formData.schedule,
          notify: formData.notifications,
          auto_retry: formData.autoRetry,
          status: action === "run" ? "running" : "pending",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create task.");
      }

      const { task_id } = await response.json();

      toast({
        title: "Task Created Successfully",
        description: `Task has been ${action === "run" ? "started" : "saved as draft"}.`,
      });

      // Clear form after success
      setFormData({
        name: "",
        description: "",
        type: "",
        priority: "",
        schedule: "",
        notifications: false,
        autoRetry: false,
      });

      // Optionally redirect to Tasks page
      // navigate("/tasks"); // if you're using react-router

    } catch (error: any) {
      toast({
        title: "Error creating task",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Create New Task</h1>
      <p className="mb-6 text-muted-foreground">
        Set up a new AI automation task for your customer support workflow
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Define the core details of your AI task</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Task Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g., Customer Email Classification"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe what this task will accomplish..."
            />
          </div>
          <div>
            <Label>Task Type *</Label>
            <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select task type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classification">Classification</SelectItem>
                <SelectItem value="summary">Summarization</SelectItem>
                <SelectItem value="translation">Translation</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Set up task behavior and scheduling</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Priority</Label>
            <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Schedule</Label>
            <Select value={formData.schedule} onValueChange={(value) => handleChange("schedule", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="notifications"
              checked={formData.notifications}
              onCheckedChange={(checked) => handleChange("notifications", !!checked)}
            />
            <Label htmlFor="notifications">Enable email notifications for task completion</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="auto-retry"
              checked={formData.autoRetry}
              onCheckedChange={(checked) => handleChange("autoRetry", !!checked)}
            />
            <Label htmlFor="auto-retry">Automatically retry failed tasks</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => handleSubmit("save")}>Save Draft</Button>
        <Button onClick={() => handleSubmit("run")}>Create & Run</Button>
      </div>
    </div>
  );
}
