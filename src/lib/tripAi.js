
const ITEM_PROPS = {
  time: { type: 'string', description: 'HH:MM 24시간 형식' },
  name: { type: 'string' },
  category: {
    type: 'string',
    enum: ['관광', '식사', '카페', '체험', '휴식', '쇼핑']
  },
  description: { type: 'string', description: '한 줄 설명' },
  reason: {
    type: 'string',
    description: '사용자의 취향/예산에 맞는 추천 이유'
  },
  cost: {
    type: 'number',
    description: '1인 예상 비용(원), 무료는 0'
  },
  transit_cost: {
    type: 'number',
    description: '이전 장소에서 여기까지 1인 교통비(원)'
  },
  duration_min: {
    type: 'number',
    description: '예상 소요시간(분)'
  },
  indoor: { type: 'boolean' },
  lat: { type: 'number' },
  lng: { type: 'number' },
  travel_mode: {
    type: 'string',
    description: '이전 장소에서의 이동수단 (도보/대중교통/자동차)'
  },
  travel_min: {
    type: 'number',
    description: '이전 장소에서의 예상 이동시간(분), 첫 장소는 0'
  }
};

const ITEM_SCHEMA = {
  type: 'object',
  properties: ITEM_PROPS,
  required: Object.keys(ITEM_PROPS)
};

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    title: { type: 'string' },
    summary: { type: 'string' },
    days: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          day: { type: 'number' },
          theme: { type: 'string' },
          items: {
            type: 'array',
            items: ITEM_SCHEMA
          }
        },
        required: ['day', 'theme', 'items']
      }
    },
    checklist: {
      type: 'array',
      items: { type: 'string' }
    }
  },
  required: ['title', 'summary', 'days', 'checklist']
};

const RULES = `
규칙:
- 한국 여행자 기준으로 작성한다.
- 대중교통 접근성, 도보 이동량, 지역별 실제 이동시간을 고려한다.
- 하루 4~6개 장소를 시간순으로 배치한다.
- 실제로 존재하는 장소만 사용한다.
- 위도와 경도는 가능한 정확하게 입력한다.
- 비용은 1인 기준 원화로 작성한다.
- 전체 비용이 입력된 예산을 넘지 않도록 한다.
- 모든 텍스트는 한국어로 작성한다.
- JSON 형식 외의 설명은 반환하지 않는다.
`;

export const MODEL = 'openrouter/free';

// OpenRouter 백엔드 호출
async function requestAI(prompt, schema) {
  const response = await fetch('/api/ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt,
      schema,
      model: MODEL
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `AI 서버 오류 (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();

  // 서버가 결과를 어떤 형태로 반환하더라도 처리
  let result =
    data.result ??
    data.data ??
    data.output ??
    data.content ??
    data;

  // OpenRouter 원본 응답 형식 처리
  if (result.choices?.[0]?.message?.content) {
    result = result.choices[0].message.content;
  }

  // JSON 문자열 처리
  if (typeof result === 'string') {
    result = result
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    result = JSON.parse(result);
  }

  if (!result || typeof result !== 'object') {
    throw new Error('AI 응답 데이터가 올바르지 않습니다.');
  }

  return result;
}

// 비용 계산
export function computeBreakdown(itinerary) {
  const b = {
    식사: 0,
    카페: 0,
    '입장료·체험': 0,
    교통: 0
  };

  (itinerary || []).forEach((d) =>
    (d.items || []).forEach((i) => {
      const c = Number(i.cost) || 0;

      if (i.category === '식사') {
        b.식사 += c;
      } else if (i.category === '카페') {
        b.카페 += c;
      } else {
        b['입장료·체험'] += c;
      }

      b.교통 += Number(i.transit_cost) || 0;
    })
  );

  return b;
}

// 총비용 계산
export function computeTotal(itinerary) {
  return Object.values(computeBreakdown(itinerary))
    .reduce((a, v) => a + v, 0);
}

// 여행 일정 생성
export async function generateTrip(input) {
  const prompt = `
${input.destination} ${input.days}일 여행 일정 초안을 만들어줘.

- 1인 예산: ${input.budget}원
- 동행: ${input.companions}
- 취향: ${(input.interests || []).join(', ')}
- 이동 수단: ${input.transport}

${RULES}

각 장소에 추천 이유(reason)를 반드시 작성해줘.
준비물 체크리스트(checklist)는 8개 내외로 제안해줘.
전체 일정을 PLAN_SCHEMA 구조에 맞춰 작성해줘.
`;

  return requestAI(prompt, PLAN_SCHEMA);
}

// 기존 여행 일정 수정
export async function reviseTrip(trip, instruction) {
  const prompt = `
아래는 현재 여행 일정(JSON)이다.
사용자의 요청을 반영해 전체 일정을 다시 구성해줘.

[사용자 요청]
${instruction}

[여행 정보]
여행지: ${trip.destination}
1인 예산: ${trip.budget}원
동행: ${trip.companions}
취향: ${(trip.interests || []).join(', ')}
이동수단: ${trip.transport}

${RULES}

요청과 상관없는 부분은 최대한 유지해줘.
비가 오거나 실내 요청이면 실내 장소, 가까운 대체 코스,
휴식 시간을 포함해줘.

[현재 일정]
${JSON.stringify(trip.itinerary)}
`;

  return requestAI(prompt, PLAN_SCHEMA);
}

// 기존 장소 대체 추천
export async function suggestReplacement(trip, dayIdx, itemIdx) {
  const day = trip.itinerary[dayIdx];
  const old = day.items[itemIdx];

  if (!old) {
    throw new Error('교체할 장소를 찾을 수 없습니다.');
  }

  const prompt = `
${trip.destination} 여행의 ${day.day}일차 일정 중
"${old.name}"(${old.category})을 대체할 장소 한 곳을 추천해줘.

기존 시간: ${old.time}
취향: ${(trip.interests || []).join(', ')}
이동수단: ${trip.transport}

같은 날 다른 장소와 중복되지 않도록 해줘.
비슷하거나 더 저렴한 비용의 장소를 우선 추천해줘.

이전 장소:
${day.items[itemIdx - 1]?.name || '없음'}

${RULES}

기존 시간대와 일정 흐름을 고려해줘.
ITEM_SCHEMA 구조에 맞는 장소 하나만 반환해줘.
`;

  return requestAI(prompt, ITEM_SCHEMA);
}

// AI 일정 데이터를 기존 앱 구조로 변환
export function toItinerary(plan) {
  return (plan.days || []).map((d, i) => ({
    day: d.day || i + 1,
    theme: d.theme || '',
    items: d.items || []
  }));
}
