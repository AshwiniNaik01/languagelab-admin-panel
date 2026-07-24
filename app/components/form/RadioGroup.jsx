"use client";

export default function RadioGroup({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  ...rest
}) {
  return (
    <div className="w-full">

      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
          {required && (
            <span className="ml-1 text-orange-500">*</span>
          )}
        </label>
      )}

      <div className="flex flex-col gap-2">

        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option}
              checked={value === option}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              {...rest}
              className="accent-orange-500 w-4 h-4"
            />

            <span className="text-gray-700 text-sm">
              {option}
            </span>
          </label>
        ))}

      </div>
    </div>
  );
}