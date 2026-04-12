# Step 3 — 프론트: 헤더 DB 메뉴 렌더링 + 페이지 이동

## 목표
헤더에 DB 1차 메뉴를 동적 렌더링하고, 클릭 시 해당 페이지로 이동

## 작업 내용

### 3-1. Header 수정
- 기존 하드코딩 nav → useQuery로 1차 메뉴(depth=1) 조회
- visible=true인 메뉴만 표시
- sortOrder 순 정렬
- "메뉴 관리" 링크는 하드코딩 유지 (관리자 기능)

### 3-2. 동적 라우트
```
src/
├── pages/
│   ├── home/ui/HomePage.tsx             # 기존
│   ├── menu-manage/ui/MenuManagePage.tsx # Step 2에서 생성
│   └── placeholder/ui/PlaceholderPage.tsx # 신규: "준비 중" 페이지
└── app/routes/AppRoutes.tsx             # 동적 라우트 추가
```

### 3-3. AppRoutes 수정
- DB 메뉴의 path 기반으로 Route 동적 생성
- "/" → HomePage
- "/menu-manage" → MenuManagePage
- 나머지 DB 메뉴 path → PlaceholderPage (메뉴명 표시)
- 매칭 안 되는 경로 → 404

### 3-4. PlaceholderPage
- URL 파라미터 또는 메뉴 데이터에서 메뉴명 추출
- "{메뉴명} 페이지 - 구현 예정" 표시

## 완료 기준
- [ ] 헤더에 DB 1차 메뉴 동적 표시
- [ ] DB에서 메뉴 추가/수정 → 헤더에 반영
- [ ] 메뉴 클릭 시 해당 경로로 이동
- [ ] 존재하지 않는 페이지는 "구현 예정" 표시
