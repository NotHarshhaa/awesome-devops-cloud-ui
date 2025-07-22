import { Octokit } from "@octokit/rest";
import { format, isValid, parseISO } from "date-fns";

export interface Resource {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
  date: string;
  formattedDate?: string;
}

interface ParsedLine {
  name: string;
  description: string;
  url: string;
  date: string;
}

interface FetchOptions {
  owner?: string;
  repo?: string;
  path?: string;
  cacheTime?: number;
}

const DEFAULT_OPTIONS: Required<FetchOptions> = {
  owner: "NotHarshhaa",
  repo: "awesome-devops-cloud",
  path: "README.md",
  cacheTime: 5 * 60 * 1000, // 5 minutes
};

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
  request: {
    timeout: 10000, // 10 second timeout
  },
});

// Cache implementation with expiration
const cache = new Map<string, { data: Resource[]; timestamp: number }>();

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second between retries

function getCacheKey(options: Required<FetchOptions>): string {
  return `${options.owner}/${options.repo}/${options.path}`;
}

function isValidCache(timestamp: number, cacheTime: number): boolean {
  return Date.now() - timestamp < cacheTime;
}

function parseLine(line: string): ParsedLine | null {
  const parts = line.split("|").map((part) => part.trim());
  if (parts.length < 5) return null;

  const [, name, description, url, date = "Unknown"] = parts;

  // Extract URL from markdown link format
  const markdownMatch = url.match(/\[(.*?)\]\((.*?)\)/);
  const cleanUrl = markdownMatch?.[2] || url.replace(/^Link:?\s*/i, "").trim();

  // Validate URL
  try {
    new URL(cleanUrl);
  } catch (e) {
    console.warn(`Invalid URL found: ${cleanUrl}`);
  }

  return {
    name,
    description,
    url: cleanUrl,
    date,
  };
}

function formatDate(dateString: string): {
  date: string;
  formattedDate?: string;
} {
  // If date is "Unknown", return as is
  if (!dateString || dateString === "Unknown") {
    return { date: dateString };
  }

  try {
    const parsedDate = parseISO(dateString);

    // Validate the parsed date
    if (!isValid(parsedDate)) {
      return { date: dateString };
    }

    // Format the date for display
    const formattedDate = format(parsedDate, "MMM d, yyyy");
    return { date: dateString, formattedDate };
  } catch (error) {
    console.warn(`Invalid date format: ${dateString}`);
    return { date: dateString };
  }
}

function parseContent(content: string): Resource[] {
  const lines = content.split("\n");
  const resources: Resource[] = [];
  let currentCategory = "";
  let id = 1;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      currentCategory = line.replace("## ", "").trim();
      continue;
    }

    if (
      !line.startsWith("| ") ||
      !currentCategory ||
      line.includes("Name | Description")
    ) {
      continue;
    }

    const parsedLine = parseLine(line);
    if (!parsedLine) continue;

    const { name, description, url, date } = parsedLine;

    if (name === "Name" || description === "Description" || !url) {
      continue;
    }

    // Format date if possible
    const { date: originalDate, formattedDate } = formatDate(date);

    resources.push({
      id: id++,
      name,
      description,
      url,
      category: currentCategory,
      date: originalDate,
      formattedDate,
    });
  }

  return resources;
}

async function fetchWithRetry(
  options: Required<FetchOptions>,
  retries = 0,
): Promise<Resource[]> {
  try {
    const response = await octokit.repos.getContent({
      owner: options.owner,
      repo: options.repo,
      path: options.path,
    });

    if (Array.isArray(response.data) || !("content" in response.data)) {
      throw new Error("Invalid response data: Expected a single file content");
    }

    const content = Buffer.from(response.data.content, "base64").toString();
    return parseContent(content);
  } catch (error) {
    if (retries < MAX_RETRIES) {
      console.log(`Retrying fetch (${retries + 1}/${MAX_RETRIES})...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
      return fetchWithRetry(options, retries + 1);
    }
    throw error;
  }
}

export async function fetchAndParseReadme(
  options: FetchOptions = {},
): Promise<Resource[]> {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };
  const cacheKey = getCacheKey(finalOptions);

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && isValidCache(cached.timestamp, finalOptions.cacheTime)) {
    return cached.data;
  }

  try {
    const resources = await fetchWithRetry(finalOptions);

    // Update cache
    cache.set(cacheKey, {
      data: resources,
      timestamp: Date.now(),
    });

    return resources;
  } catch (error) {
    console.error("Error fetching README:", error);

    // Return cached data if available, even if expired
    if (cached?.data) {
      console.log("Returning cached data due to fetch error");
      return cached.data;
    }

    // If no cached data, return empty array with a console error
    console.error("No cached data available and fetch failed");
    return [];
  }
}
