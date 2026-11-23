# TripMate (트립메이트)

**AI 기반 맞춤형 여행 일정 생성 서비스**

TripMate는 사용자가 여행 목적지와 여행 기간, 예산, 동행자 및 관심사를 입력하면 맞춤형 여행 일정을 생성하고 관리할 수 있도록 돕는 여행 앱입니다.

## 🌐 서비스 바로가기

[TripMate 웹 앱 실행하기](https://camouflaged-trip-mate-plan.base44.app)


## 1. 주요 기능

- **여행 정보 입력**: 여행지, 기간, 예산, 동행자, 관심사 설정
- **AI 일정 생성**: 입력한 여행 조건을 바탕으로 여행 일정 생성
- **여행 관리**: 생성한 여행 목록 및 상세 일정 확인
- **여행 지도**: 여행 장소와 이동 경로 확인
- **체크리스트**: 여행 준비물 및 할 일 관리
- **비용 관리**: 여행 예상 비용 확인

## 2. 개발 환경

| 구분 | 사용 기술 |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Language | JavaScript |
| UI | Tailwind CSS |
| Icons | Lucide React |
| Backend | Base44 |
| Mobile | Capacitor |
| iOS | Xcode |

## 3. 실행 방법

### 사전 준비

- Node.js
- npm
- Visual Studio Code (권장)

### 프로젝트 설치

```bash
git clone https://github.com/fkdlxmtmxk-dev/TripMate.git
cd TripMate
npm install
```

### 개발 서버 실행

```bash
npm run dev
```

실행 후 터미널에 표시되는 로컬 주소로 접속합니다.

### 프로덕션 빌드

```bash
npm run build
```

빌드 결과물은 `dist` 폴더에 생성됩니다.

## 🔑 API 설정 안내

트립메이트의 AI 일정 생성 기능을 사용하려면 OpenRouter API 연동이 필요합니다.

1. [OpenRouter](https://openrouter.ai/)에 가입합니다.
2. API Keys 메뉴에서 API 키를 발급받습니다.
3. 프로젝트 루트 폴더에 `.env` 파일을 생성합니다.
4. 프로젝트에서 사용하는 환경변수 이름에 맞춰 API 키를 설정합니다.

API 키가 설정되지 않은 경우 AI 일정 생성 기능이 정상적으로 작동하지 않을 수 있습니다.

※ API 키는 개인적으로 발급받아야 하며, GitHub 등 공개 저장소에 업로드하지 마세요.

## 4. iOS 앱 실행

이 프로젝트는 Capacitor를 사용하여 웹 프로젝트를 iOS 앱으로 연결합니다.

### iOS 프로젝트 동기화

```bash
npx cap sync ios
```

### Xcode 실행

```bash
npx cap open ios
```

Xcode에서 시뮬레이터 또는 연결된 iPhone을 선택하여 실행할 수 있습니다.

※ iOS 빌드 및 실행에는 macOS와 Xcode가 필요합니다.

## 5. 프로젝트 구조

```text
TripMate/
├── base44/
│   └── entities/
│       └── trip.jsonc
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── api/
│   └── ...
├── ios/
├── package.json
├── capacitor.config.ts
├── vite.config.js
└── README.md
```

## 6. 개발자

- 이름: 이해성
- 프로젝트명: TripMate (트립메이트)


## Docs & Support

GitHub integration: [https://docs.base44.com/developers/app-code/local-development/github](https://docs.base44.com/developers/app-code/local-development/github)



Local development: [https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview](https://docs.base44.com/developers/backend/overview/local-dev/local-development-overview)

Support: [https://app.base44.com/support](https://app.base44.com/support)
