import React from "react";
import { star } from "../assets/icons";
import gsap from "gsap";
import { useRef } from "react";
import { useHistory } from "react-router-dom";

const PopularProductCard = ({ id, imageUrl, name, price, discountPercent }) => {
  const history = useHistory();
  const backendUrl = "http://localhost:5235";
  const imageRef = useRef();
  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  const handleProductClick = () => {
    history.push(`/productdetail/${id}`);
  };

  return (
    <div
      className="flex flex-1 flex-col 
    w-full max-sm:w-full cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleProductClick}
    >
      <div className="flex justify-center items-center bg-gray-100">
        <img
          ref={imageRef}
          src={`${backendUrl}${imageUrl}`}
          alt={name}
          className="w-[280px] h-[280px]"
        />
      </div>
      <div
        className="mt-8 flex justify-start
        gap-2.5"
      >
        <img src={star} alt="rating" width={24} height={24} />
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
        <p className=" text-lg font-semibold font-montserrat text-coral-red">
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

export default PopularProductCard;
