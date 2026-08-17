import React from "react";
import HeroSection from "../../components/home/HeroSection";
import CategorySection from "../../components/home/CategorySection";
import BestSellerSection from "../../components/home/BestSellerSection";
import NewArrivalSection from "../../components/home/NewArrivalSection";
import OfferBanner from "../../components/home/OfferBanner";
import WhyBrita from "../../components/home/WhyBrita";
import InstagramGallery from "../../components/home/InstagramGallery";
import Newsletter from "../../components/home/Newsletter";

export default function Home() {
  return (
    <>
      <HeroSection />
      <CategorySection />
      <BestSellerSection />
      <OfferBanner />
      <NewArrivalSection />
      <WhyBrita />
      <InstagramGallery />
      <Newsletter />
    </>
  );
}
