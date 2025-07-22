"use client";

import { Resource, fetchAndParseReadme } from "@/hooks/use-readme";
import { isValid, parseISO } from "date-fns";
import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";

import { SubmitCTA } from "@/components/sections/cta-submit";
import Hero from "@/components/sections/hero";
import ItemList from "@/components/sections/items-list";
import { motion } from "framer-motion";

interface Category {
  title: string;
  items: Resource[];
}

const EXCLUDED_CATEGORIES = ["Star History", "Contributors"];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredItems, setFilteredItems] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedResources = await fetchAndParseReadme();

      if (fetchedResources.length === 0) {
        setError("No resources found. Please try again later.");
        return;
      }

      // Process categories
      const groupedCategories = fetchedResources.reduce(
        (acc, resource) => {
          if (!EXCLUDED_CATEGORIES.includes(resource.category)) {
            if (!acc[resource.category]) {
              acc[resource.category] = [];
            }
            acc[resource.category].push(resource);
          }
          return acc;
        },
        {} as Record<string, Resource[]>,
      );

      const formattedCategories = Object.entries(groupedCategories).map(
        ([title, items]) => ({
          title,
          items,
        }),
      );

      // Filter out excluded categories
      const eligibleItems = fetchedResources.filter(
        (item) => !EXCLUDED_CATEGORIES.includes(item.category),
      );

      // Sort items by date (newest first) initially
      const sortedItems = eligibleItems.sort((a, b) => {
        const dateA =
          a.date && a.date !== "Unknown" ? parseISO(a.date) : new Date(0);
        const dateB =
          b.date && b.date !== "Unknown" ? parseISO(b.date) : new Date(0);

        if (!isValid(dateA)) return 1;
        if (!isValid(dateB)) return -1;

        return dateB.getTime() - dateA.getTime();
      });

      setCategories(formattedCategories);
      setFilteredItems(sortedItems);
    } catch (error) {
      console.error("Error fetching README:", error);
      setError("Failed to load resources. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
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
        stiffness: 300,
        damping: 25,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">
            Loading DevOps & Cloud Resources
          </h2>
          <p className="text-muted-foreground max-w-md">
            We're fetching the latest curated resources for your DevOps and
            Cloud journey...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8 flex flex-col items-center justify-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-10 w-10 text-red-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Error Loading Resources</h2>
          <p className="text-muted-foreground">{error}</p>
          <button
            onClick={fetchData}
            className="mt-4 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="container mx-auto max-w-7xl px-4 py-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Hero />
      </motion.div>

      <motion.div variants={itemVariants} className="my-12">
        <ItemList items={filteredItems} categories={categories} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <SubmitCTA />
      </motion.div>
    </motion.div>
  );
}
