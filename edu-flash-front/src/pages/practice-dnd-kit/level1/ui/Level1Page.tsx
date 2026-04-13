import { useState } from 'react'
import { DndContext, type DragEndEvent } from '@dnd-kit/core'
import { useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

// 구조적 이해:
// DndContext: 드래그 앤 드롭 기능을 제공하는 컨텍스트
// useDraggable: 드래그 가능한 요소를 만드는 훅
// useDroppable: 드롭 가능한 영역을 만드는 훅
// handleDragEnd: 드래그가 끝났을 때 호출되는 함수
// dropped: 드롭된 장소에 대한 정보를 담는 상태

// DraggableItem 컴포넌트
// id: 드래그 아이템의 고유 ID
// children: 드래그 아이템의 내용
function DraggableItem({ id, children }: { id: string; children: React.ReactNode }) {

  // useDraggable 훅을 사용하여 드래그 가능한 요소를 만든다.
  // 구조 할당 분해를 통해 가져온 속성들을 사용해서 드래그 가능한 요소를 만든다.
  // 내가 설정하는 정보는 id 와 children 이다.

  // 세부 사항
  // attributes: 드래그 가능한 요소의 속성
  // listeners: 드래그 가능한 요소의 리스너
  // setNodeRef: 드래그 가능한 요소의 노드 참조
  // transform: 드래그 가능한 요소의 변환
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id })
  const style = { transform: CSS.Translate.toString(transform) }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm transition-shadow hover:shadow-md active:cursor-grabbing"
    >
      {children}
    </div>
  )
}

// DroppableZone 컴포넌트
// id: 드롭 영역의 고유 ID
// children: 드롭 영역의 내용
// isOver: 드롭 영역이 드래그 아이템 위에 있는지 여부
function DroppableZone({ id, children, isOver }: { id: string; children: React.ReactNode; isOver?: boolean }) {

  // useDroppable 훅을 사용하여 드롭 가능한 영역을 만든다.
  // 구조 할당 분해를 통해 가져온 속성들을 사용해서 드롭 가능한 영역을 만든다.
  // 내가 설정하는 정보는 id 와 children 이다.

  // 세부 사항
  // setNodeRef: 드롭 가능한 영역의 노드 참조
  // isOver: 드롭 가능한 영역이 드래그 아이템 위에 있는지 여부
  const { setNodeRef, isOver: over } = useDroppable({ id })
  const active = isOver ?? over

  return (
    <div
      ref={setNodeRef}
      className={`min-h-[120px] rounded-lg border-2 border-dashed p-4 transition-colors ${active ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-50'
        }`}
    >
      {children}
    </div>
  )
}

export function Level1Page() {
  // step1:
  // dropped 상태를 선언한다.
  // 드롭된 장소에 대한 정보를 담는다.
  const [dropped, setDropped] = useState<string | null>(null)

  const handleDragEnd = (event: DragEndEvent) => {
    // step2:
    // 이벤트가 일어난 장소를 over 로 받는다.
    const { over } = event

    // step3:
    // over 가 있으면 dropped 상태를 장소의 id 로 업데이트 한다.
    // 장소의 id 는 DroppableZone 컴퍼넌트의 props 로 설정 된다.
    if (over) {
      setDropped(over.id as string)
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">Level 1 — 기본 드래그 앤 드롭</h1>
      <p className="mt-2 text-gray-500">아이템을 드래그해서 드롭 영역에 놓아보세요.</p>

      <div className="mt-2 rounded-md bg-gray-100 p-3 text-sm text-gray-600">
        <strong>학습 포인트:</strong> DndContext, useDraggable, useDroppable 기본 사용법
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="mb-3 text-sm font-medium text-gray-500">드래그 아이템</h3>
            {dropped !== 'zone-a' && (
              <DraggableItem id="item-1">
                🎯 나를 드래그하세요!
              </DraggableItem>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-500">드롭 영역 A</h3>
              <DroppableZone id="zone-a">
                {dropped === 'zone-a' ? (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-blue-700">
                    ✅ 드롭 성공!
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">여기에 놓으세요</p>
                )}
              </DroppableZone>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-medium text-gray-500">드롭 영역 B</h3>
              <DroppableZone id="zone-b">
                {dropped === 'zone-b' ? (
                  <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-green-700">
                    ✅ 드롭 성공!
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">여기에도 놓을 수 있어요</p>
                )}
              </DroppableZone>
            </div>
          </div>
        </div>
      </DndContext>

      <button
        onClick={() => setDropped(null)}
        className="mt-6 rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-800"
      >
        리셋
      </button>
    </main>
  )
}
