import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Star } from "lucide-react";
import { getCurrentUser } from "@/utils/userAuth";
import { loadCourses, getUserCourses, enrollUserInCourse, Course } from "@/utils/courseManager";
import { addNotification } from "@/utils/notificationManager";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Courses = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [courses, setCourses] = useState<(Course & { progress: number })[]>([]);
  const [userCourses, setUserCourses] = useState<(Course & { progress: number })[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadCoursesData();
  }, [currentUser]);

  const loadCoursesData = () => {
    const allCourses = loadCourses();
    if (currentUser) {
      const userEnrolledCourses = getUserCourses(currentUser.id);
      setUserCourses(userEnrolledCourses);
      
      // Merge all courses with user progress
      const coursesWithProgress = allCourses.map(course => {
        const userCourse = userEnrolledCourses.find(uc => uc.id === course.id);
        return {
          ...course,
          progress: userCourse ? userCourse.progress : 0
        };
      });
      setCourses(coursesWithProgress);
    } else {
      const coursesWithProgress = allCourses.map(course => ({ ...course, progress: 0 }));
      setCourses(coursesWithProgress);
    }
  };

  const handleEnrollCourse = (courseId: string) => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "Please log in to enroll in courses.",
        variant: "destructive",
      });
      return;
    }

    const success = enrollUserInCourse(currentUser.id, courseId);
    if (success) {
      const course = courses.find(c => c.id === courseId);
      
      // Add notification
      addNotification({
        type: 'course_enrolled',
        title: 'Course Enrolled!',
        message: `You have successfully enrolled in ${course?.title}`,
        userId: currentUser.id
      });

      toast({
        title: "Enrolled Successfully",
        description: "You have been enrolled in the course!",
      });
      loadCoursesData(); // Refresh data
    } else {
      toast({
        title: "Already Enrolled",
        description: "You are already enrolled in this course.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-platform-gray/30">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-primary mb-2">Courses</h1>
          <p className="text-platform-gray-dark">
            Discover and continue your learning journey
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="learning">Your Learnings</TabsTrigger>
            <TabsTrigger value="live">Live Classes</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="card-elevated hover:scale-105 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="text-4xl text-center mb-2">{course.thumbnail}</div>
                    <CardTitle className="text-lg text-primary text-center">
                      {course.title}
                    </CardTitle>
                    <p className="text-sm text-platform-gray-dark text-center">
                      by {course.author}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-platform-gray-dark">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-current text-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <Button 
                      className="w-full btn-accent"
                      onClick={() => 
                        course.progress > 0 
                          ? navigate(`/courses/${course.id}`)
                          : handleEnrollCourse(course.id)
                      }
                    >
                      {course.progress > 0 ? "Continue Learning" : "Enroll Now"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userCourses.map((course) => (
                <Card key={course.id} className="card-elevated hover:scale-105 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="text-4xl text-center mb-2">{course.thumbnail}</div>
                    <CardTitle className="text-lg text-primary text-center">
                      {course.title}
                    </CardTitle>
                    <p className="text-sm text-platform-gray-dark text-center">
                      by {course.author}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                    <Button 
                      className="w-full btn-accent"
                      onClick={() => navigate(`/courses/${course.id}`)}
                    >
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="live" className="space-y-4">
            <Card className="card-elevated">
              <CardContent className="py-12 text-center">
                <div className="w-16 h-16 bg-platform-gray rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  No Classes Scheduled
                </h3>
                <p className="text-platform-gray-dark">
                  No Classes are scheduled at this moment :)
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Courses;