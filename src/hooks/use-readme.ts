import { Octokit } from "@octokit/rest";

export interface Resource {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
  date: string;
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
});

// Cache implementation
const cache = new Map<string, { data: Resource[]; timestamp: number }>();

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

  return {
    name,
    description,
    url: cleanUrl,
    date,
  };
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

    if (!line.startsWith("| ") || !currentCategory || line.includes("Name | Description")) {
      continue;
    }

    const parsedLine = parseLine(line);
    if (!parsedLine) continue;

    const { name, description, url, date } = parsedLine;
    
    if (name === "Name" || description === "Description" || !url) {
      continue;
    }

    resources.push({
      id: id++,
      name,
      description,
      url,
      category: currentCategory,
      date,
    });
  }

  return resources;
}

export async function fetchAndParseReadme(options: FetchOptions = {}): Promise<Resource[]> {
  const finalOptions = { ...DEFAULT_OPTIONS, ...options };
  const cacheKey = getCacheKey(finalOptions);

  // Check cache
  const cached = cache.get(cacheKey);
  if (cached && isValidCache(cached.timestamp, finalOptions.cacheTime)) {
    return cached.data;
  }

  try {
    const response = await octokit.repos.getContent({
      owner: finalOptions.owner,
      repo: finalOptions.repo,
      path: finalOptions.path,
    });

    if (Array.isArray(response.data) || !("content" in response.data)) {
      throw new Error("Invalid response data: Expected a single file content");
    }

    const content = Buffer.from(response.data.content, "base64").toString();
    const resources = parseContent(content);

    // Update cache
    cache.set(cacheKey, {
      data: resources,
      timestamp: Date.now(),
    });

    return resources;
  } catch (error) {
    console.error("Error fetching README:", error);
    // Return cached data if available, even if expired
    return cached?.data || [];
  }
}
