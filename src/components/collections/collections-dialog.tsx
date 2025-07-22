"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Collection,
  Resource,
  useCollections,
} from "@/hooks/use-collections";
import {
  BookMarked,
  Calendar,
  ChevronRight,
  FolderPlus,
  Link,
  MoreHorizontal,
  Plus,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CollectionsDialogProps {
  resourceId?: number;
  resource?: Resource;
  variant?: "default" | "add";
}

export function CollectionsDialog({
  resourceId,
  resource,
  variant = "default",
}: CollectionsDialogProps) {
  const [open, setOpen] = useState(false);
  const [newCollectionOpen, setNewCollectionOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const shareInputRef = useRef<HTMLInputElement>(null);

  const {
    collections,
    addCollection,
    removeCollection,
    addToCollection,
    removeFromCollection,
    makeCollectionPublic,
    makeCollectionPrivate,
    getShareableLink,
    isInCollection,
  } = useCollections();

  // Handle creating a new collection
  const handleCreateCollection = () => {
    if (!name.trim()) {
      toast.error("Please enter a collection name");
      return;
    }

    const id = addCollection(name.trim(), description.trim());

    // If we're adding a resource directly to this new collection
    if (resourceId !== undefined) {
      addToCollection(id, resourceId);
    }

    setName("");
    setDescription("");
    setNewCollectionOpen(false);
  };

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setNewCollectionOpen(false);
      setName("");
      setDescription("");
      setShareOpen(false);
      setShareUrl(null);
    }
  }, [open]);

  // Copy share URL to clipboard
  const copyShareUrl = () => {
    if (shareUrl && shareInputRef.current) {
      shareInputRef.current.select();
      navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    }
  };

  // Handle collection sharing
  const handleShareCollection = (collectionId: string) => {
    // If it's already public, just get the link
    let link = getShareableLink(collectionId);

    if (!link) {
      // Make it public and get a new link
      const shareId = makeCollectionPublic(collectionId);
      link = getShareableLink(collectionId);
    }

    setShareUrl(link);
    setShareOpen(true);
  };

  // Manage adding/removing resource from collection
  const toggleResourceInCollection = (collectionId: string) => {
    if (resourceId === undefined) return;

    if (isInCollection(collectionId, resourceId)) {
      removeFromCollection(collectionId, resourceId);
    } else {
      addToCollection(collectionId, resourceId);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {variant === "add" ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 text-xs"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            Add to Collection
          </Button>
        ) : (
          <Button variant="outline" className="gap-2">
            <BookMarked className="h-4 w-4" />
            My Collections
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>
            {resourceId !== undefined
              ? "Add to Collection"
              : "Manage Collections"}
          </DialogTitle>
          <DialogDescription>
            {resourceId !== undefined
              ? "Save this resource to one of your collections."
              : "Create and manage your resource collections."}
          </DialogDescription>
        </DialogHeader>

        {/* New Collection Form */}
        <AnimatePresence>
          {newCollectionOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-2 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Create New Collection</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => setNewCollectionOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Input
                    placeholder="Collection name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-24 resize-none"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setNewCollectionOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateCollection}
                  >
                    Create Collection
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Share Collection UI */}
        <AnimatePresence>
          {shareOpen && shareUrl && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Share Collection</h3>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => setShareOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    ref={shareInputRef}
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={copyShareUrl}
                    className="shrink-0"
                  >
                    Copy
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Anyone with this link can view this collection, but they won't
                  be able to modify it.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collections List */}
        <div
          className={`max-h-[300px] overflow-y-auto ${
            newCollectionOpen || shareOpen ? "opacity-50" : ""
          }`}
        >
          {collections.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BookMarked className="h-10 w-10 text-muted-foreground/50" />
              <h3 className="mt-4 text-sm font-medium">
                No collections yet
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Create your first collection to organize resources.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {collections.map((collection) => (
                <CollectionItem
                  key={collection.id}
                  collection={collection}
                  resourceId={resourceId}
                  isInCollection={
                    resourceId !== undefined
                      ? isInCollection(collection.id, resourceId)
                      : false
                  }
                  onToggleResource={() =>
                    toggleResourceInCollection(collection.id)
                  }
                  onRemove={() => removeCollection(collection.id)}
                  onShare={() => handleShareCollection(collection.id)}
                />
              ))}
            </ul>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          {!newCollectionOpen && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewCollectionOpen(true)}
              className="mt-3 gap-2 sm:mt-0"
            >
              <Plus className="h-4 w-4" />
              New Collection
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
          >
            {resourceId ? "Done" : "Close"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface CollectionItemProps {
  collection: Collection;
  resourceId?: number;
  isInCollection: boolean;
  onToggleResource: () => void;
  onRemove: () => void;
  onShare: () => void;
}

function CollectionItem({
  collection,
  resourceId,
  isInCollection,
  onToggleResource,
  onRemove,
  onShare,
}: CollectionItemProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="group relative rounded-md border border-border/50 bg-card p-3 shadow-sm transition-all hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h4 className="font-medium leading-none tracking-tight">
              {collection.name}
            </h4>
            <div className="flex items-center">
              {resourceId !== undefined && (
                <TooltipProvider delayDuration={300}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={isInCollection ? "default" : "outline"}
                        size="sm"
                        className={`ml-2 h-7 px-2 text-xs ${
                          isInCollection ? "bg-green-600 hover:bg-green-700" : ""
                        }`}
                        onClick={onToggleResource}
                      >
                        {isInCollection ? "Added" : "Add"}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {isInCollection
                        ? "Remove from collection"
                        : "Add to collection"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {/* Collection actions menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="ml-1 h-7 w-7 text-muted-foreground"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onShare} className="cursor-pointer">
                    <Share2 className="mr-2 h-4 w-4" />
                    <span>Share Collection</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onRemove}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Collection</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {collection.description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
              {collection.description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="mr-1 h-3 w-3" />
              <span>
                {format(new Date(collection.updatedAt), "MMM d, yyyy")}
              </span>
            </div>

            {collection.isPublic && (
              <Badge variant="outline" className="px-1 py-0 text-[10px]">
                <Link className="mr-1 h-2.5 w-2.5" />
                Shared
              </Badge>
            )}

            <Badge
              variant="secondary"
              className="ml-auto h-5 px-1.5 py-0 text-[10px]"
            >
              {collection.items.length} items
            </Badge>
          </div>
        </div>
      </div>
    </motion.li>
  );
}
