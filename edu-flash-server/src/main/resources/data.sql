INSERT INTO menu (name, path, parent_id, depth, sort_order, visible, created_at, updated_at)
VALUES ('홈', '/', NULL, 1, 1, true, NOW(), NOW()),
       ('학습', '/study', NULL, 1, 2, true, NOW(), NOW()),
       ('내 카드', '/my-cards', NULL, 1, 3, true, NOW(), NOW()),
       ('설정', '/settings', NULL, 1, 4, true, NOW(), NOW()),
       ('DnD Kit 실습', '/practice-dnd-kit', NULL, 1, 5, true, NOW(), NOW());

INSERT INTO menu (name, path, parent_id, depth, sort_order, visible, created_at, updated_at)
VALUES ('Level 1 - 기본 드래그', '/practice-dnd-kit/level1', 5, 2, 1, true, NOW(), NOW()),
       ('Level 2 - 정렬 리스트', '/practice-dnd-kit/level2', 5, 2, 2, true, NOW(), NOW()),
       ('Level 3 - 다중 컨테이너', '/practice-dnd-kit/level3', 5, 2, 3, true, NOW(), NOW()),
       ('Level 4 - 그리드 정렬', '/practice-dnd-kit/level4', 5, 2, 4, true, NOW(), NOW()),
       ('Level 5 - 트리 정렬', '/practice-dnd-kit/level5', 5, 2, 5, true, NOW(), NOW());
