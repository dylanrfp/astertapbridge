# AsterTap Bridge — Next.js

Plantilla general en Next.js (App Router) para generar Bridges de clientes.
Un Bridge por cliente = una copia de este proyecto + editar `config/bridge.config.js`.

## Correr en local

```bash
npm install
npm run dev
```

Abre http://localhost:3000

## Cómo usar para un cliente nuevo

1. Duplica esta carpeta (o crea un branch/repo por cliente).
2. Edita **solo `config/bridge.config.js`**: nombre, tagline, descripción,
   links y colores del tema si el cliente pide algo distinto al negro/dorado
   default ("black card premium").
3. `npm run build` y despliega en Vercel (mismo flujo que ya usas).
4. Apunta el dominio/subdominio del cliente.

## Estructura

- `app/layout.js` — shell HTML, fuentes (Fraunces + Manrope).
- `app/page.js` — entrada, solo renderiza `<Bridge config={BRIDGE_CONFIG} />`.
- `app/globals.css` — estilos "black card premium", no se toca por cliente.
- `components/Bridge.js` — layout del bridge (header, links, footer).
- `components/icons.js` — set de íconos SVG por tipo de link.
- `config/bridge.config.js` — **el único archivo que cambia por cliente**.

## Tipos de link soportados (icono automático)

`whatsapp`, `instagram`, `tiktok`, `facebook`, `web`, `menu`, `maps`,
`reviews`, `phone`, `email`, `custom`.

## Nota sobre el ejemplo (Sky Flight)

El config trae de ejemplo el Bridge real de Sky Flight (nombre, tagline,
links de WhatsApp/Instagram/TikTok/reseña de Google) para que veas la
plantilla funcionando con datos reales. Reemplázalo por los del siguiente
cliente cuando lo uses.
