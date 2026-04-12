# Step 1 — 백엔드: Menu 엔티티 + CRUD API

## 목표
Menu 테이블 생성, 트리 조회 포함 CRUD API 구현, Security/CORS 설정

## 작업 내용

### 1-1. 패키지 구조 (정통 DDD 절충안)
```
com.eduflash
├── menu
│   ├── presentation
│   │   ├── MenuController.java        # REST API
│   │   └── dto
│   │       ├── MenuRequest.java       # 생성/수정 요청 DTO
│   │       └── MenuResponse.java      # 응답 DTO (children 포함 트리 구조)
│   ├── application
│   │   └── MenuService.java           # 비즈니스 로직
│   ├── domain
│   │   ├── Menu.java                  # @Entity (Self-referencing)
│   │   └── MenuRepository.java        # JpaRepository interface
│   └── infrastructure                 # (지금은 비워둠, 외부 연동 시 추가)
└── global
    └── config
        ├── SecurityConfig.java        # 임시 permitAll
        └── WebConfig.java             # CORS 설정
```

### 1-2. Menu 엔티티
- ERD 기반 (erd/menu.md 참고)
- `@ManyToOne` parent ↔ `@OneToMany` children (Self-referencing)
- `@CreationTimestamp`, `@UpdateTimestamp` 활용

### 1-3. REST API
| Method | URL | 설명 |
|--------|-----|------|
| GET | /api/menus/tree | 전체 메뉴 트리 조회 (1차 기준, children 포함) |
| GET | /api/menus?depth=1 | 특정 depth 메뉴 목록 조회 |
| GET | /api/menus/{id} | 단건 조회 |
| POST | /api/menus | 메뉴 생성 (parentId로 상위 지정) |
| PUT | /api/menus/{id} | 메뉴 수정 |
| DELETE | /api/menus/{id} | 메뉴 삭제 (하위 메뉴도 함께 삭제) |

### 1-4. MenuResponse 트리 구조
```json
{
  "id": 2,
  "name": "학습",
  "path": "/study",
  "depth": 1,
  "sortOrder": 2,
  "visible": true,
  "children": [
    { "id": 5, "name": "기초", "path": "/study/basic", "depth": 2, "children": [] },
    { "id": 6, "name": "심화", "path": "/study/advanced", "depth": 2, "children": [] }
  ]
}
```

### 1-5. Security + CORS
- SecurityConfig: 전체 permitAll (추후 인증 추가)
- WebConfig: localhost:5173 허용

### 1-6. 초기 데이터
- data.sql로 1차 메뉴 4개 insert

## 완료 기준
- [ ] 서버 실행 시 menu 테이블 자동 생성 + 초기 데이터 투입
- [ ] GET /api/menus/tree → 트리 구조 JSON 반환
- [ ] POST/PUT/DELETE 정상 동작
- [ ] curl 또는 httpie로 API 테스트 완료
