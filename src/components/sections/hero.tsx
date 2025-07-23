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
    <section className="relative isolate min-h-[100vh] w-full overflow-hidden bg-dot-pattern">
      {/* Enhanced Background Elements */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={{ y, opacity, scale }}
      >
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.15),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(var(--primary-rgb),0.1),transparent_60%)]" />

        {/* Animated dot pattern with mask */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800d_1px,transparent_1px),linear-gradient(to_bottom,#8080800d_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_800px_at_center,black,transparent)]" />

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
      </motion.div>

      <motion.div
        ref={containerRef}
        className="mx-auto flex h-full min-h-[100vh] max-w-6xl flex-col items-center justify-center px-6 py-12"
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
          <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <motion.span
              className="relative inline-block"
              whileHover={{ scale: 1.02 }}
            >
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent [text-shadow:0_4px_8px_rgba(0,0,0,0.1)]">
                awesome-devops-cloud-ui
              </span>
              <motion.span
                className="absolute -inset-2 -z-10 bg-primary/5 blur-2xl rounded-full"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.span>
          </h1>
          <motion.p
            className="mx-auto max-w-3xl text-sm sm:text-base md:text-lg text-muted-foreground/90 leading-relaxed"
            variants={itemVariants}
          >
            A curated collection of DevOps & Cloud tools, beautifully organized
            and easily accessible. Discover the perfect tools to streamline your
            development workflow and boost your productivity.
          </motion.p>
        </motion.div>

        {/* Enhanced Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-8 sm:mt-12 flex flex-col items-center gap-6 sm:gap-8 w-full px-4 sm:px-0"
        >
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto min-w-0 sm:min-w-[180px] h-11 sm:h-12 text-sm sm:text-base font-medium relative overflow-hidden group"
                onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Explore Tools
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto min-w-0 sm:min-w-[180px] h-11 sm:h-12 text-sm sm:text-base font-medium group relative overflow-hidden"
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
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs sm:text-sm group relative overflow-hidden"
              asChild
            >
              <Link href="/docs" className="inline-flex items-center justify-center gap-2">
                <Code className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:rotate-12" />
                <span>Read Documentation</span>
                <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          {/* Enhanced Creator Link */}
          <motion.div
            className="mt-8 mb-4 flex flex-col items-center text-center max-w-full px-4"
            variants={itemVariants}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 w-full">
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                Created with{" "}
                <span className="inline-block animate-pulse">❤️</span> by
              </span>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://notharshhaa.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 hover:from-primary hover:to-primary/80 transition-colors duration-300 whitespace-nowrap"
              >
                H A R S H H A A
              </motion.a>
            </div>
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
