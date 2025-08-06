import React, { useState } from "react";
import { headerLogo } from "../assets/images";
import { cart, hamburger, search, user, like } from "../assets/icons";
import { navLinks } from "../constants";
import { Link, useLocation } from "react-router-dom";

const Nav = () => {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload(); // reload để cập nhật UI
  };

  return (
    <header className="padding-x py-8 fixed z-50 w-full bg-white shadow-lg border-b border-gray-200">
      <nav
        className="flex justify-between
            items-center max-container "
      >
        <Link to="/">
          <img src={headerLogo} alt="logo" width={130} height={29} />
        </Link>
        <ul
          className="flex-1 flex justify-center
                items-center gap-16 max-lg:hidden "
        >
          {navLinks.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <li key={item.label}>
                <Link
                  to={item.href}
                  className={`font-montserrat leading-normal text-lg duration-200 
                    ${isActive ? "text-coral-red" : "text-slate-gray"} 
                    hover:text-coral-red`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex gap-8 max-lg:hidden">
          <Link className="cursor-pointer" to="/search">
            <img className="w-5 h-5" src={search} alt="search icon" />
          </Link>

          {isLoggedIn() && (
            <Link className="cursor-pointer" to="/favourite">
              <img className="w-5 h-5" src={like} alt="like icon" />
            </Link>
          )}

          {isLoggedIn() ? (
            <div className="relative">
              <img
                className="w-5 h-5 cursor-pointer"
                src={user}
                alt="user icon"
                onClick={() => setShowUserMenu((prev) => !prev)}
              />
              {showUserMenu && (
                <div className="absolute right--10 top-8 bg-white border rounded-md shadow-md w-32 py-2 z-50">
                  <Link to="/profile">
                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-montserrat">
                      Profile
                    </button>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 font-montserrat"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link className="cursor-pointer" to="/login">
              <img className="w-5 h-5" src={user} alt="user icon" />
            </Link>
          )}

          <Link className="cursor-pointer" to="/cart">
            <img className="w-5 h-5" src={cart} alt="cart icon" />
          </Link>
        </div>
        <div>
          <img
            onClick={toggleMenu}
            className="hidden max-lg:block cursor-pointer"
            src={hamburger}
            alt="Hamburger"
            width={25}
            height={25}
          />
          {/* Dropdown menu */}
          {menuOpen && (
            <ul className="absolute right-0 top-20 bg-gray-100 shadow-md rounded-lg w-40 p-4 z-50 space-y-3 cursor-pointer">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    className="block text-slate-gray hover:text-coral-red font-montserrat"
                    onClick={() => setMenuOpen(false)} // đóng menu khi bấm
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <hr />
              <li>
                <Link
                  to="/search"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-coral-red"
                >
                  Search
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-coral-red"
                >
                  User
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  onClick={() => setMenuOpen(false)}
                  className="block hover:text-coral-red"
                >
                  Cart
                </Link>
              </li>
            </ul>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Nav;
