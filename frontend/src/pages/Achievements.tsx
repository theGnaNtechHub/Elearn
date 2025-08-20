import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Medal, Award, Trophy, Star } from "lucide-react";
import { getUserAchievements } from "@/utils/achievementManager";
import { getCurrentUser } from "@/utils/userAuth";

const Achievements = () => {
  const [achievementData, setAchievementData] = useState<any>(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      const data = getUserAchievements(currentUser.id);
      setAchievementData(data);
    }
  }, [currentUser]);

  if (!achievementData) {
    return (
      <div className="min-h-screen bg-platform-gray/30 flex items-center justify-center">
        <div className="text-center">
          <p className="text-platform-gray-dark">Please sign in to view your achievements.</p>
        </div>
      </div>
    );
  }

  const achievementCategories = [
    {
      id: 1,
      title: "Medals",
      icon: Medal,
      count: achievementData.categorized.Medals.earned,
      total: achievementData.categorized.Medals.total,
      color: "bg-yellow-100 text-yellow-800",
      achievements: achievementData.categorized.Medals.achievements
    },
    {
      id: 2,
      title: "Badges",
      icon: Award,
      count: achievementData.categorized.Badges.earned,
      total: achievementData.categorized.Badges.total,
      color: "bg-blue-100 text-blue-800",
      achievements: achievementData.categorized.Badges.achievements
    },
    {
      id: 3,
      title: "Certificates",
      icon: Star,
      count: achievementData.categorized.Certificates.earned,
      total: achievementData.categorized.Certificates.total,
      color: "bg-green-100 text-green-800",
      achievements: achievementData.categorized.Certificates.achievements
    },
    {
      id: 4,
      title: "Trophies",
      icon: Trophy,
      count: achievementData.categorized.Trophies.earned,
      total: achievementData.categorized.Trophies.total,
      color: "bg-purple-100 text-purple-800",
      achievements: achievementData.categorized.Trophies.achievements
    },
  ];

  return (
    <div className="min-h-screen bg-platform-gray/30">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-primary mb-2">Achievements</h1>
          <p className="text-platform-gray-dark">
            Track your learning progress and celebrate your milestones
          </p>
        </div>

        {/* Achievement Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {achievementCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id} className="card-elevated hover:scale-105 transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-semibold text-primary mb-2">{category.title}</h3>
                  <div className="text-2xl font-bold text-accent mb-1">{category.count}/{category.total}</div>
                  <p className="text-sm text-platform-gray-dark">Earned</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Detailed Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {achievementCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card key={category.id} className="card-elevated">
                <CardHeader>
                  <CardTitle className="text-primary flex items-center">
                    <Icon className="w-5 h-5 mr-2" />
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        achievement.earned
                          ? "bg-accent/5 border-accent/20"
                          : "bg-platform-gray/30 border-border opacity-60"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className={`font-semibold ${
                          achievement.earned ? "text-primary" : "text-platform-gray-dark"
                        }`}>
                          {achievement.name}
                        </h4>
                        <Badge
                          variant={achievement.earned ? "default" : "secondary"}
                          className={achievement.earned ? "bg-accent" : ""}
                        >
                          {achievement.earned ? "Earned" : "Locked"}
                        </Badge>
                      </div>
                      <p className={`text-sm ${
                        achievement.earned ? "text-platform-gray-dark" : "text-platform-gray-dark/60"
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Summary */}
        <Card className="card-elevated mt-8">
          <CardHeader>
            <CardTitle className="text-primary">Achievement Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">{achievementData.stats.totalEarned}</div>
                <p className="text-sm text-platform-gray-dark">Total Earned</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{achievementData.stats.completionRate}%</div>
                <p className="text-sm text-platform-gray-dark">Completion Rate</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent mb-1">{achievementData.stats.totalPoints}</div>
                <p className="text-sm text-platform-gray-dark">Total Points</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">{achievementData.stats.dayStreak}</div>
                <p className="text-sm text-platform-gray-dark">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Achievements;