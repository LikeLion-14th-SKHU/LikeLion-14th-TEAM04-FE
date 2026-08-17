export default function ColorSwatchOption({
  name,
  value,
  label,
  hex,
  checked,
  onChange,
}) {
  return (
    <label
      className={`flex h-[44px] cursor-pointer items-center justify-center gap-[8px] border text-[12.5px] transition-colors duration-700 ease-film has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-clay ${checked
          ? 'border-[#17120e] bg-[#17120e] font-medium text-[#f7f1e8]'
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
        className="size-[12px] shrink-0 border border-black/10"
        style={{
          backgroundColor: hex,
        }}
        aria-hidden="true"
      />

      {label}
    </label>
  )
}