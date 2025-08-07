import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  BookOpen,
  CheckCircle
} from "lucide-react";
import { loadCourses, getUserCourses, updateCourseProgress, Course } from "@/utils/courseManager";
import { getCurrentUser } from "@/utils/userAuth";
import { addNotification } from "@/utils/notificationManager";
import { checkAndAwardCertificates, checkAndAwardBadges } from "@/utils/achievementManager";
import { useToast } from "@/hooks/use-toast";

interface CourseSection {
  id: string;
  title: string;
  videos: {
    id: string;
    title: string;
    duration: string;
    completed: boolean;
  }[];
}

const CourseViewer = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [userProgress, setUserProgress] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [courseSections, setCourseSections] = useState<CourseSection[]>([]);
  const currentUser = getCurrentUser();
  const { toast } = useToast();

  useEffect(() => {
    if (courseId) {
      loadCourseData();
    }
  }, [courseId]);

  const loadCourseData = () => {
    const courses = loadCourses();
    const foundCourse = courses.find(c => c.id === courseId);
    
    if (!foundCourse) return;
    
    setCourse(foundCourse);
    
    if (currentUser) {
      const userCourses = getUserCourses(currentUser.id);
      const userCourse = userCourses.find(uc => uc.id === courseId);
      setUserProgress(userCourse?.progress || 0);
    }

    // Mock course sections and videos
    const mockSections: CourseSection[] = [
      {
        id: "section-1",
        title: "Getting Started",
        videos: [
          { id: "video-1", title: "Introduction to the Course", duration: "10:30", completed: false },
          { id: "video-2", title: "Setting Up Your Environment", duration: "15:45", completed: false },
          { id: "video-3", title: "Basic Concepts Overview", duration: "12:20", completed: false }
        ]
      },
      {
        id: "section-2", 
        title: "Core Fundamentals",
        videos: [
          { id: "video-4", title: "Understanding the Basics", duration: "18:15", completed: false },
          { id: "video-5", title: "Practical Examples", duration: "22:30", completed: false },
          { id: "video-6", title: "Common Patterns", duration: "16:45", completed: false }
        ]
      },
      {
        id: "section-3",
        title: "Advanced Topics",
        videos: [
          { id: "video-7", title: "Advanced Techniques", duration: "25:10", completed: false },
          { id: "video-8", title: "Best Practices", duration: "20:35", completed: false },
          { id: "video-9", title: "Real-world Applications", duration: "28:45", completed: false }
        ]
      }
    ];

    setCourseSections(mockSections);
    setCurrentVideo("video-1");
  };

  const handleVideoComplete = (videoId: string) => {
    setCourseSections(prev => 
      prev.map(section => ({
        ...section,
        videos: section.videos.map(video => 
          video.id === videoId ? { ...video, completed: true } : video
        )
      }))
    );

    // Calculate new progress
    const totalVideos = courseSections.reduce((acc, section) => acc + section.videos.length, 0);
    const completedVideos = courseSections.reduce((acc, section) => 
      acc + section.videos.filter(v => v.completed || v.id === videoId).length, 0
    );
    
    const newProgress = Math.round((completedVideos / totalVideos) * 100);
    setUserProgress(newProgress);

    if (currentUser && courseId) {
      updateCourseProgress(currentUser.id, courseId, newProgress);
      
      // Add notification
      addNotification({
        type: 'video_completed',
        title: 'Video Completed!',
        message: `You completed a video in ${course?.title}`,
        userId: currentUser.id
      });

      // Award badges for sections completed
      const sectionsCompleted = Math.floor(completedVideos / 3); // Assume 3 videos per section
      checkAndAwardBadges(currentUser.id, sectionsCompleted);

      if (newProgress === 100) {
        addNotification({
          type: 'course_completed',
          title: 'Course Completed!',
          message: `Congratulations! You completed ${course?.title}`,
          userId: currentUser.id
        });
        
        // Award certificate for course completion
        checkAndAwardCertificates(currentUser.id, course?.title || '');
        
        toast({
          title: "Course Completed! 🎉",
          description: `Congratulations on completing ${course?.title}! You've earned a certificate!`,
        });
      }
    }
  };

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (!course) {
    return <div className="flex items-center justify-center min-h-screen">Course not found</div>;
  }

  const currentVideoData = courseSections
    .flatMap(s => s.videos)
    .find(v => v.id === currentVideo);

  const totalVideos = courseSections.reduce((acc, section) => acc + section.videos.length, 0);
  const completedVideos = courseSections.reduce((acc, section) => 
    acc + section.videos.filter(v => v.completed).length, 0
  );

  return (
    <div className="min-h-screen bg-platform-gray/30">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Video Player */}
            <Card className="card-elevated">
              <CardContent className="p-0">
                <div className="aspect-video bg-black rounded-t-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
                    <p className="text-lg">
                      {currentVideoData ? currentVideoData.title : "Select a video to play"}
                    </p>
                    {currentVideoData && (
                      <Button 
                        className="mt-4"
                        onClick={() => handleVideoComplete(currentVideo!)}
                      >
                        Mark as Complete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Details */}
            <Card className="card-elevated">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-4xl">{course.thumbnail}</span>
                    <div>
                      <h1 className="text-2xl font-bold text-primary">{course.title}</h1>
                      <p className="text-platform-gray-dark">by {course.author}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-platform-gray-dark">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-500" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students} students</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <Badge variant="secondary">{course.level}</Badge>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Course Progress</span>
                      <span>{userProgress}% ({completedVideos}/{totalVideos} videos)</span>
                    </div>
                    <Progress value={userProgress} className="h-3" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-primary mb-2">Description</h3>
                    <p className="text-platform-gray-dark">{course.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Course Content */}
          <div className="lg:col-span-1">
            <Card className="card-elevated sticky top-8">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-primary">Course Content</h3>
                </div>

                <div className="space-y-4">
                  {courseSections.map((section, sectionIndex) => (
                    <div key={section.id} className="space-y-2">
                      <h4 className="font-medium text-sm text-primary">
                        {sectionIndex + 1}. {section.title}
                      </h4>
                      <div className="space-y-1 pl-4">
                        {section.videos.map((video, videoIndex) => (
                          <div 
                            key={video.id}
                            className={`flex items-center space-x-2 p-2 rounded cursor-pointer hover:bg-platform-gray/50 transition-colors ${
                              currentVideo === video.id ? 'bg-platform-gray/30' : ''
                            }`}
                            onClick={() => setCurrentVideo(video.id)}
                          >
                            <Checkbox 
                              checked={video.completed}
                              onCheckedChange={() => {
                                if (!video.completed) {
                                  handleVideoComplete(video.id);
                                }
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs truncate ${
                                video.completed ? 'line-through text-platform-gray-dark' : ''
                              }`}>
                                {videoIndex + 1}. {video.title}
                              </p>
                              <p className="text-xs text-platform-gray-dark">{video.duration}</p>
                            </div>
                            {video.completed && (
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;