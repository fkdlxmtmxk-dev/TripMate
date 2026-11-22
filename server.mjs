
import express from 'express';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = 3001;

app.use(express.json({ limit: '2mb' }));

// 서버 상태 확인
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'TripMate AI Server is running'
  });
});

// OpenRouter 요청 함수
async function callOpenRouter(apiKey, body) {
  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:5173',
        'X-Title': 'TripMate'
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(120000)
    }
  );

  const data = await response.json();

  return { response, data };
}

// AI 일정 생성
app.post('/api/ai', async (req, res) => {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: 'OPENROUTER_API_KEY가 설정되지 않았습니다.'
      });
    }

    const { prompt, schema, model } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        error: '올바른 prompt가 필요합니다.'
      });
    }

    const selectedModel = model || 'openrouter/free';

    const messages = [
      {
        role: 'system',
        content: `
너는 한국 여행 전문 AI 플래너다.

반드시 JSON 형식으로만 응답한다.
마크다운이나 추가 설명은 작성하지 않는다.
모든 텍스트는 한국어로 작성한다.

${schema ? `반드시 다음 JSON Schema 구조를 따른다:\n${JSON.stringify(schema)}` : ''}
        `
      },
      {
        role: 'user',
        content: prompt
      }
    ];

    const requestBody = {
      model: selectedModel,
      messages,
      temperature: 0.7
    };

    // 먼저 JSON Schema 방식으로 요청
    if (schema) {
      requestBody.response_format = {
        type: 'json_schema',
        json_schema: {
          name: 'tripmate_response',
          strict: false,
          schema
        }
      };
    }

    let { response, data } = await callOpenRouter(
      apiKey,
      requestBody
    );

    // JSON Schema를 지원하지 않는 모델이면 JSON 모드로 재시도
    if (
      !response.ok &&
      schema &&
      [400, 422].includes(response.status)
    ) {
      console.warn('JSON Schema 요청 실패. JSON 모드로 재시도합니다.');

      const fallbackBody = {
        ...requestBody,
        response_format: {
          type: 'json_object'
        }
      };

      ({ response, data } = await callOpenRouter(
        apiKey,
        fallbackBody
      ));
    }

    if (!response.ok) {
      console.error('OpenRouter 오류:', data);

      return res.status(response.status).json({
        error: data.error?.message || 'OpenRouter 요청 실패',
        details: data
      });
    }

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({
        error: 'AI 응답이 비어 있습니다.'
      });
    }

    console.log('AI 응답 성공:', data.model);

    return res.json({
      result: content,
      model: data.model
    });

  } catch (error) {
    console.error('서버 오류:', error);

    const isTimeout = error.name === 'TimeoutError';

    return res.status(isTimeout ? 504 : 500).json({
      error: isTimeout
        ? 'AI 응답 시간이 초과되었습니다.'
        : error.message || '서버 내부 오류'
    });
  }
});

app.listen(PORT, () => {
  console.log(`TripMate AI Server: http://localhost:${PORT}`);
});
