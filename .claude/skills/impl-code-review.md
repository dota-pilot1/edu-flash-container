---
name: impl-code-review
description: 구현 완료된 기능의 코드 리뷰 문서를 생성합니다. 백엔드/프론트 파일 구조와 구현 기능 목록을 정리합니다.
command: impl-code-review
---

# 구현 코드 리뷰 스킬

구현 완료된 기능에 대해 코드 리뷰 문서를 생성합니다.

## 출력 경로 규칙

```
/Users/terecal/edu-flash-container/구현 계획/{기능명}/코드 리뷰/{구현된 기능 이름}.md
```

- `{기능명}` → 기존 구현 계획 폴더명
- `{구현된 기능 이름}` → 실제 구현된 기능 단위 (예: Menu CRUD API, 메뉴 관리 페이지)

## 프로젝트 정보

- **백엔드**: `/Users/terecal/edu-flash-container/edu-flash-server` (Spring Boot 4, DDD 절충안)
- **프론트엔드**: `/Users/terecal/edu-flash-container/edu-flash-front` (React, FSD 구조)

## 문서 포맷

```markdown
# {구현된 기능 이름}

## 백엔드

### 파일 구조
> 추가/수정된 파일만 표시. 신규 파일은 (신규), 수정된 파일은 (수정) 표기

```
com.eduflash
├── {도메인}/
│   ├── presentation/
│   │   └── SomeController.java        (신규) REST API
│   └── ...
```

### 구현 기능
- [ ] 또는 [x] 체크리스트 형태
- API 엔드포인트, 핵심 로직 등

## 프론트엔드

### 파일 구조
> 추가/수정된 파일만 표시

```
src/
├── entities/{도메인}/
│   └── ...
```

### 구현 기능
- [ ] 또는 [x] 체크리스트 형태
- 컴포넌트, 페이지, 연동 등

## 연동 설정
> CORS, 프록시, 환경변수 등 변경사항 (해당 시)
```

## 실행 절차

1. 사용자 요청에서 **기능명** 또는 **구현 계획 폴더** 식별
2. 해당 기능의 구현 계획(step*.md) 참조
3. 실제 프로젝트 코드 탐색 — 추가/수정된 파일 확인
4. 파일 구조 + 구현 기능 목록 정리
5. 코드 리뷰 md 파일 생성
6. 요약 출력
