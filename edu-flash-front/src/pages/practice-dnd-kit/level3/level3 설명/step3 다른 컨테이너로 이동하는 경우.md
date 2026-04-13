# Step 3: 다른 컨테이너로 이동 (Moving Between Containers)

이 섹션에서는 아이템이 **원래 있던 상자를 떠나 완전히 다른 상자로 이사갈 때**의 로직을 분석합니다. 레벨 3 드래그 앤 드롭에서 가장 정교한 계산이 일어나는 부분입니다.

---

## 1. 코드 구조 분석

```tsx
// 다른 컨테이너로 이동하는 경우 (activeContainer와 overContainer가 다를 때)
if (activeContainer !== overContainer) {
  setContainers((prev) => {
    // ① 복사: 두 개의 상자 리스트를 각각 복사합니다 (불변성 유지)
    const activeItems = [...prev[activeContainer]]
    const overItems = [...prev[overContainer]]

    // ② 제거: 원래 상자에서 드래그 중인 아이템을 찾아 제거합니다.
    const activeIndex = activeItems.findIndex((i) => i.id === active.id)
    const [movingItem] = activeItems.splice(activeIndex, 1)

    // ③ 삽입 위치 파악: 새 상자에서 마우스가 가리키는 곳(over)의 번호를 찾습니다.
    const overIndex = overItems.findIndex((i) => i.id === over.id)

    // ④ 삽입 실행:
    if (overIndex >= 0) {
      // 마우스가 특정 카드 위에 있으면 그 자리에 끼워넣기 (새치기)
      overItems.splice(overIndex, 0, movingItem)
    } else {
      // 마우스가 빈 공간에 있으면 리스트 맨 뒤에 추가
      overItems.push(movingItem)
    }

    // ⑤ 최종 업데이트: 변경된 두 상자를 전체 데이터에 반영합니다.
    return { ...prev, [activeContainer]: activeItems, [overContainer]: overItems }
  })
}
```

---

## 2. 주요 단계별 심층 설명

### [Step 1] "출석부 지우기" (`splice`로 제거)
`activeItems.splice(activeIndex, 1)`는 단순히 배열을 자르는 것이 아니라, 해당 위치의 요소를 **"추출"**해냅니다. 추출된 요소는 `[movingItem]`에 소중하게 담겨 다음 상자로 이동할 준비를 마칩니다.

### [Step 2] "새치기 삽입" (`splice`로 추가)
`overItems.splice(overIndex, 0, movingItem)`는 `splice`의 마법 같은 활용법입니다.
- **`0`을 지우고 `movingItem`을 넣는다**: 기존 데이터는 하나도 삭제하지 않고 그 번호표 자리에 새로운 데이터를 **끼워넣는(Inject)** 동작입니다. 이 덕분에 기존 아이템들이 아래로 슥 밀려나며 자리가 생기는 애니메이션 효과가 나타납니다.

### [Step 3] "빈 상자 처리" (`push`)
만약 새 상자에 아이템이 하나도 없거나 마우스가 카드 위가 아닌 배경 위에 있다면 `overIndex`가 `-1`이 됩니다. 이때는 고민 없이 맨 뒤에 가져다 붙입니다.

---

## 3. 요약 (이사 가기 비유)

이 로직은 **A 아파트에서 B 아파트로 이사 가는 과정**과 같습니다.

1.  **짐 싸기**: A 아파트(`activeContainer`)에서 내 짐(`movingItem`)을 완전히 빼냅니다. 이제 A 아파트 명단에는 내가 없습니다.
2.  **이사 가기**: B 아파트(`overContainer`)로 이동합니다.
3.  **입주**: B 아파트의 특정 층수(`overIndex`)에 새치기해서 들어갑니다. 만약 그 아파트가 비어있다면 그냥 1층에 들어갑니다.
4.  **전입 신고**: 관리소(`setContainers`)에 "저 A 동에서 B 동으로 이사 왔어요!"라고 장부를 업데이트합니다.

---

## 💡 왜 `onDragOver`에서 이 일을 하나요?

이사 로직이 `onDragEnd`(내려놓을 때)가 아니라 **`onDragOver`(마우스가 지나갈 때)**에 있기 때문에, 사용자는 아이템을 놓기도 전에 아이템들이 실시간으로 다른 상자로 건너가며 자리를 잡는 **"예술적인 부드러움"**을 경험하게 되는 것입니다.

---

## 🔎 보충 설명: `overIndex` 조건과 `push`의 동작

```tsx
const overIndex = overItems.findIndex((i) => i.id === over.id)
if (overIndex >= 0) {
  overItems.splice(overIndex, 0, movingItem)
} else {
  overItems.push(movingItem)
}
```

### 1. `overIndex >= 0` 조건이란?
마우스(`over`)가 새로운 상자의 **특정 카드 위**에 올라가 있는 상태를 말합니다.
- 이때 `splice(overIndex, 0, movingItem)`를 하면, 내가 가리키고 있는 그 카드의 **바로 앞(위) 자리**를 비집고 들어갑니다.

### 2. `else`는 언제 실행되나요?
마우스가 카드가 아닌 **상자의 빈 배경** 위에 있거나, 상자가 아예 **비어있을 때** 실행됩니다. (`findIndex`가 `-1`을 반환하기 때문입니다.)

### 3. `push`는 맨 위인가요, 맨 아래인가요?
**맨 아래(리스트의 끝)**입니다.
- **`push`**: 배열의 마지막에 요소를 추가합니다. 즉, 상자의 가장 밑바닥에 카드를 붙이게 됩니다.

**요약하자면:** 
카드를 다른 상자의 **중간**에 넣고 싶으면 `splice`가 작동하고, 상자의 **어느 곳이든 빈 곳**에 대충 던져 넣으면 `push`가 작동하여 리스트의 가장 마지막에 자리를 잡게 됩니다. 😊