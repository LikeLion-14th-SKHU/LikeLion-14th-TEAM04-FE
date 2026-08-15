import { useState } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../components/Header'
import Button from '../../components/Button'

const CATEGORY_LABELS = {
    clothing: '의류',
    bag: '가방',
    accessory: '악세사리',
}

export default function EditionCompletePage() {
    const navigate = useNavigate()

    const form = JSON.parse(
        sessionStorage.getItem('edition-form') || '{}',
    )

    const concept = JSON.parse(
        sessionStorage.getItem('edition-concept') || '{}',
    )

    const [editionName, setEditionName] = useState(
        `Edition No. 001 · ${concept.title || 'Memory Edition'
        }`,
    )

    const [editingName, setEditingName] =
        useState(false)

    const [editingValue, setEditingValue] =
        useState(editionName)

    const material =
        form.material === '직접입력'
            ? form.materialCustom
            : form.material

    const clothingType =
        form.clothingType === '직접입력'
            ? form.clothingTypeCustom
            : form.clothingType

    const handleStartEdit = () => {
        setEditingValue(editionName)
        setEditingName(true)
    }

    const handleSaveName = () => {
        if (!editingValue.trim()) return

        setEditionName(editingValue.trim())
        setEditingName(false)
    }

    const handleComplete = () => {
        const completedEdition = {
            ...form,
            concept,
            editionName,
            createdAt: '2026.08.14',
        }

        const existing = JSON.parse(
            localStorage.getItem('my-editions') || '[]',
        )

        localStorage.setItem(
            'my-editions',
            JSON.stringify([
                ...existing,
                completedEdition,
            ]),
        )

        sessionStorage.removeItem('edition-form')
        sessionStorage.removeItem('edition-concept')

        navigate('/')
    }

    return (
        <>
            <Header />

            <main className="min-h-[calc(100dvh-56px)] w-full">
                <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[42px] pb-[38px] max-[860px]:px-[22px]">
                    <p className="m-0 text-[8px] tracking-[.22em] text-ink/45">
                        EDITION COMPLETE
                    </p>

                    <h1 className="mt-[13px] mb-0 text-[30px] font-semibold tracking-[-.04em]">
                        에디션이 완성되었습니다
                    </h1>

                    <div className="mt-[40px] grid grid-cols-[310px_minmax(0,1fr)] items-center gap-[48px] max-[800px]:grid-cols-1">
                        {/* 이미지 */}
                        <div className="border-[14px] border-white bg-[#dfd0b8]">
                            <div
                                className="flex h-[330px] items-center justify-center"
                                style={{
                                    backgroundColor:
                                        concept.color || '#d8c8ae',
                                }}
                            >
                                <span className="text-[8px] tracking-[.16em] text-ink/35">
                                    EDITION RENDER · 3D GOODS
                                </span>
                            </div>
                        </div>

                        {/* 상세 정보 */}
                        <div>
                            {/* 에디션 이름 */}
                            {editingName ? (
                                <div className="flex items-center gap-[10px]">
                                    <input
                                        value={editingValue}
                                        onChange={(event) =>
                                            setEditingValue(
                                                event.target.value,
                                            )
                                        }
                                        maxLength={60}
                                        className="h-[44px] min-w-0 flex-1 border border-ink/25 bg-white/45 px-[12px] font-brand text-[22px] outline-none focus:border-ink"
                                    />

                                    <button
                                        type="button"
                                        onClick={handleSaveName}
                                        className="cursor-pointer border-0 bg-transparent text-[10px] font-medium text-ink/60 hover:text-ink"
                                    >
                                        저장
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-[12px]">
                                    <h2 className="m-0 font-brand text-[26px] font-normal">
                                        {editionName}
                                    </h2>

                                    <button
                                        type="button"
                                        onClick={handleStartEdit}
                                        className="cursor-pointer border-0 bg-transparent p-0 text-[10px] text-ink/50 underline underline-offset-4 hover:text-ink"
                                    >
                                        수정
                                    </button>
                                </div>
                            )}

                            {/* 생성 날짜 */}
                            <div className="mt-[24px]">
                                <p className="m-0 text-[11px] font-medium">
                                    생성 날짜
                                </p>

                                <p className="mt-[6px] mb-0 text-[12px] text-ink/55">
                                    2026.08.14
                                </p>
                            </div>

                            {/* 사연 */}
                            <div className="mt-[22px]">
                                <p className="m-0 text-[11px] font-medium">
                                    추억 스토리
                                </p>

                                <p className="mt-[8px] mb-0 max-w-[720px] text-[13px] leading-[1.8] text-ink/70">
                                    {form.story ||
                                        '입력된 이야기가 없습니다.'}
                                </p>
                            </div>

                            {/* 구성 정보 */}
                            <div className="mt-[26px] grid grid-cols-4 gap-[22px] border-t border-ink/20 pt-[18px] max-[700px]:grid-cols-2">
                                <div>
                                    <p className="m-0 text-[9px] tracking-[.12em] text-ink/45">
                                        CONCEPT
                                    </p>

                                    <p className="mt-[7px] mb-0 text-[12px] font-medium">
                                        {concept.title || '-'}
                                    </p>
                                </div>

                                <div>
                                    <p className="m-0 text-[9px] tracking-[.12em] text-ink/45">
                                        MATERIAL
                                    </p>

                                    <p className="mt-[7px] mb-0 text-[12px] font-medium">
                                        {material || '-'}
                                    </p>
                                </div>

                                <div>
                                    <p className="m-0 text-[9px] tracking-[.12em] text-ink/45">
                                        ORIGINAL CLOTH
                                    </p>

                                    <p className="mt-[7px] mb-0 text-[12px] font-medium">
                                        {clothingType || '-'}
                                    </p>
                                </div>

                                <div>
                                    <p className="m-0 text-[9px] tracking-[.12em] text-ink/45">
                                        CATEGORY
                                    </p>

                                    <p className="mt-[7px] mb-0 text-[12px] font-medium">
                                        {CATEGORY_LABELS[
                                            form.mainCategory
                                        ] || '-'}

                                        {form.subCategory &&
                                            form.subCategory !== '선택안함'
                                            ? ` · ${form.subCategory}`
                                            : ''}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-[38px] flex justify-end">
                        <Button onClick={handleComplete}>
                            완료
                        </Button>
                    </div>
                </div>
            </main>
        </>
    )
}