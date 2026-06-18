"use client";

import { useMemo, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

export default function ScrollableTable({
  columns = [],
  data = [],
  maxHeight = "600px",
  emptyMessage = "No data available",
}) {
  const [sortOrder, setSortOrder] = useState("top");

  const sortedData = useMemo(() => {
    return sortOrder === "top" ? data : [...data].reverse();
  }, [data, sortOrder]);

  return (
    <div className="w-full max-w-7xl mx-auto bg-white rounded-2xl border border-orange-200 shadow-md overflow-hidden">

      <div className="overflow-y-auto" style={{ maxHeight }}>
        <table className="min-w-full border-collapse">

          {/* HEADER */}
          <thead className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-600 z-20 border-b border-orange-700">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-4.5 text-left text-xs font-black uppercase tracking-wider text-white"
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
            {sortedData.length > 0 ? (
              sortedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={`border-b border-orange-100 transition
                    ${rowIndex % 2 === 0 ? "bg-white" : "bg-[#FFF8F4]/30"}
                    hover:bg-orange-50`}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4.5 whitespace-nowrap text-sm transition ${
                        colIndex === 0
                          ? "font-semibold text-[#3C1E0A]"
                          : "text-[#5C4033]"
                      }`}
                    >
                      {typeof col.accessor === "function"
                        ? col.accessor(row)
                        : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
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