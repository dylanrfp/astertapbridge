import { BRIDGE_CONFIG } from "../../config/bridge.config";

// Genera /contacto.vcf en el build (botón "Guardar contacto").
// En iPhone abre directo la tarjeta de contacto; en Android la importa.
export const dynamic = "force-static";

const esc = (v = "") => String(v).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");

export function GET() {
  const c = BRIDGE_CONFIG;
  const phone = c.whatsapp ? "+" + String(c.whatsapp).replace(/^521/, "52") : "";
  const ig = (c.links || []).find((l) => l.type === "instagram" && l.url);
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${esc(c.brandName)}`,
    `N:;${esc(c.brandName)};;;`,
    `ORG:${esc(c.brandName)}`,
    phone && `TEL;TYPE=CELL,VOICE:${phone}`,
    c.siteUrl && `URL:${c.siteUrl}`,
    ig && `X-SOCIALPROFILE;TYPE=instagram:${ig.url}`,
    c.tagline && `NOTE:${esc(c.tagline)}`,
    "END:VCARD",
  ].filter(Boolean);
  return new Response(lines.join("\r\n") + "\r\n", {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `inline; filename="${c.brandName}.vcf"`,
    },
  });
}
