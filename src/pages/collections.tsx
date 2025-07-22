"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Collection, Resource, useCollections } from "@/hooks/use-collections";
import { fetchAndParseReadme } from "@/hooks/use-readme";
import Head from "next/head";
import Link from "next/link";
import { CollectionsDialog } from "@/components/collections/collections-dialog";
import { motion } from "framer-motion";
import { ArrowLeft, BookMarked, ExternalLink, FolderOpen, FolderPlus, Loader2, Plus, Search } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { ItemGrid } from "@/components/item-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CollectionsPage() {
  const router = useRouter();
  const { collections } = useCollections();
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [collectionResources, setCollectionResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all resources
  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        const resources = await fetchAndParseReadme();
        setAllResources(resources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);

  // Filter collections based on search term
  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (collection.description && collection.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // When a collection is selected, filter resources to show only those in the collection
  useEffect(() => {
    if (selectedCollection && allResources.length > 0) {
      const resources = allResources.filter((resource) =>
        selectedCollection.items.includes(resource.id)
      );
      setCollectionResources(resources);
    } else {
      setCollectionResources([]);
    }
  }, [selectedCollection, allResources]);

  // Reset selected collection when going back to collections list
  const handleBackToList = () => {
    setSelectedCollection(null);
  };

  return (
    <>
      <Head>
        <title>My Collections | Awesome DevOps Cloud Resources</title>
      </Head>

      <div className="container mx-auto max-w-6xl py-8 px-4">
        <Link
          href="/"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all resources
        </Link>

        {selectedCollection ? (
          <CollectionDetail
            collection={selectedCollection}
            resources={collectionResources}
            onBack={handleBackToList}
          />
        ) : (
          <CollectionsList
            collections={filteredCollections}
            loading={loading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSelectCollection={setSelectedCollection}
          />
        )}
      </div>
    </>
  );
}

interface CollectionsListProps {
  collections: Collection[];
  loading: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSelectCollection: (collection: Collection) => void;
}

function CollectionsList({
  collections,
  loading,
  searchTerm,
  setSearchTerm,
  onSelectCollection
}: CollectionsListProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Collections</h1>
          <p className="text-muted-foreground mt-1">
            Organize and manage your saved resource collections
          </p>
        </div>

        <CollectionsDialog />
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search collections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading your collections...</p>
        </div>
      ) : collections.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <BookMarked className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-xl font-medium">No collections yet</h3>
            <p className="mt-2 text-muted-foreground max-w-md">
              Create collections to organize your favorite DevOps and cloud resources
            </p>
            <CollectionsDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              onClick={() => onSelectCollection(collection)}
            />
          ))}

          {/* Add new collection card */}
          <Card className="flex flex-col items-center justify-center border-dashed p-6 hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="flex flex-col items-center justify-center text-center p-6">
              <div className="rounded-full bg-primary/10 p-3 mb-4">
                <FolderPlus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">Create New Collection</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Organize your resources into custom collections
              </p>
            </CardContent>
            <CardFooter>
              <CollectionsDialog />
            </CardFooter>
          </Card>
        </div>
      )}
    </motion.div>
  );
}

interface CollectionCardProps {
  collection: Collection;
  onClick: () => void;
}

function CollectionCard({ collection, onClick }: CollectionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        className="h-full cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="truncate">{collection.name}</span>
            {collection.isPublic && (
              <Badge variant="outline" className="ml-2 shrink-0">Shared</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          {collection.description ? (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {collection.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground/60 italic">
              No description provided
            </p>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground flex justify-between mt-auto pt-3 border-t">
          <span>{collection.items.length} resources</span>
          <span>Updated {format(new Date(collection.updatedAt), "MMM d, yyyy")}</span>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

interface CollectionDetailProps {
  collection: Collection;
  resources: Resource[];
  onBack: () => void;
}

function CollectionDetail({ collection, resources, onBack }: CollectionDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to collections
          </Button>
          <h1 className="text-2xl font-bold md:text-3xl">{collection.name}</h1>
          {collection.description && (
            <p className="mt-2 text-muted-foreground">{collection.description}</p>
          )}
          <div className="mt-2 flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              {resources.length} resources
            </span>
            <span className="text-sm text-muted-foreground">
              Updated: {format(new Date(collection.updatedAt), "MMMM d, yyyy")}
            </span>
            {collection.isPublic && (
              <Badge variant="outline">Shared</Badge>
            )}
          </div>
        </div>

        <CollectionsDialog />
      </div>

      {resources.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">This collection is empty</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Add resources to this collection to see them here.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">
                <Plus className="mr-2 h-4 w-4" />
                Browse Resources
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ItemGrid
          items={resources}
          bookmarkedItems={[]} // You can integrate with bookmarks if needed
          onBookmark={() => {}} // Placeholder - implement if needed
          layoutType="grid"
        />
      )}
    </motion.div>
  );
}
