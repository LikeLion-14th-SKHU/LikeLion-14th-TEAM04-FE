import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../components/Header'
import Button from '../../components/Button'
import { clearEditionDraft } from '../../api/client'
import { createCertificate } from '../../api/certificate'
import { getEditionGeneration, selectEditionName } from '../../api/edition'

const CATEGORY_LABELS = {
    clothing: '의류',
    bag: '가방',
    accessory: '악세사리',
}

const CLOTHING_MAIN_LABELS = {
    top: '상의',
    bottom: '하의',
    dress: '원피스',
    outer: '아우터',
}

export default function EditionCompletePage() {
    const navigate = useNavigate()

    // 화면에 들어올 때 한 번만 읽는다 — 매 렌더 다시 읽으면 완료 직후 세션을 비우는 순간
    // 값이 사라져서, 콘셉트 없이 들어온 것으로 오해하고 입력 화면으로 튕긴다
    const [form] = useState(() =>
        JSON.parse(sessionStorage.getItem('edition-form') || '{}'),
    )

    const [concept] = useState(() =>
        JSON.parse(sessionStorage.getItem('edition-concept') || '{}'),
    )

    const [generation, setGeneration] = useState(null)
    const [editionName, setEditionName] = useState('')

    const [editingName, setEditingName] =
        useState(false)

    const [editingValue, setEditingValue] =
        useState('')

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const generationId = concept.generationId

    // 에디션명 후보는 콘셉트가 아니라 회차에 달려 있다 — 고른 콘셉트의 회차를 가져온다
    useEffect(() => {
        // 콘셉트를 고르지 않고 주소로 바로 들어온 경우 — 여기서 할 수 있는 게 없다
        if (!generationId) {
            navigate('/edition/create', { replace: true })
            return
        }

        let cancelled = false

        getEditionGeneration(generationId)
            .then((data) => {
                if (cancelled) return

                setGeneration(data)
                setEditionName(
                    data.editionName ??
                    data.editionNameCandidates?.[0] ??
                    '',
                )
            })
            .catch((caught) => {
                if (!cancelled) setError(caught.message)
            })

        return () => {
            cancelled = true
        }
    }, [generationId, navigate])

    const saveName = async (name) => {
        const trimmed = name.trim()

        if (!trimmed) {
            setError('에디션명을 입력해주세요.')
            return
        }

        setSaving(true)
        setError('')

        try {
            const updated = await selectEditionName(generationId, trimmed)

            setEditionName(updated.editionName ?? trimmed)
            setGeneration(updated)
            setEditingName(false)
        } catch (caught) {
            setError(caught.message)
        }

        setSaving(false)
    }

    const material =
        form.material === '직접입력'
            ? form.materialCustom
            : form.material

    const clothingSub =
        form.clothingSub === '직접입력'
            ? form.clothingSubCustom
            : form.clothingSub

    const clothingType = [
        CLOTHING_MAIN_LABELS[form.clothingMain],
        clothingSub === '선택안함' ? '' : clothingSub,
    ]
        .filter(Boolean)
        .join(' · ')

    const handleStartEdit = () => {
        setEditingValue(editionName)
        setEditingName(true)
    }

    const handleSaveName = () => saveName(editingValue)

    const handleComplete = async () => {
        // 수정하다 저장을 안 누르고 완료로 넘어가는 사람이 있다 — 입력한 이름을 버리지 않는다
        const finalName = editingName ? editingValue.trim() : editionName

        if (!finalName) {
            setError('에디션명을 입력해주세요.')
            return
        }

        setSaving(true)
        setError('')

        try {
            // 후보를 그대로 두고 넘어가는 사람이 대부분이다 — 화면에 보이던 이름을 확정하고 간다
            if (generation?.editionName !== finalName) {
                const updated = await selectEditionName(generationId, finalName)

                setGeneration(updated)
                setEditionName(updated.editionName ?? finalName)
                setEditingName(false)
            }

            // 보증서 발급이 최종 확정이다. 성공해야 컬렉션에 자동으로 등록된다
            await createCertificate(concept.conceptId)

            // 이 회차는 끝났다 — 다음 생성이 앞 회차의 추억을 물고 가지 않게 전부 지운다
            clearEditionDraft()
            navigate('/collection')
        } catch (caught) {
            setError(caught.message)
            setSaving(false)
        }
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
                            {concept.imageUrl ? (
                                <img
                                    src={concept.imageUrl}
                                    alt={concept.conceptName ?? ''}
                                    className="block h-[330px] w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-[330px] items-center justify-center bg-[#d8c8ae]">
                                    <span className="text-[8px] tracking-[.16em] text-ink/35">
                                        EDITION RENDER · 3D GOODS
                                    </span>
                                </div>
                            )}
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
                                        maxLength={50}
                                        className="h-[44px] min-w-0 flex-1 border border-ink/25 bg-white/45 px-[12px] font-brand text-[22px] outline-none focus:border-ink"
                                    />

                                    <button
                                        type="button"
                                        disabled={saving}
                                        onClick={handleSaveName}
                                        className="cursor-pointer border-0 bg-transparent text-[10px] font-medium text-ink/60 hover:text-ink disabled:cursor-not-allowed disabled:text-ink/30"
                                    >
                                        {saving ? '저장 중...' : '저장'}
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-[12px]">
                                    <h2 className="m-0 font-brand text-[26px] font-normal">
                                        {editionName || '이름을 불러오는 중'}
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

                            {/* AI가 지어온 이름 후보 — 하나 고르면 그대로 확정된다 */}
                            {generation?.editionNameCandidates?.length > 0 && (
                                <div className="mt-[14px] flex flex-wrap items-center gap-[8px]">
                                    <span className="text-[9px] tracking-[.12em] text-ink/45">
                                        AI 제안
                                    </span>

                                    {generation.editionNameCandidates.map(
                                        (candidate) => (
                                            <button
                                                key={candidate}
                                                type="button"
                                                disabled={saving}
                                                onClick={() =>
                                                    saveName(candidate)
                                                }
                                                className={`h-[28px] cursor-pointer border px-[11px] text-[10px] transition-colors duration-700 ease-film disabled:cursor-not-allowed ${editionName === candidate
                                                    ? 'border-ink bg-ink text-cream'
                                                    : 'border-[#ddd1c1] bg-white/50 text-ink/65 hover:border-clay'
                                                    }`}
                                            >
                                                {candidate}
                                            </button>
                                        ),
                                    )}
                                </div>
                            )}

                            {error && (
                                <p className="mt-[12px] mb-0 text-[10px] text-clay">
                                    {error}
                                </p>
                            )}

                            {/* 생성 날짜 */}
                            <div className="mt-[24px]">
                                <p className="m-0 text-[11px] font-medium">
                                    생성 날짜
                                </p>

                                <p className="mt-[6px] mb-0 text-[12px] text-ink/55">
                                    {generation?.createdAt
                                        ? new Date(
                                            generation.createdAt,
                                        ).toLocaleDateString('ko-KR')
                                        : '-'}
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
                                        {concept.conceptName || '-'}
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
                        <Button disabled={saving} onClick={handleComplete}>
                            {saving ? '확정 중...' : '완료'}
                        </Button>
                    </div>
                </div>
            </main>
        </>
    )
}
