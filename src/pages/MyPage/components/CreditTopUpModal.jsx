import { useEffect, useRef, useState } from 'react'
import Button from '../../../components/Button'

const PRESETS = [10000, 30000, 50000, 100000]
const MIN_AMOUNT = 1000
const METHODS = ['신용 · 체크카드', '계좌이체', '간편결제']

export default function CreditTopUpModal({ open, credit, onTopUp, onClose }) {
  const dialogRef = useRef(null)
  const [preset, setPreset] = useState(PRESETS[0])
  // 직접 입력이 비어 있을 때만 프리셋이 금액이 된다 — 두 값을 합쳐 하나로 계산한다
  const [custom, setCustom] = useState('')
  // number 입력은 소수점을 막지 못한다. 1 C 아래는 없으니 내림해서 정수로 쓴다
  const amount = custom === '' ? preset : Math.floor(Number(custom))
  const payable = Number.isFinite(amount) && amount >= MIN_AMOUNT

  // 네이티브 <dialog> 라 포커스 트랩·Esc 닫기·배경 inert 를 브라우저가 해준다
  useEffect(() => {
    const dialog = dialogRef.current
    if (!open) {
      dialog.close()
      return
    }
    // 지난번에 입력한 금액이 남아 있으면 안 된다 — 열 때마다 기본값으로 되돌린다
    setPreset(PRESETS[0])
    setCustom('')
    dialog.showModal()
  }, [open])

  return (
    <dialog
      className="m-auto max-h-[calc(100dvh-40px)] w-[452px] max-w-[calc(100vw-40px)] overflow-y-auto border border-frame bg-white p-[26px] text-ink backdrop:bg-[rgba(23,18,14,.45)]"
      ref={dialogRef}
      aria-labelledby="credit-topup-title"
      // Esc 로 닫힐 때도 부모 상태가 맞아야 한다
      onClose={onClose}
    >
      <div className="flex items-start justify-between gap-[16px]">
        <div className="min-w-0">
          <h2 className="m-0 text-[17px] font-semibold" id="credit-topup-title">
            크레딧 충전
          </h2>
          <p className="mt-[7px] mb-0 text-[12px] break-keep text-ink/55">
            필요한 만큼 충전해 서비스에서 사용하세요.
          </p>
        </div>
        <button
          className="-mt-[2px] flex size-[22px] shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-ink/50 transition-colors duration-700 ease-film hover:text-ink"
          type="button"
          onClick={onClose}
          aria-label="닫기"
        >
          <svg
            className="size-[13px]"
            viewBox="0 0 13 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M1 1 12 12M12 1 1 12" />
          </svg>
        </button>
      </div>

      <div className="mt-[18px] flex h-[78px] flex-col justify-center border border-[#efe7dc] bg-[#fbf6ee] px-[18px]">
        <p className="m-0 text-[8.5px] tracking-[.18em] text-ink/50">보유 크레딧</p>
        <p className="mt-[7px] mb-0 text-[26px]">{credit.toLocaleString('ko-KR')} C</p>
      </div>

      {/* 카드 테두리는 바깥 div 가 그린다 — fieldset 이 직접 그리면 안쪽 그리드가 찌그러진다 */}
      <fieldset className="mt-[18px] min-w-0 border-0 p-0">
        <legend className="mb-[10px] p-0 text-[12.5px] font-medium">충전 금액</legend>
        <div className="grid grid-cols-2 gap-[9px]">
          {PRESETS.map((value) => (
            <label
              key={value}
              className="cursor-pointer has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-clay"
            >
              <input
                className="peer sr-only"
                type="radio"
                name="credit-preset"
                value={value}
                checked={custom === '' && value === preset}
                onChange={() => {
                  setPreset(value)
                  setCustom('')
                }}
              />
              <span className="flex h-[44px] items-center justify-between border border-[#dcd3c5] bg-[#fdfbf7] px-[13px] text-[12.5px] transition-colors duration-700 ease-film peer-checked:border-transparent peer-checked:bg-ink peer-checked:font-medium peer-checked:text-[#f7f1e8]">
                {value.toLocaleString('ko-KR')} C
                <span className="opacity-55">{value.toLocaleString('ko-KR')}원</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* 보이는 문구를 그대로 label 로 쓴다 — sr-only 라벨을 따로 두면 이름이 둘이 된다 */}
      <label className="mt-[18px] mb-[10px] block text-[12.5px] font-medium" htmlFor="credit-custom">
        직접 입력
      </label>
      <div className="flex h-[44px] items-center gap-[8px] border border-[#dcd3c5] bg-[#fdfbf7] px-[13px] focus-within:border-clay">
        <input
          className="h-full min-w-0 flex-1 rounded-none border-0 bg-transparent p-0 text-[12.5px] text-ink outline-0 placeholder:text-ink/40"
          id="credit-custom"
          type="number"
          inputMode="numeric"
          min={MIN_AMOUNT}
          step={1000}
          placeholder="충전할 크레딧을 입력하세요"
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
        />
        <span className="shrink-0 text-[11px] text-ink/50">C</span>
      </div>
      <p className="mt-[9px] mb-0 text-[11px] break-keep text-ink/45">
        1 C = 1원 · 최소 {MIN_AMOUNT.toLocaleString('ko-KR')} C부터 충전할 수 있습니다.
      </p>

      <label className="mt-[18px] mb-[10px] block text-[12.5px] font-medium" htmlFor="credit-method">
        결제 수단
      </label>
      {/* 화살표는 기본값 그대로 둔다 — appearance-none 으로 지우고 다시 그리면 코드만 는다.
          결제 수단은 아직 서버로 안 나간다. TODO: 결제 API 연동 —
          이 파일의 금액 검증(최소 1,000 C·정수·상한 없음)은 화면용이라 서버가 다시 검증해야 한다 */}
      <select
        className="h-[44px] w-full rounded-none border border-[#dcd3c5] bg-[#fdfbf7] px-[13px] text-[12.5px] text-ink"
        id="credit-method"
        name="method"
        defaultValue={METHODS[0]}
      >
        {METHODS.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>

      <div className="mt-[18px] flex items-center justify-between gap-[16px] border-t border-[#f0e8dc] pt-[16px]">
        <p className="m-0 text-[12.5px] text-ink/60">총 결제 금액</p>
        {/* 1 C = 1원이라 충전 크레딧이 그대로 결제 금액이다 */}
        <p className="m-0 text-[18px] font-semibold">
          {payable ? amount.toLocaleString('ko-KR') : 0}원
        </p>
      </div>

      <Button
        className="mt-[16px] w-full"
        disabled={!payable}
        onClick={() => {
          onTopUp(amount)
          onClose()
        }}
      >
        {(payable ? amount : 0).toLocaleString('ko-KR')}원 충전하기
      </Button>

      <p className="mt-[13px] mb-0 text-[10.5px] leading-[18px] break-keep text-ink/45">
        결제 즉시 크레딧이 충전됩니다. 미사용 크레딧은 결제 후 30일 이내 환불 가능합니다.
      </p>
    </dialog>
  )
}
