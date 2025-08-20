import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, BookOpen, Trophy, GraduationCap } from "lucide-react";
import { loadUsers, User as UserType } from "@/utils/userAuth";
import { loadCourses, loadUserCourses, getUserLevel } from "@/utils/courseManager";

interface StatsModalProps {
  type: 'users' | 'courses' | 'tutors' | 'achievements';
  isOpen: boolean;
  onClose: () => void;
}

const StatsModal = ({ type, isOpen, onClose }: StatsModalProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen, type]);

  const loadData = () => {
    setLoading(true);
    
    switch (type) {
      case 'users':
        const users = loadUsers().filter(u => u.username !== 'admin');
        const usersWithProgress = users.map(user => {
          const userLevel = getUserLevel(user.id);
          return { ...user, level: userLevel.level, progress: userLevel.progress };
        });
        setData(usersWithProgress);
        break;
      
      case 'courses':
        const courses = loadCourses();
        const userCourses = loadUserCourses();
        const coursesWithStats = courses.map(course => {
          const enrollments = userCourses.filter(uc => uc.courseId === course.id);
          const completions = enrollments.filter(uc => uc.completed).length;
          return {
            ...course,
            enrollments: enrollments.length,
            completions,
            completionRate: enrollments.length > 0 ? (completions / enrollments.length) * 100 : 0
          };
        });
        setData(coursesWithStats);
        break;
      
      case 'tutors':
        // Mock tutor data
        setData([
          { id: '1', name: 'Dr. Sarah Chen', courses: 2, students: 1500, rating: 4.8 },
          { id: '2', name: 'Prof. Michael Rodriguez', courses: 1, students: 987, rating: 4.9 },
          { id: '3', name: 'Lisa Thompson', courses: 1, students: 2341, rating: 4.7 }
        ]);
        break;
      
      case 'achievements':
        // Mock achievements data
        setData([
          { id: '1', name: 'First Course Completed', users: 45, icon: '🎓' },
          { id: '2', name: 'Speed Learner', users: 23, icon: '⚡' },
          { id: '3', name: 'Dedicated Student', users: 67, icon: '📚' }
        ]);
        break;
    }
    
    setLoading(false);
  };

  const getTitle = () => {
    switch (type) {
      case 'users': return 'All Users';
      case 'courses': return 'All Courses';
      case 'tutors': return 'All Tutors';
      case 'achievements': return 'All Achievements';
      default: return 'Details';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'users': return <User className="h-5 w-5" />;
      case 'courses': return <BookOpen className="h-5 w-5" />;
      case 'tutors': return <GraduationCap className="h-5 w-5" />;
      case 'achievements': return <Trophy className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-6">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : data.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No data available.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {type === 'users' && data.map((user: UserType & { level: number; progress: number }) => (
                <Card key={user.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                          </span>
                        </div>
                        <div>
                          <CardTitle className="text-sm text-primary">{user.name}</CardTitle>
                          <p className="text-xs text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">Level {user.level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{user.progress ? user.progress.toFixed(0) : 0}%</span>
                      </div>
                      <Progress value={user.progress || 0} className="h-2" />
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {type === 'courses' && data.map((course: any) => (
                <Card key={course.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl">{course.thumbnail}</div>
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                    <CardTitle className="text-sm text-primary">{course.title}</CardTitle>
                    <p className="text-xs text-muted-foreground">by {course.author}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Enrollments</span>
                        <span>{course.enrollments}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completions</span>
                        <span>{course.completions}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Completion Rate</span>
                        <span>{course.completionRate ? course.completionRate.toFixed(1) : 0}%</span>
                      </div>
                      <Progress value={course.completionRate || 0} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}

              {type === 'tutors' && data.map((tutor: any) => (
                <Card key={tutor.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-sm text-primary">{tutor.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">Instructor</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Courses</span>
                        <span>{tutor.courses}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Students</span>
                        <span>{tutor.students}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Rating</span>
                        <span>⭐ {tutor.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {type === 'achievements' && data.map((achievement: any) => (
                <Card key={achievement.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <CardTitle className="text-sm text-primary">{achievement.name}</CardTitle>
                        <p className="text-xs text-muted-foreground">Achievement</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-sm">
                      <span>Users Earned</span>
                      <span>{achievement.users}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatsModal;