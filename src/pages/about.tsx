"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Github,
  MessageCircle,
  Linkedin,
  Mail,
  Heart,
  Star,
  Code,
  Cloud,
  Database,
  Server,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const features = [
  {
    icon: <Cloud className="h-10 w-10 text-blue-500" />,
    title: "Cloud Tools Collection",
    description:
      "A comprehensive collection of the best cloud computing tools and resources for modern developers and DevOps engineers.",
  },
  {
    icon: <Code className="h-10 w-10 text-green-500" />,
    title: "Developer-Focused",
    description:
      "Everything is organized and presented with developers in mind, making it easy to find the right tools for your workflow.",
  },
  {
    icon: <Database className="h-10 w-10 text-purple-500" />,
    title: "Open Source",
    description:
      "Built with and for the community. Contributions are welcome to help make this resource even better.",
  },
  {
    icon: <Server className="h-10 w-10 text-orange-500" />,
    title: "DevOps Excellence",
    description:
      "Curated by DevOps professionals to ensure only the most useful and reliable tools are included.",
  },
];

const teamMembers = [
  {
    name: "H A R S H H A A",
    role: "Creator & Lead Developer",
    avatar: "/team/harshhaa.png",
    avatarFallback: "HA",
    bio: "Automation Expert and DevOps enthusiast with a passion for building tools that make DevOps and cloud computing more accessible.",
    github: "https://github.com/NotHarshhaa",
    telegram: "https://t.me/NotHarshhaa",
    linkedin: "https://linkedin.com/in/harshhaa-vardhan-reddy",
  },
  {
    name: "Community Contributors",
    role: "Open Source Heroes",
    avatar: "/team/community.png",
    avatarFallback: "CC",
    bio: "This project thrives thanks to our amazing community of contributors who help maintain and expand our collection of resources.",
    github:
      "https://github.com/NotHarshhaa/awesome-devops-cloud/graphs/contributors",
  },
];

export default function AboutPage() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <Badge
            variant="outline"
            className="mb-4 py-1.5 px-4 text-sm font-medium"
          >
            About Us
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Making DevOps & Cloud Resources Accessible
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            We're building the most comprehensive and user-friendly collection
            of DevOps and cloud computing resources. Our mission is to help
            developers navigate the complex world of cloud tools.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/collections">Explore Collections</Link>
            </Button>
            <Button
              variant="outline"
              asChild
              size="lg"
              className="rounded-full"
            >
              <a
                href="https://github.com/NotHarshhaa/awesome-devops-cloud"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                Star on GitHub
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={1}
          className="w-full max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-16 md:mb-24"
        >
          {[
            { label: "GitHub Stars", value: "1.2K+" },
            { label: "Tools & Resources", value: "500+" },
            { label: "Contributors", value: "40+" },
            { label: "Monthly Users", value: "10K+" },
          ].map((stat, index) => (
            <Card
              key={index}
              className="bg-gradient-to-br from-background to-background/40 backdrop-blur-sm border"
            >
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Our Mission Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={2}
          className="w-full max-w-5xl mx-auto mb-16 md:mb-24"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Our Mission
              </h2>
              <p className="text-muted-foreground mb-4">
                We started awesome-devops-cloud-ui with a simple goal: to create
                a beautiful, accessible collection of the best DevOps and cloud
                resources in one place.
              </p>
              <p className="text-muted-foreground mb-4">
                The world of cloud computing is vast and constantly evolving.
                For developers and DevOps engineers, finding the right tools can
                be overwhelming. We're here to help simplify that journey.
              </p>
              <p className="text-muted-foreground">
                By curating high-quality resources, organizing them intuitively,
                and presenting them in a modern UI, we aim to save you time and
                help you discover the perfect tools for your projects.
              </p>
            </div>
            <div className="order-1 md:order-2 flex justify-center">
              <div className="relative w-full max-w-md h-64 md:h-80 rounded-lg overflow-hidden border">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center p-6">
                    <Cloud className="h-16 w-16 mx-auto mb-4 text-foreground/80" />
                    <h3 className="text-xl font-semibold mb-2">
                      DevOps & Cloud
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Empowering developers with the best tools and resources
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={3}
          className="w-full max-w-5xl mx-auto mb-16 md:mb-24"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="backdrop-blur-sm border bg-background/50 hover:bg-background/80 transition-colors duration-300"
              >
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={4}
          className="w-full max-w-5xl mx-auto mb-16 md:mb-24"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
            Meet the Team
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={index}
                className="backdrop-blur-sm border bg-background/50"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <Avatar className="h-20 w-20 border-2 border-border">
                      {member.avatar && (
                        <AvatarImage
                          src={member.avatar}
                          alt={member.name}
                          className="object-cover"
                        />
                      )}
                      <AvatarFallback className="text-lg">
                        {member.avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl font-semibold">{member.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {member.role}
                      </p>
                      <p className="text-sm mb-4">{member.bio}</p>
                      {member.github && (
                        <div className="flex justify-center sm:justify-start gap-3">
                          <a
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Github className="h-5 w-5" />
                          </a>
                          {member.telegram && (
                            <a
                              href={member.telegram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <MessageCircle className="h-5 w-5" />
                            </a>
                          )}
                          {member.linkedin && (
                            <a
                              href={member.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <Linkedin className="h-5 w-5" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Get Involved Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={5}
          className="w-full max-w-4xl mx-auto text-center mb-16"
        >
          <Card className="border bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-xl overflow-hidden relative">
            <CardContent className="p-8 md:p-12">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
                Get Involved
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                We believe in the power of community. Whether you're a DevOps
                expert, cloud enthusiast, or just getting started, there are
                many ways to contribute and be a part of our journey.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild variant="outline" className="rounded-full">
                  <a
                    href="https://github.com/NotHarshhaa/awesome-devops-cloud"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Contribute on GitHub
                  </a>
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <a href="mailto:contact@awesome-devops-cloud.com">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact Us
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Testimonials or Made with Love section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={6}
          className="w-full max-w-3xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <span>by developers, for developers</span>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            <a
              href="https://github.com/NotHarshhaa/awesome-devops-cloud"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Star className="h-3.5 w-3.5 text-yellow-500" />
              <span>Star us on GitHub</span>
            </a>
          </div>
        </motion.div>
      </main>
    </>
  );
}
