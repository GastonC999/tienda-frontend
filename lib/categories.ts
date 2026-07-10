// Categorías de producto, fuente única de verdad para el catálogo y el panel.
// El <select> del formulario de admin y el filtro del storefront deben usar
// esta lista (antes estaba duplicada inline en app/(storefront)/products/page.tsx).
export const CATEGORIES = [
  'Café',
  'CBD y Bienestar',
  'Cultivo',
  'Accesorios',
] as const

export type Category = (typeof CATEGORIES)[number]
