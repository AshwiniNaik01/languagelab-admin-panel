export default function TextArea({
  label,
  name,
  placeholder = "",
  value,
  onChange,
  rows = 5,
  error = "",
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full
          px-4
          py-3
          rounded-xl
          border
          border-orange-300
          bg-white
          text-gray-700
          placeholder:text-gray-400
          outline-none
          transition-all
          duration-200
          focus:border-orange-500
          focus:ring-2
          focus:ring-orange-200
        "
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}