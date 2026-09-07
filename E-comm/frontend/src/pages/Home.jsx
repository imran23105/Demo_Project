import HomeKartHero from '../components/home/HomeKartHero';
import ValueBar from '../components/home/ValueBar';
import PromoBannerGrid from '../components/home/PromoBannerGrid';
import Categories from '../components/home/Categories';
import TrendingProducts from '../components/home/TrendingProducts';
import BestSellers from '../components/home/BestSellers';

const Home = () => (
  <div className="w-full px-3 sm:px-4 lg:px-6 py-2">
    <div className="max-w-[1440px] mx-auto space-y-4 md:space-y-6">
      {/* 1. Hero Showcase with Integrated Left Category Menu */}
      <HomeKartHero />

      {/* 2. Value Proposition Floating Bar */}
      <ValueBar />

      {/* 3. Promo Banner Grid (Mega Sale, Smart Kitchen, AC Banner) */}
      <PromoBannerGrid />

      {/* 4. Browse By Categories */}
      <Categories />

      {/* 5. Trending Appliances & Products */}
      <TrendingProducts />

      {/* 6. Best Sellers */}
      <BestSellers />
    </div>
  </div>
);

export default Home;

