import { encryptEmail } from "./utils/helpers";

// ============================================================
//  Site Configuration — edit this file to customize your blog
// ============================================================

export const site = {
  name: "Kibidango086",
  title: "Kibidango086's blog",
  description: "Kibidango086 的个人博客",
  url: "https://kibidango.top",
  avatar: "/public/avatar.webp",
  defaultTheme: "dark" as "dark" | "light" | "auto",
// 主题色
  accentHue: 345,
};

// 首页社交动态 RSS 订阅源。留空数组则不显示。
// 每条需提供 name（显示名）和 url（RSS/Atom 地址）。
export const rssFeeds: { name: string; url: string }[] = [
  { name: "TG 频道", url: "https://srr.kibidango.top/telegram/channel/kibidango086_dynamic" }
];

export const waline = {
  // Waline 评论服务地址。留空即禁用评论。免费获取：https://waline.js.org/guide/get-started/
  serverURL: "https://comments.kibidango.top/",
};

export const social = {
  github: "https://github.com/Kibidango086",
  twitter: "https://x.com/KibiDango086",
  bilibili: "https://space.bilibili.com/513874563",
  telegram: "https://t.me/kibidango086",
  discord: "https://discord.com/users/1140297229551284314",
  facebook: "https://www.facebook.com/profile.php?id=61550745473623",
  email: "dango@proton.me",
};

export type SocialKey = keyof typeof social;

export const socialLinks: { key: SocialKey; label: string; url: string; encrypted?: string }[] = [
  { key: "github", label: "GitHub", url: social.github },
  { key: "twitter", label: "X / Twitter", url: social.twitter },
  { key: "bilibili", label: "B站", url: social.bilibili },
  { key: "telegram", label: "Telegram", url: social.telegram },
  { key: "discord", label: "Discord", url: social.discord },
  { key: "facebook", label: "Facebook", url: social.facebook },
  { key: "email", label: "邮件", url: `mailto:${social.email}`, encrypted: encryptEmail(social.email) },
];

export const bio = {
  short: "这个家伙很懒",
  full: "Kibidango086 是一个普通网民，涉及领域多且杂（或许不是）。",
  stats: {
    repos: "25+",
    posts: "5",
    videos: "7",
    topPlays: "35k+",
  },
};

export const features = [
  { icon: "smart_toy", title: "AI", desc: "滥用 AI 的废物" },
  { icon: "music_note", title: "B站音乐播放器", desc: "BLBL Music Player — 桌面端 B 站音乐播放器，Electron + React + TS" },
  { icon: "build", title: "小工具", desc: "PPT 翻页器、视频水印制作器等多种小工具" },
  { icon: "smart_display", title: "B站 UP 主", desc: "7 个视频，最高 3.5 万播放" },
  { icon: "sports_esports", title: "柚子厨", desc: "Ciallo～(∠・ω< )⌒★" },
  { icon: "shield_lock", title: "隐私 & 自托管", desc: "自建 blog、工具站、AI agent、CDN" },
];
