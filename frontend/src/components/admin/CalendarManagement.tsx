import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trash2, Plus, CalendarIcon, Users, Filter } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { loadEvents, addEvent, deleteEvent, getEventBadgeColor, CalendarEvent } from "@/utils/calendarManager";
import { loadCourses } from "@/utils/courseManager";
import { useToast } from "@/hooks/use-toast";

interface CalendarManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendarManagement = ({ isOpen, onClose }: CalendarManagementProps) => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: new Date(),
    time: '',
    type: 'workshop' as CalendarEvent['type'],
    targetUsers: [] as string[],
    targetLevels: [] as number[],
    targetCourses: [] as string[],
    isRequired: false,
    createdBy: 'admin'
  });
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      refreshEvents();
      const loadedCourses = loadCourses();
      setCourses(loadedCourses);
    }
  }, [isOpen]);

  const refreshEvents = () => {
    const loadedEvents = loadEvents();
    setEvents(loadedEvents);
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const event = addEvent(newEvent);
    setEvents(prev => [...prev, event]);
    setNewEvent({
      title: '',
      description: '',
      date: new Date(),
      time: '',
      type: 'workshop',
      targetUsers: [],
      targetLevels: [],
      targetCourses: [],
      isRequired: false,
      createdBy: 'admin'
    });
    setShowAddModal(false);

    toast({
      title: "Event Added",
      description: "New event has been created successfully."
    });
  };

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    deleteEvent(eventId);
    setEvents(prev => prev.filter(e => e.id !== eventId));
    
    toast({
      title: "Event Deleted",
      description: `"${eventTitle}" has been removed.`
    });
  };

  const handleLevelChange = (level: number, checked: boolean) => {
    setNewEvent(prev => ({
      ...prev,
      targetLevels: checked 
        ? [...prev.targetLevels, level]
        : prev.targetLevels.filter(l => l !== level)
    }));
  };

  const handleCourseChange = (courseId: string, checked: boolean) => {
    setNewEvent(prev => ({
      ...prev,
      targetCourses: checked 
        ? [...prev.targetCourses, courseId]
        : prev.targetCourses.filter(c => c !== courseId)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary flex items-center">
            <CalendarIcon className="w-5 h-5 mr-2" />
            Calendar Management
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Events</h3>
            <Button onClick={() => setShowAddModal(true)} className="btn-accent">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {events.map((event) => (
              <Card key={event.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-primary">{event.title}</h4>
                      <Badge className={getEventBadgeColor(event.type)}>
                        {event.type}
                      </Badge>
                      {event.isRequired && (
                        <Badge variant="destructive">Required</Badge>
                      )}
                    </div>
                    <p className="text-sm text-platform-gray-dark mb-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span>{event.date.toLocaleDateString()} at {event.time}</span>
                      {event.targetLevels.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Filter className="w-4 h-4" />
                          Levels: {event.targetLevels.join(', ')}
                        </span>
                      )}
                      {event.targetCourses.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Filter className="w-4 h-4" />
                          Courses: {event.targetCourses.length}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteEvent(event.id, event.title)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Add Event Modal */}
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter event title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter event description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newEvent.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newEvent.date ? format(newEvent.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={newEvent.date}
                        onSelect={(date) => date && setNewEvent(prev => ({ ...prev, date }))}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    placeholder="e.g., 2:00 PM"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Event Type</Label>
                <Select 
                  value={newEvent.type} 
                  onValueChange={(value: CalendarEvent['type']) => 
                    setNewEvent(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="quiz">Quiz</SelectItem>
                    <SelectItem value="live">Live Session</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="meeting">Meeting</SelectItem>
                    <SelectItem value="deadline">Deadline</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="required"
                    checked={newEvent.isRequired}
                    onCheckedChange={(checked) => 
                      setNewEvent(prev => ({ ...prev, isRequired: !!checked }))
                    }
                  />
                  <Label htmlFor="required">Required Event</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target User Levels (optional)</Label>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div key={level} className="flex items-center space-x-2">
                      <Checkbox
                        id={`level-${level}`}
                        checked={newEvent.targetLevels.includes(level)}
                        onCheckedChange={(checked) => handleLevelChange(level, !!checked)}
                      />
                      <Label htmlFor={`level-${level}`}>Level {level}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Target Courses (optional)</Label>
                <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                  {courses.map((course) => (
                    <div key={course.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`course-${course.id}`}
                        checked={newEvent.targetCourses.includes(course.id)}
                        onCheckedChange={(checked) => handleCourseChange(course.id, !!checked)}
                      />
                      <Label htmlFor={`course-${course.id}`} className="text-sm">
                        {course.title}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEvent} className="btn-accent">
                  Add Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarManagement;