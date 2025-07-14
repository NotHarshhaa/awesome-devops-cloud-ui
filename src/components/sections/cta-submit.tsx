"use client";

import { ArrowRight, Github, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export function SubmitCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
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
      },
    },
  };

  return (
    <Card className="relative w-full overflow-hidden border-border/40 bg-muted/5">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
        <div className="absolute right-0 top-0 h-32 w-32 bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 bg-primary/10 blur-3xl" />
      </div>

      <CardContent className="p-6 sm:p-8 md:p-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row items-center justify-between gap-8"
        >
          <motion.div
            variants={itemVariants}
            className="text-center lg:text-left space-y-4 lg:space-y-6 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-background/50 px-4 py-1.5 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-primary" />
              Join Our Community
            </div>
            
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              Contribute to awesome-devops-cloud-ui
            </motion.h2>
            
            <motion.p
              variants={itemVariants}
              className="text-sm sm:text-base text-muted-foreground/90 leading-relaxed max-w-prose"
            >
              Have an awesome devops-cloud-ui related project or resource? Share it
              with the community! Open a PR and help grow this curated list.
            </motion.p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="w-full lg:w-auto flex flex-col items-center gap-4"
          >
            <Button 
              asChild 
              size="lg" 
              className="w-full lg:w-auto text-base relative group overflow-hidden"
            >
              <a
                href="https://github.com/NotHarshhaa/awesome-devops-cloud/blob/master/.github/pull_request_template.md"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-6 px-8"
              >
                <Github className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-medium">Open a PR</span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </a>
            </Button>
            
            <p className="text-sm text-muted-foreground/80">
              Your contributions help make this resource better!
            </p>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
