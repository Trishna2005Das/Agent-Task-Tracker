import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ScrollText,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Eye,
} from "lucide-react";

export default function Logs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const logs = [
    {
      id: "log-001",
      timestamp: "2024-01-16 14:32:15",
      task: "Email Classification",
      type: "AI_RUN",
      status: "SUCCESS",
      duration: "1.2s",
      details: "Processed 45 emails successfully",
      user: "John Doe",
    },
    {
      id: "log-002",
      timestamp: "2024-01-16 14:28:42",
      task: "Sentiment Analysis",
      type: "AI_RUN",
      status: "SUCCESS",
      duration: "0.8s",
      details: "Analyzed customer feedback with 94% confidence",
      user: "Sarah Johnson",
    },
    {
      id: "log-003",
      timestamp: "2024-01-16 14:15:33",
      task: "Response Generator",
      type: "AI_RUN",
      status: "ERROR",
      duration: "2.1s",
      details: "API rate limit exceeded",
      user: "Mike Chen",
    },
    {
      id: "log-004",
      timestamp: "2024-01-16 13:45:17",
      task: "Ticket Router",
      type: "SYSTEM",
      status: "SUCCESS",
      duration: "0.3s",
      details: "Routed 12 tickets to appropriate departments",
      user: "System",
    },
    {
      id: "log-005",
      timestamp: "2024-01-16 13:22:08",
      task: "Customer Data Import",
      type: "DATA",
      status: "WARNING",
      duration: "5.2s",
      details: "Imported 1,250 records with 3 validation warnings",
      user: "Admin",
    },
    {
      id: "log-006",
      timestamp: "2024-01-16 12:58:44",
      task: "Auto Response",
      type: "AI_RUN",
      status: "SUCCESS",
      duration: "1.5s",
      details: "Generated responses for 23 inquiries",
      user: "System",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return <CheckCircle className="w-4 h-4 text-success" />;
      case "ERROR":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "WARNING":
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      SUCCESS: "bg-success text-white",
      ERROR: "bg-destructive text-destructive-foreground",
      WARNING: "bg-warning text-black",
    };
    return variants[status as keyof typeof variants] || "bg-muted";
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      AI_RUN: "bg-primary text-primary-foreground",
      SYSTEM: "bg-secondary text-secondary-foreground",
      DATA: "bg-info text-white",
    };
    return variants[type as keyof typeof variants] || "bg-muted";
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.task.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status.toLowerCase() === statusFilter;
    const matchesType = typeFilter === "all" || log.type.toLowerCase() === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ScrollText className="w-8 h-8 text-primary" />
            Activity Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Monitor system activities and AI processing logs
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="hover:bg-accent transition-smooth">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="hover:bg-accent transition-smooth">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <ScrollText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold text-success">98.2%</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Errors Today</p>
                <p className="text-2xl font-bold text-destructive">3</p>
              </div>
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Duration</p>
                <p className="text-2xl font-bold">1.4s</p>
              </div>
              <Clock className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ai_run">AI Run</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="data">Data</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="hover:bg-accent">
              <Calendar className="w-4 h-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="bg-card border-border shadow-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest system events and AI processing logs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="hover:bg-accent/50 transition-smooth"
                  >
                    <TableCell className="font-mono text-xs">
                      {log.timestamp}
                    </TableCell>
                    <TableCell className="font-medium">{log.task}</TableCell>
                    <TableCell>
                      <Badge className={getTypeBadge(log.type)}>
                        {log.type.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <Badge className={getStatusBadge(log.status)}>
                          {log.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.duration}
                    </TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {log.details}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-accent"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <ScrollText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No logs found</h3>
              <p className="text-muted-foreground text-center">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}