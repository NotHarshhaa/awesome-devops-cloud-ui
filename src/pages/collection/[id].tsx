"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeft, Eye, ExternalLink, FolderOpen, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collection, Resource } from "@/hooks/use-collections";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { fetchAndParseReadme } from "@/hooks/use-readme";
import Head from "next/head";
import Link from "next/link";
import { ItemGrid } from "@/components/item-grid";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface SharedCollectionPageProps {}

export default function SharedCollectionPage({}: SharedCollectionPageProps) {
  const router = useRouter();
  const { id } = router.query;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Attempt to load the shared collection from localStorage
  useEffect(() => {
    if (!id) return;

    // Get all collections from localStorage
    try {
      const collectionsData = localStorage.getItem("devops-resource-collections");
      if (!collectionsData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const allCollections: Collection[] = JSON.parse(collectionsData);

      // Find the collection with matching shareId
      const foundCollection = allCollections.find(
        (c) => c.shareId === id && c.isPublic
      );

      if (!foundCollection) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setCollection(foundCollection);

      // Fetch all resources to find the ones in this collection
      fetchAndParseReadme()
        .then((allResources) => {
          const collectionResources = allResources.filter((resource) =>
            foundCollection.items.includes(resource.id)
          );
          setResources(collectionResources);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching resources:", error);
          setLoading(false);
        });
    } catch (error) {
      console.error("Error loading collection:", error);
      setNotFound(true);
      setLoading(false);
    }
  }, [id]);

  const copyShareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Share link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-16 w-16 animate-pulse rounded-full bg-primary/20"></div>
          <h2 className="mt-6 text-xl font-semibold">Loading collection...</h2>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-6">
            <FolderOpen className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold">Collection Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            This collection doesn't exist or is no longer shared.
          </p>
          <Button asChild className="mt-8">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>
          {collection?.name
            ? `${collection.name} | Shared Collection`
            : "Shared Collection"}
        </title>
      </Head>

      <div className="container mx-auto max-w-6xl py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to resources
          </Link>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold md:text-3xl">
                  {collection?.name}
                </h1>
                <Badge variant="outline" className="ml-2">
                  <Eye className="mr-1 h-3 w-3" /> Shared Collection
                </Badge>
              </div>
              {collection?.description && (
                <p className="mt-2 text-muted-foreground">
                  {collection.description}
                </p>
              )}
              <div className="mt-2 text-sm text-muted-foreground">
                Last updated:{" "}
                {collection?.updatedAt
                  ? format(new Date(collection.updatedAt), "MMMM d, yyyy")
                  : "Unknown"}
              </div>
            </div>

            <Button
              variant="outline"
              className="gap-2 mt-4 sm:mt-0"
              onClick={copyShareLink}
            >
              <Share2 className="h-4 w-4" />
              Share Collection
            </Button>
          </div>
        </motion.div>

        {resources.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">
                This collection is empty
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The owner hasn't added any resources to this collection yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Resources ({resources.length})
              </h2>
            </div>

            <ItemGrid
              items={resources}
              bookmarkedItems={[]}
              onBookmark={() => {}}
              layoutType="grid"
            />
          </div>
        )}
      </div>
    </>
  );
}
