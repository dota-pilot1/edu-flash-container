import { arrayMove } from '@dnd-kit/sortable'
import type { TreeItem, TreeNode } from '../model/types'

/**
 * flat 배열 → 트리 구조로 변환 (렌더링용)
 */
export function buildTree(items: TreeItem[]): TreeNode[] {
  const roots: TreeNode[] = []
  const map = new Map<string, TreeNode>()

  // 1단계: 모든 아이템을 Map에 등록 (O(n))
  for (const item of items) {
    map.set(item.id, { ...item, children: [] })
  }

  // 2단계: 부모-자식 관계 연결
  for (const item of items) {
    const node = map.get(item.id)!
    if (item.parentId && map.has(item.parentId)) {
      map.get(item.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }
  return roots
}

/**
 * 데이터를 블록(부모 + 모든 자식들) 단위로 쪼개주는 함수
 */
function splitIntoBlocks(items: TreeItem[], targetDepth: number): TreeItem[][] {
  const blocks: TreeItem[][] = []

  items.forEach((item) => {
    // 1. 현재 정렬하려는 뎁스와 같거나 더 얕은(상위) 메뉴라면? -> 새로운 블록(칸) 시작
    if (item.depth <= targetDepth) {
      blocks.push([item])
    }
    // 2. 나보다 더 깊은(하위) 메뉴라면? -> 현재 작업 중인 블록의 '식구'로 추가
    else if (blocks.length > 0) {
      blocks[blocks.length - 1].push(item)
    }
  });

  return blocks
}

/**
 * n차 메뉴까지 대응 가능한 범용 트리 이동 로직
 * (사용자의 드래그 의도에 맞게 블록 단위로 순서를 재배치함)
 */
export function treeAwareMove(items: TreeItem[], activeId: string, overId: string): TreeItem[] {
  const activeItem = items.find((i) => i.id === activeId)
  const overItem = items.find((i) => i.id === overId)

  // 1. 유효성 체크
  if (!activeItem || !overItem || activeItem.depth !== overItem.depth) return items
  if (activeItem.parentId !== overItem.parentId) return items

  // 2. [명시적 단계] 전체 리스트를 '블록' 단위로 쪼개기
  const blocks = splitIntoBlocks(items, activeItem.depth)

  // 3. 블록들 사이에서 '이사 갈 놈'과 '목적지' 찾기
  const oldIndex = blocks.findIndex((b) => b[0]?.id === activeId)
  const newIndex = blocks.findIndex((b) => b[0]?.id === overId)

  if (oldIndex === -1 || newIndex === -1) return items

  // 4. 블록 단위로 순서 교체 후, 다시 평평한 배열로 합쳐서 반환
  return arrayMove(blocks, oldIndex, newIndex).flat()
}
