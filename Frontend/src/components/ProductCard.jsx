import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { useHistory } from "react-router-dom";

const ProductCard = ({ id, imageUrl, name, price, discountPercent }) => {
  const backendUrl = "http://localhost:5235";
  const history = useHistory();

  const handleProductClick = () => {
    history.push(`/productdetail/${id}`);
  };

  return (
    <div
      onClick={handleProductClick}
      className="flex flex-1 flex-col 
    w-full max-sm:w-full cursor-pointer"
    >
      <div className="flex justify-center items-center bg-gray-100">
        <img
          src={`${backendUrl}${imageUrl}`}
          alt={name}
          className="w-[280px] h-[280px]"
          id="image-product"
        />
      </div>
      <div
        className="mt-8 flex justify-start
        gap-2.5"
      >
        <p
          className="font-montserrat
        text-l leading-normal text-slate-gray"
        >
          (4.5)
        </p>
      </div>
      <h3
        className="mt-2 text-xl leading-normal
      font-semibold"
      >
        {name}
      </h3>
      <div className="mt-2 flex items-center gap-2">
        <p className="text-lg font-semibold font-montserrat text-coral-red">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price * (1 - discountPercent / 100))}
        </p>
        {discountPercent > 0 && (
          <>
            <p className="text-base text-gray-500 line-through font-montserrat">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(price)}
            </p>
            <span className="text-sm text-red-500 bg-red-100 px-2 py-0.5 rounded font-bold">
              -{discountPercent}%
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
