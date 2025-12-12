"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RotateCw, SquareArrowOutUpRight } from "lucide-react";
import { DeviceSelector } from "./DeviceSelector";

interface PreviewTopBarProps {
  device: "Desktop" | "Tablet" | "Phone";
  setDevice: (device: "Desktop" | "Tablet" | "Phone") => void;
}

export const PreviewTopBar: React.FC<PreviewTopBarProps> = ({
  device,
  setDevice,
}) => {
  return (
    <div className="flex-1 flex justify-center">
      <div className="flex items-center h-7 bg-gray-100 border rounded-md px-2 max-w-[300px]">
        {/* Device selector dropdown */}
        <DeviceSelector device={device} setDevice={setDevice} />

        <input
          className="flex-1 bg-transparent border-0 outline-none text-sm pl-2"
          defaultValue="/#features-section"
        />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <SquareArrowOutUpRight />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open preview in new tab</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              <RotateCw size={10} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Refresh</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};
