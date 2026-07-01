import { getHeroSlides } from '@/lib/api'
import type { HeroSlide } from '@/types'
import HeroSlideManager from '@/components/admin/images/HeroSlideManager'

// Gestión de las imágenes del carousel Hero. El GET de slides es público, así
// que se hace en el servidor (como en productos). force-dynamic asegura datos
// frescos tras cada edición (router.refresh()).
export const dynamic = 'force-dynamic'

export default async function AdminImagesPage() {
  const slides: HeroSlide[] = await getHeroSlides()

  return <HeroSlideManager slides={slides} />
}
