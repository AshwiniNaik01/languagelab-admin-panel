"use client";

import { useMemo, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function ScrollableTable({
  columns = [],
  data = [],
  maxHeight = "600px",
  loading = false,
  emptyMessage = "No data available",
}) {
  const [sortOrder, setSortOrder] = useState("top");

  const sortedData = useMemo(() => {
    return sortOrder === "top" ? data : [...data].reverse();
  }, [data, sortOrder]);

  const lastIdx = columns.length - 1;

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl border border-orange-200 shadow-md overflow-hidden">
      <div className="overflow-y-auto overflow-x-hidden" style={{ maxHeight }}>
        <table className="min-w-full border-collapse">

          {/* HEADER */}
          <thead className="sticky top-0 z-20">
            <tr className="bg-gradient-to-r from-orange-500 to-amber-600 border-b border-orange-700">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-white whitespace-nowrap
                    ${index === lastIdx
                      ? "sticky right-0 z-30 bg-amber-600 shadow-[-4px_0_8px_rgba(0,0,0,0.15)]"
                      : ""
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span>{col.header}</span>
                    {index === 0 && (
                      <button
                        onClick={() =>
                          setSortOrder(sortOrder === "top" ? "bottom" : "top")
                        }
                        className="text-orange-100 hover:text-white transition"
                      >
                        {sortOrder === "top" ? (
                          <FaArrowUp size={12} />
                        ) : (
                          <FaArrowDown size={12} />
                        )}
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-12 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-orange-500 border-r-2" />
                  </div>
                </td>
              </tr>
            ) : sortedData.length > 0 ? (
              sortedData.map((row, rowIndex) => {
                const isEven = rowIndex % 2 === 0;
                const rowBg = isEven ? "bg-white" : "bg-[#FFF8F4]";
                return (
                  <tr
                    key={rowIndex}
                    className={`border-b border-orange-100 transition hover:bg-orange-50 ${rowBg}`}
                  >
                    {columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`px-6 py-4 whitespace-nowrap text-sm transition
                          ${colIndex === 0 ? "font-semibold text-[#3C1E0A]" : "text-[#5C4033]"}
                          ${colIndex === lastIdx
                            ? `sticky right-0 z-10 shadow-[-4px_0_8px_rgba(0,0,0,0.06)] ${rowBg}`
                            : ""
                          }`}
                      >
                        {typeof col.accessor === "function"
                          ? col.accessor(row)
                          : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center italic text-slate-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
