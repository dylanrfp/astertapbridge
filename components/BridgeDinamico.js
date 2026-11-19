"use client";
/**
 * BRIDGE DINÁMICO — propuesta v2 de AsterTap
 * Usa el mismo config/bridge.config.js que el clásico. Todo lo que sale
 * aquí es real y funciona en el cel del cliente (nada de botones de adorno):
 *   - Orb del logo con ondas de tap, se inclina con el dedo y cambia el tema
 *   - Saludo según la hora (y "Abierto ahora / Cerrado" si hay horario)
 *   - Dock de redes, botón principal con destello
 *   - Explorador con pestañas (Servicios / Precios) que cotiza por WhatsApp
 *   - Guardar como app, WiFi con copiar contraseña, guardar contacto, compartir
 *   - Reseñas con estrellas (solo si hay link) y carrusel de trabajos reales
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import Link from "next/link";
import { Icon } from "./icons";
import { Sheet, WifiSheet, useToast, haptic, copyText } from "./ui";
import s from "./BridgeDinamico.module.css";

/* ---------- helpers ---------- */

const TZ = "America/Mexico_City";
const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function nowInMexico() {
  return new Date(new Date().toLocaleString("en-US", { timeZone: TZ }));
}

function greetingFor(d) {
  const h = d.getHours();
  if (h >= 5 && h < 12) return "Buenos días";
  if (h >= 12 && h < 19) return "Buenas tardes";
  return "Buenas noches";
}

const toMin = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};

function fmtHour(hhmm) {
  let [h, m] = hhmm.split(":").map(Number);
  const ampm = h >= 12 && h < 24 ? "pm" : "am";
  h = h % 12 || 12;
  return m ? `${h}:${String(m).padStart(2, "0")} ${ampm}` : `${h} ${ampm}`;
}

// hours: { 0..6: ["09:00","20:00"] | null }. Soporta cierre después de medianoche.
function openStatus(hours, d) {
  if (!hours) return null;
  const day = d.getDay();
  const mins = d.getHours() * 60 + d.getMinutes();

  const yest = hours[(day + 6) % 7];
  if (yest) {
    const [o, c] = yest.map(toMin);
    if (c <= o && mins < c) return { open: true, label: `Abierto ahora · cierra ${fmtHour(yest[1])}` };
  }
  const today = hours[day];
  if (today) {
    const [o, c] = today.map(toMin);
    const close = c <= o ? c + 1440 : c;
    if (mins >= o && mins < close) return { open: true, label: `Abierto ahora · cierra ${fmtHour(today[1])}` };
    if (mins < o) return { open: false, label: `Cerrado · abre hoy ${fmtHour(today[0])}` };
  }
  for (let i = 1; i <= 7; i++) {
    const next = hours[(day + i) % 7];
    if (next) {
      const when = i === 1 ? "mañana" : `el ${DAYS[(day + i) % 7]}`;
      return { open: false, label: `Cerrado · abre ${when} ${fmtHour(next[0])}` };
    }
  }
  return null;
}

