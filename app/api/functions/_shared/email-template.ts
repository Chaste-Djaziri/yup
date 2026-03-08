const BRAND = {
  name: "Youth Uplift Initiative",
  accent: "#af8638",
  dark: "#12100c",
  lightBg: "#f7f1e7",
  cardBg: "#ffffff",
};

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function plainTextToHtml(value: string) {
  return escapeHtml(value).replace(/\n/g, "<br/>");
}

export function renderEmailTemplate(options: {
  title: string;
  subtitle?: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const { title, subtitle, bodyHtml, ctaLabel, ctaUrl } = options;

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${BRAND.lightBg};font-family:Arial,sans-serif;color:${BRAND.dark};">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.lightBg};padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:${BRAND.cardBg};border:1px solid #e6ddcf;">
            <tr>
              <td style="padding:24px;background:${BRAND.dark};color:#f8f4ec;">
                <div style="font-size:12px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.9;">YOUTH UPLIFT INITIATIVE</div>
                <h1 style="margin:12px 0 0;font-size:28px;line-height:1.2;color:#f8f4ec;">${escapeHtml(title)}</h1>
                ${subtitle ? `<p style="margin:10px 0 0;font-size:14px;line-height:1.5;color:#f8f4ec;opacity:0.92;">${escapeHtml(subtitle)}</p>` : ""}
              </td>
            </tr>
            <tr>
              <td style="padding:24px;font-size:15px;line-height:1.7;color:${BRAND.dark};">${bodyHtml}</td>
            </tr>
            ${ctaLabel && ctaUrl ? `<tr><td style="padding:0 24px 24px;"><a href="${escapeHtml(ctaUrl)}" style="display:inline-block;background:${BRAND.accent};color:#fff;text-decoration:none;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:12px 18px;">${escapeHtml(ctaLabel)}</a></td></tr>` : ""}
            <tr>
              <td style="padding:16px 24px;border-top:1px solid #eee6d8;font-size:12px;line-height:1.5;color:#6b6150;">
                ${BRAND.name} • contact.yupinitiative@gmail.com
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
