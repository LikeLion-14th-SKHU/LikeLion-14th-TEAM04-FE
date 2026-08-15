// 우드 배경 위에 본문을 올리는 크림 패널 — 흐린 톤 텍스트가 우드에 직접 닿으면 대비가 4.5:1 에 못 미친다
export default function Panel({ className = '', children }) {
  return (
    <div
      className={`border border-[rgba(24,19,15,.12)] bg-[#f6f0e6] p-[20px] shadow-[0_14px_30px_rgba(44,26,15,.12)] ${className}`}
    >
      {children}
    </div>
  )
}
