import React from "react";
import Banner from "../NewArrivalSections/Banner";
import { Subscribe } from "../../HomePage/HomeSections";
import { Footer } from "../../HomePage/HomeSections";
import Main from "../NewArrivalSections/Main";

const NewArrival = () => {
  return (
    <main className="relative ">
      <section>
        <Banner />
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

export default NewArrival;
