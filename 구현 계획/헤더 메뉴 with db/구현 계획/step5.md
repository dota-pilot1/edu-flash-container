# Step 5 — 프론트: 메뉴 관리 페이지 (트리 사이드바 + 상세 폼)

## 목표
왼쪽 트리 사이드바 + 오른쪽 상세 수정 폼 레이아웃

## 작업 내용

### 5-1. FSD 구조
```
features/menu-manage/
├── ui/MenuTree.tsx      # 트리 사이드바 (재귀 TreeNode)
├── ui/MenuDetail.tsx    # 상세 폼 (React Hook Form)
├── ui/ContextMenu.tsx   # 우클릭 컨텍스트 메뉴
└── index.ts

pages/menu-manage/
└── ui/MenuManagePage.tsx  # 레이아웃 + useMutation
```

### 5-2. MenuTree (shadcn/ui 스타일)
- 재귀 TreeNode 컴포넌트
- 선택: `bg-gray-900 text-white`
- 호버: `bg-gray-100`
- 들여쓰기: `depth * 12px`
- SVG 화살표 (펼침/접기)
- visible OFF → opacity-30

### 5-3. 인라인 메뉴 추가
- 우클릭 → ContextMenu → "하위 메뉴 추가"
- 트리 내부에 인라인 input 생성
- 이름 입력 → Enter → 즉시 생성 (path 자동 생성)
- ESC / blur → 취소
- depth < 3일 때만 하위 추가 가능

### 5-4. ContextMenu
- absolute 포지션, 클릭 좌표에 표시
- "하위 메뉴 추가" + "삭제"
- 바깥 클릭 / ESC → 닫기

### 5-5. MenuDetail (우측 폼)
- 기존 메뉴 수정 전용 (신규 추가는 인라인)
- React Hook Form: 이름, 경로, 상위메뉴 select, 순서, 노출
- 저장/삭제 → useMutation + invalidateQueries

### 5-6. MenuManagePage
- 전체 폭 사용 (max-w 제한 없음)
- 사이드바 w-80 (320px)
- 상태: selectedMenu, contextMenu, inlineAdd

## 완료 기준
- [ ] 트리에서 메뉴 클릭 → 오른쪽 폼에 상세 표시
- [ ] 우클릭 → 인라인으로 하위 메뉴 추가
- [ ] 3차 메뉴에서는 "하위 메뉴 추가" 비활성화
- [ ] 메뉴 CRUD 후 트리 자동 갱신
