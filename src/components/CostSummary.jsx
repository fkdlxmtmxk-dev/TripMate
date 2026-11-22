import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { computeBreakdown } from '@/lib/tripAi';

export default function CostSummary({ itinerary, total, budget }) {
  const over = total > budget;
  const breakdown = computeBreakdown(itinerary);
  return (
    <div className="space-y-3">
      <div className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${over ? 'bg-red-50 text-red-600' : 'bg-primary/10 text-primary'}`}>
        {over ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
        예상 경비 {total.toLocaleString()}원 / {over ? `예산 ${(total - budget).toLocaleString()}원 초과` : '예산 이내'}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(breakdown).map(([k, v]) => (
          <div key={k} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
            <p className="text-xs text-slate-400">{k}</p>
            <p className="text-sm font-bold">{v.toLocaleString()}원</p>
          </div>
        ))}
      </div>
      {over && <p className="text-xs text-red-500">예산을 넘었어요. 아래에서 “더 저렴하게 바꿔줘”를 눌러보세요.</p>}
    </div>
  );
}