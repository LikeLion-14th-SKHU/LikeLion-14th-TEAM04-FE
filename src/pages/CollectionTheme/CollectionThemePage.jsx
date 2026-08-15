import { useState } from 'react'
import Header from '../../components/Header'
import Panel from '../../components/Panel'
import Button from '../../components/Button'
import ColorSwatchOption from './components/ColorSwatchOption'

const COLORS = [
  { value: 'red', label: '레드', hex: '#8c3b33' },
  { value: 'black', label: '블랙', hex: '#17120e' },
  { value: 'yellow', label: '옐로우', hex: '#c29a34' },
  { value: 'blue', label: '블루', hex: '#3c4f6b' },
  { value: 'green', label: '그린', hex: '#4a5a3c' },
  { value: 'purple', label: '퍼플', hex: '#5b4470' },
]

export default function CollectionThemePage() {
  // selected 는 화면에 비치는 값, saved 는 마지막으로 확정된 값.
  // 취소는 saved 로 되돌리기, 저장은 selected 를 확정하기 (아직 API 없음)
  const [saved, setSaved] = useState('black')
  const [selected, setSelected] = useState(saved)
  // 선택값에서 바로 구할 수 있으니 별도 상태로 두지 않는다
  const color = COLORS.find((item) => item.value === selected)

  return (
    // Header 를 main 밖에 둔다 — main 안의 <header> 는 banner 랜드마크로 안 잡힌다
    <>
      <Header />
      <main className="min-h-[100dvh] w-full">
        {/* 캔버스 1280 안에서 좌우 48 을 뺀 1184 가 콘텐츠 폭이다 */}
        <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[40px] pb-[48px] max-[860px]:px-[22px] max-[860px]:pt-[28px]">
          <Panel>
            <h1 className="m-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em] break-keep">
              컬렉션 색상 변경
            </h1>
            <p className="mt-[10px] mb-[24px] text-[13.5px] break-keep text-ink/62">
              컬렉션 카드에 사용할 대표 색상을 선택하고 미리보기를 확인하세요.
            </p>

            {/* 카드 테두리는 바깥 div 가 그린다 — fieldset 이 직접 그리면 legend 가 테두리를 파고든다.
                fieldset 기본값 min-inline-size:min-content 도 안쪽 그리드를 찌그러뜨려 min-w-0 로 푼다 */}
            <div className="border border-frame bg-white p-[22px]">
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="mb-[14px] p-0 text-[13.5px] font-medium">대표 색상</legend>
                <div className="grid grid-cols-6 gap-[10px] max-[860px]:grid-cols-3 max-[430px]:grid-cols-2">
                  {COLORS.map((item) => (
                    <ColorSwatchOption
                      key={item.value}
                      name="collection-color"
                      checked={item.value === selected}
                      onChange={setSelected}
                      {...item}
                    />
                  ))}
                </div>
              </fieldset>
            </div>

            <h2 className="mt-[20px] mb-[20px] text-[13.5px] font-medium">미리보기</h2>

            <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-[20px] max-[960px]:grid-cols-1">
              <section className="border border-frame bg-white p-[22px]" aria-label="컬렉션 카드 미리보기">
                <div
                  className="flex h-[236px] flex-col items-center justify-center gap-[10px]"
                  style={{ backgroundColor: color.hex }}
                >
                  {/* 원본 배지는 40×40 원에 로고 이미지를 채우는데 그 이미지가 깨져 있다.
                      채울 게 없는 원은 안 그리고 글자만 남긴다 — 로고 이미지가 정해지면 되살린다.
                      로고 마크지 서비스명이 아니므로 Cormorant 는 쓰지 않는다 */}
                  <span className="text-[14px] text-[#e1be91]" aria-hidden="true">
                    MA
                  </span>
                  <span className="text-[8.5px] tracking-[.22em] text-[rgba(247,241,232,.6)]">
                    COLLECTION PREVIEW
                  </span>
                </div>

                <div className="mt-[18px] flex items-end justify-between gap-[16px] border-t border-[#f0e8dc] pt-[16px]">
                  <div className="min-w-0">
                    <p className="m-0 text-[16px] font-medium">첫 여행의 기억</p>
                    <p className="mt-[7px] mb-0 text-[9.5px] tracking-[.04em] text-ink/45">
                      에디션 4개 · 2026.08.04 수정
                    </p>
                  </div>
                  <p className="m-0 shrink-0 text-[9px] tracking-[.14em] text-clay uppercase">
                    {color.value}
                  </p>
                </div>
              </section>

              <section className="border border-frame bg-white p-[22px]" aria-label="색상 설정">
                <h3 className="m-0 text-[13.5px] font-medium">색상 설정</h3>
                <p className="mt-[14px] mb-[10px] text-[11.5px] text-ink/50">선택된 색상</p>
                <div className="flex items-center gap-[10px]">
                  <span
                    className="size-[26px] shrink-0 border border-frame"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden="true"
                  />
                  <span className="text-[13px]">{color.label}</span>
                  <span className="text-[10px] text-ink/45 uppercase">{color.hex}</span>
                </div>

                <p className="mt-[18px] mb-[20px] text-[11.5px] leading-[20px] break-keep text-ink/50">
                  미리보기에서 대비와 가독성을 확인하세요. 선택한 색상은 컬렉션 카드와 진열장 조명 톤에
                  함께 적용됩니다.
                </p>

                <div className="flex flex-col gap-[10px]">
                  <Button onClick={() => setSaved(selected)}>변경 사항 저장</Button>
                  <Button variant="secondary" onClick={() => setSelected(saved)}>
                    취소
                  </Button>
                </div>
              </section>
            </div>
          </Panel>
        </div>
      </main>
    </>
  )
}
