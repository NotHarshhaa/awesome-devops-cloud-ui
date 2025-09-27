"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import {
  ChevronDown,
  Github,
  Star,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Code,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      duration: 0.6,
    },
  },
};

const floatingAnimation = {
  y: [0, -10, 0],
    transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  },
};

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const y = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 30; // Increased movement sensitivity
      const y = (clientY / innerHeight - 0.5) * 30;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToContent = () => {
    const element = document.getElementById("content");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  // Random particle generation for background effect
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 2,
    duration: Math.random() * 20 + 10,
  }));

  return (
    <section className="relative isolate min-h-[100vh] w-full overflow-hidden" id="hero">
      {/* Enhanced Background Elements */}
      <motion.div
        className="absolute inset-0 -z-10 w-full h-full"
        style={{ y, opacity, scale }}
      >
        {/* Main gradient background - covers full area */}
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.15),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(var(--primary-rgb),0.1),transparent_60%)]" />

        {/* Base background color */}
        <div className="absolute inset-0 w-full h-full bg-background" />

        {/* Animated dot pattern with mask - covers full area */}
        <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_800px_at_center,black,transparent)]" />

        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full bg-primary/10"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
              }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
                x: [0, mousePosition.x * 0.5, 0],
                y: [0, mousePosition.y * 0.5, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Dynamic blur elements */}
        <motion.div
          className="absolute left-[10%] top-[20%] h-72 w-72 rounded-full bg-primary/10 blur-3xl"
          animate={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 20,
            opacity: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        />
        <motion.div
          className="absolute right-[10%] top-[30%] h-96 w-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            x: mousePosition.x * -2,
            y: mousePosition.y * -2,
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 20,
            opacity: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            },
          }}
        />
        
        {/* Additional background coverage elements */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-transparent via-background/5 to-background/10" />
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-background/5 to-transparent" />
      </motion.div>

      <motion.div
        ref={containerRef}
        className="mx-auto flex h-full min-h-[100vh] max-w-6xl flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Enhanced Stats Banner */}
        <motion.div
          variants={itemVariants}
          className="mb-8 sm:mb-12 flex flex-wrap justify-center items-center gap-2 sm:gap-6 rounded-full border border-primary/20 bg-background/60 px-3 sm:px-5 py-2 sm:py-3 shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-primary/30 hover:shadow-primary/10"
        >
          <motion.div
            className="flex items-center gap-1.5 sm:gap-2 group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-yellow-500" aria-hidden="true" />
              <motion.div
                className="absolute inset-0 rounded-full bg-yellow-500/20"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>
            <span className="text-xs sm:text-sm font-medium">1.2k Stars</span>
          </motion.div>

          <div
            className="hidden sm:block h-4 w-px bg-gradient-to-b from-border/40 via-border to-border/40"
            aria-hidden="true"
          />

          <motion.div
            className="flex items-center gap-1.5 sm:gap-2 group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" aria-hidden="true" />
              <motion.div
                className="absolute inset-0 rounded-full bg-primary/20"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              />
            </div>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">100+ Tools</span>
          </motion.div>

          <div
            className="hidden sm:block h-4 w-px bg-gradient-to-b from-border/40 via-border to-border/40"
            aria-hidden="true"
          />

          <motion.div
            className="flex items-center gap-1.5 sm:gap-2 group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="relative">
              <GitBranch className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500" aria-hidden="true" />
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-500/20"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
          </div>
            <span className="text-xs sm:text-sm font-medium">Daily Updates</span>
          </motion.div>
        </motion.div>

        {/* Enhanced Logo */}
        <motion.div
          variants={itemVariants}
          className="relative mb-6 sm:mb-8 group"
          animate={floatingAnimation}
          onHoverStart={() => setIsHovering(true)}
          onHoverEnd={() => setIsHovering(false)}
        >
          <motion.div
            className="absolute inset-0 bg-primary/10 blur-3xl rounded-full opacity-50"
            animate={{
              scale: isHovering ? [1, 1.3, 1] : [1, 1.2, 1],
              opacity: isHovering ? [0.5, 0.9, 0.5] : [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: isHovering ? 3 : 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <img
            src="/logo.svg"
            alt="awesome-devops-cloud-ui logo"
            className="relative h-20 w-auto sm:h-28 md:h-32 filter drop-shadow-lg group-hover:scale-105 group-hover:brightness-110 group-hover:drop-shadow-xl transition-all duration-300"
          />

          {/* Orbiting elements around logo */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <motion.div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary/50" />
            <motion.div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-blue-500/50" />
            <motion.div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 h-2 w-2 rounded-full bg-yellow-500/50" />
            <motion.div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-green-500/50" />
          </motion.div>
        </motion.div>

        {/* Enhanced Title and Description */}
        <motion.div variants={itemVariants} className="text-center px-4 sm:px-6">
          <motion.div
            className="relative mb-6 sm:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
              <motion.span
                className="relative inline-block"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent [text-shadow:0_4px_8px_rgba(0,0,0,0.1)]">
                  awesome-devops-cloud-ui
                </span>
                <motion.div
                  className="absolute -inset-4 -z-10 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 blur-3xl rounded-full"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.span>
            </h1>
            
            {/* Enhanced subtitle with better typography */}
            <motion.div
              className="mt-4 sm:mt-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground/80 font-medium mb-3">
                Curated DevOps & Cloud Tools
              </p>
              <p className="mx-auto max-w-4xl text-sm sm:text-base md:text-lg text-muted-foreground/70 leading-relaxed">
                Discover the perfect tools to streamline your development workflow and boost your productivity. 
                Beautifully organized and easily accessible.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-8 sm:mt-12 flex flex-col items-center gap-6 sm:gap-8 w-full px-4 sm:px-0"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-0 sm:min-w-[200px] h-12 sm:h-14 text-sm sm:text-base font-semibold relative overflow-hidden group bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Tools
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05, y: -2 }} 
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-0 sm:min-w-[200px] h-12 sm:h-14 text-sm sm:text-base font-semibold group relative overflow-hidden border-2 hover:border-primary/50 bg-background/50 backdrop-blur-sm hover:bg-primary/5 transition-all duration-300"
                asChild
              >
                <a
                  href="https://github.com/NotHarshhaa/awesome-devops-cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2"
                >
                  <Github className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                  <span>View on GitHub</span>
                </a>
              </Button>
            </motion.div>
          </div>

          {/* Documentation Button */}
          <motion.div 
            whileHover={{ scale: 1.05, y: -1 }} 
            whileTap={{ scale: 0.95 }}
            className="mt-4"
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-sm group relative overflow-hidden hover:bg-primary/10 transition-all duration-300 rounded-full px-6 py-2"
              asChild
            >
              <Link href="/docs" className="inline-flex items-center justify-center gap-2">
                <Code className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                <span>Read Documentation</span>
                <ExternalLink className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Enhanced Creator Link */}
          <motion.div
            className="mt-8 mb-4 flex flex-col items-center text-center max-w-full px-4"
            variants={itemVariants}
          >
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 w-full p-4 rounded-2xl bg-gradient-to-r from-background/50 to-background/30 backdrop-blur-sm border border-border/20"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <span className="text-sm text-muted-foreground/80 whitespace-nowrap">
                Created with{" "}
                <motion.span 
                  className="inline-block"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ❤️
                </motion.span> by
              </span>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://notharshhaa.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-600 to-purple-600 hover:from-primary/80 hover:via-blue-500 hover:to-purple-500 transition-all duration-300 whitespace-nowrap"
              >
                H A R S H H A A
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        variants={itemVariants}
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial="hidden"
        animate="visible"
      >
        <motion.button
          className="group flex flex-col items-center gap-2 text-sm text-muted-foreground/80 transition-colors hover:text-foreground"
          onClick={scrollToContent}
          whileHover={{ y: 2 }}
        >
          <span className="font-medium">Scroll to explore</span>
          <motion.div
            animate={{
              y: [0, 4, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          </motion.div>
        </motion.button>
      </motion.div>
    </section>
  );
}
