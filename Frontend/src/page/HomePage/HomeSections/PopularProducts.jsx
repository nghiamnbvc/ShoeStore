import React from "react";
import PopularProductCard from "../../../components/PopularProductCard.jsx";
import { useState, useEffect } from "react";

const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const [showScroll, setShowScroll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5235/api/ProductApi")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })

      .then((data) => {
        console.log("Fetched products:", data); // ✅ Thêm dòng này
        setProducts(data);
      })

      .catch((error) => console.error("Error fetching products:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="products" className="max-container max-sm:mt-12 pb-12">
      <div
        className="flex flex-col
            justify-start gap-5"
      >
        <h2
          className="text-4xl
                font-palanquin font-bold"
        >
          Our
          <span
            className="text-coral-red
                    "
          >
            Popular
          </span>
          Products
        </h2>
      </div>

      {loading ? (
        <p className="mt-8 text-lg text-gray-500">Loading products...</p>
      ) : (
        <div
          className={`mt-16 pb-4 cursor-pointer ${
            showScroll ? "overflow-x-auto scrollbar-hide" : "overflow-hidden"
          }`}
          onMouseEnter={() => setShowScroll(true)}
          onMouseLeave={() => setShowScroll(false)}
          style={{ paddingBottom: "20px" }}
        >
          <div className="flex gap-4 w-fit">
            {products.map((product) => (
              <div className="min-w-[360px] shrink-0" key={product.id}>
                <PopularProductCard {...product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default PopularProducts;
