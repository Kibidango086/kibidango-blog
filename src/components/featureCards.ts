import { features, bio } from "../config";

export function featureCards() {
  const cards = features
    .map(
      (f) => `
    <div class="feature-card reveal d3">
      <span class="material-symbols-rounded feature-icon">${f.icon}</span>
      <h3>${f.title}</h3>
      <p>${f.desc}</p>
    </div>`
    )
    .join("");

  return `<section class="section features-section">
  <div class="section-header reveal d3">
    <h2>关于我</h2>
    <p>${bio.full}</p>
  </div>
  <div class="features-grid">
    ${cards}
  </div>
</section>`;
}
