INSERT INTO menu (name, path, parent_id, depth, sort_order, visible, created_at, updated_at)
VALUES ('홈', '/', NULL, 1, 1, true, NOW(), NOW()),
       ('학습', '/study', NULL, 1, 2, true, NOW(), NOW()),
       ('내 카드', '/my-cards', NULL, 1, 3, true, NOW(), NOW()),
       ('설정', '/settings', NULL, 1, 4, true, NOW(), NOW());
