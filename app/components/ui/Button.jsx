export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className = "",
}) {
  const variants = {
    primary:
      "bg-orange-500 text-white hover:bg-orange-600",

    secondary:
      "bg-white text-orange-500 border border-orange-300 hover:bg-orange-50",

    danger:
      "bg-red-500 text-white hover:bg-red-600",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        rounded-xl
        font-medium
        transition-all
        duration-200
        shadow-sm

        ${variants[variant]}
        ${sizes[size]}

        ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        }

        ${className}
      `}
    >
      {children}
    </button>
  );
}