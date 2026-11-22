import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';

export default function Checklist({ items, onChange }) {
  const [text, setText] = useState('');
  const list = items || [];
  const toggle = (i) => onChange(list.map((x, idx) => (idx === i ? { ...x, done: !x.done } : x)));
  const remove = (i) => onChange(list.filter((_, idx) => idx !== i));
  const add = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    onChange([...list, { text: text.trim(), done: false }]);
    setText('');
  };
  return (
    <div className="space-y-2">
      {list.map((x, i) => (
        <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <button onClick={() => toggle(i)} className={`flex h-5 w-5 items-center justify-center rounded-md border ${x.done ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}>
            {x.done && <Check className="h-3 w-3" />}
          </button>
          <span className={`flex-1 text-sm ${x.done ? 'text-slate-400 line-through' : ''}`}>{x.text}</span>
          <button onClick={() => remove(i)} className="text-slate-300 hover:text-slate-500"><X className="h-4 w-4" /></button>
        </div>
      ))}
      <form onSubmit={add} className="flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="준비물 추가" className="flex-1 rounded-xl bg-white border border-slate-200 px-3 py-2.5 text-sm outline-none" />
        <button className="rounded-xl bg-primary px-4 text-white"><Plus className="h-4 w-4" /></button>
      </form>
    </div>
  );
}