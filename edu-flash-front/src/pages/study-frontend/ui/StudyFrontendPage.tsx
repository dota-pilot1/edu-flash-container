export function StudyFrontendPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900">프론트 엔드</h1>
      <p className="mt-2 text-gray-500">프론트엔드 학습 튜토리얼 페이지입니다.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {[
          { title: 'React 기초', desc: '컴포넌트, 상태 관리, 훅 학습' },
          { title: 'TypeScript', desc: '타입 시스템과 실전 활용' },
          { title: 'Tailwind CSS', desc: '유틸리티 퍼스트 스타일링' },
          { title: 'React Router', desc: 'SPA 라우팅 패턴' },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-gray-200 p-5 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <h3 className="font-medium text-gray-900">{item.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
