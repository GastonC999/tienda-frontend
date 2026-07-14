import Link from 'next/link'

const CATEGORIES = [
  {
    name: 'Café',
    description: 'Single origin, blends, cápsulas y utensillos',
    icon: '☕',
    href: '/products?category=Caf%C3%A9',
    color: '#581A1B',
  },
  {
    name: 'Cultivo',
    description: 'Fertilizantes, carpas, luces y sustrato',
    icon: '🌱',
    href: '/products?category=Cultivo',
    color: '#1A2A0A',
  },
  {
    name: 'Accesorios',
    description: 'Papeles, picadores, vapers y más',
    icon: '🛠️',
    href: '/products?category=Accesorios',
    color: '#003647',
  },
]

export default function Categories() {
  return (
    <section className="py-20">
      <h2 className="text-3xl font-bold mb-2" style={{ color: '#F5E6C8' }}>
        Categorías
      </h2>
      <p className="mb-10" style={{ color: 'rgba(245, 230, 200, 0.5)' }}>Encontrá lo que buscás</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CATEGORIES.map(cat => (
          <Link
            key={cat.name}
            href={cat.href}
            className="group relative overflow-hidden rounded-2xl p-8 transition-transform hover:-translate-y-1"
            style={{ backgroundColor: cat.color, border: '1px solid rgba(200, 144, 42, 0.2)' }}
          >
            <div className="text-4xl mb-4">{cat.icon}</div>
            <h3 className="text-xl font-semibold text-white mb-2">{cat.name}</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)' }} className="text-sm">
              {cat.description}
            </p>
            <span
              className="absolute bottom-6 right-6 text-2xl transition-transform group-hover:translate-x-1"
              style={{ color: '#CD8C1F' }}
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}