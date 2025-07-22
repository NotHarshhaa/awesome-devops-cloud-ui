"use client";

import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Clock,
  Eye,
  ExternalLink,
  FolderOpen,
  Lock,
  Share2,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collection, Resource } from "@/hooks/use-collections";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { fetchAndParseReadme } from "@/hooks/use-readme";
import Head from "next/head";
import Link from "next/link";
import { ItemGrid } from "@/components/item-grid";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SharedCollectionPageProps {}

export default function SharedCollectionPage({}: SharedCollectionPageProps) {
  const router = useRouter();
  const { id } = router.query;
  const [collection, setCollection] = useState<Collection | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [expiryTime, setExpiryTime] = useState<Date | null>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Attempt to load the shared collection from localStorage
  useEffect(() => {
    if (!id) return;

    // Get all collections from localStorage
    try {
      const collectionsData = localStorage.getItem(
        "devops-resource-collections",
      );
      if (!collectionsData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const allCollections: Collection[] = JSON.parse(collectionsData);

      // Find the collection with matching shareId
      const foundCollection = allCollections.find(
        (c) => c.shareId === id && c.isPublic,
      );

      if (!foundCollection) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Check if collection has expired
      if (
        foundCollection.shareExpiry &&
        foundCollection.shareExpiry < Date.now()
      ) {
        setIsExpired(true);
        setCollection(foundCollection);
        setLoading(false);
        return;
      }

      // Check if collection is password protected
      if (foundCollection.sharePassword) {
        setIsPasswordProtected(true);
        // Don't load resources until password is verified
        setCollection(foundCollection);
        setLoading(false);

        // Check if there's a password in URL parameters that we can verify
        const urlParams = new URLSearchParams(window.location.search);
        const urlPassword = urlParams.get("pw");
        if (urlPassword && urlPassword === foundCollection.sharePassword) {
          setIsPasswordVerified(true);
          loadResources(foundCollection);
        }

        return;
      }

      // Set expiry time for display if it exists
      if (foundCollection.shareExpiry) {
        setExpiryTime(new Date(foundCollection.shareExpiry));
      }

      setCollection(foundCollection);

      // Fetch all resources to find the ones in this collection
      loadResources(foundCollection);
    } catch (error) {
      console.error("Error loading collection:", error);
      setNotFound(true);
      setLoading(false);
    }
  }, [id]);

  // Function to load resources for a collection
  const loadResources = (collection: Collection) => {
    fetchAndParseReadme()
      .then((allResources) => {
        const collectionResources = allResources.filter((resource) =>
          collection.items.includes(resource.id),
        );
        setResources(collectionResources);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching resources:", error);
        setLoading(false);
      });
  };

  const copyShareLink = () => {
    // Create a URL with password parameter if verified
    let url = window.location.href;
    if (isPasswordVerified && collection?.sharePassword) {
      // Add password to URL for easy sharing
      const urlObj = new URL(window.location.href);
      urlObj.searchParams.set("pw", collection.sharePassword);
      url = urlObj.toString();
    }
    navigator.clipboard.writeText(url);
    toast.success("Share link copied to clipboard!");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!collection?.sharePassword) return;

    if (password === collection.sharePassword) {
      setIsPasswordVerified(true);
      setPasswordError(false);

      // Load resources after password verification
      loadResources(collection);

      // Update URL to include password for easy resharing
      const urlObj = new URL(window.location.href);
      urlObj.searchParams.set("pw", password);
      window.history.replaceState({}, "", urlObj.toString());

      toast.success("Password verified successfully");
    } else {
      setPasswordError(true);
      setPassword("");
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }
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

  if (isExpired && collection) {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-amber-100 dark:bg-amber-900/30 p-6">
            <Clock className="h-12 w-12 text-amber-600 dark:text-amber-500" />
          </div>
          <h2 className="mt-6 text-2xl font-semibold">
            Collection Link Expired
          </h2>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            This shared collection link has expired and is no longer accessible.
            Please contact the owner for a new link.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            Collection:{" "}
            <span className="font-medium text-foreground">
              {collection.name}
            </span>
          </div>
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

  if (isPasswordProtected && !isPasswordVerified && collection) {
    return (
      <div className="container mx-auto max-w-md py-12 px-4">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to resources
        </Link>

        <Card className="border-2 border-primary/20">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center w-full mb-4">
              <div className="rounded-full bg-primary/10 p-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-center">
              Password Protected
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              This collection is protected. Enter the password to view its
              contents.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  ref={passwordInputRef}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter collection password"
                  className={passwordError ? "border-red-500" : ""}
                  autoFocus
                />
                {passwordError && (
                  <p className="text-sm text-red-500">
                    Incorrect password. Please try again.
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full">
                Unlock Collection
              </Button>
            </form>
          </CardContent>
          <CardFooter className="border-t bg-muted/40 px-6 py-4">
            <div className="flex items-start text-xs text-muted-foreground">
              <AlertTriangle className="mr-2 h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                Collection:{" "}
                <span className="font-medium">{collection.name}</span>
                {expiryTime && (
                  <span className="block mt-1">
                    This link expires{" "}
                    {formatDistanceToNow(expiryTime, { addSuffix: true })}
                  </span>
                )}
              </span>
            </div>
          </CardFooter>
        </Card>
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
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="ml-2">
                    <Eye className="mr-1 h-3 w-3" /> Shared Collection
                  </Badge>
                  {isPasswordVerified && (
                    <Badge
                      variant="outline"
                      className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800"
                    >
                      <Unlock className="mr-1 h-3 w-3" /> Unlocked
                    </Badge>
                  )}
                  {expiryTime && (
                    <Badge
                      variant="outline"
                      className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800"
                    >
                      <Clock className="mr-1 h-3 w-3" /> Expires{" "}
                      {format(expiryTime, "MMM d, yyyy")}
                    </Badge>
                  )}
                </div>
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

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                className="gap-2 mt-4 sm:mt-0"
                onClick={copyShareLink}
              >
                <Share2 className="h-4 w-4" />
                {isPasswordVerified
                  ? "Share With Password"
                  : "Share Collection"}
              </Button>
              {collection?.shareExpiry && (
                <div className="inline-flex items-center px-2 py-1 mt-4 sm:mt-0 rounded-md text-xs text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40">
                  <Clock className="h-3 w-3 mr-1" />
                  Expires in{" "}
                  {formatDistanceToNow(new Date(collection.shareExpiry))}
                </div>
              )}
            </div>
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
