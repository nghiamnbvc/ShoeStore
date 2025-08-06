import React from "react";
import { useHistory } from "react-router-dom";

const CartItem = ({
  id,
  productId,
  name,
  gender,
  quantity,
  category,
  size,
  color,
  price,
  discountPercent,
  imgUrl,
  onIncrease,
  onDecrease,
  onDelete,
}) => {
  const backendUrl = "http://localhost:5235";

  const history = useHistory();

  const handleProductClick = () => {
    history.push(`/productdetail/${productId}`);
  };

  const finalPrice = price * (1 - discountPercent / 100);

  return (
    <div className="flex border-b pb-6">
      <div className="flex flex-col">
        <div className="flex justify-center items-center bg-gray-100">
          <img
            src={`${backendUrl}${imgUrl}`}
            className="w-[220px] h-[220px] cursor-pointer"
            onClick={handleProductClick}
          />
        </div>

        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={() => onDelete(id)}
            className="text-gray-600 hover:text-red-600 text-lg "
          >
            🗑️
          </button>
          <div className="flex items-center border border-gray-300 rounded-full px-3 py-1">
            <button onClick={() => onDecrease(id)} className="px-2 ">
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => onIncrease(id)} className="px-2 ">
              +
            </button>
          </div>
          <button className="text-gray-600 hover:text-pink-500 text-lg">
            🤍
          </button>
        </div>
      </div>

      {/* Cột thông tin sản phẩm */}
      <div className="flex-1 ml-6">
        <div className="flex flex-col space-y-1 text-gray-800">
          <div className="text-lg font-semibold font-montserrat text-coral-red">
            {name}
          </div>
          <div className="text-base text-gray-500 font-montserrat">
            {gender}
          </div>
          <div className="text-base text-gray-500 font-montserrat">
            {category}
          </div>
          <div className="text-base text-gray-600 font-montserrat">
            Size: <span className="font-medium">{size}</span>
          </div>
          <div className="text-base text-gray-600 font-montserrat">
            Color: <span className="font-medium">{color}</span>
          </div>
        </div>
      </div>

      {/* Cột giá */}
      <div className="flex flex-col items-end ml-auto">
        <p className="text-lg font-semibold text-coral-red">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(finalPrice)}
        </p>

        {discountPercent > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm text-gray-500 line-through">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(price)}
            </p>
            <span className="text-xs text-red-500 bg-red-100 px-2 py-0.5 rounded font-bold">
              -{discountPercent}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartItem;
