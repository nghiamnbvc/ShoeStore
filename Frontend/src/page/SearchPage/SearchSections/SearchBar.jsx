import React, { useState, useEffect } from "react";
import { searchbar } from "../../../assets/icons";

const SearchBar = ({ onResults }) => {
  const [query, setQuery] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  // Gọi API mỗi khi người dùng nhập
  useEffect(() => {
    if (!query) {
      onResults?.([]); // Trả về rỗng nếu xoá hết input
      return;
    }

    // Debounce sau 500ms mới gọi API
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      fetch(`http://localhost:5235/api/ProductApi/search?query=${query}`)
        .then((res) => res.json())
        .then((data) => {
          onResults?.(data);
        })
        .catch((err) => {
          console.error("Search API error:", err);
          onResults?.([]);
        });
    }, 500);
    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="flex flex-col">
      <h1 className="text-[34px] text-3xl font-semibold font-montserrat mb-2 ">
        Search <span className="text-coral-red">Result</span>
      </h1>
      <div className="relative w-full mb-7">
        <input
          type="text"
          placeholder="Enter Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 bg-gray-100 pl-12 pr-4 py-2 rounded-lg shadow-sm "
        />
        <img
          src={searchbar}
          alt="search icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 "
        />
      </div>
    </div>
  );
};

export default SearchBar;
