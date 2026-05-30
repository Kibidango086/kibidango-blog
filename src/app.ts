import { Elysia } from "elysia";
import { html } from "@elysiajs/html";
import { staticPlugin } from "@elysiajs/static";
import { site } from "./config";
import { escapeXml } from "./utils/helpers";
import { getPosts, getPost } from "./utils/posts";
import { getSocialFeed } from "./utils/rss";
import { base } from "./components/layout";
import { homePage } from "./pages/home";
import { archivePage } from "./pages/archive";
import { postPage } from "./pages/post";
import { assetMap } from "./assets";

const app = new Elysia()
  .use(html())

  // Serve assets from embedded base64 map (Vercel-compatible, checked first)
  .get("/public/*", ({ params }) => {
    const key = params["*"];
    const asset = assetMap[key!];
    if (!asset) return;
    const buffer = Buffer.from(asset.data, "base64");
    return new Response(buffer, {
      headers: {
        "Content-Type": asset.mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  })

  // Fallback: static plugin for any files not in assetMap
  .use(staticPlugin())

  .get("/", async () => {
    const posts = await getPosts();
    return base("首页", homePage(posts, []));
  })

  .get("/api/feed", async () => {
    const feed = await getSocialFeed();
    return new Response(JSON.stringify(feed), {
      headers: { "Content-Type": "application/json" },
    });
  })

  .get("/archive", async () => {
    const posts = await getPosts();
    return base("归档", archivePage(posts));
  })

  .get("/posts/:slug", async ({ params }) => {
    const post = await getPost(params.slug);
    if (!post) return new Response("文章未找到", { status: 404 });
    return base(post.meta.title, postPage(post), post.meta.description);
  })

  .get("/rss.xml", async () => {
    const posts = await getPosts();
    const items = posts
      .map(
        (p) => `    <item>
      <title>${escapeXml(p.meta.title)}</title>
      <link>${site.url}/posts/${p.slug}</link>
      <guid>${site.url}/posts/${p.slug}</guid>
      <pubDate>${new Date(p.meta.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.meta.description || "")}</description>
    </item>`
      )
      .join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.title)}</title>
    <link>${site.url}</link>
    <description>${escapeXml(site.description)}</description>
    <language>zh-CN</language>
    <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: { "Content-Type": "application/xml" },
    });
  })

  .get("/sitemap.xml", async () => {
    const posts = await getPosts();
    const urls = posts
      .map((p) => `  <url><loc>${site.url}/posts/${p.slug}</loc><lastmod>${p.meta.date}</lastmod></url>`)
      .join("\n");

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${site.url}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${site.url}/archive</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
${urls}
</urlset>`;

    return new Response(sitemap, {
      headers: { "Content-Type": "application/xml" },
    });
  })

  .get("/robots.txt", () => {
    return new Response(
      `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`,
      { headers: { "Content-Type": "text/plain" } }
    );
  });

export { app };

export default app;
