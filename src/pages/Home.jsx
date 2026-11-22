
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';

import { generateTrip, toItinerary, computeTotal } from '@/lib/tripAi';
import { saveTrip } from '@/lib/tripStorage';
import TripForm from '@/components/TripForm';

export default function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (input) => {
    setLoading(true);
    setError('');

    try {
      // 1. AI 일정 생성
      const plan = await generateTrip(input);

      // 2. 일정 데이터 변환
      const itinerary = toItinerary(plan);

      // 3. 여행 데이터 구성
      const trip = {
        title: plan.title || `${input.destination} ${input.days - 1}박 ${input.days}일`,
        destination: input.destination,
        days_count: input.days,
        budget: input.budget,
        companions: input.companions,
        interests: input.interests,
        transport: input.transport,
        summary: plan.summary || '',
        itinerary,
        total_cost: computeTotal(itinerary),
        checklist: (plan.checklist || []).map((text) => ({
          text,
          done: false,
        })),
      };

      // 4. localStorage에 여행 저장
      const savedTrip = saveTrip(trip);

      // 5. 저장된 여행의 ID로 상세 페이지 이동
      navigate(`/trip/${savedTrip.id}`);

    } catch (e) {
      console.error('일정 생성 또는 저장 오류:', e);
      setError(
        e.message || '일정을 만들거나 저장하지 못했어요. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="px-5 pb-6 pt-10">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
          <Compass className="h-6 w-6" />
        </div>

        <p className="text-xs font-bold tracking-widest text-primary">
          TRIPMATE AI
        </p>

        <h1 className="mt-1 text-3xl font-black">
          어디로 떠나볼까요?
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          AI가 취향에 맞는 하루를 설계해요
        </p>
      </header>

      <TripForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <p className="mt-3 px-5 text-center text-sm text-red-500">
          {error}
        </p>
      )}

      {loading && (
        <p className="mt-3 px-5 text-center text-xs text-slate-400">
          AI가 여행 일정을 만들고 있어요.
        </p>
      )}
    </div>
  );
}
