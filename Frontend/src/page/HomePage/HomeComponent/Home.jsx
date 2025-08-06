import React from "react";
import {
  CustomerReviews,
  Hero,
  Footer,
  PopularProducts,
  Services,
  SpecialOffer,
  Subscribe,
  SuperQuality,
} from "../HomeSections/index";
import Highlights from "../HomeSections/Highlights";

const Home = () => {
  return (
    <main className="relative">
      <section className="xl:padding-1 wide:padding-r padding-b">
        <Hero />
      </section>
      <section className="padding">
        <Highlights />
      </section>
      <section className="px-4 padding-y ">
        <SpecialOffer />
      </section>
      <section className="padding">
        <PopularProducts />
      </section>
      <section className="padding-x py-10">
        <Services />
      </section>

      <section className="bg-pale-blue padding">
        <CustomerReviews />
      </section>
      <section className="padding-x sm:py-32 py-16 w-full">
        <Subscribe />
      </section>
      <section className="bg-black padding-x padding-t pb-8">
        <Footer />
      </section>
    </main>
  );
};

export default Home;
