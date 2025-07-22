"use client";

import {
  ArrowRight,
  Github,
  Star,
  Code,
  Rocket,
  Terminal,
  Braces,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function SubmitCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hovered, setHovered] = useState(false);
  const [iconIndex, setIconIndex] = useState(0);

  const icons = [
    <Rocket key="rocket" className="h-5 w-5" />,
    <Code key="code" className="h-5 w-5" />,
    <Terminal key="terminal" className="h-5 w-5" />,
    <Braces key="braces" className="h-5 w-5" />,
  ];

  // Cycle through icons when button is hovered
  useEffect(() => {
    if (!hovered) return;

    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [hovered]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 15,
      },
    },
  };

  const floatingIconVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  };

  return (
    <Card className="relative w-full overflow-hidden border-border/40 bg-gradient-to-b from-background via-background/95 to-background/90 rounded-xl">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern-dark dark:bg-grid-pattern-light opacity-[0.03] dark:opacity-[0.04]" />
        <div className="absolute right-0 top-0 h-64 w-64 bg-primary/20 blur-[120px] rounded-full transform -translate-y-1/2 translate-x-1/4" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 bg-cyan-500/20 blur-[100px] rounded-full transform translate-y-1/2" />
        <div className="absolute left-0 top-1/4 h-40 w-40 bg-yellow-500/10 blur-[80px] rounded-full" />

        {/* Animated particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className={cn(
                "absolute rounded-full bg-primary/20 dark:bg-primary/30",
                i % 3 === 0
                  ? "h-2 w-2"
                  : i % 3 === 1
                    ? "h-3 w-3"
                    : "h-1.5 w-1.5",
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, Math.random() * -30 - 10, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      <CardContent className="p-6 sm:p-8 md:p-12 relative">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10"
        >
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left space-y-5 lg:space-y-6 max-w-2xl"
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div variants={floatingIconVariants} animate="animate">
                <Sparkles className="h-4 w-4 text-primary" />
              </motion.div>
              <span>Join Our Community</span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground bg-clip-text text-transparent pb-1"
            >
              Contribute to{" "}
              <span className="relative">
                <span className="bg-gradient-to-br from-primary via-primary/90 to-cyan-500 bg-clip-text">
                  awesome-devops-cloud-ui
                </span>
                <motion.div
                  className="absolute bottom-1 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 rounded-full"
                  initial={{ width: 0, left: "50%", opacity: 0 }}
                  animate={{ width: "100%", left: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-prose border-l-2 border-primary/20 pl-4"
            >
              Have an awesome DevOps or Cloud resource to share? Your
              contribution can help thousands of engineers discover valuable
              tools and resources. Submit your PR today and become part of our
              growing community!
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-3 pt-2"
            >
              {["Resource", "Tool", "Guide", "Platform", "Service"].map(
                (tag, i) => (
                  <motion.span
                    key={tag}
                    className="inline-block rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + i * 0.1 }}
                  >
                    {tag}
                  </motion.span>
                ),
              )}
            </motion.div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="w-full lg:w-auto flex flex-col items-center gap-6"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-cyan-500 rounded-lg blur-md opacity-60 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <Button
                asChild
                size="lg"
                className="w-full lg:w-auto text-base relative group overflow-hidden bg-background hover:bg-background/90 text-foreground border-0"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <a
                  href="https://github.com/NotHarshhaa/awesome-devops-cloud/blob/master/.github/pull_request_template.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 py-7 px-8 relative z-10"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={iconIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-center"
                    >
                      {hovered ? (
                        icons[iconIndex]
                      ) : (
                        <Github className="h-5 w-5" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <span className="font-semibold">Submit Your Resource</span>
                  <motion.div
                    animate={{ x: hovered ? 5 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0"
                    animate={{
                      x: hovered ? ["-100%", "100%"] : "-100%",
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: hovered ? Infinity : 0,
                      repeatDelay: 0.5,
                    }}
                  />
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <p className="text-sm text-muted-foreground">
                Join <span className="font-medium text-foreground">100+</span>{" "}
                contributors building the ultimate DevOps resource
              </p>
            </div>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
