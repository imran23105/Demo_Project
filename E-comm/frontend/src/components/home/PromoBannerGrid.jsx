import { Link } from 'react-router-dom';
import { FiArrowRight, FiZap } from 'react-icons/fi';

const PromoBannerGrid = () => {
  return (
    <section className="py-4">
      <div className="max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
          {/* ─── Card 1: Mega Appliance Sale (Wide Dark Emerald Card) ── */}
          <div className="md:col-span-12 lg:col-span-6 relative bg-gradient-to-r from-[#0B1A10] via-[#0E2616] to-[#14361F] text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-900/30 overflow-hidden flex flex-col justify-between min-h-[300px]">
            {/* Glow effect */}
            <div className="absolute top-1/2 right-10 -translate-y-1/2 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <div className="flex items-center gap-2 text-brand-red font-black text-xs tracking-wider uppercase">
                <FiZap size={14} className="fill-brand-red" />
                <span>Limited Time Offer</span>
              </div>

              <div className="flex items-baseline justify-between gap-4 flex-wrap">
                <div>
                  <h3 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
                    Mega Appliance Sale
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 mt-1">
                    Top brands. Bigger savings.
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold block">UP TO</span>
                  <span className="font-display font-black text-3xl sm:text-4xl text-[#CEF04A] leading-none">60%</span>
                  <span className="text-xs font-bold text-white ml-1">OFF</span>
                </div>
              </div>
            </div>

            {/* Visual + CTA */}
            <div className="relative z-10 pt-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <Link
                to="/shop?sort=discountPercent"
                className="inline-flex items-center gap-2.5 bg-brand-red hover:bg-brand-redHover text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full shadow-lg shadow-red-900/40 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <span>Grab the Deal</span>
                <FiArrowRight size={14} />
              </Link>

              <div className="w-full sm:w-1/2 max-h-36 overflow-hidden rounded-2xl border border-white/10 shadow-inner">
                <img
                  src="/assets/promo_mega_sale.jpg"
                  alt="Mega Appliance Sale Showcase"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* ─── Card 2: Smart Kitchen (Warm Wood Japandi Style) ─────── */}
          <div className="md:col-span-6 lg:col-span-3 relative bg-white rounded-3xl p-5 sm:p-6 shadow-md border border-gray-100 overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="relative z-10">
              <h3 className="font-display font-extrabold text-xl text-slate-900 leading-snug">
                Make Everyday Extraordinary
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Smart Kitchen • Smart Living
              </p>
            </div>

            {/* Kitchen Imagery */}
            <div className="relative my-3 flex-1 min-h-[110px] rounded-2xl overflow-hidden border border-gray-100">
              <img
                src="/assets/promo_smart_kitchen.jpg"
                alt="Smart Kitchen Appliances"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative z-10 pt-1">
              <Link
                to="/shop?category=kitchen-appliances"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#CEF04A] hover:bg-[#BDE032] text-slate-950 text-xs font-bold py-2.5 px-4 rounded-full shadow-sm hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <span>Explore Kitchen</span>
                <FiArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* ─── Card 3: Cooler Homes Happier You (Crimson Red AC Banner) */}
          <div className="md:col-span-6 lg:col-span-3 relative bg-gradient-to-br from-[#A0141A] via-[#B8161D] to-[#870F14] text-white rounded-3xl p-5 sm:p-6 shadow-md overflow-hidden flex flex-col justify-between min-h-[300px]">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-extrabold text-xl text-white leading-snug">
                    Cooler Homes
                  </h3>
                  <p className="text-xs text-red-200 mt-0.5">Happier You</p>
                </div>
                <span className="text-2xl text-red-200 animate-pulse">❄️</span>
              </div>
            </div>

            {/* AC Imagery */}
            <div className="relative my-3 flex-1 min-h-[110px] rounded-2xl overflow-hidden bg-black/10 border border-white/10">
              <img
                src="/assets/promo_air_conditioner.jpg"
                alt="Smart Air Conditioner"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="relative z-10 pt-1">
              <Link
                to="/shop?category=air-conditioners"
                className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-brand-red text-xs font-bold py-2.5 px-4 rounded-full shadow-sm hover:scale-[1.02] active:scale-95 transition-all duration-200"
              >
                <span>Shop ACs</span>
                <FiArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBannerGrid;
