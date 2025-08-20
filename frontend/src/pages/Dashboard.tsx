import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Trophy,
  FlaskConical,
  Zap,
  MessageSquare,
  BookOpen,
  Bell,
  ExternalLink,
} from "lucide-react";
import CalendarModal from "@/components/features/CalendarModal";
import { getCurrentUser } from "@/utils/userAuth";
import { getUserCourses } from "@/utils/courseManager";

const Dashboard = () => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      const userCourses = getUserCourses(currentUser.id);
      setEnrolledCourses(userCourses);
    }
  }, [currentUser]);

  const sidebarItems = [
    { icon: BookOpen, label: "Courses", link: "/courses" },
    { icon: Bell, label: "Notifications", link: "/notifications" },
    { icon: Calendar, label: "Calendar", action: () => setShowCalendar(true) },
    { icon: Trophy, label: "Achievements", link: "/achievements" },
    { icon: FlaskConical, label: "Logic Lab", link: "/logic-lab" },
    { icon: Zap, label: "Arena", link: "/arena" },
  ];

  return (
    <div className="min-h-screen bg-platform-gray/30">
      <div className="container mx-auto px-6 py-8">
        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-xl p-8 text-white mb-8 fade-in">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {currentUser?.name || "Innovator"}!
          </h1>
          <p className="text-lg opacity-90">
            Let's unlock new skills and continue your learning journey.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Ongoing Courses */}
            <Card className="card-elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-primary">Ongoing Courses</CardTitle>
                <Link to="/courses">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Browse Courses
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {enrolledCourses.length > 0 ? (
                  <div className="space-y-4">
                    {enrolledCourses.slice(0, 3).map((course) => (
                      <div
                        key={course.id}
                        className="p-4 bg-platform-gray/30 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-primary">
                            {course.title}
                          </h4>
                          <span className="text-sm text-platform-gray-dark">
                            {course.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-platform-gray rounded-full h-2 mb-3">
                          <div
                            className="bg-accent h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-platform-gray-dark">
                            Level: {course.level}
                          </span>
                          <Link to={`/courses/${course.id}`}>
                            <Button variant="outline" size="sm">
                              Continue
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    {enrolledCourses.length > 3 && (
                      <div className="text-center pt-2">
                        <Link to="/courses">
                          <Button variant="ghost" size="sm">
                            View all {enrolledCourses.length} courses
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-platform-gray rounded-full flex items-center justify-center mx-auto mb-4">
                      <FlaskConical className="w-8 h-8 text-platform-gray-dark" />
                    </div>
                    <p className="text-platform-gray-dark mb-4">
                      Start your first course to unlock this space!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-primary">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to="/mr-pseudo">
                    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-102 cursor-pointer border-2 border-transparent hover:border-accent/20">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-platform-orange-light rounded-lg flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">👨‍💻</span>
                        </div>
                        <h3 className="font-semibold text-primary mb-1">
                          MR PSEUDO
                        </h3>
                        <p className="text-sm text-platform-gray-dark">
                          Code Editor
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link to="/lady-logic">
                    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-102 cursor-pointer border-2 border-transparent hover:border-primary/20">
                      <CardContent className="p-6 text-center">
                        <div className="w-12 h-12 bg-platform-blue-light rounded-lg flex items-center justify-center mx-auto mb-3">
                          <span className="text-2xl">🔀</span>
                        </div>
                        <h3 className="font-semibold text-primary mb-1">
                          LADY LOGIC
                        </h3>
                        <p className="text-sm text-platform-gray-dark">
                          Flowchart Tool
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="card-elevated sticky top-24">
              <CardHeader>
                <CardTitle className="text-primary text-lg">
                  Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sidebarItems.map((item, index) => (
                  <div key={index}>
                    {item.link ? (
                      <Link to={item.link}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover:bg-platform-gray hover:text-foreground transition-colors"
                        >
                          <item.icon className="w-5 h-5 mr-3" />
                          {item.label}
                        </Button>
                      </Link>
                    ) : (
                      <Button
                        variant="ghost"
                        className="w-full justify-start hover:bg-platform-gray hover:text-foreground transition-colors"
                        onClick={item.action}
                      >
                        <item.icon className="w-5 h-5 mr-3" />
                        {item.label}
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
      />
    </div>
  );
};

export default Dashboard;
