// 라벨(POPULAR) · 제목 · 남는 폭을 채우는 룰이 한 줄에 놓인다.
// id 는 바깥 section 의 aria-labelledby 가 가리킨다
export default function SectionHeading({ id, eyebrow, title }) {
  return (
    <div className="flex items-center gap-[11px]">
      <p className="m-0 text-[9px] tracking-[.2em] text-clay">{eyebrow}</p>
      <h2 id={id} className="m-0 text-[18px] font-semibold tracking-[-.02em]">
        {title}
      </h2>
      <span className="h-px flex-1 bg-[#e7decf]" aria-hidden="true" />
    </div>
  )
}
