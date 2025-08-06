import React from "react";
import Main from "../../SalesPage/SalesSections/Main";
import { Subscribe } from "../../HomePage/HomeSections";
import { Footer } from "../../HomePage/HomeSections";
import SalesBanner from "../SalesSections/SalesBanner";

const Sales = () => {
  return (
    <main className="relative">
      <section>
        <SalesBanner />
      </section>
      <section>
        <Main />
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

export default Sales;
