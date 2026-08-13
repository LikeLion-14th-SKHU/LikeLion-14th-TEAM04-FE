// 실제 radio 를 숨겨서 쓴다 — 화살표 키 이동·그룹 롤은 브라우저가 공짜로 해준다.
// 대신 포커스 링이 사라지므로 has-[:focus-visible] 로 라벨에 다시 그린다
export default function ColorSwatchOption({ name, value, label, hex, checked, onChange }) {
  return (
    <label
      className={`flex h-[44px] cursor-pointer items-center justify-center gap-[8px] border text-[12.5px] transition-colors duration-700 ease-film has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-clay ${
        checked
          ? 'border-transparent bg-[#17120e] font-medium text-[#f7f1e8]'
          : 'border-[#dcd3c5] bg-[#fdfbf7] text-ink'
      }`}
    >
      <input
        className="sr-only"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />
      <span
        className="size-[12px] shrink-0"
        style={{ backgroundColor: checked ? '#f7f1e8' : hex }}
        aria-hidden="true"
      />
      {label}
    </label>
  )
}
