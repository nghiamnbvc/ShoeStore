import React, { useState } from "react";
import SearchBar from "../SearchSections/SearchBar";
import PopularProduct from "../../HomePage/HomeSections/PopularProducts";
import Subscribe from "../../HomePage/HomeSections/Subscribe";
import Footer from "../../HomePage/HomeSections/Footer";
import SearchProducts from "../SearchSections/SearchProducts";

const Search = () => {
  const [results, setResults] = useState([]);
  return (
    <main className="relative pt-40">
      <section className="max-container ">
        <section>
          <SearchBar onResults={setResults} />
        </section>
        <section>
          <SearchProducts products={results} />
        </section>
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

export default Search;
