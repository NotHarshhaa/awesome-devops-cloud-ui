"use client";

import { motion } from "framer-motion";
import { ChevronDown, Github, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

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

const backgroundVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 1,
      ease: "easeOut",
    },
  },
};

export default function Hero() {
  const scrollToContent = () => {
    const element = document.getElementById("content");
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative isolate min-h-[85vh] w-full overflow-hidden bg-dot-pattern">
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0 -z-10"
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50" />
        
        {/* Dot pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Radial gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-60%,rgba(var(--primary-rgb),0.08),transparent_100%)]" />
        
        {/* Blur elements */}
        <div className="absolute left-[10%] top-[20%] h-48 w-48 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-[10%] top-[30%] h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
      </motion.div>

      <motion.div
        className="mx-auto flex h-full min-h-[85vh] max-w-5xl flex-col items-center justify-center px-6 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Stats Banner */}
        <motion.div
          variants={itemVariants}
          className="mb-12 flex items-center gap-6 rounded-full border bg-background/60 px-6 py-2.5 shadow-sm backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" aria-hidden="true" />
            <span className="text-sm font-medium">1.2k Stars on GitHub</span>
          </div>
          <div className="h-4 w-px bg-border/60" aria-hidden="true" />
          <span className="text-sm font-medium text-muted-foreground">100+ DevOps Tools</span>
        </motion.div>

        <motion.div variants={itemVariants} className="relative mb-8 group">
          <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity" />
          <img
            src="/logo.svg"
            alt="awesome-devops-cloud-ui logo"
            className="relative h-24 w-auto transition-all duration-300 md:h-28 group-hover:scale-105 group-hover:brightness-110"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="relative">
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                awesome-devops-cloud-ui
              </span>
              <span className="absolute -inset-1 bg-primary/5 blur-2xl rounded-full" />
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground/90 md:text-lg leading-relaxed">
            A curated collection of DevOps & Cloud tools, beautifully organized and easily accessible.
            Discover the perfect tools to streamline your development workflow.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-10 flex flex-col items-center gap-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              className="min-w-[160px] h-11 text-base font-medium relative overflow-hidden group"
              onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}
            >
              <span className="relative z-10">Explore Tools</span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="min-w-[160px] h-11 text-base font-medium group"
              asChild
            >
              <a
                href="https://github.com/NotHarshhaa/awesome-devops-cloud"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2"
              >
                <Github className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                View on GitHub
              </a>
            </Button>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href="https://notharshhaa.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative font-medium text-foreground/90 hover:text-foreground transition-colors"
            >
              Created by{" "}
              <span className="inline-flex items-center">
                H A R S H H A A
                <span className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </span>
            </a>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="absolute bottom-8 left-0 right-0 flex justify-center"
        initial="hidden"
        animate="visible"
      >
        <button
          className="group flex flex-col items-center gap-1 text-sm text-muted-foreground/80 transition-colors hover:text-foreground"
          onClick={scrollToContent}
        >
          <span className="font-medium">Scroll to explore</span>
          <ChevronDown className="h-4 w-4 animate-bounce transition-transform duration-300 group-hover:translate-y-0.5" />
        </button>
      </motion.div>
    </section>
  );
}
