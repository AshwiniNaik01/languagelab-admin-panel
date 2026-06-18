import * as Icons from "lucide-react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  icon,
  className = "",
}) {
  const IconComponent = icon ? Icons[icon] : null;

  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white shadow-md shadow-orange-500/10 active:scale-95 border-b-2 border-orange-700",

    secondary:
      "bg-white text-orange-600 border border-orange-300 hover:bg-orange-50 active:scale-95",

    danger:
      "bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 active:scale-95 border-b-2 border-red-700",
  };

  const sizes = {
    sm: "px-3 py-2 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-6 py-3.5 text-base gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        rounded-xl
        font-semibold
        transition-all
        duration-200
        shadow-sm
        cursor-pointer
        select-none

        ${variants[variant]}
        ${sizes[size]}

        ${disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : ""}

        ${className}
      `}
    >
      {IconComponent && <IconComponent size={size === "sm" ? 14 : size === "lg" ? 20 : 16} className="shrink-0" />}
      {children}
    </button>
  );
}