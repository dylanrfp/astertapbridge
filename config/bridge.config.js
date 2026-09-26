/**
 * CONFIG DEL BRIDGE — AsterTap MX
 * ---------------------------------
 * Este es el ÚNICO archivo que se edita para lanzar un Bridge nuevo por
 * cliente/uso. No toques app/ ni components/ a menos que sea un cambio de
 * diseño global.
 *
 * Este config trae el DEMO MAESTRO de AsterTap: el Bridge que el equipo de
 * ventas enseña en las visitas, con todo lo que se puede vender (Bridge,
 * catálogo/menú, ejemplo de sitio web, agendar demo, redes, WhatsApp,
 * reseñas). Para un Bridge de CLIENTE, se hace una copia de este proyecto y
 * se reemplaza este archivo por los datos de ese cliente.
 */

export const BRIDGE_CONFIG = {
  // --- Identidad del negocio ---
  brandName: "AsterTap",
  tagline: "Todo tu negocio en un solo tap",
  description: "Tarjetas NFC, Bridges y sitios web para negocios en Zapopan y Guadalajara.",

  // Texto chico bajo el tagline. En un Bridge de cliente normal dice
  // "AsterTap Bridge" (marca de quién lo hizo); aquí, como el Bridge ES de
  // AsterTap, usamos un texto distinto para no repetir el nombre.
  dividerLabel: "Demo para negocios",

  logoUrl: "/logo.png",

  // --- Botones / links (se renderizan en este orden) ---
  // type controla el ícono. Tipos disponibles:
  // whatsapp | instagram | tiktok | facebook | web | menu | maps | reviews | phone | email | demo | custom
  links: [
    {
      type: "demo",
      label: "Agendar una demo",
      // Pre-llena el mensaje de WhatsApp — así el botón "Reservar/Agendar"
      // sí hace algo real sin necesitar backend.
      url:
        "https://wa.me/5213121543614?text=" +
        encodeURIComponent(
          "Hola! Vi el Bridge de AsterTap y quiero agendar una demo para mi negocio."
        ),
      highlight: true,
    },
    {
      type: "wifi",
      label: "Conectar al WiFi",
      url: "WIFI:S:NombreDeTuRed;T:WPA;P:TuContrasena;;", // Android barcode scanners and some systems support this. iOS natively intercepts this via camera but not always via tap.
    },
    {
      type: "whatsapp",
      label: "Contáctanos",
      url: "https://wa.me/5213121543614",
    },
    {
      type: "menu",
      label: "Catálogo y precios",
      url: "/catalogo", // página interna — ver app/catalogo/page.js
      internal: true,
    },
    {
      type: "web",
      label: "Ejemplo de sitio web",
      url: "/sitio-demo", // página interna — ver app/sitio-demo/page.js
      internal: true,
    },
    {
      type: "instagram",
      label: "Instagram",
      url: "https://www.instagram.com/astertapmx/",
    },
    { 
      type: "tiktok", 
      label: "TikTok", 
      url: "https://www.tiktok.com/@astertapmx" 
    },
    {
      type: "reviews",
      label: "Déjanos tu reseña en Google",
      // PENDIENTE: AsterTap todavía no tiene ficha de Google Business propia.
      // En cuanto exista, cambia esta URL por el link real de reseña.
      url: "https://g.page/r/PENDIENTE/review",
    },
  ],

  // --- Catálogo (usa el pricing real de AsterTap) ---
  catalog: [
    {
      category: "Tarjetas NFC",
      items: [
        { name: "Genérica — 1 tarjeta", price: "$349" },
        { name: "Genérica — paquete de 2", price: "$649" },
        { name: "Genérica — paquete de 3", price: "$749" },
        { name: "Customizada v1", price: "$499" },
        { name: "Customizada v2", price: "$599" },
      ],
    },
    {
      category: "Bridge",
      items: [
        { name: "Bridge + Tarjeta Básica", price: "$599 + $99/mes" }
      ],
    },
    {
      category: "Sitio web",
      items: [
        { name: "Básico (home, contacto, about, links, dominio)", price: "$4,499 + $249/mes" },
        { name: "Pro (personalizable, dominio propio)", price: "$7,499 + $399/mes" },
      ],
    },
  ],

  // --- Ejemplo de sitio web (página /sitio-demo) ---
  demoSite: {
    heroTitle: "Tu negocio, en una sola página.",
    heroSubtitle:
      "Así se ve un sitio web básico de AsterTap: rápido, directo al punto, y con todos tus links en un solo lugar.",
    services: [
      { title: "Menú / Catálogo", desc: "Tus productos o servicios, siempre actualizados." },
      { title: "Reservas y contacto", desc: "Un botón directo a WhatsApp, sin fricción." },
      { title: "Reseñas de Google", desc: "El objetivo #1: más estrellas, más rápido." },
    ],
  },

  // --- Marca AsterTap (footer) ---
  // Aquí desactivado: como el Bridge ya ES de AsterTap, repetir el nombre
  // abajo es redundante. En un Bridge de cliente, esto se activa para dar
  // crédito ("Hecho con AsterTap").
  showAsterTapBranding: false,
  asterTapTagline: "Un toque. Cinco estrellas.",
  asterTapUrl: "https://astertap.com",
  footerBrandLabel: "AsterTap",

  // --- Tema visual ---
  theme: {
    bg: "#0a0a0a",
    card: "#151513",
    cardLine: "rgba(212,175,55,0.25)",
    text: "#f3efe6",
    textMuted: "#a39c8f",
    accent: "#D4AF37",
    accentSoft: "#e8c98a",
    accentText: "#181207",
  },
};
