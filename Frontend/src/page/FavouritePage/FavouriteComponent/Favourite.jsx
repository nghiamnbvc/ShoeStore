import React from "react";
import { Footer } from "../../HomePage/HomeSections";
import { Subscribe } from "../../HomePage/HomeSections";
import Main from "../FavouriteSections/Main";


const Favourite = () => {

  return (
    <main className="relative pt-40">
      <section className="max-container">
        <Main/>
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

export default Favourite;
