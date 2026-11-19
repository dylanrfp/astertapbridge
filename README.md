# AsterTap Bridge — Next.js

Plantilla en Next.js (App Router, export estático) para los Bridges de AsterTap.
Un Bridge por cliente = una copia de este proyecto + editar `config/bridge.config.js`.
Este repo trae el Bridge propio de AsterTap, que vive en **astertap.com**.

## Correr en local

```bash
npm install
npm run dev
```

- http://localhost:3000 → Bridge (diseño que diga `layout` en el config)
- http://localhost:3000/propuesta → Bridge dinámico (propuesta v2), siempre

## Dos diseños, un solo config

| `layout`     | Qué es |
|--------------|--------|
| `"clasico"`  | El Bridge de siempre: lista de botones dorados. |
| `"dinamico"` | Propuesta v2: orb del logo con ondas de tap, saludo según la hora, dock de redes, botón con destello, pestañas Servicios/Precios que cotizan por WhatsApp, guardar como app, WiFi con copiar contraseña, guardar contacto, compartir, estrellas de reseña y carrusel de trabajos reales. |

Para que astertap.com use el dinámico: cambia `layout: "clasico"` por `layout: "dinamico"`.

## Cómo usar para un cliente nuevo

1. Duplica esta carpeta (o un repo por cliente).
2. Edita **solo `config/bridge.config.js`**: nombre, links, WiFi, catálogo,
   servicios, horario (`hours`), dominio (`siteUrl`).
3. Cambia `public/logo.png` y regenera `og.png` / íconos si es otro negocio.
4. Push a GitHub → Vercel despliega solo.

Reglas del config:
- Un link con `url: ""` **no se muestra** (así se dejan pendientes sin botones rotos).
- `dock: true` → sale como botón redondo arriba (dinámico).
- `action: "wifi"` → abre la ventanita del WiFi con los datos de `wifi`.
- `hours` → muestra "Abierto ahora · cierra 8 pm" en vivo (hora de GDL).

## Dominio (astertap.com)

- `siteUrl` en el config es la URL oficial: de ahí salen el canonical, el
  preview de WhatsApp/Google (`public/og.png`) y el link de "Compartir".
- astertap.com ya apunta a este proyecto en Vercel; con hacer push se actualiza.
- Si algún día hay que conectarlo de nuevo: Vercel → proyecto → Settings →
  Domains → agrega `astertap.com` y `www.astertap.com`, y en tu proveedor de
  dominio pon exactamente los registros que muestra la tarjeta de Vercel
  (normalmente A `@` → `76.76.21.21` y CNAME `www` → `cname.vercel-dns.com`).

## Estructura

- `config/bridge.config.js` — **el único archivo que cambia por cliente**.
- `app/layout.js` — metadata, dominio, íconos de app, preview de WhatsApp.
- `app/page.js` — elige clásico o dinámico según `layout`.
- `app/propuesta/page.js` — vista fija del dinámico (no se indexa en Google).
- `app/contacto.vcf/route.js` — genera la tarjeta de contacto en el build.
- `app/catalogo`, `app/sitio-demo` — páginas internas del clásico.
- `components/Bridge.js` — Bridge clásico.
- `components/BridgeDinamico.js` + `.module.css` — Bridge dinámico.
- `components/ui.js` — ventanita inferior, aviso flotante, copiar, vibración.
- `public/manifest.webmanifest`, `public/sw.js`, `public/icon-*.png` — "Guardar como app".

Fuentes: Inter y Archivo Expanded (lo más cercano a Helios Extended del
manual), servidas desde el propio sitio, sin depender de Google Fonts.
