"use client";

export default function ToggleSwitch({
  checked = false,
  onChange,
  label = "",
  disabled = false,
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      {label && (
        <span className="text-sm font-medium text-gray-700">
          {label}
        </span>
      )}

      <div
        onClick={() => !disabled && onChange(!checked)}
        className={`
          relative w-12 h-6 rounded-full transition-all duration-300
          ${checked ? "bg-orange-500" : "bg-gray-300"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <div
          className={`
            absolute top-0.5 left-0.5
            w-5 h-5 bg-white rounded-full shadow
            transition-transform duration-300
            ${checked ? "translate-x-6" : ""}
          `}
        />
      </div>
    </label>
  );
}