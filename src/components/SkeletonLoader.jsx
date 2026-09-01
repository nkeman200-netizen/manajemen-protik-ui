export function TableSkeleton({ rows = 5, cols = 4, className = '' }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className={`animate-pulse ${className}`}>
          {Array.from({ length: cols }).map((_, cIdx) => (
            <td key={cIdx} className="px-6 py-4">
              <div className="flex items-center gap-2">
                <div
                  className={`h-4 rounded-lg bg-slate-200 dark:bg-white/10 ${
                    cIdx === 0
                      ? 'w-3/4'
                      : cIdx === cols - 1
                      ? 'w-16 ml-auto'
                      : 'w-1/2'
                  }`}
                />
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function DirectoryCardSkeleton({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="animate-pulse rounded-2xl border border-slate-200/80 bg-white/60 p-6 shadow-sm dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-10 rounded-2xl bg-slate-200 dark:bg-white/10" />
            <div className="h-5 w-20 rounded-full bg-slate-200 dark:bg-white/10" />
          </div>
          <div className="h-5 w-3/4 rounded-lg bg-slate-200 dark:bg-white/10 mb-2" />
          <div className="h-3.5 w-1/2 rounded-lg bg-slate-200 dark:bg-white/10 mb-4" />
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
            <div className="h-4 w-24 rounded bg-slate-200 dark:bg-white/10" />
            <div className="h-4 w-12 rounded bg-slate-200 dark:bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ArchiveCardSkeleton({ count = 8 }) {
  return (
    <div className="space-y-4">
      {/* Period Header Skeleton */}
      <div className="flex items-center gap-3 animate-pulse">
        <div className="h-3 w-28 rounded bg-slate-200 dark:bg-white/10" />
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>

      {/* Compact Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="animate-pulse flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/5"
          >
            <div className="flex flex-1 items-center gap-3 overflow-hidden">
              <div className="h-8 w-8 shrink-0 rounded-xl bg-slate-200 dark:bg-white/10" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 w-3/4 rounded bg-slate-200 dark:bg-white/10" />
                <div className="h-2.5 w-1/2 rounded bg-slate-200 dark:bg-white/10" />
              </div>
            </div>
            <div className="h-6 w-6 shrink-0 rounded-lg bg-slate-200 dark:bg-white/10 ml-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonthlyDueTableSkeleton({ rows = 6, months = 9 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="animate-pulse">
          <td className="whitespace-nowrap px-6 py-4">
            <div className="h-4 w-36 rounded bg-slate-200 dark:bg-white/10 mb-2" />
            <div className="flex items-center gap-2">
              <div className="h-3 w-16 rounded bg-slate-200 dark:bg-white/10" />
              <div className="h-3 w-20 rounded bg-slate-200 dark:bg-white/10" />
            </div>
          </td>
          {Array.from({ length: months }).map((_, mIdx) => (
            <td key={mIdx} className="px-3 py-4 text-center">
              <div className="mx-auto h-5 w-5 rounded-full bg-slate-200 dark:bg-white/10" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}



