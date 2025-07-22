"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";
import {
  ArrowRight,
  Book,
  Bookmark,
  ChevronRight,
  Code,
  FolderOpen,
  Github,
  Info,
  Layers,
  List,
  Search,
  Star,
  ThumbsUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => (
  <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
    <Card className="p-3 sm:p-6 h-full border border-border/60 bg-card/60 backdrop-blur-sm hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="mb-2 sm:mb-4 flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10">
        {icon}
      </div>
      <h3 className="mb-1 sm:mb-2 text-base sm:text-xl font-semibold tracking-tight">
        {title}
      </h3>
      <p className="text-xs sm:text-base text-muted-foreground">
        {description}
      </p>
    </Card>
  </motion.div>
);

interface CodeExampleProps {
  title: string;
  description: string;
  code: string;
  language?: string;
}

const CodeExample = ({
  title,
  description,
  code,
  language = "javascript",
}: CodeExampleProps) => (
  <motion.div variants={itemVariants} className="w-full">
    <div className="mb-2">
      <h3 className="text-sm sm:text-lg font-semibold">{title}</h3>
      <p className="text-[10px] sm:text-sm text-muted-foreground">{description}</p>
    </div>
    <div className="relative overflow-hidden rounded-lg border bg-muted/50 p-1 max-w-full">
      <div className="absolute right-2 top-2 flex space-x-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-5 w-5 sm:h-6 sm:w-6"
          onClick={() => {
            navigator.clipboard.writeText(code);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-copy"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          <span className="sr-only">Copy</span>
        </Button>
      </div>
      <pre className="overflow-x-auto p-2 sm:p-4 text-[10px] sm:text-sm whitespace-pre-wrap sm:whitespace-pre break-all sm:break-normal">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  </motion.div>
);

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const StepCard = ({ number, title, description, icon }: StepCardProps) => (
  <motion.div variants={itemVariants}>
    <div className="flex gap-2 sm:gap-4">
      <div className="flex-shrink-0">
        <div className="relative">
          <div className="flex h-8 w-8 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
          <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-primary text-[7px] sm:text-[10px] font-bold text-primary-foreground">
            {number}
          </span>
        </div>
      </div>
      <div>
        <h3 className="text-sm sm:text-lg font-semibold">{title}</h3>
        <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
);

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("getting-started");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Documentation - awesome-devops-cloud-ui</title>
        <meta
          name="description"
          content="Learn how to use awesome-devops-cloud-ui to discover and organize DevOps and cloud tools."
        />
      </Head>

      <div className="relative isolate overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(var(--primary-rgb),0.1),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(var(--primary-rgb),0.05),transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_800px_at_center,black,transparent)]" />
          <div className="absolute -left-80 top-0 h-[20rem] sm:h-[40rem] w-[70rem] rounded-full bg-primary/5 blur-3xl opacity-30 sm:opacity-50" />
          <div className="absolute right-0 bottom-0 h-[15rem] sm:h-[30rem] w-[60rem] rounded-full bg-primary/5 blur-3xl opacity-20 sm:opacity-30" />
        </div>

        {/* Header */}
        <div className="container px-4 py-10 md:py-24">
          <motion.div
            className="mx-auto max-w-3xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              duration: 0.6,
            }}
          >
            <div className="mb-4 sm:mb-6 inline-flex items-center rounded-full border border-primary/20 bg-background/60 px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-medium backdrop-blur-xl">
              <Book className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              Documentation
            </div>
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold tracking-tight md:text-5xl">
              Learn how to use{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent [text-shadow:0_4px_8px_rgba(0,0,0,0.1)]">
                awesome-devops-cloud-ui
              </span>
            </h1>
            <p className="mb-6 sm:mb-10 text-base sm:text-xl text-muted-foreground">
              Everything you need to know about our curated collection of DevOps
              & Cloud tools.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="group"
                onClick={() => setActiveTab("getting-started")}
              >
                Get Started
                <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Button variant="outline" size="lg" asChild className="group">
                <a
                  href="https://github.com/NotHarshhaa/awesome-devops-cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Main content */}
        <div className="container px-4 pb-24">
          <motion.div
            className="mx-auto max-w-6xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Tabs
              defaultValue="getting-started"
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              <TabsList className="mx-auto mb-6 sm:mb-8 grid w-full max-w-3xl grid-cols-2 gap-1 sm:gap-0 sm:grid-cols-4 p-1 h-auto sm:h-10 bg-muted/50">
                <TabsTrigger value="getting-started" className="text-[10px] sm:text-sm h-8 sm:h-auto">
                  <div className="flex items-center gap-1">
                    <Info className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Getting</span>{" "}
                    <span>Started</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="features" className="text-[10px] sm:text-sm h-8 sm:h-auto">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Features</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="usage" className="text-[10px] sm:text-sm h-8 sm:h-auto">
                  <div className="flex items-center gap-1">
                    <Layers className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>Usage</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger value="faq" className="text-[10px] sm:text-sm h-8 sm:h-auto">
                  <div className="flex items-center gap-1">
                    <List className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>FAQ</span>
                  </div>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="getting-started" className="space-y-12">
                <motion.div variants={itemVariants}>
                  <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold tracking-tight">
                    Welcome to awesome-devops-cloud-ui
                  </h2>
                  <p className="mb-3 sm:mb-4 text-sm sm:text-lg text-muted-foreground">
                    awesome-devops-cloud-ui is a beautiful and interactive UI
                    for browsing and organizing a curated collection of DevOps
                    and Cloud tools. This documentation will help you get
                    started and make the most out of our platform.
                  </p>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="relative overflow-hidden rounded-xl border bg-card/60 p-4 sm:p-6 backdrop-blur-sm">
                    <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                    <div className="absolute -left-6 -bottom-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
                    <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold">
                      Quick Start Guide
                    </h3>
                    <div className="space-y-4 sm:space-y-6">
                      <StepCard
                        number={1}
                        title="Browse the Collection"
                        description="Explore our comprehensive collection of DevOps and Cloud tools organized by categories."
                        icon={<Search className="h-5 w-5" />}
                      />
                      <StepCard
                        number={2}
                        title="Create Collections"
                        description="Organize tools into personal collections for easy access later."
                        icon={<FolderOpen className="h-5 w-5" />}
                      />
                      <StepCard
                        number={3}
                        title="Bookmark Favorites"
                        description="Save individual tools as favorites for quick reference."
                        icon={<Bookmark className="h-5 w-5" />}
                      />
                      <StepCard
                        number={4}
                        title="Contribute"
                        description="Help improve the collection by contributing through GitHub."
                        icon={<Github className="h-5 w-5" />}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="flex justify-center mt-4 sm:mt-8">
                      <Button
                        onClick={() => setActiveTab("faq")}
                        className="group"
                        size="sm"
                      >
                        View FAQ
                        <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div> 
              </TabsContent>

              <TabsContent value="features" className="space-y-12">
                <motion.div variants={itemVariants}>
                  <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold tracking-tight">
                    Key Features
                  </h2>
                  <p className="mb-5 sm:mb-8 text-sm sm:text-lg text-muted-foreground">
                    awesome-devops-cloud-ui comes packed with features to help
                    you discover, organize, and access the best DevOps and Cloud
                    tools.
                  </p>

                  <div className="grid gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <FeatureCard
                      icon={<Search className="h-6 w-6 text-primary" />}
                      title="Advanced Search"
                      description="Quickly find tools with our powerful search and filtering system."
                    />
                    <FeatureCard
                      icon={<FolderOpen className="h-6 w-6 text-primary" />}
                      title="Custom Collections"
                      description="Create and manage personal collections of tools for different projects."
                    />
                    <FeatureCard
                      icon={<Star className="h-6 w-6 text-primary" />}
                      title="Favorites"
                      description="Bookmark your most-used tools for quick access."
                    />
                    <FeatureCard
                      icon={<ThumbsUp className="h-6 w-6 text-primary" />}
                      title="Curated Selection"
                      description="All tools are hand-picked and verified for quality and usefulness."
                    />
                    <FeatureCard
                      icon={<Zap className="h-6 w-6 text-primary" />}
                      title="Performance"
                      description="Lightning-fast interface with smooth animations and transitions."
                    />
                    <FeatureCard
                      icon={<Code className="h-6 w-6 text-primary" />}
                      title="Open Source"
                      description="Fully open-source and community-driven development."
                    />
                  </div>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <div className="flex justify-center">
                    <Button
                      onClick={() => setActiveTab("usage")}
                      className="group px-3 py-1.5 h-8 text-xs sm:px-4 sm:py-2 sm:h-10 sm:text-sm"
                      size="sm"
                    >
                      Learn Usage
                      <ArrowRight className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="usage" className="space-y-6 sm:space-y-12">
                <motion.div variants={itemVariants} className="text-center">
                  <h2 className="mb-3 sm:mb-6 text-2xl sm:text-3xl font-bold tracking-tight">
                    Using awesome-devops-cloud-ui
                  </h2>
                  <p className="mb-4 sm:mb-8 text-xs sm:text-lg text-muted-foreground mx-auto max-w-2xl">
                    Learn how to make the most of our platform with these
                    detailed usage instructions.
                  </p>
                </motion.div>

                <div className="grid gap-3 sm:gap-12">
                  {/* Searching for Tools */}
                  <motion.div variants={itemVariants}>
                    <div className="rounded-xl border border-border/60 bg-card/60 p-3 sm:p-6 backdrop-blur-sm">
                      <h3 className="mb-2 sm:mb-4 text-lg sm:text-2xl font-semibold">
                        Searching for Tools
                      </h3>
                      <div className="space-y-2 sm:space-y-4">
                        <p className="text-[10px] sm:text-base text-muted-foreground">
                          Use our powerful search functionality to find the
                          exact tools you need:
                        </p>
                        <ul className="ml-3 sm:ml-6 space-y-1 sm:space-y-2 list-disc text-[10px] sm:text-sm text-muted-foreground">
                          <li>
                            Use the search bar at the top of the homepage to
                            search by tool name or description
                          </li>
                          <li>
                            Filter results by category, popularity, or date
                            added
                          </li>
                          <li>
                            Use tags to narrow down your search to specific tool
                            types
                          </li>
                        </ul>
                        <div className="mt-2 sm:mt-4 rounded-lg border bg-muted/50 p-2 sm:p-4">
                          <h4 className="mb-0.5 sm:mb-2 text-xs sm:text-base font-medium">
                            Pro Tip
                          </h4>
                          <p className="text-[10px] sm:text-sm text-muted-foreground">
                            Combine multiple filters to find exactly what you're
                            looking for. For example, search for "monitoring"
                            while filtering for "open source" tools in the
                            "Kubernetes" category.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Creating Collections */}
                  <motion.div variants={itemVariants}>
                    <div className="rounded-xl border border-border/60 bg-card/60 p-3 sm:p-6 backdrop-blur-sm">
                      <h3 className="mb-2 sm:mb-4 text-lg sm:text-2xl font-semibold">
                        Creating Collections
                      </h3>
                      <div className="space-y-2 sm:space-y-4">
                        <p className="text-[10px] sm:text-base text-muted-foreground">
                          Organize tools into personal collections for easier
                          access:
                        </p>
                        <ol className="ml-3 sm:ml-6 space-y-1 sm:space-y-2 list-decimal text-[10px] sm:text-sm text-muted-foreground">
                          <li>
                            Click on the "Collections" button in the header to
                            view your existing collections
                          </li>
                          <li>
                            Click "Create New Collection" and give it a name and
                            optional description
                          </li>
                          <li>
                            While browsing tools, click the "Add to Collection"
                            button on any tool card
                          </li>
                          <li>Select which collection(s) to add the tool to</li>
                        </ol>

                        <div className="w-full max-w-full overflow-x-auto -mx-3 px-3 py-1 sm:mx-0 sm:px-0 sm:py-0">
                          <div className="min-w-0 w-full">
                            <CodeExample
                              title="Collections API"
                              description="For developers: You can also interact with collections programmatically"
                              code={`// Example of using collections hook
import { useCollections } from '@/hooks/use-collections';

const MyComponent = () => {
  const {
    collections,
    createCollection,
    addToCollection
  } = useCollections();

  // Create collection
  const handleCreate = () => {
    createCollection({
      name: 'My DevOps Tools',
      description: 'Essential tools'
    });
  };

  // Add tool to collection
  const handleAddTool = (toolId, collId) => {
    addToCollection(toolId, collId);
  };

  return (
    // Your component JSX
  );
};`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Bookmarking Favorites */}
                  <motion.div variants={itemVariants}>
                    <div className="rounded-xl border border-border/60 bg-card/60 p-3 sm:p-6 backdrop-blur-sm">
                      <h3 className="mb-2 sm:mb-4 text-lg sm:text-2xl font-semibold">
                        Bookmarking Favorites
                      </h3>
                      <div className="space-y-2 sm:space-y-4">
                        <p className="text-[10px] sm:text-base text-muted-foreground">
                          Quickly save and access your favorite tools:
                        </p>
                        <ul className="ml-3 sm:ml-6 space-y-1 sm:space-y-2 list-disc text-[10px] sm:text-sm text-muted-foreground">
                          <li>
                            Click the bookmark icon on any tool card to add it
                            to your favorites
                          </li>
                          <li>
                            Access all your bookmarked tools by clicking on
                            "Bookmarks" in the user menu
                          </li>
                          <li>
                            Sort and filter your bookmarks just like the main
                            tool collection
                          </li>
                        </ul>
                        <div className="mt-2 sm:mt-4 rounded-lg border bg-muted/50 p-2 sm:p-4">
                          <h4 className="mb-0.5 sm:mb-2 text-xs sm:text-base font-medium">
                            Note
                          </h4>
                          <p className="text-[10px] sm:text-sm text-muted-foreground">
                            Bookmarks are stored in your browser's local
                            storage. They will persist between sessions on the
                            same device, but won't sync across devices.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                <motion.div variants={itemVariants}>
                  <div className="flex justify-center mt-4">
                    <Button
                      onClick={() => setActiveTab("faq")}
                      className="group"
                      size="sm"
                    >
                      View FAQ
                      <ArrowRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="faq" className="space-y-12">
                <motion.div variants={itemVariants}>
                  <h2 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-bold tracking-tight">
                    Frequently Asked Questions
                  </h2>
                  <p className="mb-5 sm:mb-8 text-sm sm:text-lg text-muted-foreground">
                    Find answers to common questions about
                    awesome-devops-cloud-ui.
                  </p>

                  <div className="space-y-3 sm:space-y-6">
                    <div className="rounded-lg border bg-card/60 p-4 sm:p-6 backdrop-blur-sm">
                      <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-semibold">
                        What is awesome-devops-cloud-ui?
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        awesome-devops-cloud-ui is a beautiful interface for
                        browsing and organizing a curated collection of DevOps
                        and Cloud tools. It helps you discover, save, and access
                        the best tools for your development workflow.
                      </p>
                    </div>

                    <div className="rounded-lg border bg-card/60 p-4 sm:p-6 backdrop-blur-sm">
                      <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-semibold">
                        How do I suggest a new tool to be added?
                      </h3>
                      <p className="text-[10px] sm:text-sm text-muted-foreground">
                        You can contribute by submitting a pull request to our{" "}
                        <a
                          href="https://github.com/NotHarshhaa/awesome-devops-cloud"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          GitHub repository
                        </a>
                        . Please follow the contribution guidelines in the
                        README.
                      </p>
                    </div>

                    <div className="rounded-lg border bg-card/60 p-4 sm:p-6 backdrop-blur-sm">
                      <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-semibold">
                        Are my collections saved between sessions?
                      </h3>
                      <p className="text-[10px] sm:text-sm text-muted-foreground">
                        Yes, your collections are saved in your browser's local
                        storage. They will persist between sessions on the same
                        device, but won't sync across different devices.
                      </p>
                    </div>

                    <div className="rounded-lg border bg-card/60 p-4 sm:p-6 backdrop-blur-sm">
                      <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-semibold">
                        Can I export my collections?
                      </h3>
                      <p className="text-[10px] sm:text-sm text-muted-foreground">
                        Currently, we don't have a built-in export feature, but
                        we're working on adding this functionality in a future
                        update.
                      </p>
                    </div>

                    <div className="rounded-lg border bg-card/60 p-4 sm:p-6 backdrop-blur-sm">
                      <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-semibold">
                        How are tools selected for inclusion?
                      </h3>
                      <p className="text-[10px] sm:text-sm text-muted-foreground">
                        Each tool is carefully reviewed for quality, usefulness,
                        and relevance to DevOps and Cloud workflows. We
                        prioritize actively maintained tools with good
                        documentation and community support.
                      </p>
                    </div>

                    <div className="rounded-lg border bg-card/60 p-4 sm:p-6 backdrop-blur-sm">
                      <h3 className="mb-1 sm:mb-2 text-lg sm:text-xl font-semibold">
                        Is this project open source?
                      </h3>
                      <p className="text-[10px] sm:text-sm text-muted-foreground">
                        Yes! The entire project is open source under the MIT
                        license. You can find the source code on{" "}
                        <a
                          href="https://github.com/NotHarshhaa/awesome-devops-cloud"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          GitHub
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="mx-auto max-w-3xl rounded-xl border bg-card/60 p-5 sm:p-8 text-center backdrop-blur-sm"
                >
                  <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-semibold">
                    Still have questions?
                  </h3>
                  <p className="mb-4 sm:mb-6 text-[10px] sm:text-sm text-muted-foreground">
                    If you couldn't find the answer you were looking for, feel
                    free to reach out or check our GitHub repository.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button variant="outline" asChild className="group">
                      <a
                        href="https://github.com/NotHarshhaa/awesome-devops-cloud/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Github className="mr-2 h-4 w-4" />
                        Open an Issue
                      </a>
                    </Button>
                    <Button asChild className="group">
                      <Link href="/">
                        Return to Home
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </>
  );
}
