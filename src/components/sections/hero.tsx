"use client";

import { motion } from "framer-motion";
import { ChevronDown, Github, Star } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const backgroundVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
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
    <section className="relative isolate min-h-[75vh] w-full overflow-hidden">
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0 -z-10"
        variants={backgroundVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      </motion.div>

      <motion.div
        className="mx-auto flex h-full min-h-[75vh] max-w-5xl flex-col items-center justify-center px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Stats Banner */}
        <motion.div
          variants={itemVariants}
          className="mb-10 flex items-center gap-6 rounded-full border bg-background/50 px-6 py-2 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm">1.2k Stars on GitHub</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <span className="text-sm text-muted-foreground">100+ DevOps Tools</span>
        </motion.div>

        <motion.div variants={itemVariants} className="mb-6 group">
          <img
            src="/logo.svg"
            alt="awesome-devops-cloud-ui logo"
            className="h-20 w-auto transition-transform duration-300 md:h-24 group-hover:scale-105"
          />
        </motion.div>

        <motion.div variants={itemVariants} className="text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-primary/70 to-primary bg-clip-text text-transparent">
              awesome-devops-cloud-ui
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground md:text-lg">
            A curated collection of DevOps & Cloud tools, beautifully organized and easily accessible.
            Discover the perfect tools to streamline your development workflow.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-8 flex flex-col items-center gap-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="#explore"
              className="group relative inline-flex min-w-[140px] items-center justify-center overflow-hidden rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 md:text-base"
            >
              Explore Tools
            </a>
            <a
              href="https://github.com/NotHarshhaa/awesome-devops-cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-lg border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground md:text-base"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <a
              href="https://notharshhaa.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative font-medium text-foreground"
            >
              Created by{" "}
              <span className="inline-flex items-center">
                H A R S H H A A
                <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-foreground transition-transform duration-200 ease-out group-hover:scale-x-100"></span>
              </span>
            </a>
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <motion.button
          variants={itemVariants}
          className="flex flex-col items-center text-sm text-muted-foreground transition-colors hover:text-foreground"
          onClick={scrollToContent}
        >
          <span>Scroll to explore</span>
          <ChevronDown className="mt-1 h-4 w-4 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
