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
    page.tsx                  # Catálogo con filtro por categoría (?category=X)
    [id]/page.tsx             # Detalle de producto
  cart/
    page.tsx                  # Carrito de compras
  checkout/
    page.tsx                  # Formulario de checkout + integración MercadoPago
    success/page.tsx          # Confirmación de orden

components/
  Navbar.tsx                  # Logo Moccana, links, contador de carrito reactivo
  Footer.tsx                  # Footer con identidad Moccana
  Hero.tsx                    # Carousel automático 4 slides (5s), dots navegables
  Categories.tsx              # Grilla de 4 categorías en la home
  FeaturedProducts.tsx        # 3 productos destacados en la home
  ProductCard.tsx             # Tarjeta de producto con link a detalle
  AddToCartButton.tsx         # Client Component para Zustand en Server Pages
  CategoryFilter.tsx          # Botones de filtro por categoría en /products

store/
  cartStore.ts                # Estado global del carrito (Zustand + localStorage persist)

lib/
  api.ts                      # getProducts(), getProduct(id) → fetch a NEXT_PUBLIC_API_URL

types/
  index.ts                    # interface Product { id, name, description, price, image, category }
```

## Categorías
| Ícono | Nombre |
|---|---|
| ☕ | Café |
| 🌿 | Cannabis Medicinal |
| 🌱 | Cultivo |
| 🛠️ | Accesorios |

## Paleta de colores Moccana
| Nombre | Valor | Uso |
|---|---|---|
| Vino | `#6B1010` | Navbar, footer, títulos, botones activos |
| Dorado | `#CD8C1F` | Acentos, links, badges, hover |

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
- Leer `state.items` directamente (no `totalItems()`) genera reactividad en Zustand
- Páginas con fetch al backend usan `export const dynamic = 'force-dynamic'`
- Imágenes de Cloudinary y placehold.co configuradas en `next.config.ts` con `remotePatterns`
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

## Pendiente
- Panel de admin (`/admin`) con auth por roles
- Subida de imágenes a Cloudinary desde el admin
- Gestión de imágenes para el carousel de la home
