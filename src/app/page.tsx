import HeroSlideshow from '@/components/HeroSlideshow'
import QuoteSection from '@/components/QuoteSection'
import BrandCards from '@/components/BrandCards'
import StatsSection from '@/components/StatsSection'
import BlogSection from '@/components/BlogSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <HeroSlideshow />
      <QuoteSection />
      <BrandCards />
      <StatsSection />
      <BlogSection />
      <div style={{ backgroundColor: '#F9A8BB' }}>
        <Footer />
      </div>
    </>
  )
}