const waLink = (num, msg) => `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;

/* ---------- íconos de interfaz (trazo) ---------- */

function G({ name, size = 20 }) {
  const p = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };
  switch (name) {
    case "share":
      return <svg {...p}><path d="M12 3v12" /><path d="M7.5 7.5L12 3l4.5 4.5" /><path d="M5 12v6.5A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V12" /></svg>;
    case "arrow":
      return <svg {...p}><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>;
    case "out":
      return <svg {...p}><path d="M7 17L17 7" /><path d="M8 7h9v9" /></svg>;
    case "chev":
      return <svg {...p}><path d="M9 6l6 6-6 6" /></svg>;
    case "plus":
      return <svg {...p}><path d="M12 5v14M5 12h14" /></svg>;
    case "app":
      return <svg {...p}><rect x="6" y="2.5" width="12" height="19" rx="3" /><path d="M12 7.5v6" /><path d="M9.5 11.5L12 14l2.5-2.5" /><path d="M10.5 18.5h3" /></svg>;
    case "contact":
      return <svg {...p}><circle cx="10" cy="8" r="3.5" /><path d="M3.5 20a6.5 6.5 0 0 1 13 0" /><path d="M19 8v6M16 11h6" /></svg>;
    case "wifi":
      return <svg {...p}><path d="M2.5 9a14 14 0 0 1 19 0" /><path d="M5.5 12.5a9.5 9.5 0 0 1 13 0" /><path d="M8.6 16a5 5 0 0 1 6.8 0" /><circle cx="12" cy="19.3" r="0.9" fill="currentColor" /></svg>;
    case "calendar":
      return <svg {...p}><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /><path d="M8.5 14.5l2.2 2.2 4.8-4.8" /></svg>;
    case "nfc":
      return <svg {...p}><rect x="2.5" y="6" width="13" height="12" rx="2.5" /><path d="M18.5 8.5a5 5 0 0 1 0 7" /><path d="M21 6a8.5 8.5 0 0 1 0 12" /></svg>;
    case "bridge":
      return <svg {...p}><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" /><path d="M9.5 7.5h5M9.5 11h5M9.5 14.5h5" /></svg>;
    case "web":
      return <svg {...p}><rect x="2.5" y="4" width="19" height="15" rx="2.5" /><path d="M2.5 8.5h19" /><circle cx="5.5" cy="6.3" r="0.6" fill="currentColor" /><circle cx="7.8" cy="6.3" r="0.6" fill="currentColor" /><path d="M7 13h6M7 15.5h4" /></svg>;
    case "loyalty":
      return <svg {...p}><rect x="2.5" y="5" width="19" height="14" rx="2.5" /><circle cx="7.5" cy="12" r="1.6" /><circle cx="12" cy="12" r="1.6" /><circle cx="16.5" cy="12" r="1.6" fill="currentColor" /></svg>;
    case "star":
      return <svg {...p} fill="currentColor" stroke="none"><path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3-4.7-4.4 6.4-.8z" /></svg>;
    case "iosShare":
      return <svg {...p} width={18} height={18}><path d="M12 3v11" /><path d="M8 7l4-4 4 4" /><rect x="5" y="10" width="14" height="11" rx="2.5" /></svg>;
    case "iosAdd":
      return <svg {...p} width={18} height={18}><rect x="3.5" y="3.5" width="17" height="17" rx="4" /><path d="M12 8v8M8 12h8" /></svg>;
    case "dots":
      return <svg {...p} width={18} height={18} fill="currentColor" stroke="none"><circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" /></svg>;
    default:
      return null;
  }
}

/* ---------- efecto de "presión" con brillo donde toca el dedo ---------- */

function pressGlow(e) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--px", `${e.clientX - r.left}px`);
  el.style.setProperty("--py", `${e.clientY - r.top}px`);
  el.classList.remove(s.pressed);
  // reflow para reiniciar la animación
  void el.offsetWidth;
  el.classList.add(s.pressed);
}

/* ---------- componente ---------- */

export default function BridgeDinamico({ config }) {
  const {
    brandName,
    tagline,
    logoUrl,
    links = [],
    whatsapp,
    siteUrl,
    displayDomain,
    wifi,
    catalog = [],
    services = [],
    showcase = [],
    hours,
    rotatingPrefix = "Hacemos",
    rotatingWords = [],
    toolsTitle = "Útil",
    showAsterTapBranding,
    asterTapUrl,
  } = config;

  const visible = links.filter((l) => l.url && !l.classicOnly);
  const primary = visible.find((l) => l.highlight);
  const dock = visible.filter((l) => l.dock);
  const wifiLink = visible.find((l) => l.action === "wifi");
  const reviewLink = visible.find((l) => l.type === "reviews");
  const listLinks = visible.filter(
    (l) => !l.highlight && !l.dock && l.action !== "wifi" && l.type !== "reviews"
  );

  const tabs = useMemo(() => {
    const t = [];
    if (services.length) t.push({ id: "servicios", label: "Servicios" });
    if (catalog.length) t.push({ id: "precios", label: "Precios" });
    return t;
  }, [services.length, catalog.length]);

  const rootRef = useRef(null);
  const orbRef = useRef(null);
  const wordRefs = useRef([]);
  const [rotW, setRotW] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [word, setWord] = useState(0);
  const [tab, setTab] = useState(0);
  const [openSvc, setOpenSvc] = useState(0);
  const [lightMode, setLightMode] = useState(false);
  const [orbBump, setOrbBump] = useState(false);
  const [wifiOpen, setWifiOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const [installEvt, setInstallEvt] = useState(null);
  const [installed, setInstalled] = useState(false);
  const [platform, setPlatform] = useState("other");
  const [stars, setStars] = useState(0);
  const [bursts, setBursts] = useState([]);
  const [toastNode, showToast] = useToast();

  /* --- montado y modo de color --- */
  useEffect(() => {
    setMounted(true);
    setLightMode(document.documentElement.classList.contains("light"));
  }, []);

  /* --- palabras que rotan --- */
  useEffect(() => {
    if (rotatingWords.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setWord((w) => (w + 1) % rotatingWords.length), 2300);
    return () => clearInterval(id);
  }, [rotatingWords.length]);

  /* --- ancho de la pastilla = ancho de la palabra actual --- */
  useEffect(() => {
    const measure = () => {
      const el = wordRefs.current[word];
      if (el) setRotW(el.offsetWidth);
    };
    measure();
    document.fonts?.ready?.then(measure).catch(() => {});
  }, [word]);

  /* --- guardar como app (PWA) --- */
  useEffect(() => {
    const ua = navigator.userAgent || "";
    const ios = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const android = /android/i.test(ua);
    setPlatform(ios ? "ios" : android ? "android" : "other");
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
    setInstalled(standalone);

    const onBip = (e) => {
      e.preventDefault();
      setInstallEvt(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvt(null);
      showToast("Listo, ya está en tu cel");
    };
    window.addEventListener("beforeinstallprompt", onBip);
    window.addEventListener("appinstalled", onInstalled);
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onBip);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, [showToast]);

  /* --- aparecer al hacer scroll --- */
  useEffect(() => {
    const els = rootRef.current?.querySelectorAll("[data-reveal]") || [];
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add(s.in));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add(s.in);
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.04 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* --- orb: inclinación con el dedo / mouse --- */
  const onOrbMove = (e) => {
    const el = orbRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 18).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 18).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${((y + 0.5) * 100).toFixed(1)}%`);
  };
  const onOrbLeave = () => {
    const el = orbRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  /* --- cambio de tema con onda desde el logo --- */
  const toggleTheme = () => {
    const next = !lightMode;
    haptic(15);
    setOrbBump(true);
    setTimeout(() => setOrbBump(false), 800);

    const apply = () => {
      document.documentElement.classList.toggle("light", next);
      setLightMode(next);
    };

    if (
      typeof document === "undefined" ||
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      apply();
      return;
    }

    // SIEMPRE calcular desde el centro exacto del logo (nunca desde la esquina o el cursor)
    const r = orbRef.current?.getBoundingClientRect();
    const x = r ? Math.round(r.left + r.width / 2) : Math.round(window.innerWidth / 2);
    const y = r ? Math.round(r.top + r.height / 2) : 130;
    const end = Math.ceil(
      Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    );

    const root = document.documentElement;
    root.style.setProperty("--ripple-x", `${x}px`);
    root.style.setProperty("--ripple-y", `${y}px`);
    root.style.setProperty("--ripple-r", `${end}px`);
    root.classList.add("in-view-transition");
    const t = document.startViewTransition(() => flushSync(apply));
    t.finished.finally(() => root.classList.remove("in-view-transition"));
  };

  /* --- destello de estrellas en el botón principal --- */
  const burst = (e) => {
    haptic(18);
    const id = Date.now();
    const x = e.clientX || innerWidth / 2;
    const y = e.clientY || innerHeight / 2;
    const parts = Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
      const d = 46 + Math.random() * 54;
      return {
        tx: Math.cos(a) * d,
        ty: Math.sin(a) * d,
        sc: 0.5 + Math.random() * 0.8,
        star: i % 3 === 0,
      };
    });
    setBursts((b) => [...b, { id, x, y, parts }]);
    setTimeout(() => setBursts((b) => b.filter((k) => k.id !== id)), 900);
  };

  /* --- compartir --- */
  const share = useCallback(async () => {
    haptic(10);
    const url = siteUrl || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: brandName, text: `${brandName} — ${tagline}`, url });
        return;
      } catch (err) {
        if (err && err.name === "AbortError") return;
      }
    }
    const ok = await copyText(url);
    showToast(ok ? "Link copiado" : url);
  }, [siteUrl, brandName, tagline, showToast]);

  /* --- guardar como app --- */
  const install = async () => {
    haptic(10);
    if (installed) {
      showToast("Ya lo tienes en tu cel");
      return;
    }
    if (installEvt) {
      installEvt.prompt();
      const choice = await installEvt.userChoice.catch(() => null);
      setInstallEvt(null);
      if (choice?.outcome === "accepted") showToast("Listo, ya está en tu cel");
      return;
    }
    setInstallOpen(true);
  };

  /* --- swipe entre pestañas --- */
  const touch = useRef(null);
  const onTouchStart = (e) => {
    const t = e.touches[0];
    touch.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e) => {
    if (!touch.current || tabs.length < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touch.current.x;
    const dy = t.clientY - touch.current.y;
    touch.current = null;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      setTab((i) => Math.min(tabs.length - 1, Math.max(0, i + (dx < 0 ? 1 : -1))));
      haptic(8);
    }
  };

  const activeTab = tabs[tab]?.id;
  let seq = 0; // orden de entrada escalonada
  const delay = () => ({ "--d": seq++ });

  return (
    <div className={`${s.root} ${mounted ? s.ready : ""}`} ref={rootRef}>
      <div className={s.aurora} aria-hidden="true">
        <span />
        <span />
      </div>
      <div className={s.grain} aria-hidden="true" />

      <main className={s.col}>
        {/* barra superior */}
        <header className={s.top} style={delay()}>
          <button className={s.iconBtn} onClick={share} aria-label="Compartir este Bridge">
            <G name="share" size={19} />
          </button>
        </header>

        {/* hero */}
        <section className={s.hero}>
          <div className={s.orbWrap} style={delay()}>
          <button
            ref={orbRef}
            className={`${s.orb} ${orbBump ? s.bump : ""}`}
            onPointerMove={onOrbMove}
            onPointerLeave={onOrbLeave}
            onClick={toggleTheme}
            aria-label={lightMode ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
          >
            <span className={s.wave} />
            <span className={s.wave} />
            <span className={s.wave} />
            {orbBump && <span className={s.tapPulse} aria-hidden="true" />}
            <span className={s.halo} />
            <span className={s.disc}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logoUrl} alt={brandName} draggable="false" />
              <span className={s.sheen} />
            </span>
          </button>
          </div>

          <h1 className={s.brand} style={delay()}>{brandName}</h1>
          {tagline && <p className={s.tagline} style={delay()}>{tagline}</p>}

          {rotatingWords.length > 0 && (
            <p className={s.rotator} style={delay()} aria-live="polite">
              <span className={s.rotPrefix}>{rotatingPrefix}</span>
              <span className={s.rotWindow} style={rotW ? { width: rotW } : undefined}>
                {rotatingWords.map((w, i) => {
                  const n = rotatingWords.length;
                  const st = i === word ? s.on : i === (word - 1 + n) % n ? s.was : "";
                  return (
                    <span
                      key={w}
                      ref={(el) => (wordRefs.current[i] = el)}
                      className={`${s.rotWord} ${st}`}
                      aria-hidden={i !== word}
                    >
                      {w}
                    </span>
                  );
                })}
              </span>
            </p>
          )}
        </section>

        {/* dock de redes */}
        {dock.length > 0 && (
          <nav className={s.dock} aria-label="Redes y contacto" style={{ ...delay(), "--n": dock.length }}>
            {dock.map((l) => (
              <a
                key={l.label}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className={s.dockItem}
                onPointerDown={() => haptic(8)}
              >
                <span className={s.dockIcon}>
                  <Icon type={l.type} />
                </span>
                <span className={s.dockLabel}>{l.dockLabel || l.label}</span>
              </a>
            ))}
          </nav>
        )}

        {/* botón principal */}
        {primary && (
          <a
            className={s.cta}
            href={primary.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={burst}
            onPointerDown={pressGlow}
            style={delay()}
          >
            <span className={s.ctaShine} aria-hidden="true" />
            <span className={s.ctaIcon}><G name="calendar" size={22} /></span>
            <span className={s.ctaText}>
              <b>{primary.label}</b>
              {primary.sub && <small>{primary.sub}</small>}
            </span>
            <span className={s.ctaArrow}><G name="arrow" size={20} /></span>
          </a>
        )}

        {/* links restantes */}
        {listLinks.length > 0 && (
          <div className={s.list}>
            {listLinks.map((l) => {
              const inner = (
                <>
                  <span className={s.rowIcon}><Icon type={l.type} /></span>
                  <span className={s.rowText}>
                    <b>{l.label}</b>
                    {l.sub && <small>{l.sub}</small>}
                  </span>
                  <span className={s.rowChev}><G name={l.internal ? "chev" : "out"} size={18} /></span>
                </>
              );
              return l.internal ? (
                <Link key={l.label} href={l.url} className={s.row} onPointerDown={pressGlow} style={delay()}>
                  {inner}
                </Link>
              ) : (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={s.row}
                  onPointerDown={pressGlow}
                  style={delay()}
                >
                  {inner}
                </a>
              );
            })}
          </div>
        )}

        {/* explorador con pestañas */}
        {tabs.length > 0 && (
          <section className={s.explore} data-reveal>
            <div className={s.secHead}>
              <h2>Explora</h2>
              {tabs.length > 1 && <span className={s.hint}>Desliza ↔</span>}
            </div>

            {tabs.length > 1 && (
              <div className={s.tabs} role="tablist" style={{ "--n": tabs.length, "--i": tab }}>
                <span className={s.tabPill} aria-hidden="true" />
                {tabs.map((t, i) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={i === tab}
                    aria-controls={`panel-${t.id}`}
                    id={`tab-${t.id}`}
                    className={`${s.tab} ${i === tab ? s.tabOn : ""}`}
                    onClick={() => {
                      haptic(8);
                      setTab(i);
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            <div
              className={s.panelArea}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {activeTab === "servicios" && (
                <div key="svc" id="panel-servicios" role="tabpanel" aria-labelledby="tab-servicios" className={s.panel}>
                  {services.map((sv, i) => {
                    const open = openSvc === i;
                    return (
                      <div key={sv.key} className={`${s.svc} ${open ? s.svcOpen : ""}`} style={{ "--k": i }}>
                        <button
                          className={s.svcHead}
                          aria-expanded={open}
                          onClick={() => {
                            haptic(8);
                            setOpenSvc(open ? -1 : i);
                          }}
                        >
                          <span className={s.svcIcon}><G name={sv.icon} size={22} /></span>
                          <span className={s.svcTitle}>
                            <b>{sv.title}</b>
                            {sv.desc && <small>{sv.desc}</small>}
                          </span>
                          <span className={s.svcPlus}><G name="plus" size={18} /></span>
                        </button>
                        <div className={s.svcBody}>
                          <div className={s.svcInner}>
                            <p>{sv.blurb}</p>
                            {sv.points?.length > 0 && (
                              <ul>
                                {sv.points.map((pt) => (
                                  <li key={pt}>{pt}</li>
                                ))}
                              </ul>
                            )}
                            <a
                              className={s.svcBtn}
                              href={waLink(whatsapp, `Hola! Me interesa ${sv.title.toLowerCase()} para mi negocio.`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => haptic(12)}
                            >
                              Me interesa <G name="arrow" size={16} />
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === "precios" && (
                <div key="cat" id="panel-precios" role="tabpanel" aria-labelledby="tab-precios" className={s.panel}>
                  {catalog.map((g, gi) => (
                    <div key={g.category} className={s.catGroup} style={{ "--k": gi }}>
                      <h3>{g.category}</h3>
                      {g.items.map((it) => {
                        const hasPrice = /\$/.test(it.price);
                        const msg = hasPrice
                          ? `Hola! Quiero cotizar: ${it.name} (${it.price}).`
                          : `Hola! Quiero cotizar: ${it.name}.`;
                        return (
                          <a
                            key={it.name}
                            className={s.catRow}
                            href={waLink(whatsapp, msg)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onPointerDown={pressGlow}
                            onClick={() => haptic(10)}
                          >
                            <span className={s.catName}>{it.name}</span>
                            <span className={s.catPrice}>{it.price}</span>
                            <span className={s.catGo} aria-label="Cotizar por WhatsApp">
                              <Icon type="whatsapp" />
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  ))}
                  <p className={s.catNote}>Toca cualquier precio y te mandamos la cotización por WhatsApp.</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* herramientas */}
        <section className={s.tools} data-reveal>
          <div className={s.secHead}>
            <h2>{toolsTitle}</h2>
          </div>
          <div className={s.toolGrid}>
            <button className={s.tool} onClick={install} onPointerDown={pressGlow}>
              <span className={s.toolIcon}><G name="app" size={22} /></span>
              <b>{installed ? "Ya está en tu cel" : "Guárdalo como app"}</b>
              <small>Sin descargar nada</small>
            </button>
            {wifiLink && wifi && (
              <button
                className={s.tool}
                onClick={() => {
                  haptic(10);
                  setWifiOpen(true);
                }}
                onPointerDown={pressGlow}
              >
                <span className={s.toolIcon}><G name="wifi" size={22} /></span>
                <b>WiFi</b>
                <small>Copia la contraseña</small>
              </button>
            )}
            <a className={s.tool} href="/contacto.vcf" onPointerDown={pressGlow} onClick={() => haptic(10)}>
              <span className={s.toolIcon}><G name="contact" size={22} /></span>
              <b>Guardar contacto</b>
              <small>Directo a tu agenda</small>
            </a>
          </div>
        </section>

        {/* reseñas (solo si hay link real) */}
        {reviewLink && (
          <section className={s.review} data-reveal>
            <div>
              <b>¿Qué tal tu experiencia?</b>
              <small>Toca las estrellas y déjanos tu reseña en Google</small>
            </div>
            <div className={s.starRow} onPointerLeave={() => setStars(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <a
                  key={n}
                  href={reviewLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${n} estrella${n > 1 ? "s" : ""}`}
                  className={`${s.star} ${n <= stars ? s.starOn : ""}`}
                  style={{ "--k": n }}
                  onPointerEnter={() => setStars(n)}
                  onClick={() => {
                    setStars(n);
                    haptic(14);
                  }}
                >
                  <G name="star" size={30} />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* trabajos reales */}
        {showcase.length > 0 && (
          <section className={s.show} data-reveal>
            <div className={s.secHead}>
              <h2>Trabajos reales</h2>
              <span className={s.hint}>{showcase.length} proyectos</span>
            </div>
            <div className={s.showTrack}>
              {showcase.map((w, i) => {
                const initials = w.mark || w.name
                  .split(/\s+/)
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((p) => p[0])
                  .join("")
                  .toUpperCase();
                const host = w.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
                return (
                  <a
                    key={w.name}
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={s.showCard}
                    style={{ "--k": i }}
                    onPointerDown={pressGlow}
                  >
                    <span className={s.showArt} aria-hidden="true">
                      {w.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={w.image} alt={w.name} className={s.showImg} loading="lazy" />
                      ) : (
                        <span className={s.showInit}>{initials}</span>
                      )}
                    </span>
                    <span className={s.showKind}>{w.kind}</span>
                    <b>{w.name}</b>
                    <small>
                      {host} <G name="out" size={13} />
                    </small>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        <footer className={s.foot} data-reveal>
          {showAsterTapBranding ? (
            <a href={asterTapUrl} target="_blank" rel="noopener noreferrer">
              Hecho con <b>AsterTap</b>
            </a>
          ) : (
            <span>{displayDomain}</span>
          )}
          <small>Toca el logo para cambiar a modo {lightMode ? "oscuro" : "claro"}</small>
        </footer>
      </main>

      {/* destellos */}
      {bursts.map((b) => (
        <span key={b.id} className={s.burst} style={{ left: b.x, top: b.y }} aria-hidden="true">
          {b.parts.map((p, i) => (
            <i
              key={i}
              className={p.star ? s.pStar : s.pDot}
              style={{ "--tx": `${p.tx}px`, "--ty": `${p.ty}px`, "--sc": p.sc }}
            />
          ))}
        </span>
      ))}

      <WifiSheet open={wifiOpen} onClose={() => setWifiOpen(false)} wifi={wifi} onCopied={showToast} />

      <Sheet
        open={installOpen}
        onClose={() => setInstallOpen(false)}
        title="Guárdalo en tu cel"
        labelledBy="at-install-title"
      >
        {platform === "ios" ? (
          <ol className="at-steps">
            <li><span className="n">1</span><span>Toca <b>Compartir</b> <G name="iosShare" /> abajo en Safari</span></li>
            <li><span className="n">2</span><span>Elige <b>Agregar a inicio</b> <G name="iosAdd" /></span></li>
            <li><span className="n">3</span><span>Listo: te queda como app con el logo de {brandName}</span></li>
          </ol>
        ) : (
          <ol className="at-steps">
            <li><span className="n">1</span><span>Abre el menú <G name="dots" /> de tu navegador</span></li>
            <li><span className="n">2</span><span>Toca <b>Agregar a pantalla principal</b> o <b>Instalar app</b></span></li>
            <li><span className="n">3</span><span>Listo: te queda como app con el logo de {brandName}</span></li>
          </ol>
        )}
        <p className="at-sheet-note">
          Si lo abriste desde Instagram o WhatsApp, primero ábrelo en {platform === "ios" ? "Safari" : "Chrome"}.
        </p>
      </Sheet>

      {toastNode}
    </div>
  );
}
