import React, { useState, useEffect } from "react";
import ProductCard from "../../../components/ProductCard";
import { useLocation, useHistory } from "react-router-dom";

const Main = ({ category }) => {
  const [selectedGender, setSelectedGender] = useState("Men");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const location = useLocation();

  // Đồng bộ selectedGender với URL khi component được render
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("women")) {
      setSelectedGender("Women");
    } else if (path.includes("men")) {
      setSelectedGender("Men");
    }
  }, [location.pathname]);

  // Fetch API khi selectedGender thay đổi, có sử dụng AbortController
  useEffect(() => {
    const controller = new AbortController(); // Tạo AbortController mới
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:5235/api/ProductApi/gender/${selectedGender.toLowerCase()}`;
        if (category) {
          url += `?category=${encodeURIComponent(category)}`;
        }
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        if (error.name === "AbortError") {
          console.log("Request aborted");
        } else {
          console.error("Error fetching products:", error);
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Cleanup: hủy request nếu selectedGender thay đổi nhanh
    return () => {
      controller.abort();
    };
  }, [selectedGender, category]);

  return (
    <section className="max-container min-h-screen px-6">
      <div className="flex flex-col gap-6">
        {/* Gender Switch */}
        <div className="flex justify-end">
          <div className="flex bg-white p-1 rounded-full shadow-md">
            {["Men", "Women"].map((gender) => (
              <button
                key={gender}
                onClick={() => {
                  setSelectedGender(gender);
                  history.push(`/${gender.toLowerCase()}`);
                }}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-300 
                  ${
                    selectedGender === gender
                      ? "bg-coral-red text-white shadow"
                      : "text-gray-700"
                  }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards */}
        {loading ? (
          <p className="text-center text-gray-500">Đang tải sản phẩm...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Main;
