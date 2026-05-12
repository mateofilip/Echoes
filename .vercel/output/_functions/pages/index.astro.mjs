import { c as createComponent, a as createAstro, b as addAttribute, r as renderHead, d as renderSlot, e as renderTemplate, f as renderComponent } from '../chunks/astro/server_X9bNU1-d.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                                 */
export { renderers } from '../renderers.mjs';

const $$Astro = createAstro();
const $$Layout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Layout;
  return renderTemplate`<html lang="en" data-astro-cid-sckkx6r4> <head><meta charset="UTF-8"><meta name="description" content="Astro description"><meta name="viewport" content="width=device-width"><link rel="icon" type="image/svg+xml" href="/favicon.png"><meta name="generator"${addAttribute(Astro2.generator, "content")}><title>Echoes</title><meta property="og:title" content="Echoes – Inspiring Quotes"><meta property="og:description" content="Discover and share inspiring quotes. Beautiful, modern, and responsive web app built with Astro, React, and Supabase."><meta property="og:image" content="/favicon.png"><meta property="og:url" content="https://mf-echoes.vercel.app"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="Echoes – Inspiring Quotes"><meta name="twitter:description" content="Discover and share inspiring quotes. Beautiful, modern, and responsive web app built with Astro, React, and Supabase."><meta name="twitter:image" content="/favicon.png">${renderHead()}</head> <body class="relative overflow-hidden bg-stone-950 text-orange-200" data-astro-cid-sckkx6r4> ${renderSlot($$result, $$slots["default"])} </body></html>`;
}, "/Users/mateofilip/Documents/Projects/Echoes/src/layouts/Layout.astro", void 0);

const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, {}, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Welcome", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/Users/mateofilip/Documents/Projects/Echoes/src/components/Welcome.tsx", "client:component-export": "default" })} ` })}`;
}, "/Users/mateofilip/Documents/Projects/Echoes/src/pages/index.astro", void 0);

const $$file = "/Users/mateofilip/Documents/Projects/Echoes/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
