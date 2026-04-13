# Level 5: 무한 뎁스 대응 트리 DnD 시스템 (Master Edition)

본 프로젝트는 `@dnd-kit`을 활용하여 계층 구조(Tree)를 가진 데이터를 효율적으로 정렬하고 관리하는 고급 시스템을 구현한 예제입니다.

## 🚀 핵심 기능 (Key Features)

### 1. 범용 블록 기반 이동 (Generic Block-based Move)
- **원자적 브랜치 이동**: 부모 노드 이동 시, 해당 노드에 속한 모든 자손(Descendants)이 하나의 '블록'으로 묶여 함께 이동합니다.
- **n차 뎁스 대응**: 하드코딩된 조건 없이 `activeItem.depth`를 기준으로 동적 파티셔닝(`splitIntoBlocks`)을 수행하여 무한한 계층 구조를 지원합니다.

### 2. 하이브리드 데이터 아키텍처 (Hybrid Architecture)
- **Flat Source of Truth**: 데이터의 저장과 편집(정렬/삭제/수정)은 1차원 배열(Flat Array)에서 수행하여 복잡도를 낮추고 성능을 확보했습니다.
- **Tree View Projection**: 렌더링 직전에만 Flat 데이터를 Tree 구조로 변환(`buildTree`)하여 사용자에게 직관적인 계층 UI를 제공합니다.

### 3. 재귀적 UI 및 접기/펼치기 (Recursive UI & Folding)
- **접기/펼치기(Fold/Unfold)**: `expandedIds` 상태(Set)를 통해 특정 브랜치의 가시성을 제어합니다. 부모를 접으면 재귀적 렌더링이 중단되어 하위 메뉴가 화면에서 사라집니다.
- **TreeBranch 컴포넌트**: 자기 자신을 다시 호출하는 재귀적 구조를 통해 뎁스의 제한 없이 계층 구조를 시각화합니다.
- **가변 Indentation**: `(depth - 1) * 40px` 공식을 통해 시각적인 계층 깊이를 명확하게 표현합니다.

## 🛠️ 핵심 유틸리티 (Core Utilities)

- **`splitIntoBlocks`**: 드래그 대상의 뎁스에 맞춰 전체 데이터를 유연하게 그룹화합니다.
- **`treeAwareMove`**: 블록 단위의 `arrayMove` 연산 후 다시 평탄화(`flat`)하여 최종 순서를 결정합니다.
- **`buildTree`**: Map 기반의 $O(n)$ 연산을 통해 Flat 데이터를 중첩된 트리 객체로 변형합니다.

## 🎨 UX 설계 철학
- **Compact Drag Overlay**: 기술적으로는 전체 브랜치가 이동하지만, 시각적으로는 부모 카드 하나만 노출하여 사용자의 시야를 확보하고 드래그 피로도를 최소화했습니다.
- **Interactive Handles**: 모든 차수의 메뉴에 드래그 핸들을 상시 노출하여 어떤 위치에서든 즉각적인 순서 조정을 지원합니다.

---
**"Computers love Flat, Humans love Trees."**  
본 프로젝트는 이 간극을 가장 우아한 아키텍처로 해결해낸 결과물입니다.
