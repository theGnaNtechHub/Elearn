import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, BookOpen, Trophy, Calendar, Trash2 } from "lucide-react";
import { User as UserType } from "@/utils/userAuth";
import { getUserCourses, getUserLevel, loadUserCourses } from "@/utils/courseManager";
import { useToast } from "@/hooks/use-toast";

interface UserModalProps {
  user: UserType;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdate: () => void;
}

const UserModal = ({ user, isOpen, onClose, onUserUpdate }: UserModalProps) => {
  const [userCourses, setUserCourses] = useState<any[]>([]);
  const [userLevel, setUserLevel] = useState({ level: 1, progress: 0, nextLevelProgress: 100 });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const courses = getUserCourses(user.id);
      setUserCourses(courses);
      setUserLevel(getUserLevel(user.id));
    }
  }, [user]);

  const handleDeleteUser = () => {
    // In a real app, this would call an API
    toast({
      title: "User Deleted",
      description: `${user.name} has been removed from the platform.`,
      variant: "destructive",
    });
    onUserUpdate();
    onClose();
  };

  const totalCourses = userCourses.length;
  const completedCourses = userCourses.filter(course => course.progress === 100).length;
  const inProgressCourses = userCourses.filter(course => course.progress > 0 && course.progress < 100).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">{user.name}</h2>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Level</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{userLevel.level}</div>
                  <div className="mt-2">
                    <Progress value={userLevel.progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {userLevel.nextLevelProgress.toFixed(0)}% to next level
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Courses</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{totalCourses}</div>
                  <p className="text-xs text-muted-foreground">
                    {completedCourses} completed, {inProgressCourses} in progress
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Joined</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold text-primary">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <p className="text-xs text-muted-foreground">Member since</p>
                </CardContent>
              </Card>
            </div>

            {/* User Information */}
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-primary font-medium">{user.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Username</label>
                    <p className="text-primary font-medium">@{user.username}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-primary font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                    <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            {userCourses.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-primary mb-2">No Courses Enrolled</h3>
                  <p className="text-muted-foreground">This user hasn't enrolled in any courses yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userCourses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl">{course.thumbnail}</div>
                        <Badge variant={course.progress === 100 ? "default" : course.progress > 0 ? "secondary" : "outline"}>
                          {course.progress === 100 ? "Completed" : course.progress > 0 ? "In Progress" : "Not Started"}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm text-primary">{course.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">by {course.author}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-primary">Delete User Account</h4>
                    <p className="text-sm text-muted-foreground">
                      Permanently delete this user's account and all associated data. This action cannot be undone.
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteUser}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;