import { useState } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../components/Header'
import Button from '../../components/Button'
import ConceptCard from './components/ConceptCard'

const INITIAL_CONCEPTS = [
    {
        id: 1,
        title: '헤리티지 토트',
        color: '#d5c1a1',
    },
    {
        id: 2,
        title: '아카이브 파우치',
        color: '#c7ae8b',
    },
    {
        id: 3,
        title: '메모리 키링',
        color: '#e5dac8',
    },
]

const CONCEPT_NAMES = [
    '스티치 아카이브',
    '메모리 오브제',
    '아틀리에 에디션',
    '헤리티지 라인',
    '리멤버 파우치',
    '아카이브 월렛',
    '모먼트 백',
    '메모리 포켓',
    '타임리스 에디션',
]

const COLORS = [
    '#918879',
    '#b8a489',
    '#514d47',
    '#bca98e',
    '#d2c3ac',
    '#867a6c',
    '#c8b79c',
    '#a99479',
    '#ded0bd',
]

function createMoreConcepts(startId) {
    return Array.from({ length: 3 }, (_, index) => {
        const id = startId + index

        return {
            id,
            title:
                CONCEPT_NAMES[
                (id - 4) % CONCEPT_NAMES.length
                ],
            color: COLORS[(id - 4) % COLORS.length],
        }
    })
}

export default function EditionConceptPage() {
    const navigate = useNavigate()

    const [concepts, setConcepts] =
        useState(INITIAL_CONCEPTS)

    // 처음에는 가운데 콘셉트만 공개
    const [unlockedIds, setUnlockedIds] =
        useState([2])

    const [selectedId, setSelectedId] =
        useState(2)

    const [initialBlurUnlocked, setInitialBlurUnlocked] =
        useState(false)

    const [freeExpansionUsed, setFreeExpansionUsed] =
        useState(false)

    const [credit, setCredit] = useState(12500)

    const handleUnlockBlurred = () => {
        if (credit < 100) return

        // TODO: 실제 크레딧 차감 API 연결
        setCredit((prev) => prev - 100)

        setUnlockedIds([1, 2, 3])
        setInitialBlurUnlocked(true)
    }

    const handleAddConcepts = () => {
        if (!initialBlurUnlocked) return

        // 첫 3개 추가만 무료
        if (freeExpansionUsed) {
            if (credit < 100) return

            // TODO: 실제 크레딧 차감 API 연결
            setCredit((prev) => prev - 100)
        }

        const nextConcepts = createMoreConcepts(
            concepts.length + 1,
        )

        setConcepts((prev) => [
            ...prev,
            ...nextConcepts,
        ])

        setUnlockedIds((prev) => [
            ...prev,
            ...nextConcepts.map((item) => item.id),
        ])

        if (!freeExpansionUsed) {
            setFreeExpansionUsed(true)
        }
    }

    const handleNext = () => {
        const selectedConcept = concepts.find(
            (concept) => concept.id === selectedId,
        )

        sessionStorage.setItem(
            'edition-concept',
            JSON.stringify(selectedConcept),
        )

        navigate('/edition/create/complete')
    }

    return (
        <>
            <Header />

            <main className="min-h-[calc(100dvh-78px)] w-full bg-paper">
                <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[38px] pb-[38px] max-[860px]:px-[22px]">
                    <div className="flex items-center gap-[12px]">
                        <span className="text-[8px] tracking-[.22em] text-clay">
                            STEP 03 / 03
                        </span>

                        <span className="h-px w-[52px] bg-ink" />
                        <span className="h-px w-[44px] bg-ink" />
                        <span className="h-px w-[44px] bg-ink" />
                    </div>

                    <h1 className="mt-[16px] mb-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em]">
                        에디션 콘셉트 선택
                    </h1>

                    <p className="mt-[10px] mb-0 text-[12px] text-ink/52">
                        AI가 제안한 방향을 확인하고 원하는 콘셉트를
                        선택하세요.
                    </p>

                    <div className="mt-[26px] grid grid-cols-3 gap-[18px] max-[850px]:grid-cols-2 max-[560px]:grid-cols-1">
                        {concepts.map((concept) => (
                            <ConceptCard
                                key={concept.id}
                                concept={concept}
                                locked={
                                    !unlockedIds.includes(concept.id)
                                }
                                selected={
                                    selectedId === concept.id
                                }
                                onSelect={() =>
                                    setSelectedId(concept.id)
                                }
                            />
                        ))}
                    </div>

                    {/* 콘셉트 열람 */}
                    <div className="mt-[22px] border-t border-[#ddd1c1] pt-[18px]">
                        {!initialBlurUnlocked ? (
                            <div>
                                <button
                                    type="button"
                                    disabled={credit < 100}
                                    onClick={handleUnlockBlurred}
                                    className="cursor-pointer border-0 bg-transparent p-0 text-[10px] text-ink transition-colors hover:text-clay disabled:cursor-not-allowed disabled:text-ink/30"
                                >
                                    + 블러 콘셉트 열람하기

                                    <span className="ml-[7px] text-[8px] text-ink/40">
                                        (100 크레딧)
                                    </span>
                                </button>

                                <p className="mt-[7px] mb-0 text-[8px] text-ink/35">
                                    블러 처리된 두 콘셉트를 함께 확인할 수 있습니다.
                                </p>
                            </div>
                        ) : (
                            <div>
                                <button
                                    type="button"
                                    disabled={
                                        freeExpansionUsed && credit < 100
                                    }
                                    onClick={handleAddConcepts}
                                    className="cursor-pointer border-0 bg-transparent p-0 text-[10px] text-ink transition-colors hover:text-clay disabled:cursor-not-allowed disabled:text-ink/30"
                                >
                                    + 콘셉트 3개 더 열람하기

                                    <span className="ml-[7px] text-[8px] text-ink/40">
                                        {freeExpansionUsed
                                            ? '(100 크레딧)'
                                            : '(1회 무료)'}
                                    </span>
                                </button>

                                {freeExpansionUsed && (
                                    <p className="mt-[7px] mb-0 text-[8px] text-ink/35">
                                        이후 추가 열람은 3개당 100 크레딧이
                                        사용됩니다.
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="mt-[20px] flex items-center justify-end gap-[20px]">
                        <p className="m-0 text-[8px] text-ink/40">
                            보유 크레딧 {credit.toLocaleString('ko-KR')} C
                        </p>

                        <Button
                            disabled={!selectedId}
                            onClick={handleNext}
                        >
                            다음
                        </Button>
                    </div>
                </div>
            </main>
        </>
    )
}