"use client";

import { useState, useRef, useEffect } from "react";

export default function MultiSelectDropdown({
  label,
  name,
  options = [],
  value = [],
  onChange,
  required = false,
  placeholder = "Select options",
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle selection
  const toggleOption = (option) => {
    let updated;

    if (value.includes(option)) {
      updated = value.filter((item) => item !== option);
    } else {
      updated = [...value, option];
    }

    onChange(updated);
  };

  return (
    <div className="w-full relative" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
          {required && (
            <span className="ml-1 text-orange-500">*</span>
          )}
        </label>
      )}

      {/* Select Box */}
      <div
        onClick={() => setOpen(!open)}
        className="
          w-full
          px-4
          py-3
          border
          border-orange-300
          rounded-xl
          bg-white
          cursor-pointer
          flex
          flex-wrap
          gap-2
          min-h-[48px]
          items-center
          focus:ring-2
          focus:ring-orange-200
        "
      >
        {value.length === 0 && (
          <span className="text-gray-400 text-sm">
            {placeholder}
          </span>
        )}

        {value.map((item) => (
          <span
            key={item}
            className="bg-orange-100 text-orange-600 px-2 py-1 rounded-md text-xs"
          >
            {item}
          </span>
        ))}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="
          absolute
          w-full
          mt-2
          bg-white
          border
          border-orange-200
          rounded-xl
          shadow-lg
          z-10
          overflow-hidden
        ">
          {options.map((option) => {
            const isSelected = value.includes(option);

            return (
              <label
                key={option}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  cursor-pointer
                  transition-all
                  duration-150
                  border-b
                  border-orange-50
                  hover:bg-orange-50
                  ${isSelected ? "bg-orange-50" : ""}
                `}
              >
                {/* LEFT SIDE CHECKBOX */}
                <div
                  className={`
                    w-5
                    h-5
                    flex
                    items-center
                    justify-center
                    rounded-md
                    border-2
                    transition-all
                    duration-200
                    ${
                      isSelected
                        ? "bg-orange-500 border-orange-500"
                        : "border-gray-300"
                    }
                  `}
                >
                  {isSelected && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M5 13l4 4L19 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                {/* OPTION TEXT */}
                <span className="text-gray-700 text-sm">
                  {option}
                </span>

                {/* hidden checkbox logic */}
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleOption(option)}
                  className="hidden"
                />
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}