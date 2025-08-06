import React, { useEffect, useState } from "react";
import ProductCard from "../../../components/ProductCard";
import { toast } from "react-toastify";

const Main = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5235/api/WishlistApi", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login"; 
          }

          throw new Error("Failed to fetch wishlist. Status: " + res.status);
        }

        const text = await res.text();
        if (!text) {
          return [];
        }

        return JSON.parse(text); 
      })
      .then((data) => setWishlist(data))
      .catch((err) => console.error("Failed to fetch wishlist:", err));
  }, []);

  function removeFromWishlist(productId) {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5235/api/WishlistApi/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setWishlist(wishlist.filter((item) => item.id !== productId));
        toast.success("Removed from wishlist!");
      })
      .catch((error) => {
        console.error("❌ Error removing from wishlist:", error.message);
        toast.error("⚠️ Failed to remove item from wishlist.");
      });
  }

  return (
    <div>
      <h1 className="text-3xl text-[34px] font-montserrat font-semibold">
        Favourites
      </h1>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {wishlist.map((item) => (
          <div key={item.id} className=" rounded-lg  bg-white text-black">
            <ProductCard key={item.id} {...item} />
            <button
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
              onClick={() => removeFromWishlist(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Main;
