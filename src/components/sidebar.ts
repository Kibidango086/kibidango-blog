import { site, bio, socialLinks, type SocialKey } from "../config";

export function sidebar() {
  const ico = (key: SocialKey): string => {
    const map: Record<string, string> = {
      github: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>`,
      twitter: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
      bilibili: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.813 4.653h.854c1.51.055 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 19.103 0 17.593v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.12-.658.36-.906.24-.249.533-.373.88-.373.36 0 .68.124.96.373L9.413 4.653h5.12l3.054-2.68c.28-.249.6-.373.96-.373.347 0 .64.124.88.373.24.248.36.55.36.906 0 .356-.124.658-.373.906l-1.174 1.12Z"/></svg>`,
      telegram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0A12 12 0 1 0 12 24 12 12 0 0 0 12 0zm5.52 8.16l-1.94 9.14c-.15.66-.54.82-1.09.51l-3-2.21-1.45 1.4c-.16.16-.3.3-.61.3l.21-2.99 5.45-4.93c.24-.21-.05-.33-.37-.12l-6.74 4.25-2.9-.9c-.63-.2-.64-.63.13-.93l11.35-4.38c.52-.19.98.13.82.93z"/></svg>`,
      facebook: `<svg width="18" height="18" viewBox="0 0 320 512" fill="currentColor" aria-hidden="true"><path d="M80 299.3V512h116V299.3h86.5l18-97.8H196v-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4.4 37 1.2V7.9C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4v42.1H14v97.8z"/></svg>`,
      email: `<span class="material-symbols-rounded" style="font-size:18px">mail</span>`,
    };
    return map[key] || "";
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
