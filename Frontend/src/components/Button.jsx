import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
const Button = ({
  label,
  iconUrl,
  backgroundColor,
  textColor,
  borderColor,
  fullWidth,
  linkTo,
}) => {
  return (
    <Link to={linkTo}>
      <button
        className={`flex justify-center items-center
        gap-2 px-7 py-4 font-montserrat text-lg
        leading-none
        ${
          backgroundColor
            ? `${backgroundColor} ${textColor} ${borderColor}`
            : "bg-coral-red text-white border-x-coral-red"
        }
        rounded-full ${fullWidth && "w-full"}"}`}
      >
        {label}
        {iconUrl && (
          <img
            src={iconUrl}
            alt="arrow right icon"
            className="ml-2 rounded-full w-5 h-5"
          />
        )}
      </button>
    </Link>
  );
};

export default Button;
