# 계획: AnimatedGradientBackground 컴포넌트 분리

## 목적
`app/page.tsx`에 포함되어 있던 `AnimatedGradientBackground` 컴포넌트를 별도의 파일로 분리하여 코드 가독성과 유지보수성을 높입니다.

## 주요 변경 사항
- `components/scene/AnimatedGradientBackground.tsx` 파일 생성 및 컴포넌트 로직 이동
- `app/page.tsx`에서 로컬 컴포넌트 정의 및 관련 전역 스타일 제거
- `app/page.tsx`에서 분리된 컴포넌트를 import 하도록 수정

## 검증 방법
- `npm run build`를 실행하여 타입 오류 및 빌드 성공 여부 확인
