import Link from "next/link";
import { BRIDGE_CONFIG } from "../../config/bridge.config";

export const metadata = { title: "Ejemplo de sitio web · AsterTap" };

export default function SitioDemoPage() {
  const { demoSite = {}, theme = {} } = BRIDGE_CONFIG;
  const themeVars = {
    "--bg": theme.bg,
    "--card": theme.card,
    "--card-line": theme.cardLine,
    "--text": theme.text,
    "--text-muted": theme.textMuted,
    "--accent": theme.accent,
    "--accent-soft": theme.accentSoft,
    "--accent-text": theme.accentText,
  };

  return (
    <div className="page" style={themeVars}>
      <Link href="/" className="back">
        &lsaquo; Volver al Bridge
      </Link>

      <span className="example-tag">Ejemplo — así se ve, no es un negocio real</span>

      <h1 className="page-title">{demoSite.heroTitle}</h1>
      <p className="page-sub">{demoSite.heroSubtitle}</p>

      <div className="services">
        {(demoSite.services || []).map((s) => (
          <div key={s.title} className="service-card">
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </div>

      <a
        className="btn highlight cta"
        href="https://wa.me/5213121543614?text=Hola!%20Vi%20el%20ejemplo%20de%20sitio%20web%20de%20AsterTap%20y%20quiero%20uno%20para%20mi%20negocio."
        target="_blank"
        rel="noopener noreferrer"
      >
        Quiero un sitio como este
      </a>

      {demoSite.realExample?.url && (
        <a
          className="btn ghost cta"
          href={demoSite.realExample.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {demoSite.realExample.label}
        </a>
      )}
    </div>
  );
}
