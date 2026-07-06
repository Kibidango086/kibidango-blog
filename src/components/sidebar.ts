import {
  siGithub,
  siX,
  siBilibili,
  siTelegram,
  siDiscord,
  siFacebook,
  type SimpleIcon,
} from "simple-icons";
import { site, bio, socialLinks, type SocialKey } from "../config";

const simpleIconMap: Partial<Record<SocialKey, SimpleIcon>> = {
  github: siGithub,
  twitter: siX,
  bilibili: siBilibili,
  telegram: siTelegram,
  discord: siDiscord,
  facebook: siFacebook,
};

export function sidebar() {
  const ico = (key: SocialKey): string => {
    const icon = simpleIconMap[key];
    if (!icon) {
      // email 等不走 simple-icons 的项
      if (key === "email") {
        return `<span class="material-symbols-rounded" style="font-size:18px">mail</span>`;
      }
      return "";
    }
    return `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" role="img"><path d="${icon.path}"/></svg>`;
  };

  const items = socialLinks
    .map((s) => {
      if (s.key === "email" && s.encrypted) {
        return `<a rel="noopener" class="email-protector sidebar-social-link" data-secret="${s.encrypted}" title="${s.label}">${ico("email")}<span>${s.label}</span></a>`;
      }
      return `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="sidebar-social-link" title="${s.label}">${ico(s.key)}<span>${s.label}</span></a>`;
    })
    .join("");

  return `<div class="sidebar-wrap">
  <div class="sidebar-overlay" id="sidebar-overlay"></div>
  <aside class="sidebar" id="sidebar">
    <button class="sidebar-close-btn" id="sidebar-close-btn" aria-label="关闭侧栏">
      <span class="material-symbols-rounded">close</span>
    </button>
    <div class="sidebar-card">
      <div class="sidebar-avatar-wrap">
        <img src="${site.avatar}" alt="${site.name}" class="sidebar-avatar" width="160" height="160" loading="lazy">
      </div>
      <div class="sidebar-name">${site.name}</div>
      <div class="sidebar-divider"></div>
      <div class="sidebar-bio">${bio.short}</div>
      <div class="sidebar-social">${items}</div>
    </div>
  </aside>
</div>`;
}
