import fs from "fs/promises";
import path from "path";

type SourceEntry = {
  id: string;
  title: string;
  url: string;
  filename: string;
};

const SOURCES_DIR = path.join(process.cwd(), "sources_seed");
const CONFIG_PATH = path.join(SOURCES_DIR, "sources.json");

const stripWikiMarkup = (content: string) => {
  let cleaned = content;
  cleaned = cleaned.replace(/<!--([\s\S]*?)-->/g, "");
  cleaned = cleaned.replace(/\{\{[\s\S]*?\}\}/g, "");
  cleaned = cleaned.replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2");
  cleaned = cleaned.replace(/\[\[([^\]]+)\]\]/g, "$1");
  cleaned = cleaned.replace(/'''+/g, "");
  cleaned = cleaned.replace(/={2,}\s*(.*?)\s*={2,}/g, "\n$1\n");
  cleaned = cleaned.replace(/\[http[^\s\]]+\s?([^\]]*)\]/g, "$1");
  cleaned = cleaned.replace(/<ref[^>]*>[\s\S]*?<\/ref>/g, "");
  cleaned = cleaned.replace(/<[^>]+>/g, "");

  cleaned = cleaned
    .split("\n")
    .filter((line) => {
      const trimmed = line.trim();
      if (!trimmed) return true;
      if (/^Category:/i.test(trimmed)) return false;
      if (/^[a-z]{2,3}:.+/.test(trimmed)) return false;
      if (/^\*?\s*https?:\/\//i.test(trimmed)) return false;
      return true;
    })
    .join("\n");

  cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
  return cleaned.trim();
};

const stripNonContentSections = (content: string) => {
  const stopHeaders = [
    "See also",
    "External links",
    "References",
    "Notes",
    "Bibliography",
    "Further reading"
  ];
  const lines = content.split("\n");
  const output: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (stopHeaders.some((header) => trimmed.toLowerCase() === header.toLowerCase())) {
      break;
    }
    output.push(line);
  }
  return output.join("\n").trim();
};

const fetchSource = async (entry: SourceEntry) => {
  const response = await fetch(entry.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${entry.url}: ${response.status}`);
  }
  const raw = await response.text();
  const cleaned = stripNonContentSections(stripWikiMarkup(raw));
  const header = `${entry.title}\n\nSource: ${entry.url}\n\n`;
  const outputPath = path.join(SOURCES_DIR, entry.filename);
  await fs.writeFile(outputPath, `${header}${cleaned}\n`);
  return outputPath;
};

const run = async () => {
  const configRaw = await fs.readFile(CONFIG_PATH, "utf-8");
  const entries = JSON.parse(configRaw) as SourceEntry[];
  if (!entries.length) {
    throw new Error("No Wikisource entries found in sources.json");
  }

  for (const entry of entries) {
    const outputPath = await fetchSource(entry);
    console.log(`Saved ${entry.title} to ${outputPath}`);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
