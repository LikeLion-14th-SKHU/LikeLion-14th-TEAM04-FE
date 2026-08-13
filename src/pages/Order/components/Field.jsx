// 라벨 + 입력 한 벌. select·textarea 처럼 모양이 다른 입력은 children 으로 넘긴다
// (넘기는 쪽이 INPUT_CLASS 를 붙여 생김새를 맞춘다)
export const INPUT_CLASS =
  'w-full rounded-none border border-[#dcd3c5] bg-[#fdfbf7] px-[13px] text-[12.5px] text-ink outline-0 transition-colors duration-700 ease-film placeholder:text-ink/40 focus:border-clay'

export default function Field({ id, label, className = '', children, ...inputProps }) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label className="mb-[10px] block text-[12.5px] font-medium" htmlFor={id}>
        {label}
      </label>
      {children ?? <input className={`h-[44px] ${INPUT_CLASS}`} id={id} {...inputProps} />}
    </div>
  )
}
