import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Sparkles,
  Save,
  Play,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CreateTask() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    priority: "",
    schedule: "",
    notifications: false,
    autoRetry: false,
  });

  const taskTypes = [
    { value: "classification", label: "Email Classification", description: "Categorize incoming emails" },
    { value: "sentiment", label: "Sentiment Analysis", description: "Analyze customer emotions" },
    { value: "generation", label: "Response Generation", description: "Generate automated responses" },
    { value: "routing", label: "Ticket Routing", description: "Route tickets to right agents" },
    { value: "extraction", label: "Data Extraction", description: "Extract key information" },
  ];

  const handleSubmit = (action: "save" | "run") => {
    if (!formData.name || !formData.type) {
      toast({
        title: "Missing Information",
        description: "Please fill in the required fields.",
        variant: "destructive",
      });
      return;
    }

    const actionText = action === "save" ? "saved" : "created and started";
    toast({
      title: "Task Created Successfully",
      description: `Your AI task has been ${actionText}.`,
    });

    // Reset form
    setFormData({
      name: "",
      description: "",
      type: "",
      priority: "",
      schedule: "",
      notifications: false,
      autoRetry: false,
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Plus className="w-8 h-8 text-primary" />
          Create New Task
        </h1>
        <p className="text-muted-foreground mt-1">
          Set up a new AI automation task for your customer support workflow
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Define the core details of your AI task
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Task Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Customer Email Classification"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this task will accomplish..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Task Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-muted-foreground">{type.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Configuration */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Set up task behavior and scheduling
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Select value={formData.schedule} onValueChange={(value) => setFormData(prev => ({ ...prev, schedule: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="manual">Manual</SelectItem>
                      <SelectItem value="hourly">Every Hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="realtime">Real-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifications"
                    checked={formData.notifications}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifications: !!checked }))}
                  />
                  <Label htmlFor="notifications" className="text-sm">
                    Enable email notifications for task completion
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoRetry"
                    checked={formData.autoRetry}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoRetry: !!checked }))}
                  />
                  <Label htmlFor="autoRetry" className="text-sm">
                    Automatically retry failed tasks
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => handleSubmit("run")}
              className="bg-gradient-primary hover:shadow-glow transition-smooth"
            >
              <Play className="w-4 h-4 mr-2" />
              Create & Run
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSubmit("save")}
              className="hover:bg-accent transition-smooth"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Preview */}
          <Card className="bg-gradient-glow border-border">
            <CardHeader>
              <CardTitle className="text-lg">Task Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {formData.name ? (
                <div>
                  <h4 className="font-medium">{formData.name}</h4>
                  {formData.type && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      {taskTypes.find(t => t.value === formData.type)?.label}
                    </Badge>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">
                  Enter a task name to see preview
                </p>
              )}

              {formData.description && (
                <p className="text-sm text-muted-foreground">
                  {formData.description}
                </p>
              )}

              {formData.priority && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Priority:</span>
                  <Badge variant={formData.priority === "urgent" ? "destructive" : "secondary"}>
                    {formData.priority}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-info" />
                Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Choose descriptive names for easy identification</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Real-time tasks provide instant automation</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Enable notifications to stay informed</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                <span>Auto-retry helps with temporary failures</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}