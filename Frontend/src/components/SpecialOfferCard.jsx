import { useRef, React } from "react";
import gsap from "gsap";

const SpecialOfferCard = ({ image, title, description }) => {
  const imageRef = useRef();
  const buttonRef = useRef();

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.1,
      duration: 0.3,
      ease: "power2.out",
    });
    gsap.to(buttonRef.current, {
      opacity: 1,
      duration: 0.5,
      ease: "power2.out",
      pointerEvents: "auto",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.5,
      ease: "power2.out",
    });
    gsap.to(buttonRef.current, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      pointerEvents: "none",
    });
  };

  return (
    <div
      className="relative flex-col flex-1 h-full overflow-hidden cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="absolute top-0 left-0 z-10 flex flex-col justify-between w-full h-full text-center px-4 py-6">
        <div>
          <h2 className="text-white text-xl font-semibold md:text-4xl">
            {title}
          </h2>
          <p className="text-white text-sm font-light md:text-3xl">
            {description}
          </p>
        </div>
        <div
          ref={buttonRef}
          className="flex justify-center gap-2 mb-6 opacity-0"
        >
          <button className="text-black bg-white hover:bg-black hover:text-white cursor-pointer text-center sm:w-56 w-full sm:p-3 sm:text-xl text-xs font-medium duration-300 font-montserrat">
            Shop Men
          </button>
          <button className="text-black bg-white hover:bg-black hover:text-white cursor-pointer text-center sm:w-56 w-full sm:p-3 p-2 sm:text-xl text-xs font-medium duration-300 font-montserrat">
            Shop Women
          </button>
        </div>
      </div>

      <img
        ref={imageRef}
        src={image}
        className="w-full h-full object-cover object-center"
        alt="Special Offer"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-black/20" />
    </div>
  );
};

export default SpecialOfferCard;
