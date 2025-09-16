import { useRef, React } from "react";
import Button from "../../../components/Button";
import { bestSellerImg, specialOfferImg } from "../../../assets/images";
import { arrowRight } from "../../../assets/icons";
import gsap from "gsap";
import SpecialOfferCard from "../../../components/SpecialOfferCard";
import { specialOffer } from "../../../constants";

const SpecialOffer = () => {
  return (
    <div className="flex sm:h-[85vh] gap-2 w-full h-auto ">
      {specialOffer.map((offer) => {
        return (
          <SpecialOfferCard
            key={offer.id}
            image={offer.image}
            title={offer.title}
            description={offer.description}
            linkTo={offer.url}
          />
        );
      })}
    </div>
  );
};

export default SpecialOffer;
