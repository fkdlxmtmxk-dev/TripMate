
const STORAGE_KEY = 'tripmate_trips';

// 전체 여행 목록 불러오기
export function getTrips() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

// 특정 여행 불러오기
export function getTrip(id) {
  return getTrips().find((trip) => String(trip.id) === String(id)) || null;
}

// 여행 저장 또는 수정
export function saveTrip(trip) {
  const trips = getTrips();

  const newTrip = {
    ...trip,
    id: trip.id || (
      crypto.randomUUID
        ? crypto.randomUUID()
        : String(Date.now())
    ),
  };

  const index = trips.findIndex(
    (item) => String(item.id) === String(newTrip.id)
  );

  if (index >= 0) {
    trips[index] = newTrip;
  } else {
    trips.unshift(newTrip);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));

  return newTrip;
}

// 여행 정보 수정
export function updateTrip(id, patch) {
  const trips = getTrips();

  const index = trips.findIndex(
    (trip) => String(trip.id) === String(id)
  );

  if (index === -1) {
    throw new Error('여행 정보를 찾을 수 없습니다.');
  }

  trips[index] = {
    ...trips[index],
    ...patch,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));

  return trips[index];
}

// 여행 삭제
export function deleteTrip(id) {
  const trips = getTrips().filter(
    (trip) => String(trip.id) !== String(id)
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}
