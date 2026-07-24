"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, Pencil, Trash2, MoreVertical } from "lucide-react";

export function ActionButton({ onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);

  const DROPDOWN_W = 48;
  const DROPDOWN_H = 136; // 3×32px buttons + gaps + padding

  const openMenu = () => {
    const rect = btnRef.current.getBoundingClientRect();

    // flip upward if not enough space below
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow < DROPDOWN_H + 8
      ? rect.top - DROPDOWN_H - 4
      : rect.bottom + 4;

    // right-align to button, clamp so it never overflows viewport
    const left = Math.min(
      rect.right - DROPDOWN_W,
      window.innerWidth - DROPDOWN_W - 8,
    );

    setPos({ top, left });
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (
        btnRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      )
        return;
      setOpen(false);
    };
    // also close on scroll so the menu doesn't drift
    document.addEventListener("mousedown", close);
    window.addEventListener("scroll", () => setOpen(false), { once: true });
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const handle = (fn) => {
    setOpen(false);
    fn();
  };

  const dropdown = open && (
    <div
      ref={dropdownRef}
      style={{ top: pos.top, left: pos.left }}
      className="fixed z-9999 flex flex-col gap-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-2"
    >
      {onView && (
        <button
          onClick={() => handle(onView)}
          title="View"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-500 text-white cursor-pointer hover:bg-sky-600 transition-colors"
        >
          <Eye size={14} strokeWidth={2.5} />
        </button>
      )}

      {onEdit && (
        <button
          onClick={() => handle(onEdit)}
          title="Edit"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-500 text-white cursor-pointer hover:bg-orange-600 transition-colors"
        >
          <Pencil size={14} strokeWidth={2.5} />
        </button>
      )}

      {onDelete && (
        <button
          onClick={() => handle(onDelete)}
          title="Delete"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 text-white cursor-pointer hover:bg-red-600 transition-colors"
        >
          <Trash2 size={14} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={openMenu}
        title="Actions"
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 cursor-pointer transition-colors"
      >
        <MoreVertical size={15} strokeWidth={2.5} />
      </button>

      {typeof window !== "undefined" && createPortal(dropdown, document.body)}
    </div>
  );
}
