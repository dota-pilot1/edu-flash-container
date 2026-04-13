---
name: impl-plan
description: 백엔드 → 프론트엔드 구현 계획을 스텝별로 문서화합니다. 기능명을 함께 전달하세요.
command: impl-plan
---

# 구현 계획 스킬

사용자가 기능명을 전달하면, 아래 규칙에 따라 구현 계획 문서를 생성합니다.

## 출력 경로 규칙

```
/Users/terecal/edu-flash-container/구현 계획/{기능명}/구현 계획/
├── erd/
│   └── {테이블명}.md        # ERD (테이블이 필요한 경우)
├── step1.md                 # 백엔드 구현
├── step2.md                 # 프론트엔드 구현
├── step3.md                 # 통합 + 테스트
└── ...                      # 필요 시 스텝 추가
```

- `{기능명}` → 사용자가 전달한 기능명 (예: "헤더 메뉴 with db")

## 프로젝트 정보

- **백엔드**: Spring Boot 4 + Java 21 + JPA + PostgreSQL (정통 DDD 절충안)
  - 경로: `/Users/terecal/edu-flash-container/edu-flash-server`
  - 패키지: `com.eduflash`
  - DDD 레이어 구조:
    ```
    com.eduflash.{도메인}
    ├── presentation        # Controller + DTO (요청/응답)
    ├── application         # Service (비즈니스 로직)
    ├── domain              # Entity + Repository interface
    └── infrastructure      # 외부 연동 (메일, 외부 API 등) - 필요 시 추가
    ```
  - 공통 설정: `com.eduflash.global.config`
- **프론트엔드**: React + Vite + TypeScript + Tailwind CSS v4 (FSD 구조)
  - 경로: `/Users/terecal/edu-flash-container/edu-flash-front`
  - 상태: Zustand / TanStack Query / React Hook Form / Axios
- **DB**: PostgreSQL 17 (Docker Compose, localhost:5432, edu_flash/edu_flash)

## 스텝 작성 규칙

### 스텝 분리 원칙
1. **백엔드 먼저, 프론트 나중** — API가 있어야 프론트가 연동 가능
2. **한 스텝 = 한 번에 구현 가능한 단위** — 너무 크지 않게
3. **각 스텝은 독립 실행 가능** — 이전 스텝 완료 후 테스트 가능한 단위

### 스텝 구성 순서 (기본)
| 순서 | 내용 | 대상 |
|------|------|------|
| Step 1 | DB 설계 + 엔티티 + Repository | 백엔드 |
| Step 2 | Service + Controller (API) | 백엔드 |
| Step 3 | 프론트 타입 + API 연동 계층 | 프론트 |
| Step 4 | UI 구현 (위젯/페이지) | 프론트 |
| Step 5 | 통합 테스트 + CORS/프록시 | 풀스택 |

> 기능 규모에 따라 스텝을 합치거나 세분화합니다.

### 각 step.md 포맷
```markdown
# Step N — {제목}

## 목표
한 줄 요약

## 작업 내용

### N-1. {소제목}
구체적인 코드 구조, 파일 경로, 핵심 로직

### N-2. {소제목}
...

## 완료 기준
- [ ] 체크리스트 (테스트 가능한 기준)
```

### ERD 문서 포맷
```markdown
# {테이블명} ERD

## {테이블명} 테이블
| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|

## 관계
## 인덱스
## 초기 데이터 (필요 시)
```

## 실행 절차

1. 사용자 요청에서 **기능명** 추출
2. 현재 프로젝트 구조 탐색 (기존 엔티티, API, 페이지 확인)
3. ERD 설계 (DB 필요 시)
4. 백엔드 → 프론트 순서로 스텝 분리
5. 각 스텝별 md 파일 생성
6. 전체 요약 출력
