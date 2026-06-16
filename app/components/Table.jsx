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
    <div className="w-full max-w-7xl mx-auto bg-[#FFFBF5] rounded-3xl border border-orange-100 shadow-[0_10px_25px_rgba(0,0,0,0.05)] overflow-hidden">

      <div className="overflow-y-auto" style={{ maxHeight }}>
        <table className="min-w-full border-collapse">

          {/* HEADER */}
          <thead className="sticky top-0 bg-orange-200 z-20 border-b border-orange-300">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-5 text-left text-sm font-semibold uppercase tracking-wide text-black"
                >
                  <div className="flex items-center gap-3">
                    <span>{col.header}</span>

                    {index === 0 && (
                      <button
                        onClick={() =>
                          setSortOrder(sortOrder === "top" ? "bottom" : "top")
                        }
                        className="text-black/70 hover:text-black transition"
                      >
                        {sortOrder === "top" ? (
                          <FaArrowUp size={14} />
                        ) : (
                          <FaArrowDown size={14} />
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
                    ${rowIndex % 2 === 0 ? "bg-[#FFFBF5]" : "bg-[#FFF1E6]"}
                    hover:bg-[#FFE6CC]`}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-5 whitespace-nowrap text-sm transition ${
                        colIndex === 0
                          ? "font-semibold text-black"
                          : "text-black/70"
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
                  className="py-12 text-center italic text-black/50"
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