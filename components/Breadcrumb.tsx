import Link from 'next/link'

export interface Crumb {
  label: string
  href?: string // sin href = item actual (no enlazable)
}

// Breadcrumb de navegación genérico. El último item (sin href) representa la
// página actual y se muestra en crema sólido; los anteriores son links.
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Migas de pan" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:opacity-80"
                  style={{ color: 'rgba(245, 230, 200, 0.5)' }}
                >
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: '#F5E6C8' }} aria-current="page">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span style={{ color: 'rgba(245, 230, 200, 0.3)' }}>›</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
