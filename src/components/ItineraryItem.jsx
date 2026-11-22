import { RefreshCw, Lightbulb, Clock, Home } from 'lucide-react';

const fmt = (n) => `${Number(n || 0).toLocaleString()}원`;

export default function ItineraryItem({ item, last, onReplace, onTimeChange, busy }) {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`mt-2 h-3 w-3 rounded-full ${last ? 'bg-[#FF8A6B]' : 'bg-primary'}`} />
        {!last && <div className="w-0.5 flex-1 bg-primary/30" />}
      </div>
      <div className="mb-4 flex-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <input
            type="time"
            value={item.time || ''}
            onChange={(e) => onTimeChange(e.target.value)}
            className="rounded-md bg-primary/10 px-2 py-0.5 text-sm font-bold text-primary outline-none"
          />
          <span className="text-xs text-slate-400">{item.category}</span>
        </div>
        <h3 className="mt-2 text-lg font-bold">{item.name}</h3>
        <p className="text-sm text-slate-500">{item.description}</p>
        {item.reason && (
          <p className="mt-2 flex gap-1.5 rounded-xl bg-[#FFF4E5] px-3 py-2 text-xs text-slate-600">
            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" /> {item.reason}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="font-bold text-primary">{item.cost ? fmt(item.cost) : '무료'}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.duration_min || 60}분</span>
          {item.indoor && <span className="flex items-center gap-1"><Home className="h-3 w-3" />실내</span>}
          <button
            onClick={onReplace}
            disabled={busy}
            className="ml-auto flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw className="h-3 w-3" /> 장소 교체
          </button>
        </div>
      </div>
    </div>
  );
}