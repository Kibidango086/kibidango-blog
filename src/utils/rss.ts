import { XMLParser } from "fast-xml-parser";
import { rssFeeds } from "../config";

export interface FeedItem {
  title: string;
  link: string;
  date: string;
  source: string;
  image?: string;
}

function xmlDate(d: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("zh-CN", { month: "short", day: "numeric" });
}

function extractImage(e: any): string | undefined {
  // Atom: media:thumbnail or media:content
  if (e["media:thumbnail"]) return e["media:thumbnail"]["@_url"];
  if (e["media:content"]) return e["media:content"]["@_url"];
  // RSS enclosure with image type
  if (e.enclosure?.["@_type"]?.startsWith("image")) return e.enclosure["@_url"];
  // Common image fields
  if (e.image?.url) return e.image.url;
  if (e.image?.["@_href"]) return e.image["@_href"];
  // HTML content: extract first img src
  const html = e.content || e.description || e["content:encoded"] || e.summary || "";
  if (typeof html === "string") {
    const m = html.match(/<img[^>]+src="([^"]+)"/);
    if (m) return m[1];
  }
  return undefined;
}

async function fetchOne(name: string, url: string): Promise<FeedItem[]> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "kibidango-blog/1.0" },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const text = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false });
    const doc = parser.parse(text);
    const feed = doc.feed || doc.rss?.channel;
    if (!feed) return [];
    const entries = feed.entry || feed.item || [];
    const items = (Array.isArray(entries) ? entries : [entries]).slice(0, 5);
    return items.map((e: any) => ({
      title: (e.title || "").toString().replace(/<[^>]+>/g, "").trim(),
      link: e.link?.["@_href"] || e.link?.href || e.link || "",
      date: xmlDate(e.updated || e.published || e.pubDate || e["dc:date"] || ""),
      source: name,
      image: extractImage(e),
    }));
  } catch {
    return [];
  }
}

export async function getSocialFeed(): Promise<FeedItem[]> {
  if (!rssFeeds.length) return [];
  const results = await Promise.all(rssFeeds.map((f) => fetchOne(f.name, f.url)));
  const all = results.flat();
  all.sort((a, b) => b.date.localeCompare(a.date));
  return all.slice(0, 8);
}
