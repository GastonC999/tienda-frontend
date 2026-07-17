# Frontend — Moccana

Stack: Next.js 16 · TypeScript · Tailwind CSS · Zustand · NextAuth v5 (Auth.js) · Recharts

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
AUTH_SECRET=<secreto-generado>
```
- `NEXT_PUBLIC_API_URL`: en producción (Vercel) apunta a la URL del backend en Railway.
- `AUTH_SECRET`: secreto que usa NextAuth para firmar/encriptar la cookie de sesión.
  Generalo con `openssl rand -base64 32`. Es obligatorio en producción.

## Autenticación del panel `/admin`
Las rutas `/admin/*` están protegidas con [NextAuth](https://authjs.dev) (Auth.js v5):
- `/login` usa un Credentials provider que delega la validación en el backend
  (`POST /api/auth/login` vía `login()` de `lib/api.ts`) y guarda el JWT del backend
  y el rol dentro de la cookie de sesión **httpOnly** (no accesible por JavaScript).
- `middleware.ts` redirige a `/login` cuando no hay sesión, y restringe
  `/admin/orders` y `/admin/stats` al rol `ADMIN` (un `EDITOR` va a `/admin/products`).
- La configuración central de NextAuth vive en `auth.ts` (provider + callbacks
  `jwt`/`session` que exponen `role` y `backendToken`).

### Patrón BFF para llamadas autenticadas
El JWT del backend vive en una cookie **httpOnly**, así que el navegador no puede
leerlo. Las mutaciones y lecturas protegidas **nunca se llaman desde el cliente**:
los route handlers de `app/api/admin/*` y `app/api/upload` obtienen el token en el
servidor con `auth()` y lo reenvían al backend con `Authorization: Bearer <token>`.

## Estructura
```
app/
  layout.tsx                       # Layout raíz (fuentes, ToastProvider)
  globals.css                      # Estilos globales + Tailwind
  not-found.tsx                    # Página 404
  icon.svg                         # Favicon
  (storefront)/                    # Route group público (Navbar + Footer)
    layout.tsx                     # Layout de la tienda
    page.tsx                       # Home: Hero + Categorías + Destacados
    products/
      page.tsx                     # Catálogo con filtros (búsqueda, precio, orden)
      loading.tsx                  # Skeleton del catálogo
      [id]/page.tsx                # Detalle de producto (galería + relacionados)
      [id]/loading.tsx             # Skeleton del detalle
    cart/page.tsx                  # Carrito de compras
    checkout/page.tsx              # Checkout + integración MercadoPago
    checkout/success/page.tsx      # Confirmación de orden
  (admin)/                         # Route group del panel
    login/page.tsx                 # Login del admin (/login)
    admin/(panel)/
      layout.tsx                   # Shell del panel (Sidebar + Header)
      page.tsx                     # Entrada del panel
      products/page.tsx            # ABM de productos (ADMIN/EDITOR)
      orders/page.tsx              # Gestión de órdenes (solo ADMIN)
      stats/page.tsx               # Dashboard de estadísticas (solo ADMIN)
      images/page.tsx              # Gestión de slides del Hero
  api/                             # Route handlers (BFF: reenvían el token)
    auth/[...nextauth]/route.ts    # Endpoints de NextAuth
    admin/products/route.ts        # POST (crear producto)
    admin/products/[id]/route.ts   # PUT / DELETE producto
    admin/orders/[id]/status/route.ts  # PATCH estado de orden
    admin/slides/[id]/route.ts     # PUT slide del Hero
    upload/route.ts                # Sube imagen a Cloudinary vía backend

auth.ts                            # Configuración central de NextAuth (Auth.js v5)
middleware.ts                      # Guardia de /admin/* (sesión + rol)

components/
  Navbar.tsx                       # Logo Moccana, links, contador de carrito reactivo
  Footer.tsx                       # Footer con identidad y contactos Moccana
  Hero.tsx                         # Carousel automático, dots navegables
  Categories.tsx                   # Grilla de categorías en la home
  FeaturedProducts.tsx             # Productos destacados en la home
  ProductCard.tsx                  # Tarjeta de producto con link a detalle
  ProductCardSkeleton.tsx          # Placeholder de carga de tarjeta
  ProductGallery.tsx               # Galería de imágenes del detalle
  RelatedProducts.tsx              # Productos relacionados en el detalle
  Breadcrumb.tsx                   # Migas de pan de navegación
  AddToCartButton.tsx              # Client Component para Zustand en Server Pages
  CategoryFilter.tsx               # Botones de filtro por categoría en /products
  ToastProvider.tsx                # Contexto de notificaciones (toasts)
  products/                        # Controles de filtro del catálogo
    SearchBar.tsx                  # Búsqueda por texto
    PriceRangeFilter.tsx           # Filtro por rango de precio
    SortSelect.tsx                 # Selector de orden
    ProductFilters.tsx             # Contenedor de filtros
  admin/                           # UI del panel
    AdminShell.tsx  Sidebar.tsx  Header.tsx
    products/                      # ProductManager, ProductsTable, ProductFormModal, ConfirmDialog
    orders/                        # OrderManager, OrdersTable, OrderDetailModal, OrderStatusBadge
    stats/                         # StatsDashboard, StatCard, SalesLineChart, CategoryBarChart, TopProductsTable
    images/                        # HeroSlideManager, HeroSlideFormModal

store/
  cartStore.ts                     # Estado global del carrito (Zustand + localStorage persist)

lib/
  api.ts                           # Cliente del backend (fetch a NEXT_PUBLIC_API_URL)
  categories.ts                    # CATEGORIES: fuente única de verdad de categorías
  productFilters.ts                # Parseo, filtrado y orden del catálogo

types/
  index.ts                         # Product, Order, HeroSlide, Stats, AuthUser, Role, etc.
  next-auth.d.ts                   # Extiende la sesión de NextAuth (role, backendToken)
```

## Categorías
Fuente única de verdad en `lib/categories.ts` (la usan el filtro del storefront y el
`<select>` del formulario del admin).

| Ícono | Nombre |
|---|---|
| ☕ | Café |
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
| `addItem(product, quantity?)` | `void` | Agrega producto (cantidad opcional, default 1) o incrementa |
| `removeItem(id)` | `void` | Reduce cantidad o elimina el item |
| `clearCart()` | `void` | Vacía el carrito completo |
| `totalItems()` | `number` | Suma total de unidades |
| `totalPrice()` | `number` | Precio total del carrito |

## Comunicación con el backend (`lib/api.ts`)
Las funciones marcadas con 🔒 reciben el `token` del backend por parámetro y solo se
invocan desde los route handlers (patrón BFF); nunca desde el navegador.

| Función | Método | Endpoint | |
|---|---|---|---|
| `login()` | POST | `/api/auth/login` | consumida por NextAuth |
| `getProducts()` | GET | `/api/products` | público |
| `getProduct(id)` | GET | `/api/products/{id}` | público |
| `getHeroSlides()` | GET | `/api/slides` | público |
| `createProduct()` | POST | `/api/products` | 🔒 |
| `updateProduct()` | PUT | `/api/products/{id}` | 🔒 |
| `deleteProduct()` | DELETE | `/api/products/{id}` | 🔒 |
| `updateHeroSlide()` | PUT | `/api/slides/{id}` | 🔒 |
| `getOrders()` | GET | `/api/orders` | 🔒 solo ADMIN |
| `updateOrderStatus()` | PATCH | `/api/orders/{id}/status` | 🔒 |
| `getStats()` | GET | `/api/stats` | 🔒 solo ADMIN |
| `uploadImage()` | POST | `/api/upload` | 🔒 sube a Cloudinary |

## Consideraciones importantes
- Componentes que usan Zustand necesitan `'use client'`
- El Navbar usa el patrón `mounted` para evitar errores de hidratación con localStorage
- Leer `state.items` directamente (no `totalItems()`) genera reactividad en Zustand
- Páginas con fetch al backend usan `export const dynamic = 'force-dynamic'`
- Las llamadas autenticadas siguen el patrón BFF: el token viaja server-side, nunca al cliente
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
- Alta y baja de slides del Hero desde el admin (hoy solo edición de los existentes)
- Tests automatizados (unitarios / e2e)
