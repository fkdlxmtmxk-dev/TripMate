import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

const QUICK = ['실내 위주로 바꿔줘', '카페를 하나 추가해줘', '더 저렴하게 바꿔줘', '일정을 여유롭게 줄여줘'];

export default function ChatEdit({ onSubmit, busy }) {
  const [text, setText] = useState('');
  const send = (t) => {
    if (!t.trim() || busy) return;
    onSubmit(t.trim());
    setText('');
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="mb-2 flex items-center gap-1.5 text-sm font-bold"><Sparkles className="h-4 w-4 text-primary" />AI에게 일정 수정 요청</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <button key={q} disabled={busy} onClick={() => send(q)} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-primary/10 disabled:opacity-50">
            {q}
          </button>
        ))}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(text); }} className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="예) 비가 오니까 실내 코스로 바꿔줘"
          className="flex-1 rounded-xl bg-slate-100 px-3 py-2.5 text-sm outline-none"
        />
        <button disabled={busy} className="rounded-xl bg-primary px-4 text-white disabled:opacity-50"><Send className="h-4 w-4" /></button>
      </form>
    </div>
  );
}