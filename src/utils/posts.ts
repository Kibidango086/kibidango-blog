import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import fm from "front-matter";
import { marked } from "marked";
import hljs from "highlight.js";
import katex from "katex";

export interface PostMeta {
  title: string;
  date: string;
  description?: string;
  tags?: string[];
  category?: string;
  image?: string;
}

export interface Post {
  slug: string;
  meta: PostMeta;
  html: string;
}

const POSTS_DIR = join(import.meta.dir, "..", "content", "posts");

const LANG_ALIAS: Record<string, string> = {
  bash: "bash", sh: "bash", shell: "bash", zsh: "bash",
  js: "javascript", cjs: "javascript", mjs: "javascript",
  ts: "typescript", cts: "typescript", mts: "typescript",
  py: "python", rb: "ruby", rs: "rust", go: "go",
  yml: "yaml", md: "markdown", txt: "plaintext", text: "plaintext",
};

function highlightCode(text: string, lang?: string): string {
  const raw = lang || "plaintext";
  const label = raw === "plaintext" ? "" : raw;
  const mapped = LANG_ALIAS[raw] || raw;
  const language = hljs.getLanguage(mapped) ? mapped : "plaintext";
  try {
    const result = hljs.highlight(text, { language });
    return `${label ? `<div class="code-lang">${label}</div>` : ""}<pre><code class="hljs language-${mapped}">${result.value}</code></pre>`;
  } catch {
    return `${label ? `<div class="code-lang">${label}</div>` : ""}<pre><code>${escapeHtml(text)}</code></pre>`;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderKatex(text: string): string {
  return text
    .replace(/\$\$([\s\S]*?)\$\$/g, (_, f: string) => {
      try { return katex.renderToString(f.trim(), { displayMode: true, throwOnError: false }); }
      catch { return _; }
    })
    .replace(/\$(.*?)\$/g, (_, f: string) => {
      try { return katex.renderToString(f.trim(), { displayMode: false, throwOnError: false }); }
      catch { return _; }
    });
}

function copyButton(): string {
  return `<button class="copy-btn" title="复制代码" aria-label="复制代码"><span class="material-symbols-rounded">content_copy</span></button>`;
}

function processImages(html: string): string {
  return html.replace(/<img\s([^>]*?)src="([^"]+)"([^>]*)>/g, (_, before, src, after) => {
    if (src.startsWith("data:") || src.includes("katex") || src.includes("avatar") || src.includes("favicon") || src.includes("icon")) {
      return `<img ${before}src="${src}"${after}>`;
    }
    return `<a href="${src}" data-fancybox="gallery" class="post-img-link"><img ${before}src="${src}"${after} loading="lazy"></a>`;
  });
}

export async function getPosts(): Promise<Post[]> {
  if (existsSync(POSTS_DIR)) {
    const files = await readdir(POSTS_DIR);
    const posts: Post[] = [];
    for (const file of files) {
      if (!file.endsWith(".md")) continue;
      const post = await readPost(file.replace(/\.md$/, ""));
      if (post) posts.push(post);
    }
    posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
    return posts;
  }

  // Vercel: read from generated data file
  try {
    const { postsData } = await import("../content/data");
    const posts: Post[] = [];
    for (const [file, content] of Object.entries(postsData)) {
      const slug = file.replace(/\.md$/, "");
      const post = await parsePostContent(slug, content);
      if (post) posts.push(post);
    }
    posts.sort((a, b) => new Date(b.meta.date).getTime() - new Date(a.meta.date).getTime());
    return posts;
  } catch {
    return [];
  }
}

export async function getPost(slug: string): Promise<Post | null> {
  if (existsSync(POSTS_DIR)) return readPost(slug);
  try {
    const { postsData } = await import("../content/data");
    const key = Object.keys(postsData).find((k) => k.replace(/\.md$/, "") === slug);
    if (!key) return null;
    return parsePostContent(slug, postsData[key]!);
  } catch {
    return null;
  }
}

async function readPost(slug: string): Promise<Post | null> {
  try {
    const raw = await readFile(join(POSTS_DIR, `${slug}.md`), "utf-8");
    return parsePostContent(slug, raw);
  } catch {
    return null;
  }
}

async function parsePostContent(slug: string, raw: string): Promise<Post | null> {
  try {
    const { attributes, body } = fm<PostMeta>(raw);

    const renderer = new marked.Renderer();
    renderer.code = function ({ text, lang }: { text: string; lang?: string }) {
      const highlighted = highlightCode(text, lang);
      return `<div class="code-block">${copyButton()}${highlighted}</div>`;
    };

    let html = await marked(body, { breaks: true, async: true, renderer });
    html = processImages(html);
    html = renderKatex(html);

    return {
      slug,
      meta: {
        title: attributes.title || slug,
        date: attributes.date || "",
        description: attributes.description || "",
        tags: attributes.tags || [],
        category: attributes.category || "uncategorized",
      },
      html,
    };
  } catch {
    return null;
  }
}
