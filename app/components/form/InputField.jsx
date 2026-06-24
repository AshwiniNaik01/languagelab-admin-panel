import * as Icons from "lucide-react";

export default function InputField({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  onBlur,
  error = "",
  required = false,
  disabled = false,
  icon,
  ...rest
}) {
  const IconComponent = icon ? Icons[icon] : null;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="ml-1 text-orange-500">*</span>}
        </label>
      )}

      <div className="relative">
        {IconComponent && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-400 pointer-events-none">
            <IconComponent size={16} strokeWidth={2} />
          </span>
        )}

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          {...rest}
          className={`
            w-full
            ${IconComponent ? "pl-10" : "px-4"}
            pr-4
            py-3
            rounded-xl
            border
            bg-white
            text-gray-700
            placeholder:text-gray-400
            outline-none
            transition-all
            duration-200
            ${
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-orange-300 hover:border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
            }
            ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
          `}
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}
