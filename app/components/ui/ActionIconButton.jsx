"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Eye, Pencil, Trash2, MoreVertical } from "lucide-react";

export function ActionButton({ onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const dropdownRef = useRef(null);

  const openMenu = () => {
    const rect = btnRef.current.getBoundingClientRect();
    setPos({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX - 8,
    });
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
    document.addEventListener("mousedown", close);
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
      <button
        onClick={() => handle(onView)}
        title="View"
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-sky-500 text-white cursor-pointer"
      >
        <Eye size={14} strokeWidth={2.5} />
      </button>

      <button
        onClick={() => handle(onEdit)}
        title="Edit"
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-orange-500 text-white cursor-pointer"
      >
        <Pencil size={14} strokeWidth={2.5} />
      </button>

      <button
        onClick={() => handle(onDelete)}
        title="Delete"
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500 text-white cursor-pointer"
      >
        <Trash2 size={14} strokeWidth={2.5} />
      </button>
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
