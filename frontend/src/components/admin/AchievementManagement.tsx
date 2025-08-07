import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Award, Gift } from "lucide-react";
import { loadAchievements, addAchievement, deleteAchievement, awardAchievement, Achievement } from "@/utils/achievementManager";
import { useToast } from "@/hooks/use-toast";

interface AchievementManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const AchievementManagement = ({ isOpen, onClose }: AchievementManagementProps) => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [awardUserId, setAwardUserId] = useState('');
  const [newAchievement, setNewAchievement] = useState({
    name: '',
    description: '',
    category: 'Medals' as 'Medals' | 'Badges' | 'Certificates' | 'Trophies',
    points: 0,
    icon: '🏅',
    requirements: '',
    createdBy: 'admin'
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      refreshAchievements();
    }
  }, [isOpen]);

  const refreshAchievements = () => {
    const loadedAchievements = loadAchievements();
    setAchievements(loadedAchievements);
  };

  const handleAddAchievement = () => {
    if (!newAchievement.name || !newAchievement.description || !newAchievement.requirements) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const achievement = addAchievement(newAchievement);
    setAchievements(prev => [...prev, achievement]);
    setNewAchievement({
      name: '',
      description: '',
      category: 'Medals',
      points: 0,
      icon: '🏅',
      requirements: '',
      createdBy: 'admin'
    });
    setShowAddModal(false);

    toast({
      title: "Achievement Added",
      description: "New achievement has been created successfully."
    });
  };

  const handleDeleteAchievement = (achievementId: string, achievementName: string) => {
    deleteAchievement(achievementId);
    setAchievements(prev => prev.filter(a => a.id !== achievementId));
    
    toast({
      title: "Achievement Deleted",
      description: `"${achievementName}" has been removed.`
    });
  };

  const handleAwardAchievement = () => {
    if (!selectedAchievement || !awardUserId) {
      toast({
        title: "Error",
        description: "Please select an achievement and enter a user ID.",
        variant: "destructive"
      });
      return;
    }

    const success = awardAchievement(awardUserId, selectedAchievement.id);
    if (success) {
      toast({
        title: "Achievement Awarded",
        description: `"${selectedAchievement.name}" has been awarded to user.`
      });
    } else {
      toast({
        title: "Already Awarded",
        description: "This user already has this achievement.",
        variant: "destructive"
      });
    }

    setShowAwardModal(false);
    setSelectedAchievement(null);
    setAwardUserId('');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Medals': return 'bg-yellow-100 text-yellow-800';
      case 'Badges': return 'bg-blue-100 text-blue-800';
      case 'Certificates': return 'bg-green-100 text-green-800';
      case 'Trophies': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary flex items-center">
            <Award className="w-5 h-5 mr-2" />
            Achievement Management
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Achievements</h3>
            <div className="flex gap-2">
              <Button onClick={() => setShowAwardModal(true)} variant="outline">
                <Gift className="w-4 h-4 mr-2" />
                Award Achievement
              </Button>
              <Button onClick={() => setShowAddModal(true)} className="btn-accent">
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <h4 className="font-semibold text-primary">{achievement.name}</h4>
                      <Badge className={getCategoryColor(achievement.category)}>
                        {achievement.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-platform-gray-dark mb-2">{achievement.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{achievement.points} points</span>
                      <span>Requirements: {achievement.requirements}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteAchievement(achievement.id, achievement.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Add Achievement Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Achievement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Achievement Name</Label>
                <Input
                  id="name"
                  value={newAchievement.name}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter achievement name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newAchievement.description}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter achievement description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Input
                  id="requirements"
                  value={newAchievement.requirements}
                  onChange={(e) => setNewAchievement(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="Enter requirements to earn this achievement"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={newAchievement.category} 
                    onValueChange={(value: 'Medals' | 'Badges' | 'Certificates' | 'Trophies') => 
                      setNewAchievement(prev => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Medals">Medals</SelectItem>
                      <SelectItem value="Badges">Badges</SelectItem>
                      <SelectItem value="Certificates">Certificates</SelectItem>
                      <SelectItem value="Trophies">Trophies</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Emoji)</Label>
                  <Input
                    id="icon"
                    value={newAchievement.icon}
                    onChange={(e) => setNewAchievement(prev => ({ ...prev, icon: e.target.value }))}
                    placeholder="🏅"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="points">Points</Label>
                  <Input
                    id="points"
                    type="number"
                    value={newAchievement.points}
                    onChange={(e) => setNewAchievement(prev => ({ ...prev, points: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAchievement} className="btn-accent">
                  Add Achievement
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Award Achievement Modal */}
        <Dialog open={showAwardModal} onOpenChange={setShowAwardModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Award Achievement</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Achievement</Label>
                <Select 
                  value={selectedAchievement?.id || ''} 
                  onValueChange={(value) => {
                    const achievement = achievements.find(a => a.id === value);
                    setSelectedAchievement(achievement || null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an achievement" />
                  </SelectTrigger>
                  <SelectContent>
                    {achievements.map((achievement) => (
                      <SelectItem key={achievement.id} value={achievement.id}>
                        {achievement.icon} {achievement.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  value={awardUserId}
                  onChange={(e) => setAwardUserId(e.target.value)}
                  placeholder="Enter user ID"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAwardModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAwardAchievement} className="btn-accent">
                  Award Achievement
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementManagement;