import { Link } from 'react-router-dom';
import { FiTruck, FiShield, FiRotateCcw, FiHeadphones, FiArrowRight, FiAward } from 'react-icons/fi';

const VALUE_ITEMS = [
  {
    icon: FiTruck,
    title: 'Free Delivery',
    subtitle: 'on all orders over ₹500',
  },
  {
    icon: FiShield,
    title: 'Secure Payment',
    subtitle: '100% safe & secure',
  },
  {
    icon: FiRotateCcw,
    title: 'Easy Returns',
    subtitle: 'Hassle free 7-day policy',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Support',
    subtitle: "We're always here for you",
  },
];

const ValueBar = () => {
  return (
    <section className="py-2.5">
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Features Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto flex-1 px-2">
            {VALUE_ITEMS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-slate-900 border border-gray-100 flex-shrink-0">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Premium Brands Pill Card */}
          <Link
            to="/shop?sort=ratings"
            className="w-full md:w-auto flex-shrink-0 bg-[#CEF04A] hover:bg-[#BDE032] text-slate-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-2xl md:rounded-full flex items-center justify-center gap-2.5 shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            <FiAward size={18} />
            <span>Premium Brands</span>
            <span className="text-xs font-semibold text-slate-700 hidden lg:inline">• All in one place</span>
            <FiArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ValueBar;
