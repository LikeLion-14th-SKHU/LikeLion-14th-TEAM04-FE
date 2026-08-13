// 금액·견적 요약처럼 라벨/값 한 줄이 반복되는 자리. strong 이면 합계 줄로 위에 선을 긋는다
export default function SummaryRows({ rows, className = '' }) {
  return (
    <dl className={`m-0 ${className}`}>
      {rows.map(({ label, value, strong }) => (
        <div
          key={label}
          className={`flex h-[44px] items-center justify-between gap-[12px] ${
            strong ? 'border-t border-[#f0e8dc]' : 'border-b border-[#f2ebe0]'
          }`}
        >
          <dt className="shrink-0 text-[12.5px] text-ink/55">{label}</dt>
          <dd className={`m-0 truncate text-right text-[12.5px] ${strong ? 'font-semibold' : ''}`}>
            {value}
          </dd>
        </div>
      ))}
    </dl>
  )
}
