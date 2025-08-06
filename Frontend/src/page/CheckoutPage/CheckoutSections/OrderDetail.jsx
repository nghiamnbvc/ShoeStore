import React, { useEffect, useState } from "react";

const OrderDetail = () => {
  const [cartItems, setCartItems] = useState([]);
  const backendUrl = "http://localhost:5235";

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("checkoutItems") || "[]");
    setCartItems(data);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productVariant.price;
    const discount = item.productVariant.discountPercent || 0;
    const discountedPrice = price * (1 - discount / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  const shippingFee = 0; // Cập nhật giống hình
  const total = subtotal + shippingFee;

  return (
    <div className="w-full md:w-[400px] mt-4 leading-10">
      <h2 className="text-2xl font-sans font-semibold">Order Summary</h2>

      {/* Subtotal + Shipping + Total */}

      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{subtotal.toLocaleString()} đ</span>
      </div>

      <div className="flex justify-between">
        <span>Estimated Delivery & Handling</span>
        <span>
          {shippingFee === 0 ? "Free" : `${shippingFee.toLocaleString()} đ`}
        </span>
      </div>

      <div className="border-y py-2 flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>{total.toLocaleString()} đ</span>
      </div>

      <div className="mt-4">
        {cartItems.map((item, index) => (
          <div key={index} className="flex gap-4 mt-4 items-start">
            <img
              src={`${backendUrl}${item.productVariant.imageUrl}`}
              alt={item.productVariant.productName}
              className="w-32 h-32 object-cover border rounded"
            />
            <div className="flex flex-col justify-between">
              <div>
                <p className="font-medium leading-snug">
                  {item.productVariant.productName}
                </p>
                <p className="text-gray-600 text-sm">Qty {item.quantity}</p>
                <p className="text-gray-600 text-sm">
                  Size {item.productVariant.sizeName}
                </p>
              </div>
              <p className="font-medium mt-1">
                {(
                  item.productVariant.price *
                  (1 - item.productVariant.discountPercent / 100) *
                  item.quantity
                ).toLocaleString("vi-VN")}
                ₫
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderDetail;
