#!/bin/bash
# ===========================================
# 메뉴 초기 데이터 추가 스크립트
# 사용법: 백엔드 서버(8080) 실행 후
#   chmod +x docs/seed-menus.sh
#   ./docs/seed-menus.sh
# ===========================================

API="http://localhost:8080/api/menus"

echo "📂 1차 메뉴 추가..."
curl -s -X POST $API -H "Content-Type: application/json" \
  -d '{"name":"홈","path":"/","sortOrder":1,"visible":true}' > /dev/null
curl -s -X POST $API -H "Content-Type: application/json" \
  -d '{"name":"학습","path":"/study","sortOrder":2,"visible":true}' > /dev/null
curl -s -X POST $API -H "Content-Type: application/json" \
  -d '{"name":"내 카드","path":"/my-cards","sortOrder":3,"visible":true}' > /dev/null
curl -s -X POST $API -H "Content-Type: application/json" \
  -d '{"name":"설정","path":"/settings","sortOrder":4,"visible":true}' > /dev/null

# 학습 하위 메뉴 (parentId는 학습 메뉴의 ID)
STUDY_ID=$(curl -s "$API?depth=1" | python3 -c "import sys,json; print([m['id'] for m in json.load(sys.stdin) if m['name']=='학습'][0])")
echo "📂 학습(id=$STUDY_ID) 하위 메뉴 추가..."
curl -s -X POST $API -H "Content-Type: application/json" \
  -d "{\"name\":\"프론트 엔드\",\"path\":\"/study/frontend\",\"parentId\":$STUDY_ID,\"sortOrder\":1,\"visible\":true}" > /dev/null

# DnD Kit 실습 메뉴
curl -s -X POST $API -H "Content-Type: application/json" \
  -d '{"name":"DnD Kit 실습","path":"/practice-dnd-kit","sortOrder":5,"visible":true}' > /dev/null

DND_ID=$(curl -s "$API?depth=1" | python3 -c "import sys,json; print([m['id'] for m in json.load(sys.stdin) if m['name']=='DnD Kit 실습'][0])")
echo "📂 DnD Kit 실습(id=$DND_ID) 하위 메뉴 추가..."
for i in 1 2 3 4 5; do
  case $i in
    1) name="Level 1 - 기본 드래그" ;;
    2) name="Level 2 - 정렬 리스트" ;;
    3) name="Level 3 - 다중 컨테이너" ;;
    4) name="Level 4 - 그리드 정렬" ;;
    5) name="Level 5 - 트리 정렬" ;;
  esac
  curl -s -X POST $API -H "Content-Type: application/json" \
    -d "{\"name\":\"$name\",\"path\":\"/practice-dnd-kit/level$i\",\"parentId\":$DND_ID,\"sortOrder\":$i,\"visible\":true}" > /dev/null
done

echo ""
echo "✅ 메뉴 추가 완료!"
echo ""
curl -s "$API/tree" | python3 -c "
import sys,json
for m in json.load(sys.stdin):
    print(f'  {m[\"name\"]} ({m[\"path\"]})')
    for c in m['children']:
        print(f'    └ {c[\"name\"]} ({c[\"path\"]})')
"
