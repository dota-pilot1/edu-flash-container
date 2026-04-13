# Edu Flash

교육 튜토리얼 관리 플랫폼 — 메뉴 기반 콘텐츠 관리 시스템

## 기술 스택

### 백엔드
- Spring Boot 4.0.5 / Java 21
- Spring Data JPA + PostgreSQL 17
- Spring Security (현재 permitAll)
- DDD 절충안 (presentation / application / domain / infrastructure)

### 프론트엔드
- React 19 + TypeScript 6
- Vite 8 + Tailwind CSS 4
- TanStack Query 5 / Zustand / React Hook Form
- React Router 7
- dnd-kit + framer-motion
- FSD 아키텍처 (app / pages / widgets / features / entities / shared)

### 인프라
- Docker Compose (PostgreSQL)
- Vite 프록시 (/api → localhost:8080)

## 빠른 시작

### 1. 사전 요구사항
- Java 21
- Node.js 20+
- Docker

### 2. DB 실행
```bash
cd edu-flash-server
docker compose up -d
```

### 3. 백엔드 실행
```bash
cd edu-flash-server
./gradlew bootRun
```
> http://localhost:8080

### 4. 메뉴 초기 데이터 추가
```bash
./docs/seed-menus.sh
```
> 자세한 방법: [docs/메뉴 데이터 추가.md](docs/메뉴%20데이터%20추가.md)

### 5. 프론트엔드 실행
```bash
cd edu-flash-front
npm install
npm run dev
```
> http://localhost:5173

## 프로젝트 구조

```
edu-flash-container/
├── edu-flash-server/          # Spring Boot 백엔드
│   ├── src/main/java/com/eduflash/
│   │   ├── menu/              # 메뉴 도메인 (DDD)
│   │   │   ├── presentation/  # Controller + DTO
│   │   │   ├── application/   # Service
│   │   │   └── domain/        # Entity + Repository
│   │   └── global/config/     # Security, CORS
│   ├── docker-compose.yaml    # PostgreSQL
│   └── build.gradle
│
├── edu-flash-front/           # React 프론트엔드 (FSD)
│   └── src/
│       ├── app/               # 프로바이더, 라우트, 스타일
│       ├── pages/             # 페이지 컴포넌트
│       ├── widgets/           # 헤더 (DB 메뉴 연동)
│       ├── features/          # 메뉴 관리 (트리 + 컨텍스트 메뉴)
│       ├── entities/          # Menu 타입 + API
│       └── shared/            # axios, 공용 UI
│
├── docs/                      # 문서 + 스크립트
├── 구현 계획/                  # 기능별 구현 계획 (step1~9)
├── 디버깅 히스토리(날짜별)/     # 트러블슈팅 기록
└── .claude/skills/            # Claude Code 스킬
```

## 주요 기능

### 메뉴 관리 시스템
- DB 기반 1/2/3차 메뉴 관리 (Self-referencing 트리)
- 메뉴 관리 페이지: 사이드바 트리 + 우클릭 컨텍스트 메뉴 + 인라인 추가
- 헤더: DB 메뉴 동적 렌더링, 하위 메뉴 드롭다운

### API
| Method | URL | 설명 |
|--------|-----|------|
| GET | /api/menus/tree | 전체 메뉴 트리 조회 |
| GET | /api/menus?depth=N | depth별 메뉴 조회 |
| GET | /api/menus/{id} | 단건 조회 |
| POST | /api/menus | 메뉴 생성 |
| PUT | /api/menus/{id} | 메뉴 수정 |
| DELETE | /api/menus/{id} | 메뉴 삭제 (cascade) |

### dnd-kit 실습 (Level 1~5)
| Level | 주제 | 핵심 |
|-------|------|------|
| 1 | 기본 드래그 | useDraggable, useDroppable |
| 2 | 정렬 리스트 | SortableContext, arrayMove |
| 3 | 다중 컨테이너 (칸반) | 컨테이너 간 이동, DragOverlay |
| 4 | 그리드 스왑 | framer-motion layout, 1:1 교체 |
| 5 | 트리 정렬 | treeAwareMove, 블록 단위 이동 |

## DB 설정

| 항목 | 값 |
|------|-----|
| Host | localhost:5432 |
| Database | edu_flash |
| User | edu_flash |
| Password | edu_flash |
| DDL | update (데이터 유지) |

## Claude Code 스킬

| 스킬 | 사용법 | 설명 |
|------|--------|------|
| impl-plan | `/impl-plan 기능명` | 백엔드→프론트 구현 계획 문서 생성 |
| impl-code-review | `/impl-code-review 기능명` | 구현 완료 후 코드 리뷰 문서 생성 |
