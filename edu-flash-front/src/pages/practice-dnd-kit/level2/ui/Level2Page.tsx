import { useState } from 'react'
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

// 구조적 이해:
// SortableContext: 정렬 가능한 리스트를 만드는 컨텍스트
// useSortable: 정렬 가능한 요소를 만드는 훅
// arrayMove: 정렬 가능한 리스트의 순서를 변경하는 함수
// verticalListSortingStrategy: 수직 리스트 정렬 전략

function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  // useSortable 훅을 사용하여 정렬 가능한 요소를 만든다.
  // 구조 할당 분해를 통해 가져온 속성들을 사용해서 정렬 가능한 요소를 만든다.
  // 내가 설정하는 정보는 id 와 children 이다.

  // 세부 사항
  // attributes: 정렬 가능한 요소의 속성
  // listeners: 정렬 가능한 요소의 리스너
  // setNodeRef: 정렬 가능한 요소의 노드 참조
  // transform: 정렬 가능한 요소의 변환
  // transition: 정렬 가능한 요소의 전환
  // isDragging: 정렬 가능한 요소가 드래그 중인지 여부
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  // style 객체를 생성한다.
  // 훅을 사용해서 가져온 속성들을 사용해서 style 객체를 생성한다.
  // transform: CSS.Transform.toString(transform): 드래그 중인 요소의 위치를 계산 하여 실시간으로 적용
  // transition: transition: 드래그 중인 요소의 시각적 효과가 부드럽게 변하도록 설정


  // 내부적으로 아래와 같이 변환 됨
  // const style = {
  //   // 1. transform: 아이템이 내 마우스를 따라오게 만드는 '위치' 값 (좌표)
  //   transform: CSS.Transform.toString(transform),

  //   // 2. transition: 자리가 바뀔 때 '스르륵' 미끄러지듯 움직이는 '효과' (애니메이션)
  //   transition,
  // }
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab rounded-lg border bg-white px-4 py-3 transition-shadow ${isDragging ? 'z-10 border-blue-300 shadow-lg' : 'border-gray-200 shadow-sm hover:shadow-md'
        }`}
    >
      {children}
    </div>
  )
}

const initialItems = [
  { id: 'item-1', label: '🍎 사과' },
  { id: 'item-2', label: '🍌 바나나' },
  { id: 'item-3', label: '🍇 포도' },
  { id: 'item-4', label: '🍊 오렌지' },
  { id: 'item-5', label: '🍓 딸기' },
]

export function Level2Page() {
  const [items, setItems] = useState(initialItems)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setItems((prev) => {
        const oldIndex = prev.findIndex((i) => i.id === active.id)
        const newIndex = prev.findIndex((i) => i.id === over.id)
        return arrayMove(prev, oldIndex, newIndex)
      })
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Level 2 — 정렬 리스트</h1>
      <p className="mt-2 text-gray-500">아이템을 드래그해서 순서를 변경해보세요.</p>

      <div className="mt-2 rounded-md bg-gray-100 p-3 text-sm text-gray-600">
        <strong>학습 포인트:</strong> SortableContext, useSortable, arrayMove, verticalListSortingStrategy
      </div>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="mt-8 space-y-2">
            {items.map((item, index) => (
              <SortableItem key={item.id} id={item.id}>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400">{index + 1}</span>
                  <span>{item.label}</span>
                </div>
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="mt-6 rounded-md bg-gray-50 p-4">
        <h3 className="text-sm font-medium text-gray-700">현재 순서:</h3>
        <p className="mt-1 text-sm text-gray-500">{items.map((i) => i.label).join(' → ')}</p>
      </div>

      <button
        onClick={() => setItems(initialItems)}
        className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
      >
        리셋
      </button>
    </main>
  )
}
