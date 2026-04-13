# Menu ERD

## menu 테이블

| 컬럼 | 타입 | 제약 | 설명 |
|------|------|------|------|
| id | BIGSERIAL | PK | 메뉴 ID |
| name | VARCHAR(50) | NOT NULL | 메뉴 표시 이름 (홈, 학습, 설정 등) |
| path | VARCHAR(200) | NOT NULL, UNIQUE | 프론트 라우트 경로 (/study, /my-cards) |
| parent_id | BIGINT | FK(menu.id), NULL | 상위 메뉴 ID (NULL이면 1차 메뉴) |
| depth | INT | NOT NULL, DEFAULT 1 | 메뉴 깊이 (1차=1, 2차=2, 3차=3) |
| sort_order | INT | NOT NULL, DEFAULT 0 | 같은 depth 내 정렬 순서 |
| visible | BOOLEAN | NOT NULL, DEFAULT TRUE | 노출 여부 |
| created_at | TIMESTAMP | NOT NULL | 생성일 |
| updated_at | TIMESTAMP | NOT NULL | 수정일 |

## 관계 (Self-referencing)

```
menu (1차: parent_id = NULL, depth = 1)
 └── menu (2차: parent_id = 1차.id, depth = 2)
      └── menu (3차: parent_id = 2차.id, depth = 3)
```

## 인덱스

- `idx_menu_parent_id` → parent_id (자식 메뉴 조회)
- `idx_menu_depth_sort` → (depth, sort_order) (정렬 조회)

## 초기 데이터

| id | name | path | parent_id | depth | sort_order |
|----|------|------|-----------|-------|------------|
| 1 | 홈 | / | NULL | 1 | 1 |
| 2 | 학습 | /study | NULL | 1 | 2 |
| 3 | 내 카드 | /my-cards | NULL | 1 | 3 |
| 4 | 설정 | /settings | NULL | 1 | 4 |
