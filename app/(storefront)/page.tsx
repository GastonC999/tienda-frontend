import Hero from '@/components/Hero'
import Categories from '@/components/Categories'
import FeaturedProducts from '@/components/FeaturedProducts'
import { getHeroSlides } from '@/lib/api'
import type { HeroSlide } from '@/types'

export default async function Home() {
  const slides: HeroSlide[] = await getHeroSlides()

  return (
    <div>
      <Hero slides={slides} />
      <Categories />
      <FeaturedProducts />
    </div>
  )
}
