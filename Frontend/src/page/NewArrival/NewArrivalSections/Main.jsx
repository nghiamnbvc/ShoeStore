import React, { useState, useEffect } from "react";
import ProductCard from "../../../components/ProductCard";
import { useParams, useHistory } from "react-router-dom";

const Main = () => {
  const [newProducts, setNewProducts] = useState([]);
  const history = useHistory();
  const { gender } = useParams();

  useEffect(() => {
    if (gender) {
      fetch(`http://localhost:5235/api/ProductApi/${gender}-new-arrivals`)
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch new products");
          }
          return res.json();
        })
        .then((data) => setNewProducts(data))
        .catch((error) => console.error("Error:", error));
    }
  }, [gender]);

  return (
    <section>
      <div className="flex">
        <button
          onClick={() => history.push("/newarrival/men")}
          className={`flex-1 flex justify-center items-center text-xl font-montserrat py-2 transition-all duration-300 ${
            gender === "men"
              ? "border-b-2 border-black font-semibold font-montserrat"
              : "border-b-2 border-gray-300 text-gray-500"
          }`}
        >
          Men
        </button>
        <button
          onClick={() => history.push("/newarrival/women")}
          className={`flex-1 flex justify-center items-center text-lg font-montserrat py-2 transition-all duration-300 ${
            gender === "women"
              ? "border-b-2 border-black font-semibold font-montserrat"
              : "border-b-2 border-gray-300 text-gray-500"
          }`}
        >
          Women
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full mt-4 px-16">
        {newProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  );
};

export default Main;
