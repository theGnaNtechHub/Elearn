import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, Trophy, GraduationCap, LogOut, Plus, Eye, Settings, Trash2, Shield, Target, Swords, Calendar, CheckSquare } from "lucide-react";
import { getCurrentUser, logoutUser, loadUsers, User } from "@/utils/userAuth";
import { loadCourses, loadUserCourses } from "@/utils/courseManager";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import UserModal from "@/components/admin/UserModal";
import StatsModal from "@/components/admin/StatsModal";
import AddUserModal from "@/components/admin/AddUserModal";
import ArenaManagement from "@/components/admin/ArenaManagement";
import AchievementManagement from "@/components/admin/AchievementManagement";
import CalendarManagement from "@/components/admin/CalendarManagement";
import TaskManagement from "@/components/admin/TaskManagement";

const Admin = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [statsModal, setStatsModal] = useState<'users' | 'courses' | 'tutors' | 'achievements' | null>(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showArena, setShowArena] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTasks, setShowTasks] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  useEffect(() => {
    // Check if user is admin
    if (!currentUser || currentUser.username !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }

    // Load users
    const allUsers = loadUsers();
    setUsers(allUsers);
  }, []); // Remove dependencies to prevent infinite loop

  const handleLogout = () => {
    logoutUser();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/signin');
  };

  if (!currentUser || currentUser.username !== 'admin') {
    return null;
  }

  const refreshData = () => {
    const allUsers = loadUsers();
    setUsers(allUsers);
  };

  const totalUsers = users.length;
  const regularUsers = users.filter(u => u.username !== 'admin').length;
  const courses = loadCourses();
  const userCourses = loadUserCourses();

  return (
    <div className="min-h-screen bg-platform-gray/30">
      {/* Admin Header */}
      <div className="bg-white border-b border-platform-gray/20 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-primary">Admin Dashboard</h1>
            <p className="text-platform-gray-dark">Welcome back, {currentUser.name}</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setStatsModal('users')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{regularUsers}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setStatsModal('courses')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{courses.length}</div>
              <p className="text-xs text-muted-foreground">Available courses</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setStatsModal('tutors')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tutors</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">3</div>
              <p className="text-xs text-muted-foreground">Active tutors</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setStatsModal('achievements')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">3</div>
              <p className="text-xs text-muted-foreground">Total achievements</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="tutors">Tutors</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>
                      Manage registered users and their accounts
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddUserModal(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add User
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {regularUsers === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No users registered yet.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {users.filter(u => u.username !== 'admin').map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary font-medium">
                                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                              </span>
                            </div>
                            <div>
                              <h3 
                                className="font-medium text-primary cursor-pointer hover:underline"
                                onClick={() => setSelectedUser(user)}
                              >
                                {user.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">@{user.username}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">Active</Badge>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedUser(user)}
                              className="gap-2"
                            >
                              <Eye className="h-4 w-4" />
                              Manage
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <CardTitle>Course Management</CardTitle>
                <CardDescription>
                  Add, edit, and manage courses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">Quick actions for course management</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setShowAchievements(true)}>
                      <Shield className="h-4 w-4 mr-2" />
                      Achievements
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowArena(true)}>
                      <Swords className="h-4 w-4 mr-2" />
                      Arena
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowCalendar(true)}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Calendar
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowTasks(true)}>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Tasks
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tutors">
            <Card>
              <CardHeader>
                <CardTitle>Tutor Management</CardTitle>
                <CardDescription>
                  Manage tutors and instructors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Tutor management coming soon...</p>
                  <Button className="mt-4 btn-accent">Add New Tutor</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>
                  Configure platform settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Settings panel coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Modals */}
      {selectedUser && (
        <UserModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          onUserUpdate={refreshData}
        />
      )}
      
      <StatsModal
        type={statsModal || 'users'}
        isOpen={!!statsModal}
        onClose={() => setStatsModal(null)}
      />
      
      <AddUserModal
        isOpen={showAddUserModal}
        onClose={() => setShowAddUserModal(false)}
        onUserAdded={refreshData}
      />
      
      <AchievementManagement 
        isOpen={showAchievements} 
        onClose={() => setShowAchievements(false)} 
      />
      <ArenaManagement 
        isOpen={showArena} 
        onClose={() => setShowArena(false)} 
      />
      <CalendarManagement 
        isOpen={showCalendar} 
        onClose={() => setShowCalendar(false)} 
      />
      <TaskManagement 
        isOpen={showTasks} 
        onClose={() => setShowTasks(false)} 
      />
    </div>
  );
};

export default Admin;