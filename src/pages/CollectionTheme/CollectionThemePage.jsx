import { useState } from 'react'
import { useNavigate } from 'react-router'

import Header from '../../components/Header'
import Panel from '../../components/Panel'
import Button from '../../components/Button'

import ColorSwatchOption from './components/ColorSwatchOption'

import {
  COLORS,
  colorOf,
  loadTheme,
  saveTheme,
} from '../../data/collectionTheme'

export default function CollectionThemePage() {
  const navigate = useNavigate()

  // draft는 화면에 비치는 값,
  // saved는 마지막으로 확정된 값
  const [saved, setSaved] = useState(loadTheme)
  const [draft, setDraft] = useState(saved)

  // 현재 선택된 색상 정보
  const color = colorOf(draft.color)

  // 저장
  // localStorage에 저장한 뒤 컬렉션 화면으로 이동
  const handleSave = () => {
    saveTheme(draft)
    setSaved(draft)

    navigate('/collection')
  }

  // 취소
  // 저장하지 않고 컬렉션 화면으로 이동
  const handleCancel = () => {
    setDraft(saved)

    navigate('/collection')
  }

  return (
    <>
      <Header />

      <main className="min-h-[100dvh] w-full">
        <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[40px] pb-[48px] max-[860px]:px-[22px] max-[860px]:pt-[28px]">
          <Panel>
            <h1 className="m-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em] break-keep">
              컬렉션 테마 변경
            </h1>

            <p className="mt-[10px] mb-[24px] text-[13.5px] break-keep text-ink/62">
              컬렉션에 사용할 대표 색상과 이름을 정하고 미리보기를 확인하세요.
            </p>

            <div className="border border-frame bg-white p-[22px]">
              <fieldset className="m-0 min-w-0 border-0 p-0">
                <legend className="mb-[14px] p-0 text-[13.5px] font-medium">
                  대표 색상
                </legend>

                <div className="grid grid-cols-7 gap-[10px] max-[1000px]:grid-cols-4 max-[650px]:grid-cols-2">
                  {COLORS.map((item) => (
                    <ColorSwatchOption
                      key={item.value}
                      name="collection-color"
                      checked={
                        item.value === draft.color
                      }
                      onChange={(value) =>
                        setDraft({
                          ...draft,
                          color: value,
                        })
                      }
                      {...item}
                    />
                  ))}
                </div>
              </fieldset>

              <label
                className="mt-[22px] block text-[13.5px] font-medium"
                htmlFor="collection-title"
              >
                컬렉션 이름
              </label>

              <input
                className="mt-[10px] h-[42px] w-full max-w-[420px] border border-[#dcd3c5] bg-white px-[13px] text-[13px] text-ink outline-0 focus:border-clay"
                id="collection-title"
                value={draft.title}
                maxLength={20}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    title: event.target.value,
                  })
                }
              />
            </div>

            <h2 className="mt-[20px] mb-[20px] text-[13.5px] font-medium">
              미리보기
            </h2>

            <div className="grid grid-cols-[minmax(0,1fr)_320px] items-start gap-[20px] max-[960px]:grid-cols-1">

              {/* 옷장 미리보기 */}
              <section
                className="border border-frame bg-white p-[22px]"
                aria-label="컬렉션 옷장 미리보기"
              >
                <p className="m-0 mb-[12px] truncate text-[18px] font-semibold">
                  {draft.title || '나의 컬렉션'}
                </p>

                <div
                  className="border p-[12px] shadow-[0_10px_24px_rgba(44,26,15,.10)]"
                  style={{
                    backgroundColor:
                      color.cabinet,
                    borderColor:
                      color.border,
                  }}
                >
                  <div className="grid grid-cols-[120px_minmax(0,1fr)_100px] gap-[9px] max-[650px]:grid-cols-[90px_minmax(0,1fr)]">

                    {/* ACCESSORY */}
                    <div
                      className="flex min-h-[300px] flex-col border p-[7px]"
                      style={{
                        backgroundColor:
                          color.section,
                        borderColor:
                          color.border,
                      }}
                    >
                      <p
                        className="m-0 mb-[8px] text-[7px] tracking-[.16em]"
                        style={{
                          color: color.accent,
                        }}
                      >
                        ACCESSORY
                      </p>

                      <div className="grid grid-cols-2 gap-[5px]">
                        {Array.from({
                          length: 6,
                        }).map((_, index) => (
                          <div
                            key={index}
                            className="aspect-square border"
                            style={{
                              backgroundColor:
                                color.slot,
                              borderColor:
                                color.border,
                            }}
                          />
                        ))}
                      </div>

                      <div className="flex-1" />

                      {[1, 2].map((drawer) => (
                        <div
                          key={drawer}
                          className="relative mt-[5px] h-[34px] border"
                          style={{
                            backgroundColor:
                              color.drawer,
                            borderColor:
                              color.border,
                          }}
                        >
                          <span
                            className="absolute top-1/2 left-1/2 h-[2px] w-[20px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                            style={{
                              backgroundColor:
                                color.accent,
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* BAG + CLOTHING */}
                    <div className="flex min-w-0 flex-col gap-[9px]">

                      {/* BAG */}
                      <div
                        className="border p-[7px]"
                        style={{
                          backgroundColor:
                            color.section,
                          borderColor:
                            color.border,
                        }}
                      >
                        <p
                          className="m-0 mb-[8px] text-[7px] tracking-[.16em]"
                          style={{
                            color: color.accent,
                          }}
                        >
                          BAG
                        </p>

                        <div className="grid grid-cols-4 gap-[5px]">
                          {Array.from({
                            length: 4,
                          }).map((_, index) => (
                            <div
                              key={index}
                              className="h-[68px] border"
                              style={{
                                backgroundColor:
                                  color.slot,
                                borderColor:
                                  color.border,
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* CLOTHING */}
                      <div
                        className="flex-1 border p-[7px]"
                        style={{
                          backgroundColor:
                            color.section,
                          borderColor:
                            color.border,
                        }}
                      >
                        <p
                          className="m-0 mb-[8px] text-[7px] tracking-[.16em]"
                          style={{
                            color: color.accent,
                          }}
                        >
                          CLOTHING
                        </p>

                        <div
                          className="mb-[12px] h-px w-full"
                          style={{
                            backgroundColor:
                              color.accent,
                          }}
                        />

                        <div className="grid grid-cols-5 gap-[5px]">
                          {Array.from({
                            length: 5,
                          }).map((_, index) => (
                            <div
                              key={index}
                              className="relative h-[165px]"
                            >
                              <span
                                className="absolute top-[-8px] left-1/2 h-[8px] w-px -translate-x-1/2"
                                style={{
                                  backgroundColor:
                                    color.accent,
                                }}
                              />

                              <div
                                className="h-full w-full"
                                style={{
                                  backgroundColor:
                                    color.slot,
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 오른쪽 패널 */}
                    <div
                      className="border p-[8px] max-[650px]:col-span-2"
                      style={{
                        backgroundColor:
                          color.side,
                        borderColor:
                          color.border,
                      }}
                    >
                      <p className="m-0 border-b border-black/10 pb-[8px] text-center text-[7px] tracking-[.16em] text-ink/50">
                        MY COLLECTION
                      </p>

                      <div className="border-b border-black/10 py-[12px]">
                        <p className="m-0 text-[6px] tracking-[.14em] text-ink/40">
                          TOTAL EDITIONS
                        </p>

                        <p className="mt-[4px] mb-0 text-[20px]">
                          0
                        </p>
                      </div>

                      <div className="py-[12px]">
                        <p className="m-0 text-[6px] tracking-[.14em] text-ink/40">
                          LATEST EDITION
                        </p>

                        <div
                          className="mt-[8px] h-[70px]"
                          style={{
                            backgroundColor:
                              color.slot,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* 테마 설정 */}
              <section
                className="border border-frame bg-white p-[22px]"
                aria-label="테마 설정"
              >
                <h3 className="m-0 text-[13.5px] font-medium">
                  테마 설정
                </h3>

                <p className="mt-[14px] mb-[10px] text-[11.5px] text-ink/50">
                  선택된 색상
                </p>

                <div className="flex items-center gap-[10px]">
                  <span
                    className="size-[26px] shrink-0 border border-frame"
                    style={{
                      backgroundColor:
                        color.hex,
                    }}
                    aria-hidden="true"
                  />

                  <span className="text-[13px]">
                    {color.label}
                  </span>

                  <span className="text-[10px] text-ink/45 uppercase">
                    {color.hex}
                  </span>
                </div>

                <div className="mt-[20px] flex flex-col gap-[10px]">
                  <Button onClick={handleSave}>
                    테마 적용하기
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                  >
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