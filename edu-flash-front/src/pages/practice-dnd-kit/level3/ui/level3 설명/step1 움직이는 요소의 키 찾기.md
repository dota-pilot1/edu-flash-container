핵심 질문:
function Container({ id, title, items, color }: { id: string; title: string; items: Item[]; color: string }) {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div ref={setNodeRef} className="flex flex-col rounded-lg border border-gray-200 bg-gray-50">
      <div className={`rounded-t-lg px-3 py-2 text-sm font-medium ${color}`}>
        {title} ({items.length})
      </div>
      <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
        <div className="min-h-[100px] space-y-1.5 p-2">
          {items.map((item) => (
            <SortableCard key={item.id} id={item.id}>
              {item.label}
            </SortableCard>
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

에서 SortableCard 의 아이디를 설정하는데 

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    // 드래그 중인 아이템의 컨테이너
    const activeContainer = findContainer(containers, active.id as string)

    // 마우스가 올라가 있는 곳의 컨테이너
    const overContainer = findContainer(containers, over.id as string) ?? (over.id as ContainerId)

    // 컨테이너가 없으면 리턴
    if (!activeContainer || !overContainer) return

    // 다른 컨테이너로 이동하는 경우
    if (activeContainer !== overContainer) {
      setContainers((prev) => {
        const activeItems = [...prev[activeContainer]]
        const overItems = [...prev[overContainer]]
        const activeIndex = activeItems.findIndex((i) => i.id === active.id)
        const [movedItem] = activeItems.splice(activeIndex, 1)

        // 핵심: push가 아니라 over 위치에 삽입 → 부드러운 삽입 효과
        const overIndex = overItems.findIndex((i) => i.id === over.id)
        if (overIndex >= 0) {
          overItems.splice(overIndex, 0, movedItem)
        } else {
          overItems.push(movedItem)
        }

        return { ...prev, [activeContainer]: activeItems, [overContainer]: overItems }
      })
    }
    // 같은 컨테이너 내 순서 변경
    else {
      const overIndex = containers[activeContainer].findIndex((i) => i.id === over.id)
      const activeIndex = containers[activeContainer].findIndex((i) => i.id === active.id)

      if (activeIndex !== overIndex && overIndex !== -1) {
        setContainers((prev) => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
        }))
      }
    }
  }

  에서 

      const { active, over } = event

를 통해 얻을수 있는 정보가 active.id 와 over.id 가 전부인데 실제 매핑되어 있는 키값을 얻으려면 어떻게 해야하는가?

어떤 과정을 거쳐서 active.id 로 key 를 찾는지 단계별로 알아 보자

step1:
Object.entries(containers) 까지 실행

결과 (배열):
```tsx
[
  [
    "todo", 
    [
      { id: 't1', label: 'DnD 기본 학습' },
      { id: 't2', label: 'Sortable 구현' },
      { id: 't3', label: '트리 DnD 적용' }
    ]
  ],
  [
    "doing", 
    [{ id: 'd1', label: '다중 컨테이너 실습' }]
  ],
  [
    "done", 
    [{ id: 'x1', label: '프로젝트 세팅' }]
  ]
]
```

stpe2 
for (const [key, items] of Object.entries(containers)) 까지 실행

결과:

'''
1회차:
key = "todo"
items = [
      { id: 't1', label: 'DnD 기본 학습' },
      { id: 't2', label: 'Sortable 구현' },
      { id: 't3', label: '트리 DnD 적용' }
    ]

2회차:
key = "doing"
items = [{ id: 'd1', label: '다중 컨테이너 실습' }]

3회차:
key = "done"
items = [{ id: 'x1', label: '프로젝트 세팅' }]
'''

step3:
  for (const [key, items] of Object.entries(containers)) {
    if (items.some((i) => i.id === itemId)) return key as ContainerId
  }
까지 실행 하면 2번 질문의 1회차 2회차 3회차 각각의 key 중에서 itemId 와 같은 key 를 리턴
즉 컨테이너의 key 를 리턴

즉 active.id 와 같은 id 를 가진 요소를 찾아서 그 요소의 key 를 리턴 하게 된다.
