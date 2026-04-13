# Step 2: 같은 컨테이너 내 순서 변경 (Sorting)

이 섹션에서는 아이템이 다른 상자로 가지 않고, **자기가 속한 현재 상자 안에서 순서만 바꿀 때** 어떤 일이 일어나는지 분석합니다.

---

## 1. 코드 구조 분석

```tsx
// 같은 컨테이너 내 순서 변경 (activeContainer와 overContainer가 같을 때)
else {
  // ① 인덱스 찾기: 현재 내가 잡고 있는 아이템(active)과 마우스가 가리키는 곳(over)의 번호표를 찾습니다.
  const activeIndex = containers[activeContainer].findIndex((i) => i.id === active.id)
  const overIndex = containers[activeContainer].findIndex((i) => i.id === over.id)

  // ② 조건 확인: 위치가 실제로 바뀌었는지, 그리고 유효한 위치인지 확인합니다.
  if (activeIndex !== overIndex && overIndex !== -1) {
    setContainers((prev) => ({
      ...prev,
      // ③ 배열 순서 교체: dnd-kit에서 제공하는 arrayMove 유틸리티를 사용하여 슥~ 자리를 바꿉니다.
      [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
    }))
  }
}
```

---

## 2. 주요 단계별 설명

### [Step 1] 현재 위치와 목표 위치 파악
`findIndex`를 사용하여 현재 드래그 중인 카드가 몇 번째(`activeIndex`)인지, 그리고 마우스가 가리키는 카드가 몇 번째(`overIndex`)인지 번호를 알아냅니다.

### [Step 2] 의미 없는 업데이트 방지
`activeIndex !== overIndex` 조건은 아이템이 실제로 옆 칸으로 이동했을 때만 상태를 업데이트하도록 합니다. 제자리에서 흔들릴 때는 불필요한 연산을 하지 않기 위함입니다.

### [Step 3] `arrayMove` 마법사 활용
레벨 2에서도 보셨던 `arrayMove` 함수를 사용합니다. 이 함수는 복잡하게 배열을 지우고 다시 넣는 로직을 대신 처리해 주어, 배열 내의 순서를 아주 부드럽게 스왑(Swap)해 줍니다.

---

## 3. 요약 (가구 배치 비유)

이 로직은 **"내 집(컨테이너) 안에서 가구(카드) 배치만 다시 하는 것"**과 같습니다.

1.  **상황**: 거실에 있는 TV와 소파의 자리를 바꾸려고 합니다.
2.  **행동**: 소파(`active`)를 들어서 TV(`over`)가 있던 자리에 놓습니다.
3.  **결과**: 다른 방(다른 컨테이너)은 전혀 건드리지 않고, 거실의 가구 순서만 깔끔하게 변경됩니다.

**레벨 3에서는 이 로직이 `onDragOver`에 들어있기 때문에, 사용자가 마우스를 위아래로 움직이기만 해도 가구가 실시간으로 슥슥 비켜주며 자리를 잡는 시각적 효과가 나타납니다!**

---

---

## 🔎 보충 설명: 이 한 줄은 어떤 의미인가요?
**`[activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex)`**
에서
**`arrayMove(prev[activeContainer], activeIndex, overIndex)`**의 각 파라미터는 무엇을 의미하나요?

1. **`prev[activeContainer]` (대상 배열)**: 
   - 순서를 바꾸고 싶은 **진짜 데이터(배열)**입니다. 
   - `prev`라는 전체 장부에서 현재 드래그가 일어난 상자(`activeContainer`)의 리스트만 쏙 뽑아온 것입니다.

2. **`activeIndex` (시작 위치)**: 
   - 드래그를 **시작한 아이템**의 원래 번호표(Index)입니다.

3. **`overIndex` (도착 위치)**: 
   - 아이템을 **내려놓을(혹은 올라가 있는) 곳**의 번호표(Index)입니다.

---

## 💡 이 로직이 포함된 전체 문장 해석하기

```tsx
[activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex)
```

1.  **`arrayMove(...)`**: "이 리스트(`prev[activeContainer]`)에서, 이 번호(`activeIndex`)에 있던 애를 저 번호(`overIndex`)로 옮긴 **새 리스트**를 만들어줘!"
2.  **`[activeContainer]: ...`**: "그리고 그 **새 리스트**를 이 상자 이름(`activeContainer`)의 결과물로 써줘!"

### 최종 결과:
이 코드가 실행되면 **기존 상자 리스트는 그대로 유지**되면서, 우리가 드래그한 상자의 **아이템 순서만 완벽하게 바뀐 새 상태**가 탄생하게 됩니다.
