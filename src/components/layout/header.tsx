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
      transition={{ 
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6 
      }}
      className="sticky top-0 z-50 w-full border-b bg-gradient-to-b from-background/60 to-background/40 backdrop-blur-xl shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link 
            href="/" 
            className="group flex items-center gap-2.5 transition-all duration-300 hover:opacity-90"
          >
            <motion.div 
              className="relative h-8 w-8 flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/logo.svg"
                alt="logo"
                className="h-full w-full object-contain"
              />
            </motion.div>
            <span className="text-base font-semibold tracking-tight truncate bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 md:text-lg">
              awesome-devops-cloud-ui
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-4">
            <motion.a
              href="https://github.com/NotHarshhaa/awesome-devops-cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-muted/50 md:px-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="h-5 w-5" />
              <span className="hidden md:inline-block">GitHub</span>
            </motion.a>
            <div className="hidden h-4 w-px bg-gradient-to-b from-border/50 to-border md:block"></div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
