# Step 1 — 백엔드: Menu 엔티티 + DB 설계

## 목표
Self-referencing Menu 테이블 생성, 1/2/3차 트리 구조 지원

## 작업 내용

### 1-1. DDD 패키지 구조 생성
```
com.eduflash
├── menu/
│   ├── domain/
│   │   ├── Menu.java              # @Entity
│   │   └── MenuRepository.java    # JpaRepository interface
│   ├── application/               # (Step 2에서 추가)
│   ├── presentation/              # (Step 2에서 추가)
│   └── infrastructure/            # (필요 시 추가)
└── global/config/                 # (Step 3에서 추가)
```

### 1-2. Menu 엔티티
- Self-referencing: `@ManyToOne parent` ↔ `@OneToMany children`
- 컬럼: id, name, path(unique), parent_id, depth, sort_order, visible
- `@CreationTimestamp`, `@UpdateTimestamp`
- `@OrderBy("sortOrder ASC")` on children
- `CascadeType.ALL`, `orphanRemoval = true`

### 1-3. MenuRepository
- `findByParentIsNullOrderBySortOrderAsc()` — 트리 루트 조회
- `findByDepthOrderBySortOrderAsc(depth)` — depth별 조회

### 1-4. 초기 데이터
- `data.sql`로 1차 메뉴 4개 INSERT (홈, 학습, 내 카드, 설정)
- `application.yaml`에 `defer-datasource-initialization: true` 설정

## 완료 기준
- [ ] 서버 실행 시 menu 테이블 자동 생성
- [ ] data.sql로 초기 데이터 투입 확인
