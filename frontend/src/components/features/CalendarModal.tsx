import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalendarModal = ({ isOpen, onClose }: CalendarModalProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleOk = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="scale-in">
        <DialogHeader>
          <DialogTitle className="text-primary">Calendar</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border w-full pointer-events-auto"
          />
        </div>
        <div className="flex justify-end space-x-3 p-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleOk} className="btn-accent">
            OK
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarModal;