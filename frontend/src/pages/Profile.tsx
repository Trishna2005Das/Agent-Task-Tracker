import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Settings,
  Bell,
  Shield,
  Key,
  Save,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@company.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    role: "Customer Support Manager",
    department: "Customer Success",
    timezone: "PST",
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    taskReminders: true,
    darkMode: false,
    autoSave: true,
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences Updated",
      description: "Your preferences have been saved.",
    });
  };

  const stats = [
    { label: "Tasks Created", value: "156", icon: Award },
    { label: "AI Runs", value: "2,341", icon: Award },
    { label: "Success Rate", value: "98.5%", icon: Award },
    { label: "Member Since", value: "Jan 2024", icon: Calendar },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <User className="w-8 h-8 text-primary" />
          Profile & Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="hover:bg-accent">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/api/placeholder/80/80" alt="Profile" />
                  <AvatarFallback className="bg-gradient-primary text-white text-lg">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{profileData.firstName} {profileData.lastName}</h3>
                  <p className="text-muted-foreground">{profileData.role}</p>
                  <Badge variant="outline" className="mt-1">
                    {profileData.department}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profileData.timezone} onValueChange={(value) => setProfileData(prev => ({ ...prev, timezone: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PST">Pacific (PST)</SelectItem>
                      <SelectItem value="MST">Mountain (MST)</SelectItem>
                      <SelectItem value="CST">Central (CST)</SelectItem>
                      <SelectItem value="EST">Eastern (EST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleSaveProfile} className="bg-gradient-primary hover:shadow-glow">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-primary" />
                Preferences
              </CardTitle>
              <CardDescription>
                Customize your experience and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive task updates via email</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={preferences.emailNotifications}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={preferences.pushNotifications}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pushNotifications: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyReports">Weekly Reports</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly performance summaries</p>
                    </div>
                    <Switch
                      id="weeklyReports"
                      checked={preferences.weeklyReports}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, weeklyReports: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* App Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">App Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="taskReminders">Task Reminders</Label>
                      <p className="text-sm text-muted-foreground">Remind me about pending tasks</p>
                    </div>
                    <Switch
                      id="taskReminders"
                      checked={preferences.taskReminders}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, taskReminders: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoSave">Auto-save</Label>
                      <p className="text-sm text-muted-foreground">Automatically save work in progress</p>
                    </div>
                    <Switch
                      id="autoSave"
                      checked={preferences.autoSave}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoSave: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSavePreferences} variant="outline" className="hover:bg-accent">
                <Save className="w-4 h-4 mr-2" />
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-card border-border shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start hover:bg-accent">
                  <Key className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-accent">
                  <Shield className="w-4 h-4 mr-2" />
                  Enable Two-Factor Authentication
                </Button>
                <Button variant="outline" className="w-full justify-start hover:bg-accent">
                  <Settings className="w-4 h-4 mr-2" />
                  Manage API Keys
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="bg-gradient-glow border-border">
            <CardHeader>
              <CardTitle className="text-lg">Your Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <stat.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm">{stat.label}</span>
                  </div>
                  <Badge variant="outline">{stat.value}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{profileData.location}</span>
              </div>
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg">Account Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Plan</span>
                <Badge className="bg-gradient-primary">Pro</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Status</span>
                <Badge variant="outline" className="text-success border-success">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Renewal</span>
                <span className="text-sm text-muted-foreground">Mar 15, 2024</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}