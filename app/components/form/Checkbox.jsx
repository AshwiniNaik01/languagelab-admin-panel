"use client";

import { FaCheck } from "react-icons/fa";

export default function Checkbox({
  label,
  name,
  checked = false,
  onChange,
  disabled = false,
}) {
  return (
    <label
      className={`
        inline-flex items-center gap-3 select-none
        transition-all duration-200
        ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
      `}
    >
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
        />

        {/* BOX */}
        <div
          className="
            flex h-5 w-5 items-center justify-center
            rounded-md
            border border-orange-300
            bg-white
            shadow-sm

            transition-all duration-200

            peer-hover:border-orange-400
            peer-hover:shadow-sm

            peer-focus:ring-2
            peer-focus:ring-orange-100

            peer-checked:border-orange-500
            peer-checked:bg-orange-500
          "
        >
          {/* WHITE TICK (UPDATED ONLY THIS PART) */}
          <FaCheck
            className="
              h-3 w-3
              text-white
              opacity-0
              transition-opacity duration-200
              peer-checked:opacity-100
            "
          />
        </div>
      </div>

      {/* LABEL */}
      {label && (
        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>
      )}
    </label>
  );
}