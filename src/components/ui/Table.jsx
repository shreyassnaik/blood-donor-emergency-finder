import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Table({
  columns = [],
  data = [],
  emptyMessage = 'No data found',
  pageSize = 10,
}) {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [page, setPage] = useState(1);

  const handleSort = (key) => {
    if (sortCol === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(key);
      setSortDir('asc');
    }
  };

  const sorted = [...data].sort((a, b) => {
    if (!sortCol) return 0;
    const av = a[sortCol] ?? '';
    const bv = b[sortCol] ?? '';
    const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const totalPages = Math.ceil(sorted.length / pageSize);
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#1F7A8C]/15">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#1F7A8C]/10 border-b border-[#1F7A8C]/15">
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && handleSort(col.key)}
                  className={`
                    px-5 py-3.5 text-left text-xs font-semibold text-[#BFDBF7]/60 uppercase tracking-wider
                    ${col.sortable !== false ? 'cursor-pointer select-none hover:text-[#BFDBF7]' : ''}
                    transition-colors
                  `}
                >
                  <div className="flex items-center gap-1.5">
                    {col.label}
                    {col.sortable !== false && sortCol === col.key && (
                      sortDir === 'asc'
                        ? <ChevronUp size={12} className="text-[#1F7A8C]" />
                        : <ChevronDown size={12} className="text-[#1F7A8C]" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-[#BFDBF7]/30 text-sm">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row, i) => (
                <tr
                  key={row.id ?? i}
                  className="border-b border-[#1F7A8C]/08 hover:bg-[#1F7A8C]/05 transition-colors table-row-hover"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-sm text-[#BFDBF7]/80">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#1F7A8C]/15 bg-[#1F7A8C]/05">
          <p className="text-xs text-[#BFDBF7]/40">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-[#BFDBF7]/40 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/20 disabled:opacity-30 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                  p === page
                    ? 'bg-[#1F7A8C] text-[#BFDBF7]'
                    : 'text-[#BFDBF7]/40 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/20'
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg text-[#BFDBF7]/40 hover:text-[#BFDBF7] hover:bg-[#1F7A8C]/20 disabled:opacity-30 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
