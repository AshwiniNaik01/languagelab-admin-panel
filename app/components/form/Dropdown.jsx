"use client";

import { FaChevronDown } from "react-icons/fa";

export default function Dropdown({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  required = false,
  disabled = false,
  ...rest
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          {label}
          {required && <span className="ml-1 text-orange-500">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          {...rest}
          className="
            peer
            w-full
            appearance-none
            rounded-xl
            border
            border-orange-200
            bg-white
            px-4
            py-3
            pr-12
            text-sm
            font-medium
            text-gray-700
            shadow-sm
            transition-all
            duration-200
            outline-none

            hover:border-orange-300
            hover:shadow-md

            focus:border-orange-500
            focus:ring-4
            focus:ring-orange-100
            focus:shadow-lg

            disabled:cursor-not-allowed
            disabled:bg-gray-100
            disabled:text-gray-400
          "
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <FaChevronDown
          className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-xs
            text-orange-500
            transition-transform
            duration-200
            peer-focus:rotate-180
          "
        />
      </div>
    </div>
  );
}