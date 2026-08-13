const VARIANT = {
  primary: 'border-0 bg-[#12100e] text-[#f7f1e8] hover:bg-ink-hover',
  secondary:
    'border border-[rgba(23,18,14,.34)] bg-[rgba(255,255,255,.42)] text-ink hover:bg-white',
}

// type 기본값을 button 으로 둔다 — 폼 안에 들어가도 의도치 않게 제출되지 않게
export default function Button({ variant = 'primary', type = 'button', ...props }) {
  return (
    <button
      {...props}
      className={`flex h-[45px] w-full cursor-pointer items-center justify-center rounded-none px-[18px] text-[14px] font-medium tracking-[.01em] transition-[transform,background-color] duration-700 ease-film active:scale-[.985] ${VARIANT[variant]}`}
      type={type}
    />
  )
}
