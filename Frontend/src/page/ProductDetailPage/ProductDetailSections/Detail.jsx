import React, { useState } from "react";
import Button from "../../../components/Button";
import { toast } from "react-toastify";

const Detail = ({ product }) => {
  const handleAddToWishlist = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5235/api/WishlistApi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      toast.success("❤️ Added to wishlist!");
    } catch (error) {
      console.error("❌ Failed to add wishlist:", error.message);
      toast.error("⚠️ An error occurred while adding to wishlist.");
    }
  };
  // Lấy danh sách màu duy nhất với name và hexCode
  const uniqueColors = [
    ...new Map(
      product.productVariants.map((v) => [
        v.color?.name,
        { name: v.color?.name, hexCode: v.color?.hexCode || "#000000" },
      ])
    ).values(),
  ];

  const uniqueSizes = [
    ...new Set(product.productVariants.map((v) => v.size?.name)),
  ];

  const [selectedColor, setSelectedColor] = useState(
    uniqueColors[0]?.name || ""
  );
  const [selectedSize, setSelectedSize] = useState(uniqueSizes[0] || "");

  const handleAddToCart = async () => {
    const variant = product.productVariants.find(
      (v) => v.color?.name === selectedColor && v.size?.name === selectedSize
    );

    if (!variant) {
      toast.error("Please choose the correct color and size.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5235/api/CartApi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          productVariantId: variant.productVariantId,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        let msg = "Không thể thêm vào giỏ hàng.";

        try {
          const data = JSON.parse(text);
          if (data?.message) msg = data.message;
        } catch {
          // Không parse được thì giữ nguyên msg
        }

        console.error("Lỗi Cart:", response.status, text);
        toast.error(`❌ ${msg}`);
        return;
      }

      toast.success("Added to Cart!");
    } catch (error) {
      console.error("Lỗi mạng khi gọi CartApi:", error);
      toast.error("Lỗi khi thêm sản phẩm vào giỏ.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8 bg-white ">
      {/* Product Title & Price */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">
          {product.name}
        </h1>
        <div className="flex items-center gap-3">
          {product.discountPercent > 0 && (
            <>
              <p className="text-base text-gray-500 line-through font-medium">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </p>
              <span className="text-sm text-red-500 bg-red-100 px-2 py-0.5 rounded font-bold">
                -{product.discountPercent}%
              </span>
            </>
          )}
        </div>
        <p className="mt-2 text-xl text-red-600 font-semibold">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(product.price * (1 - product.discountPercent / 100))}
        </p>
      </div>

      {/* Description */}
      <p className="text-gray-700 leading-relaxed">{product.description}</p>

      {/* Color Selection */}
      {uniqueColors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Color:</h4>
          <div className="flex flex-wrap gap-3">
            {uniqueColors.map((color, index) => (
              <button
                key={index}
                onClick={() => setSelectedColor(color.name)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full border text-sm capitalize transition-all
                  ${
                    selectedColor === color.name
                      ? "border-black  ring-black"
                      : "border-gray-300 hover:ring-1 hover:ring-gray-400"
                  }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.hexCode }}
                ></span>
                {color.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size Selection */}
      {uniqueSizes.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Size:</h4>
          <div className="flex flex-wrap gap-3">
            {uniqueSizes.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 rounded-md border text-sm
                  ${
                    selectedSize === size
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col  gap-4 pt-6">
        <button
          className="flex-1 px-6 py-4 bg-black text-white text-xl font-semibold rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-red-500 duration-200"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
        <button
          className="flex-1 px-6 py-4 bg-white text-xl font-semibold border-2 border-slate-400 rounded-full hover:ring-2 hover:ring-offset-2 hover:ring-red-500 duration-200"
          onClick={handleAddToWishlist}
        >
          Favourite
        </button>
      </div>
    </div>
  );
};

export default Detail;
