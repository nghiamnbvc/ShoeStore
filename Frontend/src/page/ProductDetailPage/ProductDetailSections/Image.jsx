import React, { useState } from "react";
import { bigShoe1 } from "../../../assets/images";
import { shoes } from "../../../constants";
import ShoeCard from "../../../components/ShoeCard";

const Image = ({ imageUrl }) => {
  // const [bigShoeImg, setBigShoeImg] = useState(images);
  const backendUrl = "http://localhost:5235";

  console.log("✅ Image URL:", imageUrl);
  return (
    <div
      className="relative flex flex-col justify-center
            items-center xl:min-h-screen max-xl:py-40 
            bg-primary  bg-cover bg-center mx-5 rounded-xl gap-6"
    >
      <img
        src={`${backendUrl}${imageUrl}`}
        alt="shoe collection"
        width={580}
        height={470}
        className="object-contain relative
                    z-10 pb-10 "
      />
      {/* <div
        className="flex sm:gap-6 gap-4 
                 bottom-[2%] 
                max-sm:px-6"
      >
        {shoes.map((shoe) => (
          <div>
            <ShoeCard
              imgURL={shoe}
              changeBigShoeImg={(shoe) => setBigShoeImg(shoe)}
              bigShoeImg={bigShoeImg}
            />
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Image;
