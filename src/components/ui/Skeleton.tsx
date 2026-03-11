// ─── Primitive ────────────────────────────────────────────────────────────────
export function Sk({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />;
}

// ─── Public pages ─────────────────────────────────────────────────────────────

export function BlogCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col">
      <div className="h-48 bg-slate-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <div className="flex gap-3"><Sk className="h-3 w-20" /><Sk className="h-3 w-12" /></div>
        <Sk className="h-4 w-16 rounded-full" />
        <Sk className="h-5 w-full" />
        <Sk className="h-5 w-3/4" />
        <Sk className="h-4 w-full" />
        <Sk className="h-4 w-2/3" />
        <Sk className="h-4 w-20 mt-2" />
      </div>
    </div>
  );
}

export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="h-52 bg-slate-200 animate-pulse" />
      <div className="p-5 space-y-3">
        <Sk className="h-5 w-3/4" />
        <Sk className="h-4 w-1/2" />
        <div className="flex gap-4"><Sk className="h-3 w-16" /><Sk className="h-3 w-16" /><Sk className="h-3 w-16" /></div>
        <div className="flex justify-between items-center pt-1">
          <Sk className="h-6 w-28" />
          <Sk className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="h-28 bg-slate-200 animate-pulse relative">
        <div className="absolute bottom-0 left-6 translate-y-1/2 w-24 h-24 rounded-full bg-slate-300 border-4 border-white" />
      </div>
      <div className="px-6 pb-6 pt-16 space-y-3">
        <Sk className="h-5 w-40" />
        <Sk className="h-4 w-28" />
        <Sk className="h-4 w-full" />
        <Sk className="h-4 w-3/4" />
        <Sk className="h-14 w-full rounded-xl mt-2" />
        <Sk className="h-11 w-full rounded-xl" />
        <Sk className="h-11 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function BlogDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-5">
          {/* Hero image */}
          <div className="h-72 md:h-96 bg-slate-200 animate-pulse rounded-2xl" />
          {/* Meta */}
          <div className="flex gap-4"><Sk className="h-4 w-24" /><Sk className="h-4 w-20" /><Sk className="h-4 w-16" /></div>
          {/* Title */}
          <Sk className="h-8 w-full" />
          <Sk className="h-8 w-3/4" />
          {/* Content lines */}
          {[...Array(6)].map((_, i) => <Sk key={i} className="h-4 w-full" />)}
          <Sk className="h-4 w-2/3" />
          {[...Array(4)].map((_, i) => <Sk key={i} className="h-4 w-full" />)}
        </div>
        {/* Sidebar */}
        <div className="lg:w-72 shrink-0 space-y-4">
          <div className="bg-white rounded-xl p-5 space-y-3">
            <Sk className="h-4 w-28" />
            <Sk className="h-20 w-20 rounded-full mx-auto" />
            <Sk className="h-5 w-32 mx-auto" />
            <Sk className="h-10 w-full rounded-xl" />
          </div>
          <div className="bg-white rounded-xl p-5 space-y-3">
            <Sk className="h-4 w-24" />
            {[...Array(3)].map((_, i) => <Sk key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        </div>
      </div>
    </div>
  );
}

export function PropertyDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-5">
          <div className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
          <div className="flex gap-2">{[...Array(4)].map((_, i) => <Sk key={i} className="h-20 w-20 rounded-xl" />)}</div>
          <Sk className="h-7 w-2/3" />
          <div className="flex gap-3"><Sk className="h-5 w-24" /><Sk className="h-5 w-24" /><Sk className="h-5 w-24" /></div>
          {[...Array(5)].map((_, i) => <Sk key={i} className="h-4 w-full" />)}
        </div>
        <div className="lg:w-80 shrink-0 space-y-4">
          <div className="bg-white rounded-xl p-5 space-y-3">
            <Sk className="h-7 w-32" />
            {[...Array(5)].map((_, i) => <Sk key={i} className="h-10 w-full rounded-lg" />)}
            <Sk className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SidebarSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm p-4"><Sk className="h-9 w-full rounded-lg" /></div>
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
        <Sk className="h-3 w-20 mb-3" />
        {[...Array(4)].map(i => <Sk key={i} className="h-9 w-full rounded-lg" />)}
      </div>
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
        <Sk className="h-3 w-24 mb-3" />
        {[...Array(3)].map(i => <Sk key={i} className="h-9 w-full rounded-lg" />)}
      </div>
    </div>
  );
}

export function AreaCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col items-center gap-3">
      <Sk className="w-12 h-12 rounded-xl" />
      <Sk className="h-4 w-20" />
      <Sk className="h-3 w-14" />
    </div>
  );
}

export function SchemeCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
      <Sk className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 space-y-2"><Sk className="h-4 w-3/4" /><Sk className="h-3 w-1/2" /></div>
    </div>
  );
}

// ─── Admin pages ──────────────────────────────────────────────────────────────

// Table row skeleton — pass colSpan to match the table
export function TableRowSkeleton({ cols = 5, rows = 8 }: { cols?: number; rows?: number }) {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <tr key={i} className="border-b border-slate-100">
          {[...Array(cols)].map((_, j) => (
            <td key={j} className="px-5 py-4">
              <Sk className={`h-4 ${j === 0 ? 'w-40' : j === cols - 1 ? 'w-16' : 'w-24'}`} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function AdminCardSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 flex items-center gap-4 shadow-sm">
          <Sk className="w-10 h-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2"><Sk className="h-4 w-40" /><Sk className="h-3 w-28" /></div>
          <Sk className="h-8 w-20 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm space-y-3">
            <Sk className="h-4 w-24" /><Sk className="h-8 w-20" /><Sk className="h-3 w-16" />
          </div>
        ))}
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl p-5 shadow-sm"><Sk className="h-4 w-32 mb-4" /><Sk className="h-56 w-full rounded-xl" /></div>
        <div className="bg-white rounded-xl p-5 shadow-sm"><Sk className="h-4 w-32 mb-4" /><Sk className="h-56 w-full rounded-xl" /></div>
      </div>
      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 shadow-sm space-y-3">
            <Sk className="h-4 w-28 mb-4" />
            {[...Array(5)].map((_, j) => <div key={j} className="flex gap-3"><Sk className="h-4 flex-1" /><Sk className="h-4 w-16" /></div>)}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MessageListSkeleton() {
  return (
    <div className="space-y-1">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="p-4 border-b flex items-start gap-3">
          <Sk className="w-9 h-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-2"><Sk className="h-4 w-32" /><Sk className="h-3 w-48" /><Sk className="h-3 w-28" /></div>
        </div>
      ))}
    </div>
  );
}