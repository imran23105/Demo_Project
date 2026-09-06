import Sidebar from '../components/layout/Sidebar';
import HeroSection from '../components/home/HeroSection';
import Categories from '../components/home/Categories';
import TrendingProducts from '../components/home/TrendingProducts';
import BannerSection from '../components/home/BannerSection';
import FeaturedCollections from '../components/home/FeaturedCollections';
import BestSellers from '../components/home/BestSellers';

const Home = () => (
  <div className="container-custom py-4">
    <div className="flex gap-5">
      {/* Sidebar */}
      <aside className="hidden lg:block w-56 flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <HeroSection />
        <Categories />
        <TrendingProducts />
        <BannerSection />
        <FeaturedCollections />
      </div>
    </div>
  </div>
);

export default Home;
