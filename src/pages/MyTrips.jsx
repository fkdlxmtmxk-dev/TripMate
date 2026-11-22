
import { Link } from 'react-router-dom';
import { MapPin, Trash2, CalendarDays } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getTrips, deleteTrip } from '@/lib/tripStorage';

export default function MyTrips() {
  const [trips, setTrips] = useState([]);

  const loadTrips = () => {
    setTrips(getTrips());
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('이 여행을 삭제할까요?')) return;

    deleteTrip(id);
    loadTrips();
  };

  return (
    <div className="px-5 pt-10 pb-8">
      <h1 className="text-3xl font-black">내 여행</h1>
      <p className="mb-5 mt-1 text-sm text-slate-500">
        저장한 여행 일정을 확인할 수 있어요.
      </p>

      {trips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-400">
          <MapPin className="mx-auto mb-3 h-8 w-8" />
          아직 저장된 여행이 없어요.
          <br />
          <Link
            to="/"
            className="mt-2 inline-block font-bold text-primary"
          >
            첫 일정 만들기
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
            >
              <Link
                to={`/trip/${trip.id}`}
                className="min-w-0 flex-1"
              >
                <h2 className="truncate font-bold text-slate-900">
                  {trip.title || '이름 없는 여행'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  <MapPin className="mr-1 inline h-3 w-3" />
                  {trip.destination || '목적지 미정'}
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  <CalendarDays className="mr-1 inline h-3 w-3" />
                  {trip.days_count || trip.itinerary?.length || 0}일 여행
                </p>
              </Link>

              <button
                onClick={() => handleDelete(trip.id)}
                className="ml-3 rounded-full p-2 text-slate-400 hover:bg-red-50 hover:text-red-500"
                aria-label="여행 삭제"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
