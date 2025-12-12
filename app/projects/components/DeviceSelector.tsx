"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Check, Monitor, MonitorCog, Smartphone, Tablet } from "lucide-react";

interface DeviceSelectorProps {
  device: "Desktop" | "Tablet" | "Phone";
  setDevice: (device: "Desktop" | "Tablet" | "Phone") => void;
}

export const DeviceSelector: React.FC<DeviceSelectorProps> = ({
  device,
  setDevice,
}) => {
  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MonitorCog />
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>Choose device</TooltipContent>
      </Tooltip>

      <DropdownMenuContent align="start" className="w-50">
        <DropdownMenuItem
          onClick={() => setDevice("Desktop")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Monitor size={16} />
            Desktop
          </div>
          {device === "Desktop" && <Check size={16} />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setDevice("Tablet")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Tablet size={16} />
            Tablet
          </div>
          {device === "Tablet" && <Check size={16} />}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setDevice("Phone")}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Smartphone size={16} />
            Phone
          </div>
          {device === "Phone" && <Check size={16} />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
