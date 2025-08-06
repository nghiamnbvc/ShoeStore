import CartItem from "../../../components/CartItem";
import { useState } from "react";

const CartProduct = ({ cartItems, setCartItems }) => {
  const token = localStorage.getItem("token");
  const handleIncrease = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedItems);
  };

  const handleDecrease = (id) => {
    const updatedItems = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedItems);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5235/api/CartApi/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const newCartItems = cartItems.filter((item) => item.id !== id);
      setCartItems(newCartItems);
    } catch (error) {
      console.error("Lỗi khi xoá mục khỏi giỏ hàng:", error);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <section className="max-w-4xl mx-auto px-4">
        <h3 className="text-3xl font-semibold font-montserrat mb-6">Bag</h3>
        <p>There are no items in your bag</p>
      </section>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-4">
      <h3 className="text-3xl font-semibold font-montserrat mb-6">Bag</h3>
      <ul className="space-y-6">
        {cartItems.map((item) => (
          <li key={item.id}>
            <CartItem
              id={item.id}
              productId={item.productVariant.productId}
              imgUrl={item.productVariant?.imageUrl}
              name={item.productVariant?.productName}
              gender={item.productVariant?.gender}
              color={item.productVariant?.colorName}
              category={item.productVariant?.category}
              size={item.productVariant?.sizeName}
              price={item.productVariant?.price}
              discountPercent={item.productVariant?.discountPercent}
              quantity={item.quantity}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onDelete={handleDelete}
            />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CartProduct;
