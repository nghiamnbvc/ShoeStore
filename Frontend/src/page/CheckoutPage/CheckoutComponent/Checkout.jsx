import React from "react";
import OrderDetail from "../CheckoutSections/OrderDetail";
import Information from "../CheckoutSections/Information";
import Header from "../CheckoutSections/Header";

const Checkout = () => {
  return (
    <main className="relative pb-24">
      <section>
        <Header />
      </section>
      <section className="flex ">
        <section className="w-1/2 padding-x ">
          <Information />
        </section>
        <section className="w-1/2 padding-x border-l">
          <OrderDetail />
        </section>
      </section>
    </main>
  );
};

export default Checkout;
