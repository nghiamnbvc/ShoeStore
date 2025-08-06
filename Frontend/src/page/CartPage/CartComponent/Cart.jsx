import React, { useEffect, useState } from "react";
import CartProduct from "../CartSections/CartProduct";
import CartDetail from "../CartSections/CartDetail";
import {
  PopularProducts,
  Subscribe,
  Footer,
} from "../../HomePage/HomeSections";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchCart = async () => {
      try {
        const response = await fetch("http://localhost:5235/api/CartApi/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Lỗi khi lấy giỏ hàng");

        const data = await response.json();
        console.log("Cart Data:", data);
        setCartItems(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  if (loading) return <p className="text-center pt-20">Loading cart...</p>;

  return (
    <main className="relative pt-40">
      <section className="flex flex-col md:flex-row w-full max-container mb-6">
        <section className="w-full md:w-2/3">
          <CartProduct cartItems={cartItems} setCartItems={setCartItems} />
        </section>
        <section className="w-full md:w-1/3">
          <CartDetail cartItems={cartItems} />
        </section>
      </section>

      <section>
        <PopularProducts />
      </section>
      <section className="padding-x sm:py-32 py-16 w-full ">
        <Subscribe />
      </section>
      <section className="bg-black padding-x padding-t pb-8">
        <Footer />
      </section>
    </main>
  );
};

export default Cart;
