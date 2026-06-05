"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TriggerNodeDialog = ({ open, onOpenChange }: props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Trigger</DialogTitle>
          <DialogDescription>
            Configure setting to change trigger setting
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">Trigger Header</div>
      </DialogContent>
    </Dialog>
  );
};
