
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Loader2, Navigation } from 'lucide-react';
import { getTrip } from '@/lib/tripStorage';
import RouteMap from '@/components/RouteMap';

export default function TripMap() {
  const { id } = useParams();
  const [dayIdx, setDayIdx] = useState(0);
  const [trip, setTrip] = useState(() => getTrip(id));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const savedTrip = getTrip(id);
    setTrip(savedTrip);
    setDayIdx(0);

    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-5">
        <h2 className="text-xl font-bold">여행 정보를 찾을 수 없어요.</h2>
        <Link to="/my-trips" className="mt-4 text-primary">
          내 여행으로 돌아가기
        </Link>
      </div>
    );
  }

  const itinerary = Array.isArray(trip.itinerary)
    ? trip.itinerary
    : [];

  if (itinerary.length === 0) {
    return (
      <div className="p-6">
        <Link to={`/trip/${id}`} className="text-sm text-slate-500">
          <ChevronLeft className="inline h-4 w-4" />
          일정으로
        </Link>
        <p className="mt-8 text-center text-slate-500">
          등록된 여행 일정이 없습니다.
        </p>
      </div>
    );
  }

  const safeDayIdx = Math.min(dayIdx, itinerary.length - 1);
  const day = itinerary[safeDayIdx];
  const items = Array.isArray(day?.items) ? day.items : [];

  const coords = items.filter(
    (item) =>
      Number.isFinite(Number(item.lat)) &&
      Number.isFinite(Number(item.lng))
  );

  const pt = (p) => `${p.lat},${p.lng}`;

  const gmaps =
    coords.length >= 2
      ? `https://www.google.com/maps/dir/?api=1&origin=${pt(coords[0])}&destination=${pt(coords[coords.length - 1])}${coords.length > 2 ? `&waypoints=${coords.slice(1, -1).map(pt).join('|')}` : ''}&travelmode=transit`
      : null;

  return (
    <div className="px-5 pb-6 pt-8">
      <Link
        to={`/trip/${id}`}
        className="mb-3 inline-flex items-center text-sm text-slate-500"
      >
        <ChevronLeft className="h-4 w-4" />
        일정으로
      </Link>

      <h1 className="text-2xl font-black">
        오늘의 이동 경로
      </h1>

      <p className="mb-4 text-sm text-slate-500">
        이동시간은 지도 정보 기준 예상치예요
      </p>

      <div className="mb-4 flex gap-2 overflow-x-auto">
        {itinerary.map((d, i) => (
          <button
            key={i}
            onClick={() => setDayIdx(i)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold ${
              i === safeDayIdx
                ? 'bg-[#132B4F] text-white'
                : 'border border-slate-200 bg-white text-slate-500'
            }`}
          >
            {d.day || i + 1}일차
          </button>
        ))}
      </div>

      <RouteMap items={items} />

      <h2 className="mb-2 mt-5 font-bold">
        추천 동선
      </h2>

      <div className="space-y-2">
        {items.map((it, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {i + 1}
            </span>

            <div className="flex-1">
              <p className="text-sm font-bold">{it.name}</p>
              <p className="text-xs text-slate-400">
                {it.time}
              </p>
            </div>

            {i > 0 && (
              <span className="text-xs text-slate-500">
                {it.travel_mode || '이동'} {it.travel_min || 0}분
              </span>
            )}

            {Number.isFinite(Number(it.lat)) &&
              Number.isFinite(Number(it.lng)) && (
                <a
                  href={`https://maps.apple.com/?daddr=${pt(it)}&q=${encodeURIComponent(it.name || '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary"
                >
                  <Navigation className="h-4 w-4" />
                </a>
              )}
          </div>
        ))}
      </div>

      {gmaps && (
        <a
          href={gmaps}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex items-center justify-center rounded-2xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/30"
        >
          지도 앱으로 길찾기
        </a>
      )}
    </div>
  );
}
