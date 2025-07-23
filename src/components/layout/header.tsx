"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Github,
  FolderOpen,
  Menu,
  X,
  Info,
  Users,
} from "lucide-react";
import { ModeToggle } from "@/components/ui/theme-toggle";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.6,
      }}
      className="sticky top-0 z-50 w-full border-b bg-gradient-to-b from-background/60 to-background/40 backdrop-blur-xl shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-14 md:h-16 items-center justify-between">
          {/* Logo and Site Name */}
          <Link
            href="/"
            className="group flex items-center gap-2 transition-all duration-300 hover:opacity-90"
          >
            <motion.div
              className="relative h-7 w-7 md:h-8 md:w-8 flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src="/logo.svg"
                alt="logo"
                className="h-full w-full object-contain"
              />
            </motion.div>
            <span className="text-sm font-semibold tracking-tight truncate bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 md:text-lg">
              awesome-devops-cloud-ui
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/docs"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-muted/50"
              >
                <BookOpen className="h-5 w-5" />
                <span>Docs</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/collections"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-muted/50"
              >
                <FolderOpen className="h-5 w-5" />
                <span>Collections</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/about"
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-muted/50"
              >
                <Users className="h-5 w-5" />
                <span>About</span>
              </Link>
            </motion.div>
            <motion.a
              href="https://github.com/NotHarshhaa/awesome-devops-cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-300 hover:text-foreground hover:bg-muted/50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="h-5 w-5" />
              <span>GitHub</span>
            </motion.a>
            <div className="h-4 w-px bg-gradient-to-b from-border/50 to-border"></div>
            <ModeToggle />
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ModeToggle />
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t bg-background/95 backdrop-blur-sm"
          >
            <div className="container px-4 py-3 flex flex-col space-y-2">
              <Link
                href="/docs"
                className="flex items-center gap-2 p-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                <span>Docs</span>
              </Link>
              <Link
                href="/collections"
                className="flex items-center gap-2 p-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FolderOpen className="h-4 w-4" />
                <span>Collections</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center gap-2 p-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users className="h-4 w-4" />
                <span>About</span>
              </Link>
              <a
                href="https://github.com/NotHarshhaa/awesome-devops-cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
