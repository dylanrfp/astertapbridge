import Link from "next/link";
import { BRIDGE_CONFIG } from "../../config/bridge.config";

export const metadata = { title: "Catálogo · AsterTap MX" };

export default function CatalogoPage() {
  const { catalog = [], theme = {} } = BRIDGE_CONFIG;
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

      <h1 className="page-title">Catálogo y precios</h1>
      <p className="page-sub">Lo que AsterTap ofrece hoy.</p>

      {catalog.map((group) => (
        <section key={group.category} className="cat-group">
          <h2>{group.category}</h2>
          <ul className="cat-list">
            {group.items.map((item) => (
              <li key={item.name}>
                <span className="cat-name">{item.name}</span>
                <span className="cat-price">{item.price}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <a
        className="btn highlight cta"
        href="https://wa.me/5213121543614?text=Hola!%20Vi%20el%20cat%C3%A1logo%20de%20AsterTap%20y%20quiero%20cotizar."
        target="_blank"
        rel="noopener noreferrer"
      >
        Cotizar por WhatsApp
      </a>
    </div>
  );
}
