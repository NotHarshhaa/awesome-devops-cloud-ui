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
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="relative h-8 w-8 md:h-9 md:w-9">
              <img
                src="/logo.svg"
                alt="logo"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="hidden text-lg font-semibold sm:inline-block">
              awesome-devops-cloud-ui
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/NotHarshhaa/awesome-devops-cloud-ui"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Github className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline-block">GitHub</span>
            </a>
            <div className="h-4 w-px bg-border"></div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
