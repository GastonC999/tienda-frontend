# Frontend — Moccana

Stack: Next.js 16 · TypeScript · Tailwind CSS · Zustand

## Requisitos
- Node.js 20+

## Instalación
```bash
npm install
```

## Desarrollo
```bash
npm run dev → http://localhost:3000
```

## Variables de entorno
Creá un archivo `.env.local` en la raíz del proyecto:
```
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```
En producción (Vercel) esta variable apunta a la URL del backend en Railway.

## Estructura
```
app/
  layout.tsx                  # Layout global (Navbar + Footer)
  page.tsx                    # Home: Hero + Categorías + Destacados
  globals.css                 # Estilos globales + Tailwind
  products/
    page.tsx                  # Catálogo con filtro por categoría
    [id]/page.tsx             # Detalle de producto
  cart/
    page.tsx                  # Carrito de compras
  checkout/
    page.tsx                  # Formulario de checkout
    success/page.tsx          # Confirmación de orden

components/
  Navbar.tsx                  # Navbar con logo Moccana, contador de carrito reactivo
  Footer.tsx                  # Footer con identidad Moccana
  Hero.tsx                    # Carousel automático con 4 slides (categorías)
  Categories.tsx              # Grilla de categorías en la home
  FeaturedProducts.tsx        # 3 productos destacados en la home
  ProductCard.tsx             # Tarjeta de producto con link a detalle
  AddToCartButton.tsx         # Botón agregar al carrito (Client Component)
  CategoryFilter.tsx          # Filtros de categoría en /products

store/
  cartStore.ts                # Estado global del carrito (Zustand + localStorage)

lib/
  api.ts                      # Llamadas al backend (getProducts, getProduct)

types/
  index.ts                    # Interface Product
```

## Categorías disponibles
- ☕ Café
- 🌿 Cannabis Medicinal
- 🌱 Cultivo
- 🛠️ Accesorios

## Paleta de colores Moccana
| Variable | Valor | Uso |
|---|---|---|
| Vino | `#581A1B` | Color principal, navbar, footer |
| Dorado | `#C8902A` | Acentos, botones, links |

## Estado global: cartStore
| Propiedad/Método | Tipo | Descripción |
|---|---|---|
| `items` | `CartItem[]` | Lista de productos en el carrito |
| `addItem(product)` | `void` | Agrega producto o incrementa cantidad |
| `removeItem(id)` | `void` | Reduce cantidad o elimina el item |
| `clearCart()` | `void` | Vacía el carrito completo |
| `totalItems()` | `number` | Suma total de unidades |
| `totalPrice()` | `number` | Precio total del carrito |

## Comunicación con el backend
| Función | Método | Endpoint |
|---|---|---|
| `getProducts()` | GET | `/api/products` |
| `getProduct(id)` | GET | `/api/products/{id}` |

## Consideraciones importantes
- Componentes que usan Zustand necesitan `'use client'`
- El Navbar usa el patrón `mounted` para evitar errores de hidratación con localStorage
- Las páginas de productos usan `export const dynamic = 'force-dynamic'` para evitar errores de prerenderizado en build
- Imágenes externas requieren configuración en `next.config.ts`
- CORS configurado en el backend para `localhost:3000`

## Scripts
| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo en localhost:3000 |
| `npm run build` | Compila para producción |
| `npm run start` | Servidor de producción |
| `npm run lint` | Corre ESLint |

## Deploy
Deployado en **Vercel**. Redespliega automáticamente con cada push a `main`.