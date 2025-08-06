import React, { useState } from "react";
import SideBar from "../ProductSections/SideBar";
import Main from "../ProductSections/Main";
import { Footer, PopularProducts } from "../../HomePage/HomeSections";

const Products = ({ title }) => {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (
    <main className="relative pt-40">
      {/* Wrapper for Sidebar and Main */}
      <section className="flex flex-col sm:flex-row">
        {/* Sidebar */}
        <section className="w-full sm:w-[380px] xl:padding-1 wide:padding-r padding-b">
          <SideBar
            title={title}
            onCategoryClick={(cat) => setSelectedCategory(cat)}
            selectedCategory={selectedCategory}
          />
        </section>

        {/* Main content */}
        <section className="flex-1">
          <Main category={selectedCategory} />
        </section>
      </section>

      <section className="mt-24">
        <PopularProducts />
      </section>

      {/* Footer */}
      <section className="bg-black padding-x padding-t pb-8">
        <Footer />
      </section>
    </main>
  );
};

export default Products;
