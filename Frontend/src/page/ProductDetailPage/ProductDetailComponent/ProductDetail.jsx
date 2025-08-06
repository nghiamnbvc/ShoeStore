import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Detail from "../ProductDetailSections/Detail";
import Image from "../ProductDetailSections/Image";
import { Footer } from "../../HomePage/HomeSections";
import { PopularProducts } from "../../HomePage/HomeSections";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5235/api/ProductApi/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error("Error get product detail:", err));
  }, [id]);

  if (!product) return <p>Đang tải chi tiết sản phẩm...</p>;
  return (
    <main className="relative pt-40">
      <section className="flex max-container">
        <section className="flex-[7]">
          <Image imageUrl={product.imageUrl} />
        </section>
        <section className="flex-[3] ">
          <Detail product={product} />
        </section>
      </section>

      <section className="mt-24">
        <PopularProducts />
      </section>
      {/* Footer */}
      <section className="bg-black padding-x padding-t pb-8">
        <Footer />
      </section>
    </main>
  );
};

export default ProductDetail;
