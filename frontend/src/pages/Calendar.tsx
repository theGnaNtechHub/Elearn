import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { getEventsForUser, getEventsForDate, getEventBadgeColor } from "@/utils/calendarManager";
import { getCurrentUser } from "@/utils/userAuth";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const currentUser = getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      const userEvents = getEventsForUser(currentUser.id);
      setEvents(userEvents);
    }
  }, [currentUser]);

  const getEventsForSelectedDate = (date: Date) => {
    return getEventsForDate(date, currentUser?.id || '');
  };

  return (
    <div className="min-h-screen bg-platform-gray/30">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 fade-in">
          <h1 className="text-3xl font-bold text-primary mb-2">Calendar</h1>
          <p className="text-platform-gray-dark">
            Track your learning schedule and upcoming events
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="card-elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-primary">December 2024</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border w-full"
                  modifiers={{
                    hasEvent: events.map(event => event.date)
                  }}
                  modifiersClassNames={{
                    hasEvent: "bg-accent/20 text-accent-foreground font-semibold"
                  }}
                />
              </CardContent>
            </Card>
          </div>

          {/* Events & Actions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Add Event */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-primary">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full btn-accent">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </Button>
              </CardContent>
            </Card>

            {/* Today's Events */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-primary">
                  {selectedDate ? "Events for " + selectedDate.toLocaleDateString() : "Today's Events"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedDate && getEventsForSelectedDate(selectedDate).length > 0 ? (
                  getEventsForSelectedDate(selectedDate).map((event) => (
                    <div key={event.id} className="p-3 bg-platform-gray/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-primary text-sm">
                          {event.title}
                        </h4>
                        <Badge className={getEventBadgeColor(event.type)}>
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-platform-gray-dark">{event.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 bg-platform-gray rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-xl">📅</span>
                    </div>
                    <p className="text-sm text-platform-gray-dark">
                      No events scheduled for this day
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="card-elevated">
              <CardHeader>
                <CardTitle className="text-primary">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {events.slice(0, 3).map((event) => (
                  <div key={event.id} className="p-3 bg-platform-gray/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-primary text-sm">
                        {event.title}
                      </h4>
                      <Badge className={getEventBadgeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <div className="text-xs text-platform-gray-dark">
                      {event.date.toLocaleDateString()} at {event.time}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;