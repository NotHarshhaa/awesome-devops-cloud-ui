// src/components/multi-select.tsx

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  CheckIcon,
  XCircle,
  ChevronDown,
  XIcon,
  Search,
  Filter,
  Tag,
  Tags,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const multiSelectVariants = cva(
  "m-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300",
  {
    variants: {
      variant: {
        default:
          "border-foreground/10 text-foreground bg-card hover:bg-card/80",
        secondary:
          "border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        inverted: "inverted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Optional icon component to display alongside the option. */
    icon?: React.ComponentType<{ className?: string }>;
    description?: string;
    group?: string;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * Animation duration in seconds for the visual effects (e.g., bouncing badges).
   * Optional, defaults to 0 (no animation).
   */
  animation?: number;

  /**
   * Maximum number of items to display. Extra selected items will be summarized.
   * Optional, defaults to 3.
   */
  maxCount?: number;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * If true, renders the multi-select component as a child of another component.
   * Optional, defaults to false.
   */
  asChild?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  showSelectAll?: boolean;
  showSearch?: boolean;
  showGroups?: boolean;
  showCount?: boolean;
  showClearAll?: boolean;
  showRecentlyUsed?: boolean;
  maxRecentItems?: number;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      variant,
      defaultValue = [],
      placeholder = "Select options",
      animation = 0,
      maxCount = 3,
      modalPopover = false,
      asChild = false,
      className,
      showSelectAll = true,
      showSearch = true,
      showGroups = true,
      showCount = true,
      showClearAll = true,
      showRecentlyUsed = true,
      maxRecentItems = 5,
      ...props
    },
    ref,
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [recentlyUsed, setRecentlyUsed] = React.useState<string[]>([]);

    React.useEffect(() => {
      const stored = localStorage.getItem("multiselect-recent");
      if (stored) {
        setRecentlyUsed(JSON.parse(stored));
      }
    }, []);

    const updateRecentlyUsed = (value: string) => {
      if (!showRecentlyUsed) return;
      
      const newRecent = [
        value,
        ...recentlyUsed.filter((v) => v !== value),
      ].slice(0, maxRecentItems);
      
      setRecentlyUsed(newRecent);
      localStorage.setItem("multiselect-recent", JSON.stringify(newRecent));
    };

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (event.key === "Enter") {
        setIsPopoverOpen(true);
      } else if (event.key === "Backspace" && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
      updateRecentlyUsed(option);
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    const toggleAll = () => {
      if (selectedValues.length === options.length) {
        handleClear();
      } else {
        const allValues = options.map((option) => option.value);
        setSelectedValues(allValues);
        onValueChange(allValues);
      }
    };

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedOptions = showGroups
      ? filteredOptions.reduce((groups, option) => {
          const group = option.group || "Other";
          return {
            ...groups,
            [group]: [...(groups[group] || []), option],
          };
        }, {} as Record<string, typeof options>)
      : { "": filteredOptions };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            variant="outline"
            className={cn(
              "relative w-full justify-between",
              selectedValues.length > 0 ? "h-auto" : "",
              className
            )}
          >
            <div className="flex flex-wrap gap-1">
              {selectedValues.length > 0 ? (
                <>
                  {selectedValues.slice(0, maxCount).map((value) => {
                    const option = options.find((opt) => opt.value === value);
                    return (
                      <Badge
                        key={value}
                        variant={variant === "inverted" ? "default" : variant}
                        className={cn(
                          multiSelectVariants({ variant }),
                          "rounded-md px-1 py-0"
                        )}
                      >
                        {option?.icon && (
                          <option.icon className="mr-1 h-3 w-3" />
                        )}
                        {option?.label}
                        <button
                          className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              toggleOption(value);
                            }
                          }}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleOption(value);
                          }}
                        >
                          <XIcon className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                        </button>
                      </Badge>
                    );
                  })}
                  {selectedValues.length > maxCount && (
                    <Badge
                      variant={variant === "inverted" ? "default" : variant}
                      className={cn(
                        multiSelectVariants({ variant }),
                        "rounded-md px-1 py-0"
                      )}
                    >
                      +{selectedValues.length - maxCount} more
                    </Badge>
                  )}
                </>
              ) : (
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Filter className="h-4 w-4" />
                  {placeholder}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {showCount && selectedValues.length > 0 && (
                <Badge variant="secondary" className="rounded-md px-1 py-0">
                  {selectedValues.length}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-full min-w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command className="max-h-[300px]">
            {showSearch && (
              <div className="flex items-center border-b px-3">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <CommandInput
                  placeholder="Search..."
                  className="h-9 flex-1"
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  onKeyDown={handleInputKeyDown}
                />
              </div>
            )}
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              {showSelectAll && (
                <CommandGroup>
                  <CommandItem
                    onSelect={toggleAll}
                    className="flex items-center justify-between"
                  >
                    <span>
                      {selectedValues.length === options.length
                        ? "Deselect All"
                        : "Select All"}
                    </span>
                    <Tags className="h-4 w-4" />
                  </CommandItem>
                  <CommandSeparator />
                </CommandGroup>
              )}
              {showRecentlyUsed && recentlyUsed.length > 0 && (
                <CommandGroup heading="Recently Used">
                  {recentlyUsed.map((value) => {
                    const option = options.find((opt) => opt.value === value);
                    if (!option) return null;
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => toggleOption(option.value)}
                      >
                        <div className="flex items-center gap-2">
                          {option.icon && (
                            <option.icon className="h-4 w-4" />
                          )}
                          <span>{option.label}</span>
                          {option.description && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Tag className="h-3 w-3 cursor-help opacity-50" />
                              </TooltipTrigger>
                              <TooltipContent>{option.description}</TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedValues.includes(option.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    );
                  })}
                  <CommandSeparator />
                </CommandGroup>
              )}
              {Object.entries(groupedOptions).map(([group, items]) => (
                <CommandGroup
                  key={group}
                  heading={group !== "" ? group : undefined}
                >
                  {items.map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                    >
                      <div className="flex items-center gap-2">
                        {option.icon && <option.icon className="h-4 w-4" />}
                        <span>{option.label}</span>
                        {option.description && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Tag className="h-3 w-3 cursor-help opacity-50" />
                            </TooltipTrigger>
                            <TooltipContent>{option.description}</TooltipContent>
                          </Tooltip>
                        )}
                      </div>
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedValues.includes(option.value)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
            {showClearAll && selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <div className="p-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-sm"
                    onClick={handleClear}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

MultiSelect.displayName = "MultiSelect";
