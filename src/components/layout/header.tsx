"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { motion } from "framer-motion";

export function Header() {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-background/60 backdrop-blur-md"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="relative h-8 w-8">
              <img
                src="/logo.svg"
                alt="logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-base font-semibold md:text-lg">
              awesome-devops-cloud-ui
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-4">
            <a
              href="https://github.com/NotHarshhaa/awesome-devops-cloud-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground md:px-3"
            >
              <Github className="h-5 w-5" />
              <span className="hidden md:inline-block">GitHub</span>
            </a>
            <div className="hidden h-4 w-px bg-border md:block"></div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
