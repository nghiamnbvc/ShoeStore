import React from "react";
import { headerLogo } from "../../../assets/images";
import { Link } from "react-router-dom";
const Header = () => {
  return (
    <div className="mt-11 border-b pb-12 border-slate-300 padding-x">
      <Link to="/">
        <img src={headerLogo} alt="logo" width={150} height={49} />
      </Link>
    </div>
  );
};

export default Header;
