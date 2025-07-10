import { Octokit } from "@octokit/rest";

export interface Resource {
  id: number;
  name: string;
  description: string;
  url: string;
  category: string;
  date: string;
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function fetchAndParseReadme(): Promise<Resource[]> {
  try {
    const response = await octokit.repos.getContent({
      owner: "NotHarshhaa",
      repo: "awesome-devops-cloud",
      path: "README.md",
    });

    if (Array.isArray(response.data) || !("content" in response.data)) {
      throw new Error("Invalid response data");
    }

    const content = Buffer.from(response.data.content, "base64").toString();

    const resources: Resource[] = [];
    let currentCategory = "";
    let id = 1;

    const lines = content.split("\n");

    for (const line of lines) {
      if (line.startsWith("## ")) {
        currentCategory = line.replace("## ", "").trim();
      } else if (
        line.startsWith("| ") &&
        line.includes(" | ") &&
        currentCategory &&
        !line.includes("Name | Description") // Skip header rows
      ) {
        const parts = line.split("|").map((part) => part.trim());
        if (parts.length >= 5) { // We expect 5 columns: empty, name, description, link, date
          let name = parts[1];
          let description = parts[2];
          let url = parts[3];
          let date = parts[4] || "Unknown";

          // Extract URL from markdown link format [Link](url)
          const markdownMatch = url.match(/\[(.*?)\]\((.*?)\)/);
          if (markdownMatch && markdownMatch[2]) {
            url = markdownMatch[2];
          } else {
            // If not in markdown format, remove any "Link:" prefix
            url = url.replace(/^Link:?\s*/i, "").trim();
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
      }
    }

    // Filter out unwanted entries
    const filteredResources = resources.filter(
      (resource) =>
        resource.name !== "Name" &&
        resource.description !== "Description" &&
        resource.url !== "Link" &&
        resource.url !== ""
    );

    return filteredResources;
  } catch (error) {
    console.error("Error fetching README:", error);
    return [];
  }
}
