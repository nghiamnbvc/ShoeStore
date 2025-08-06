import React from "react";
import ProductCard from "../../../components/ProductCard";

const SearchProducts = ({ products }) => {
  return (
    <div className="w-full">
      {products.length === 0 ? (
        <p className="mt-8 text-lg text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchProducts;
