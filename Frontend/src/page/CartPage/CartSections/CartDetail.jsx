import React from "react";
import Button from "../../../components/Button";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const CartDetail = ({ cartItems }) => {
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.productVariant.price;
    const discount = item.productVariant.discountPercent || 0;
    const discountedPrice = price * (1 - discount / 100);
    return sum + discountedPrice * item.quantity;
  }, 0);

  const shippingFee = 0; // ví dụ phí vận chuyển cố định

  const total = subtotal + shippingFee;

  return (
    <aside className="flex flex-col leading-9 font-medium">
      <div>
        <h2 className="text-3xl font-montserrat">Summary</h2>

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
      </div>

      <div className="border-y py-2 flex justify-between font-semibold text-lg">
        <span>Total</span>
        <span>{total.toLocaleString()} đ</span>
      </div>

      <div className="my-4">
        <Link
          to="/checkout"
          onClick={() =>
            localStorage.setItem("checkoutItems", JSON.stringify(cartItems))
          }
        >
          <button className="bg-coral-red text-white rounded-full border-x-coral-red px-7 py-4 font-montserrat text-lg leading-none w-full">
            Check out
          </button>
        </Link>
      </div>
    </aside>
  );
};

export default CartDetail;
