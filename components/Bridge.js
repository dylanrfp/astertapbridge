"use client";
import { useState, useRef } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { Icon, DefaultMark } from "./icons";
import { WifiSheet, useToast } from "./ui";

export default function Bridge({ config }) {
  const {
    brandName,
    tagline,
    description,
    logoUrl,
    links = [],
    dividerLabel = "AsterTap Bridge",
    showAsterTapBranding,
    asterTapTagline,
    asterTapUrl,
    footerBrandLabel = "AsterTap",
    wifi,
    theme = {},
  } = config;

  // Links sin url (pendientes) no se muestran, para no tener botones rotos.
  const visibleLinks = links.filter((l) => l.url);
  const [wifiOpen, setWifiOpen] = useState(false);
  const [toastNode, showToast] = useToast();

  const [lightMode, setLightMode] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const markRef = useRef(null);

  const toggleTheme = (e) => {
    const nextMode = !lightMode;

    // Trigger tactile logo haptic bounce animation
    setIsSwitching(true);
    setTimeout(() => setIsSwitching(false), 900);

    // Fallback if View Transitions API is not supported or user prefers reduced motion
    if (
      typeof document === "undefined" ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      if (nextMode) {
        document.documentElement.classList.add("light");
      } else {
        document.documentElement.classList.remove("light");
      }
      setLightMode(nextMode);
      return;
    }

    // Calcular el centro exacto del logo (siempre desde el centro, nunca desde la esquina o el cursor)
    const rect = markRef.current?.getBoundingClientRect();
    const x = rect ? Math.round(rect.left + rect.width / 2) : Math.round(window.innerWidth / 2);
    const y = rect ? Math.round(rect.top + rect.height / 2) : 130;

    const endRadius = Math.ceil(
      Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      )
    );

    document.documentElement.style.setProperty("--ripple-x", `${x}px`);
    document.documentElement.style.setProperty("--ripple-y", `${y}px`);
    document.documentElement.style.setProperty("--ripple-r", `${endRadius}px`);
    document.documentElement.classList.add("in-view-transition");

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        if (nextMode) {
          document.documentElement.classList.add("light");
        } else {
          document.documentElement.classList.remove("light");
        }
        setLightMode(nextMode);
      });
    });

    transition.finished.finally(() => {
      document.documentElement.classList.remove("in-view-transition");
    });
  };

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
    <div className="wrap" style={lightMode ? undefined : themeVars}>
      <div 
        ref={markRef}
        className={`mark${isSwitching ? " switching" : ""}`} 
        onClick={toggleTheme}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleTheme(e);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Cambiar tema visual"
        title="Toca para cambiar entre modo oscuro y claro"
        style={{ cursor: "pointer" }}
      >
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logoUrl} alt={brandName} />
        ) : (
          <DefaultMark />
        )}
      </div>

      <h1>{brandName}</h1>
      {tagline && <p className="tagline">{tagline}</p>}
      <div className="divider">{dividerLabel}</div>
      {description && <p className="desc">{description}</p>}

      <div className="links">
        {visibleLinks.map((link) => {
          const className = `btn${link.highlight ? " highlight" : ""}`;
          const content = (
            <>
              <span className="icon">
                <Icon type={link.type} />
              </span>
              <span className="label">{link.label}</span>
              <span className="chev">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </span>
            </>
          );

          // WiFi: abre la ventanita con red + "Copiar contraseña".
          if (link.action === "wifi") {
            return (
              <button
                key={link.label}
                type="button"
                className={className}
                onClick={() => setWifiOpen(true)}
              >
                {content}
              </button>
            );
          }

          // Links internos (páginas propias del sitio, ej. /catalogo) usan
          // next/link para navegación instantánea sin recargar; los externos
          // (WhatsApp, redes, reseñas) son <a> normales que abren en pestaña
          // nueva.
          if (link.internal) {
            return (
              <Link key={link.label} href={link.url} className={className}>
                {content}
              </Link>
            );
          }

          return (
            <a
              key={link.label}
              className={className}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          );
        })}
      </div>

      {showAsterTapBranding && (
        <footer>
          {asterTapTagline && <span className="foot-tag">{asterTapTagline}</span>}
          <a
            className="foot-brand"
            href={asterTapUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {footerBrandLabel}
          </a>
        </footer>
      )}

      <WifiSheet
        open={wifiOpen}
        onClose={() => setWifiOpen(false)}
        wifi={wifi}
        onCopied={showToast}
      />
      {toastNode}
    </div>
  );
}
