import React from "react";
import VideoCarousel from "../../../components/VideoCarousel";
import { rightImg, watchImg } from "../../../assets/images";

const Highlights = () => {
  return (
    <section id="highlights" className="overflow-x-hidden">
      <h1
        className="text-4xl
                font-palanquin font-bold"
      >
        Get the <span className="text-coral-red">highlights</span>
      </h1>
      <div className="mb-12 w-full md:flex items-end justify-start ">
        <div className="flex flex-wrap items-end gap-5">
          <p className=" text-blue-500 hover:underline cursor-pointer flex items-center text-lg">
            Watch the film
            <img src={watchImg} alt="watch" className="ml-2" />
          </p>
          <p className=" text-blue-500 hover:underline cursor-pointer flex items-center text-lg">
            Watch the event
            <img src={rightImg} alt="watch" className="ml-2" />
          </p>
        </div>
      </div>
      <div className="screen-max-width ">
        <VideoCarousel />
      </div>
    </section>
  );
};

export default Highlights;
