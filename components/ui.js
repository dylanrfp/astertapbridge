"use client";
// Piezas compartidas por el Bridge clásico y el dinámico:
// hoja inferior (bottom sheet), aviso flotante (toast), copiar y vibración.
import { useCallback, useEffect, useRef, useState } from "react";

export function haptic(ms = 10) {
  try {
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(ms);
  } catch (_) {}
}

export async function copyText(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (_) {}
  // Respaldo para navegadores viejos
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  } catch (_) {
    return false;
  }
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const show = useCallback((msg) => {
    clearTimeout(timer.current);
    setToast({ msg, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 2200);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  const node = toast ? (
    <div className="at-toast" role="status" key={toast.id}>
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12.5l4.2 4.2L19 7" />
      </svg>
      {toast.msg}
    </div>
  ) : null;
  return [node, show];
}

export function Sheet({ open, onClose, title, children, labelledBy = "at-sheet-title" }) {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    setTimeout(() => panelRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="at-sheet-wrap" onClick={onClose}>
      <div
        className="at-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        ref={panelRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="at-sheet-grip" aria-hidden="true" />
        <button className="at-sheet-x" onClick={onClose} aria-label="Cerrar">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        {title && <h2 id={labelledBy} className="at-sheet-title">{title}</h2>}
        {children}
      </div>
    </div>
  );
}

export function WifiSheet({ open, onClose, wifi = {}, onCopied }) {
  const { ssid = "", password = "", demo } = wifi;
  return (
    <Sheet open={open} onClose={onClose} title="Conéctate al WiFi" labelledBy="at-wifi-title">
      {demo && <span className="at-chip">Ejemplo · así lo ven tus clientes</span>}
      <div className="at-wifi-row">
        <span className="at-wifi-k">Red</span>
        <span className="at-wifi-v">{ssid}</span>
      </div>
      <div className="at-wifi-row">
        <span className="at-wifi-k">Contraseña</span>
        <span className="at-wifi-v at-mono">{password}</span>
      </div>
      <button
        className="at-sheet-btn"
        onClick={async () => {
          haptic(12);
          const ok = await copyText(password);
          onCopied?.(ok ? "Contraseña copiada" : "No se pudo copiar");
        }}
      >
        Copiar contraseña
      </button>
      <p className="at-sheet-note">
        Abre Ajustes → WiFi, elige <b>{ssid}</b> y pega la contraseña.
      </p>
    </Sheet>
  );
}
