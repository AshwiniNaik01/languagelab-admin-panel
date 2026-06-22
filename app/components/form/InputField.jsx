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
  ...rest
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
          {required && (
            <span className="ml-1 text-orange-500">*</span>
          )}
        </label>
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
          px-4
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

          ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : ""
          }
        `}
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}