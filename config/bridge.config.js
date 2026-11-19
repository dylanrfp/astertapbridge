/**
 * CONFIG DEL BRIDGE — AsterTap
 * ---------------------------------
 * Este es el ÚNICO archivo que se edita para lanzar un Bridge nuevo por
 * cliente/uso. No toques app/ ni components/ a menos que sea un cambio de
 * diseño global.
 *
 * Este config trae el DEMO MAESTRO de AsterTap (vive en astertap.com): el
 * Bridge que se enseña en las visitas, con todo lo que se puede vender
 * (Bridge, catálogo, ejemplo de sitio web, WiFi, redes, WhatsApp).
 * Para un Bridge de CLIENTE, se hace una copia de este proyecto y se
 * reemplaza este archivo por los datos de ese cliente.
 */

const WHATSAPP = "5213121543614"; // 312 154 3614

const wa = (msg) =>
  `https://wa.me/${WHATSAPP}${msg ? "?text=" + encodeURIComponent(msg) : ""}`;

export const BRIDGE_CONFIG = {
  // --- Dominio ---
  // URL pública con la que se comparte el Bridge (previews de WhatsApp,
  // Google, botón "Compartir"). astertap.com redirige a www en Vercel.
  siteUrl: "https://www.astertap.com",
  displayDomain: "astertap.com",

  // --- Diseño ---
  // "clasico"  → el Bridge de siempre (lista de botones).
  // "dinamico" → la propuesta nueva (orb animado, pestañas, cotizar,
  //              guardar contacto, guardar como app...).
  layout: "dinamico",

  // --- Identidad del negocio ---
  brandName: "AsterTap",
  tagline: "Todo tu negocio en un solo tap",
  description:
    "Tarjetas NFC, Bridges, sitios web y tarjetas de lealtad para negocios en Zapopan y Guadalajara.",

  // Texto chico bajo el tagline. En un Bridge de cliente normal dice
  // "AsterTap Bridge"; aquí, como el Bridge ES de AsterTap, va otro texto.
  dividerLabel: "Demo para negocios",

  logoUrl: "/logo.png",

  // Número para WhatsApp y para "Guardar contacto"
  whatsapp: WHATSAPP,
  phoneDisplay: "312 154 3614",

  // --- Botones / links (se renderizan en este orden) ---
  // type controla el ícono:
  // whatsapp | instagram | tiktok | facebook | web | menu | maps | reviews |
  // phone | email | demo | wifi | custom
  // Si un link no tiene url (""), NO se muestra. Así se pueden dejar
  // listos los pendientes sin que salga un botón roto.
  links: [
    {
      type: "demo",
      label: "Agendar una demo",
      sub: "Directo por WhatsApp",
      url: wa("Hola! Vi el Bridge de AsterTap y quiero agendar una demo para mi negocio."),
      highlight: true,
    },
    {
      type: "whatsapp",
      label: "Contáctanos",
      dockLabel: "WhatsApp",
      sub: "WhatsApp · 312 154 3614",
      url: wa(),
      dock: true, // dock: sale como botón redondo arriba en el Bridge dinámico
    },
    {
      type: "menu",
      label: "Catálogo y precios",
      url: "/catalogo",
      internal: true,
      classicOnly: true, // en el dinámico ya está en la pestaña "Precios"
    },
    {
      type: "web",
      label: "Ejemplo de sitio web",
      sub: "Así se ve un sitio AsterTap",
      url: "https://astertap.com",
    },
    {
      // Ya no es un link WIFI: (no funciona al tocarlo desde el navegador).
      // Ahora abre una ventanita con la red y un botón de "Copiar
      // contraseña". Los datos viven en `wifi` (abajo).
      type: "wifi",
      label: "Conectar al WiFi",
      sub: "Ejemplo para tu negocio",
      url: "#wifi",
      action: "wifi",
    },
    {
      type: "instagram",
      label: "Instagram",
      sub: "@astertap",
      url: "https://www.instagram.com/astertap/",
      dock: true,
    },
    {
      type: "tiktok",
      label: "TikTok",
      sub: "@astertap_",
      url: "https://www.tiktok.com/@astertap_",
      dock: true,
    },
    {
      type: "facebook",
      label: "Facebook",
      // PENDIENTE: pega aquí el link de la Página de Facebook de AsterTap.
      url: "",
    },
    {
      type: "reviews",
      label: "Déjanos tu reseña en Google",
      // PENDIENTE: AsterTap todavía no tiene ficha de Google Business.
      // Cuando exista, pega el link de "escribir reseña"
      // (search.google.com/local/writereview?placeid=...) y el botón aparece solo.
      url: "",
    },
  ],

  // --- WiFi (botón "Conectar al WiFi") ---
  // demo: true → muestra la etiqueta "Ejemplo". En un cliente real se pone
  // su red y contraseña y demo: false.
  wifi: {
    ssid: "TuNegocio-Invitados",
    password: "untapbasta",
    demo: true,
  },

  // --- Catálogo (pricing real de AsterTap) ---
  // --- Catálogo (pricing real de AsterTap) ---
  catalog: [
    {
      category: "Tarjetas NFC",
      items: [
        { name: "Simple — 1 tarjeta", price: "$349" },
        { name: "Simple — paquete de 2", price: "$649" },
        { name: "Simple — paquete de 3", price: "$749" },
        { name: "Customizada", price: "$599" },
      ],
    },
    {
      category: "Bridge",
      items: [{ name: "Bridge + Tarjeta Básica", price: "$599 + $99/mes" }],
    },
    {
      category: "Sitio web",
      items: [
        { name: "Básico (home, contacto, about, links, dominio)", price: "$4,499 + $249/mes" },
        { name: "Pro (personalizable, dominio propio)", price: "$7,499 + $399/mes" },
      ],
    },
    {
      category: "Lealtad",
      items: [{ name: "Tarjeta de lealtad digital dentro del Bridge", price: "Cotízalo" }],
    },
  ],

  // --- Servicios (pestaña "Servicios" del Bridge dinámico) ---
  services: [
    {
      key: "nfc",
      icon: "nfc",
      title: "Tarjetas NFC",
      desc: "Todo tu negocio en un solo tap",
      blurb: "Tu cliente acerca el cel y le aparece todo tu negocio. Sin apps, sin QR.",
      points: ["Simples o customizadas con tu logo", "Funcionan en iPhone y Android", "Las programamos en tu negocio"],
    },
    {
      key: "bridge",
      icon: "bridge",
      title: "Bridge",
      desc: "Tu hub digital con WhatsApp y redes",
      blurb: "Una página como esta con tu WhatsApp, redes, menú, WiFi y reseñas.",
      points: ["Incluye tarjeta básica", "Cambios cuando los necesites", "Se guarda como app en el cel"],
    },
    {
      key: "web",
      icon: "web",
      title: "Sitios web",
      desc: "Páginas rápidas hechas para vender",
      blurb: "Sitios hechos para vender: pedidos, reservas y seguimiento por WhatsApp.",
      points: ["Básico o Pro", "Dominio incluido", "Rápidos en el celular"],
    },
    {
      key: "lealtad",
      icon: "loyalty",
      title: "Tarjetas de lealtad",
      desc: "Sellos y premios para tus clientes",
      blurb: "Sellos y premios digitales dentro de tu Bridge para que tus clientes regresen.",
      points: ["Sin tarjetas de papel", "Integrada a tu Bridge", "Clientes más frecuentes"],
    },
  ],

  // --- Textos extra del Bridge dinámico ---
  rotatingPrefix: "Hacemos",
  rotatingWords: ["tarjetas NFC", "Bridges", "sitios web que venden", "tarjetas de lealtad"],
  toolsTitle: "Pruébalo como cliente",

  // --- Trabajos reales (carrusel del Bridge dinámico) ---
  showcase: [
    {
      name: "Rancho 62",
      kind: "Bridge + lealtad",
      url: "https://rancho62.astertap.com",
      image: "/clientes/rancho62-screen.png",
    },
    {
      name: "Tequila Palma Blanca",
      kind: "Sitio web",
      url: "https://www.tequilapalmablanca.com",
      image: "/clientes/palmablanca-web.png",
    },
    {
      name: "San Pancho Tropical",
      kind: "Bridge + menú",
      url: "https://www.sanpanchotropical.com",
      image: "/clientes/sanpanchotropical-screen.png",
    },
    {
      name: "Festa Pasta",
      kind: "Bridge + pedidos",
      url: "https://festapasta.astertap.com",
      image: "/clientes/festapasta-screen.png",
    },
    {
      name: "Rosa Canela",
      kind: "Bridge + catálogo",
      url: "https://rosacanela.astertap.com",
      image: "/clientes/rosacanela-screen.png",
    },
  ],

  // --- Horario (opcional) ---
  // Si se llena, el Bridge dinámico muestra "Abierto ahora · cierra 8 pm"
  // o "Cerrado · abre mañana 9 am" en vivo (hora de CDMX/GDL).
  // Formato: 0 = domingo ... 6 = sábado. null = cerrado ese día.
  // hours: { 0: null, 1: ["09:00","20:00"], 2: ["09:00","20:00"], 3: ["09:00","20:00"],
  //          4: ["09:00","20:00"], 5: ["09:00","22:00"], 6: ["10:00","22:00"] },
  hours: null,

  // --- Ejemplo de sitio web (página /sitio-demo) ---
  demoSite: {
    heroTitle: "Tu negocio, en una sola página.",
    heroSubtitle:
      "Así se ve un sitio web básico de AsterTap: rápido, directo al punto, y hecho para que tus clientes te compren.",
    services: [
      { title: "Menú / Catálogo", desc: "Tus productos o servicios, siempre actualizados." },
      { title: "Pedidos y reservas", desc: "Un botón directo a WhatsApp con el mensaje ya escrito." },
      { title: "Se guarda como app", desc: "Tus clientes lo dejan en su cel y regresan cuando quieran." },
    ],
    realExample: {
      label: "Ver un sitio real: Tequila Palma Blanca",
      url: "https://www.tequilapalmablanca.com",
    },
  },

  // --- Marca AsterTap (footer) ---
  // Desactivado aquí porque el Bridge ya ES de AsterTap. En un Bridge de
  // cliente se activa para dar crédito ("Hecho con AsterTap").
  showAsterTapBranding: false,
  asterTapTagline: "Todo tu negocio en un solo tap",
  asterTapUrl: "https://www.astertap.com",
  footerBrandLabel: "AsterTap",

  // --- Tema visual (Bridge clásico) ---
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
