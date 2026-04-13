# Step 7 — 프론트: 동적 라우트 + 페이지

## 목표
DB 메뉴 path에 매칭되는 페이지 라우트 설정

## 작업 내용

### 7-1. 실제 페이지 생성 (필요 시)
```
pages/study-frontend/
└── ui/StudyFrontendPage.tsx    # /study/frontend 전용 페이지
```

### 7-2. PlaceholderPage
- catch-all 라우트 (`path="*"`)
- 메뉴 트리에서 현재 path에 해당하는 메뉴명 찾아서 표시
- "{메뉴명} - 구현 예정"

### 7-3. AppRoutes
```
/ → HomePage
/menu-manage → MenuManagePage
/study/frontend → StudyFrontendPage
* → PlaceholderPage (catch-all)
```

- 실제 페이지가 만들어지면 라우트 추가
- 나머지는 PlaceholderPage가 처리

## 완료 기준
- [ ] 등록된 라우트 → 실제 페이지 표시
- [ ] 미등록 라우트 → PlaceholderPage에서 메뉴명 표시
