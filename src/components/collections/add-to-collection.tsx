"use client";

import { Button } from "@/components/ui/button";
import { Resource } from "@/hooks/use-readme";
import { FolderPlus } from "lucide-react";
import { CollectionsDialog } from "./collections-dialog";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AddToCollectionProps {
  resource: Resource;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
}

export function AddToCollection({
  resource,
  className = "",
  variant = "ghost",
  size = "sm",
  showLabel = false,
}: AddToCollectionProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CollectionsDialog
              resourceId={resource.id}
              resource={resource}
              variant="add"
            />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Add to collection</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
