
import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

const DURATIONS = [
  { label: '당일치기', days: 1 },
  { label: '1박 2일', days: 2 },
  { label: '2박 3일', days: 3 },
  { label: '3박 4일', days: 4 },
];

const COMPANIONS = ['혼자', '친구 1명', '친구 여럿', '연인', '가족'];
const INTERESTS = ['바다', '카페', '맛집', '자연', '전시', '쇼핑', '사진', '산책'];
const TRANSPORTS = ['대중교통', '자동차', '도보 위주'];

const Field = ({ label, children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
    <p className="text-xs text-slate-400">{label}</p>
    {children}
  </div>
);

const Chip = ({ active, onClick, children, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
      active
        ? 'bg-primary text-white shadow-md shadow-primary/30'
        : 'bg-white text-slate-600 border border-slate-200'
    } disabled:opacity-50`}
  >
    {children}
  </button>
);

export default function TripForm({ onSubmit, loading }) {
  const [destination, setDestination] = useState('부산');
  const [days, setDays] = useState(2);
  const [budget, setBudget] = useState('250000');
  const [companions, setCompanions] = useState('친구 1명');
  const [interests, setInterests] = useState(['바다', '카페']);
  const [transport, setTransport] = useState('대중교통');

  const toggle = (value) => {
    setInterests((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const submit = (e) => {
    e.preventDefault();

    if (loading) return;

    if (!destination.trim()) {
      alert('여행지를 입력해주세요.');
      return;
    }

    if (!budget || Number(budget) < 10000) {
      alert('예산은 10,000원 이상 입력해주세요.');
      return;
    }

    if (interests.length === 0) {
      alert('여행 취향을 하나 이상 선택해주세요.');
      return;
    }

    onSubmit({
      destination: destination.trim(),
      days,
      budget: Number(budget),
      companions,
      interests,
      transport,
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3 px-5">
      <Field label="여행지">
        <input
          required
          value={destination}
          disabled={loading}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="예) 부산, 제주, 강릉"
          className="w-full bg-transparent text-xl font-bold outline-none"
        />
      </Field>

      <Field label="여행 기간">
        <div className="mt-2 flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <Chip
              key={d.days}
              active={days === d.days}
              disabled={loading}
              onClick={() => setDays(d.days)}
            >
              {d.label}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="예산 (1인, 원)">
        <input
          type="number"
          min={10000}
          step={10000}
          required
          value={budget}
          disabled={loading}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full bg-transparent text-lg font-bold outline-none"
        />
      </Field>

      <Field label="함께 가는 사람">
        <div className="mt-2 flex flex-wrap gap-2">
          {COMPANIONS.map((c) => (
            <Chip
              key={c}
              active={companions === c}
              disabled={loading}
              onClick={() => setCompanions(c)}
            >
              {c}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="여행 취향 (여러 개 선택)">
        <div className="mt-2 flex flex-wrap gap-2">
          {INTERESTS.map((i) => (
            <Chip
              key={i}
              active={interests.includes(i)}
              disabled={loading}
              onClick={() => toggle(i)}
            >
              {i}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="이동 수단">
        <div className="mt-2 flex flex-wrap gap-2">
          {TRANSPORTS.map((t) => (
            <Chip
              key={t}
              active={transport === t}
              disabled={loading}
              onClick={() => setTransport(t)}
            >
              {t}
            </Chip>
          ))}
        </div>
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition active:scale-[0.98] disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            AI가 일정을 만들고 있어요…
          </>
        ) : (
          <>
            AI 일정 만들기
            <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </form>
  );
}
