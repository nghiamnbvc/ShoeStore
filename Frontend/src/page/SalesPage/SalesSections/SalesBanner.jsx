import React from "react";
import { salesBanner } from "../../../assets/images";

const SalesBanner = () => {
  return (
    <section className="pt-[94px]">
      <div className="relative">
        <img
          src={salesBanner}
          className="w-full h-[400px] object-cover"
          alt="Banner"
        />

        <div
          className="absolute
             bottom-10 left-10
             sm:top-20 sm:right-72 sm:bottom-auto sm:left-auto
             flex flex-col z-30"
        >
          <h1 className="sm:text-4xl text-3xl font-bold text-white">
            Sales
            <hr />
          </h1>
          <p className="sm:text-2xl text-sm text-white mt-3">
            Limited-time deals on the latest kicks.
            <br />
            Grab your pair before they’re gone!
          </p>
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-black/30" />
        <div className="absolute top-0 right-0 bg-amber-700 z-20  h-full w-[55%] rounded-l-full border-l-[10px] max-xl:hidden" />
      </div>
    </section>
  );
};

export default SalesBanner;
