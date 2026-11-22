
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Map, Share2, Info } from 'lucide-react';

import { getTrip, updateTrip } from '@/lib/tripStorage';
import {
  computeTotal,
  reviseTrip,
  suggestReplacement,
  toItinerary,
} from '@/lib/tripAi';

import ItineraryItem from '@/components/ItineraryItem';
import CostSummary from '@/components/CostSummary';
import ChatEdit from '@/components/ChatEdit';
import Checklist from '@/components/Checklist';

export default function TripDetail() {
  const { id } = useParams();

  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dayIdx, setDayIdx] = useState(0);
  const [tab, setTab] = useState('plan');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // 여행 정보 불러오기
  useEffect(() => {
    const data = getTrip(id);
    setTrip(data);
    setIsLoading(false);
  }, [id]);

  // 여행 정보 저장
  const save = (patch) => {
    const updated = updateTrip(id, patch);
    setTrip(updated);
    return updated;
  };

  // 일정 저장 및 총비용 계산
  const saveItinerary = (itinerary, extra = {}) => {
    return save({
      itinerary,
      total_cost: computeTotal(itinerary),
      ...extra,
    });
  };

  // AI 작업 실행
  const run = async (label, fn) => {
    setBusy(label);
    setError('');

    try {
      await fn();
    } catch (e) {
      console.error('TripDetail 오류:', e);
      setError(
        e.message || 'AI 요청에 실패했어요. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setBusy('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5">
        <p className="mb-4 text-slate-600">
          여행 정보를 찾을 수 없습니다.
        </p>
        <Link to="/trips" className="text-primary font-bold">
          내 여행으로 돌아가기
        </Link>
      </div>
    );
  }

  const itinerary = trip.itinerary || [];
  const day = itinerary[dayIdx];

  // 일정 항목 수정
  const updateItem = (itemIdx, patch) => {
    const next = itinerary.map((d, dIdx) => {
      if (dIdx !== dayIdx) return d;

      return {
        ...d,
        items: (d.items || []).map((item, i) =>
          i === itemIdx ? { ...item, ...patch } : item
        ),
      };
    });

    return saveItinerary(next);
  };

  // 장소 변경
  const replace = (itemIdx) =>
    run('장소를 바꾸는 중…', async () => {
      const item = await suggestReplacement(
        trip,
        dayIdx,
        itemIdx
      );

      await updateItem(itemIdx, {
        ...item,
        time: day.items[itemIdx].time,
      });
    });

  // AI 일정 수정
  const revise = (text) =>
    run('AI가 일정을 수정하는 중…', async () => {
      const plan = await reviseTrip(trip, text);

      saveItinerary(toItinerary(plan), {
        summary: plan.summary || trip.summary,
      });

      setDayIdx(0);
    });

  // 공유 링크 복사
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('공유 링크 복사 실패:', e);
      setError('링크 복사에 실패했어요.');
    }
  };

  return (
    <div className="px-5 pb-6 pt-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black">{trip.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {trip.summary}
          </p>
        </div>

        <button
          onClick={share}
          className="flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs"
        >
          <Share2 className="h-3 w-3" />
          {copied ? '복사됨' : '공유'}
        </button>
      </div>

      <div className="mt-4">
        <CostSummary
          itinerary={itinerary}
          total={trip.total_cost || 0}
          budget={trip.budget}
        />
      </div>

      <div className="mt-5 flex gap-2 rounded-full bg-slate-200/60 p-1">
        {[
          ['plan', '일정'],
          ['check', '준비물'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 rounded-full py-2 text-sm font-bold transition ${
              tab === key
                ? 'bg-white shadow'
                : 'text-slate-500'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'check' ? (
        <div className="mt-5">
          <Checklist
            items={trip.checklist || []}
            onChange={(checklist) => save({ checklist })}
          />
        </div>
      ) : (
        <>
          <div className="mt-5 flex gap-2 overflow-x-auto">
            {itinerary.map((d, i) => (
              <button
                key={i}
                onClick={() => setDayIdx(i)}
                className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
                  i === dayIdx
                    ? 'bg-[#132B4F] text-white'
                    : 'bg-white text-slate-500 border border-slate-200'
                }`}
              >
                {d.day}일차
              </button>
            ))}
          </div>

          {day?.theme && (
            <p className="mt-3 text-sm font-medium text-primary">
              {day.theme}
            </p>
          )}

          <div className="mt-4">
            {day?.items?.map((item, i) => (
              <ItineraryItem
                key={i}
                item={item}
                last={i === day.items.length - 1}
                busy={!!busy}
                onReplace={() => replace(i)}
                onTimeChange={(time) =>
                  updateItem(i, { time })
                }
              />
            ))}
          </div>

          <Link
            to={`/trip/${id}/map`}
            className="mb-4 flex items-center justify-center gap-2 rounded-2xl bg-[#132B4F] py-3.5 text-sm font-bold text-white"
          >
            <Map className="h-4 w-4" />
            지도·이동 경로 보기
          </Link>

          {busy && (
            <p className="mb-3 flex items-center justify-center gap-2 text-sm text-primary">
              <Loader2 className="h-4 w-4 animate-spin" />
              {busy}
            </p>
          )}

          {error && (
            <p className="mb-3 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <ChatEdit onSubmit={revise} busy={!!busy} />

          <button
            onClick={() =>
              revise('지금 일정을 다른 장소 위주로 다시 추천해줘')
            }
            disabled={!!busy}
            className="mt-3 w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-medium text-slate-600 disabled:opacity-50"
          >
            다시 추천받기
          </button>
        </>
      )}

      <p className="mt-6 flex gap-2 rounded-xl bg-[#FFF4E5] p-3 text-xs text-slate-600">
        <Info className="h-4 w-4 shrink-0 text-amber-500" />
        AI가 만든 일정은 확정 예약이 아닌 추천 초안이에요.
        운영시간·가격·교통 상황은 변동될 수 있으니 출발 전에 꼭 다시 확인해주세요.
      </p>
    </div>
  );
}
