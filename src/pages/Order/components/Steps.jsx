// 주문 진행 단계 칩. 현재 단계만 진하게 칠하고 나머지는 종이 톤으로 둔다
export default function Steps({ steps, current, className = '' }) {
  return (
    <ol className={`m-0 flex list-none flex-wrap gap-[8px] p-0 ${className}`} aria-label="주문 진행 단계">
      {steps.map((label, index) => (
        <li
          key={label}
          className={`flex h-[38px] items-center px-[16px] text-[12px] tracking-[.01em] ${
            index === current
              ? 'bg-ink font-medium text-[#f7f1e8]'
              : 'border border-[#e6ddd0] bg-[#fbf6ee] text-ink/55'
          }`}
          // 목록 안 위치가 아니라 "지금 이 단계" 라는 뜻이라 step 을 쓴다
          aria-current={index === current ? 'step' : undefined}
        >
          {label}
        </li>
      ))}
    </ol>
  )
}
