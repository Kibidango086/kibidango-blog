export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toISOString().split("T")[0]!;
}

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function icon(name: string, size = 24): string {
  return `<span class="material-symbols-rounded" style="font-size:${size}px;font-variation-settings:'FILL' 0,'wght' 400,'GRAD' 0,'opsz' ${size};">${name}</span>`;
}

const EMAIL_KEY = 'nfp|:YSqW"KbWeF~Gt"Bva';

export function encryptEmail(email: string): string {
  let result = "";
  for (let i = 0; i < email.length; i++) {
    result += String.fromCharCode(
      email.charCodeAt(i) ^ EMAIL_KEY.charCodeAt(i % EMAIL_KEY.length)
    );
  }
  return Buffer.from(result).toString("base64");
}

export function emailLink(encryptedEmail: string): string {
  return `<a rel="noopener" class="email-protector sidebar-social-link" data-secret="${encryptedEmail}" title="邮件">
  <span class="material-symbols-rounded" style="font-size:18px">mail</span>
  <span>邮件</span>
</a>`;
}
