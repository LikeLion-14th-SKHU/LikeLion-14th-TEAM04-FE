import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../components/Header'
import Panel from '../../components/Panel'
import Button from '../../components/Button'
import ConceptCard from './components/ConceptCard'
import {
    arrangeConcepts,
    isConceptLocked,
    isSelectable,
} from './conceptOrder'
import {
    getAdminEditionGenerations,
    getEditionGenerations,
    unlockConcept,
} from '../../api/edition'
import { getMe, useMe } from '../../api/user'

// 회차는 돌린 순서대로, 회차 안에서는 노출 순서대로 이어 붙인다.
// 어느 회차의 콘셉트인지는 뒤에서 에디션명을 정할 때 필요하다
const flattenConcepts = (generations) =>
    [...generations]
        .sort((a, b) => a.generationNo - b.generationNo)
        .flatMap((generation) =>
            arrangeConcepts(generation.concepts)
                .map((concept) => ({
                    ...concept,
                    generationId: generation.generationId,
                })),
        )

export default function EditionConceptPage() {
    const navigate = useNavigate()
    const me = useMe()
    const isAdmin = me?.role === 'ADMIN'

    // null 은 아직 불러오는 중이라는 뜻
    const [concepts, setConcepts] = useState(null)
    const [selectedId, setSelectedId] = useState(null)
    const [unlocking, setUnlocking] = useState(false)
    const [error, setError] = useState('')

    // 진입 시점에 한 번만 읽는다 — 렌더마다 읽으면 404 로 지운 직후 에러를 보여주지 못하고 튕긴다
    const [memoryId] = useState(() =>
        sessionStorage.getItem('edition-memory-id'),
    )

    // 재조회를 다시 걸기 위한 신호
    const [tick, setTick] = useState(0)

    const load = useCallback(async (revealAll) => {
        const page = await (revealAll
            ? getAdminEditionGenerations(memoryId)
            : getEditionGenerations(memoryId))
        const loaded = flattenConcepts(page.content)

        // 추억은 만들었는데 아직 회차를 안 돌린 상태다 — 생성부터 하고 와야 한다
        if (loaded.length === 0) {
            navigate('/edition/create/generating', { replace: true })
            return
        }

        setConcepts(loaded)
        setSelectedId(
            (prev) => prev ?? loaded.find(isSelectable)?.conceptId ?? null,
        )
    }, [memoryId, navigate])

    useEffect(() => {
        if (!memoryId) {
            navigate('/edition/create', { replace: true })
            return
        }

        // 권한을 먼저 알아야 관리자에게 잠긴 응답을 잘못 보여주지 않는다.
        getMe()
            .then((user) => load(user.role === 'ADMIN'))
            .catch((caught) => {
                // 없는 추억을 들고 있으면 이 화면으로 계속 되돌아온다 — 놓아줘야 처음부터 다시 할 수 있다
                if (caught.status === 404) {
                    sessionStorage.removeItem('edition-memory-id')
                }

                setError(caught.message)
            })
    }, [memoryId, navigate, load])

    // 생성 중에 뒤로 갔다 들어오면 아직 PENDING 인 회차를 보게 된다 —
    // 생성 화면을 거치지 않았으니 여기서 직접 지켜본다
    useEffect(() => {
        if (!concepts?.some((concept) => concept.status === 'PENDING')) return

        const timer = setTimeout(() => {
            // 실패해도 다음 타이머를 건다 — 순단 한 번에 영영 멈추면 화면이 '만드는 중'으로 굳는다
            load(isAdmin)
                .catch(() => { })
                .finally(() => setTick((prev) => prev + 1))
        }, 2000)

        return () => clearTimeout(timer)
    }, [concepts, isAdmin, load, tick])

    // 이미지가 준비된 잠긴 콘셉트만 열 수 있다
    const lockedConcepts = (concepts ?? []).filter(
        (concept) =>
            isConceptLocked(concept, isAdmin) &&
            concept.status === 'IMAGE_READY',
    )

    const handleUnlockBlurred = async () => {
        setUnlocking(true)
        setError('')

        let failure = ''

        for (const locked of lockedConcepts) {
            try {
                const opened = await unlockConcept(locked.conceptId)

                setConcepts((prev) =>
                    prev.map((concept) =>
                        concept.conceptId === locked.conceptId
                            ? { ...concept, ...opened }
                            : concept,
                    ),
                )
            } catch (caught) {
                // 한 장이 막혀도 나머지는 계속 연다
                failure = caught.message
            }
        }

        setError(failure)

        await getMe().catch(() => { })

        setUnlocking(false)
    }

    // 3장이 한 회차다 — 더 보려면 같은 추억으로 한 회차를 더 돌린다
    const handleAddConcepts = () => {
        navigate('/edition/create/generating')
    }

    const handleNext = async () => {
        const selected = concepts.find(
            (concept) => concept.conceptId === selectedId,
        )

        if (!selected) return

        let concept = selected

        if (isAdmin && !selected.isUnlocked) {
            setUnlocking(true)
            setError('')

            try {
                const opened = await unlockConcept(selectedId)

                concept = {
                    ...selected,
                    ...opened,
                    generationId: selected.generationId,
                }

                await getMe().catch(() => { })
            } catch (caught) {
                setError(caught.message)
                setUnlocking(false)
                return
            }

            setUnlocking(false)
        }

        sessionStorage.setItem(
            'edition-concept',
            JSON.stringify(concept),
        )

        navigate('/edition/create/complete')
    }

    return (
        <>
            <Header />

            <main className="min-h-[calc(100dvh-56px)] w-full">
                <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[38px] pb-[38px] max-[860px]:px-[22px]">
                    <Panel>
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

                        {concepts === null ? (
                            <div className="mt-[26px] py-[56px] text-center">
                                <p className="m-0 text-[12px] text-ink/45">
                                    {error || '콘셉트를 불러오는 중입니다.'}
                                </p>

                                {/* 불러오지 못하면 이 화면에 갇힌다 — 나갈 길을 남긴다 */}
                                {error && (
                                    <div className="mt-[20px] flex justify-center">
                                        <Button
                                            variant="secondary"
                                            href="/edition/create"
                                        >
                                            입력 화면으로
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="mt-[26px] grid grid-cols-3 gap-[18px] max-[850px]:grid-cols-2 max-[560px]:grid-cols-1">
                                    {concepts.map((concept) => (
                                        <ConceptCard
                                            key={concept.conceptId}
                                            concept={concept}
                                            locked={isConceptLocked(
                                                concept,
                                                isAdmin,
                                            )}
                                            selected={
                                                selectedId === concept.conceptId
                                            }
                                            onSelect={() =>
                                                setSelectedId(concept.conceptId)
                                            }
                                        />
                                    ))}
                                </div>

                                {/* 콘셉트 열람 — 블러를 열지 않고도 다음 회차를 돌릴 수 있어야 한다 */}
                                <div className="mt-[22px] border-t border-[#ddd1c1] pt-[18px]">
                                    {lockedConcepts.length > 0 && (
                                        <div className="mb-[16px]">
                                            <button
                                                type="button"
                                                disabled={unlocking}
                                                onClick={handleUnlockBlurred}
                                                className="cursor-pointer border-0 bg-transparent p-0 text-[10px] text-ink transition-colors hover:text-clay disabled:cursor-not-allowed disabled:text-ink/30"
                                            >
                                                {unlocking
                                                    ? '여는 중...'
                                                    : '+ 블러 콘셉트 열람하기'}

                                                <span className="ml-[7px] text-[8px] text-ink/40">
                                                    (크레딧 차감)
                                                </span>
                                            </button>

                                            <p className="mt-[7px] mb-0 text-[8px] text-ink/35">
                                                블러 처리된 콘셉트{' '}
                                                {lockedConcepts.length}장을 함께
                                                확인할 수 있습니다.
                                            </p>
                                        </div>
                                    )}

                                    <div>
                                        <button
                                            type="button"
                                            onClick={handleAddConcepts}
                                            className="cursor-pointer border-0 bg-transparent p-0 text-[10px] text-ink transition-colors hover:text-clay"
                                        >
                                            + 콘셉트 3개 더 생성하기
                                        </button>

                                        <p className="mt-[7px] mb-0 text-[8px] text-ink/35">
                                            무료 생성 횟수를 넘긴 회차부터는
                                            크레딧이 차감됩니다.
                                        </p>
                                    </div>

                                    {error && (
                                        <p className="mt-[10px] mb-0 text-[10px] text-clay">
                                            {error}
                                        </p>
                                    )}
                                </div>

                                <div className="mt-[20px] flex items-center justify-end gap-[20px]">
                                    <p className="m-0 text-[8px] text-ink/40">
                                        보유 크레딧{' '}
                                        {(me?.credit ?? 0).toLocaleString(
                                            'ko-KR',
                                        )}{' '}
                                        C
                                    </p>

                                    <Button
                                        disabled={!selectedId || unlocking}
                                        onClick={handleNext}
                                    >
                                        {unlocking ? '처리 중...' : '다음'}
                                    </Button>
                                </div>
                            </>
                        )}
                    </Panel>
                </div>
            </main>
        </>
    )
}
