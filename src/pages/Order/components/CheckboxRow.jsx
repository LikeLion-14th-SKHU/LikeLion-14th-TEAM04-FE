// 동의·저장 체크박스. 진짜 <input type="checkbox"> 를 숨겨 쓴다 —
// 클릭·스페이스·스크린리더 상태를 브라우저가 해준다
export default function CheckboxRow({ label, checked, onChange, className = '' }) {
  return (
    <label className={`flex cursor-pointer items-start gap-[10px] ${className}`}>
      <input
        className="peer sr-only"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {/* 체크 표시는 ::after 를 45도 돌린 ㄴ 자로 그린다 — 아이콘 파일을 늘리지 않는다 */}
      <span className="relative mt-[1px] size-[16px] shrink-0 border border-[#dcd3c5] bg-white transition-colors duration-700 ease-film after:absolute after:top-[2px] after:left-[5px] after:h-[7px] after:w-[3px] after:rotate-45 after:border-r-[1.5px] after:border-b-[1.5px] after:border-[#f7f1e8] after:opacity-0 peer-checked:border-ink peer-checked:bg-ink peer-checked:after:opacity-100 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-clay" />
      <span className="text-[12.5px] leading-[18px] break-keep text-ink/70">{label}</span>
    </label>
  )
}
