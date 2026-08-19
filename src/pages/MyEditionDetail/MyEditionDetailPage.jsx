import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

import Header from '../../components/Header'
import Panel from '../../components/Panel'
import Button from '../../components/Button'
import CurationCard from './components/CurationCard'

import { getMyCollectionEdition } from '../../api/collection'
import {
    getMyPublicSettings,
    updateCardVisibility,
} from '../../api/publicSettings'
import {
    getEditionLikes,
    addEditionLike,
    removeEditionLike,
} from '../../api/like'
import { getRecommendations } from '../../api/recommendation'

const formatDate = (value) => {
    if (!value) return '-'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date)
}

export default function MyEditionDetailPage() {
    const { conceptId } = useParams()

    const numericConceptId = Number(conceptId)

    const [edition, setEdition] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [tab, setTab] = useState('info')

    // =========================
    // 공개 설정
    // =========================
    const [isPublic, setIsPublic] =
        useState(false)

    const [
        pendingPublicState,
        setPendingPublicState,
    ] = useState(null)

    const [
        visibilityLoading,
        setVisibilityLoading,
    ] = useState(true)

    const [
        visibilityPending,
        setVisibilityPending,
    ] = useState(false)

    const [
        visibilityError,
        setVisibilityError,
    ] = useState('')

    // =========================
    // 좋아요
    // =========================
    const [likes, setLikes] = useState(0)
    const [liked, setLiked] = useState(false)
    const [likeLoading, setLikeLoading] =
        useState(true)
    const [likePending, setLikePending] =
        useState(false)

    // =========================
    // 큐레이션
    // =========================
    const [
        recommendations,
        setRecommendations,
    ] = useState([])

    const [
        recommendationLoading,
        setRecommendationLoading,
    ] = useState(true)

    const [
        recommendationError,
        setRecommendationError,
    ] = useState('')

    // =========================
    // 에디션 상세 조회
    // =========================
    useEffect(() => {
        if (!numericConceptId) return

        let cancelled = false

        const loadEdition = async () => {
            setLoading(true)
            setError('')

            try {
                const data =
                    await getMyCollectionEdition(
                        numericConceptId,
                    )

                if (cancelled) return

                setEdition(data)
            } catch (error) {
                if (cancelled) return

                console.error(
                    '에디션 상세 조회 실패:',
                    error,
                )

                setError(
                    error.message ??
                    '에디션을 불러오지 못했습니다.',
                )
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadEdition()

        return () => {
            cancelled = true
        }
    }, [numericConceptId])

    // =========================
    // 공개 설정 조회
    // =========================
    useEffect(() => {
        if (!numericConceptId) return

        let cancelled = false

        const loadPublicSettings = async () => {
            setVisibilityLoading(true)
            setVisibilityError('')

            try {
                const settings =
                    await getMyPublicSettings()

                if (cancelled) return

                const card =
                    settings.cards?.find(
                        (item) =>
                            item.conceptId ===
                            numericConceptId,
                    )

                setIsPublic(
                    card?.isPublic ??
                    settings.collection
                        ?.isPublic ??
                    false,
                )
            } catch (error) {
                if (cancelled) return

                console.error(
                    '공개 설정 조회 실패:',
                    error,
                )

                setVisibilityError(
                    error.message ??
                    '공개 설정을 불러오지 못했습니다.',
                )
            } finally {
                if (!cancelled) {
                    setVisibilityLoading(false)
                }
            }
        }

        loadPublicSettings()

        return () => {
            cancelled = true
        }
    }, [numericConceptId])

    // =========================
    // 좋아요 조회
    // =========================
    useEffect(() => {
        if (!numericConceptId) return

        let cancelled = false

        const loadLikes = async () => {
            setLikeLoading(true)

            try {
                const data =
                    await getEditionLikes(
                        numericConceptId,
                    )

                if (cancelled) return

                setLikes(
                    data?.likeCount ?? 0,
                )

                setLiked(
                    data?.likedByMe ?? false,
                )
            } catch (error) {
                if (cancelled) return

                console.error(
                    '좋아요 조회 실패:',
                    error,
                )
            } finally {
                if (!cancelled) {
                    setLikeLoading(false)
                }
            }
        }

        loadLikes()

        return () => {
            cancelled = true
        }
    }, [numericConceptId])

    // =========================
    // 추천 상품 조회
    // =========================
    useEffect(() => {
        if (!numericConceptId) return

        let cancelled = false

        const loadRecommendations =
            async () => {
                setRecommendationLoading(true)
                setRecommendationError('')

                try {
                    const data =
                        await getRecommendations(
                            numericConceptId,
                        )

                    if (cancelled) return

                    setRecommendations(
                        data?.recommendations ??
                        [],
                    )
                } catch (error) {
                    if (cancelled) return

                    console.error(
                        '큐레이션 조회 실패:',
                        error,
                    )

                    // Swagger 설명상 아직 생성 전이면
                    // 404가 내려올 수 있음
                    if (error.status === 404) {
                        setRecommendations([])
                        return
                    }

                    setRecommendationError(
                        error.message ??
                        '추천 상품을 불러오지 못했습니다.',
                    )
                } finally {
                    if (!cancelled) {
                        setRecommendationLoading(
                            false,
                        )
                    }
                }
            }

        loadRecommendations()

        return () => {
            cancelled = true
        }
    }, [numericConceptId])

    // =========================
    // 좋아요 등록 / 취소
    // =========================
    const handleLike = async () => {
        if (likePending) return

        setLikePending(true)

        try {
            if (liked) {
                await removeEditionLike(
                    numericConceptId,
                )
            } else {
                await addEditionLike(
                    numericConceptId,
                )
            }

            // POST / DELETE 응답에는
            // 최신 likeCount가 없으므로 다시 조회
            const data =
                await getEditionLikes(
                    numericConceptId,
                )

            setLikes(
                data?.likeCount ?? 0,
            )

            setLiked(
                data?.likedByMe ?? false,
            )
        } catch (error) {
            console.error(
                '좋아요 변경 실패:',
                error,
            )
        } finally {
            setLikePending(false)
        }
    }

    // =========================
    // 공개 설정
    // =========================
    const handleToggleRequest = () => {
        setPendingPublicState(!isPublic)
    }

    const handleConfirmVisibility =
        async () => {
            if (
                pendingPublicState === null
            ) {
                return
            }

            setVisibilityPending(true)
            setVisibilityError('')

            try {
                const setting =
                    await updateCardVisibility(
                        numericConceptId,
                        pendingPublicState,
                    )

                setIsPublic(
                    setting.isPublic,
                )

                setPendingPublicState(null)
            } catch (error) {
                console.error(
                    '공개 설정 변경 실패:',
                    error,
                )

                setVisibilityError(
                    error.message ??
                    '공개 설정 변경에 실패했습니다.',
                )
            } finally {
                setVisibilityPending(false)
            }
        }

    const handleCancelVisibility = () => {
        setPendingPublicState(null)
    }

    // =========================
    // 로딩
    // =========================
    if (loading) {
        return (
            <>
                <Header />

                <main className="flex min-h-[calc(100dvh-56px)] items-center justify-center px-[24px]">
                    <Panel className="w-full max-w-[520px] py-[56px] text-center">
                        <p className="m-0 text-[13px] text-ink/50">
                            에디션을 불러오는
                            중입니다.
                        </p>
                    </Panel>
                </main>
            </>
        )
    }

    // =========================
    // 조회 실패
    // =========================
    if (error || !edition) {
        return (
            <>
                <Header />

                <main className="flex min-h-[calc(100dvh-56px)] items-center justify-center px-[24px]">
                    <Panel className="w-full max-w-[520px] py-[56px] text-center">
                        <p className="m-0 text-[13px] text-ink/50">
                            {error ||
                                '에디션을 찾을 수 없습니다.'}
                        </p>
                    </Panel>
                </main>
            </>
        )
    }

    const certificate =
        edition.certificate ?? {}

    const originalItem =
        edition.originalItem ?? {}

    // =========================
    // 기본 정보
    // =========================
    const renderInfo = () => (
        <section className="mt-[28px]">
            <div className="grid grid-cols-[420px_minmax(0,1fr)] gap-[42px] max-[900px]:grid-cols-1">
                {/* 왼쪽 */}
                <div>
                    <div className="border border-frame bg-white p-[14px]">
                        <div className="flex h-[390px] items-center justify-center bg-[#d4c2a6]">
                            {edition.imageUrl ? (
                                <img
                                    src={
                                        edition.imageUrl
                                    }
                                    alt={
                                        certificate.editionName
                                    }
                                    className="h-[90%] w-[90%] object-contain"
                                />
                            ) : (
                                <span className="text-[8px] tracking-[.12em] text-ink/35">
                                    EDITION IMAGE
                                </span>
                            )}
                        </div>
                    </div>

                    {/* 좋아요 */}
                    <button
                        type="button"
                        onClick={handleLike}
                        disabled={
                            likeLoading ||
                            likePending
                        }
                        className="mt-[12px] flex cursor-pointer items-center gap-[7px] border-0 bg-transparent p-0 text-[10px] text-ink/55 disabled:cursor-default disabled:opacity-50"
                    >
                        <span>
                            {liked ? '♥' : '♡'}
                        </span>

                        좋아요 {likes}개
                    </button>

                    {/* 공개 설정 */}
                    <div className="mt-[20px] flex items-center justify-between border border-frame bg-white px-[18px] py-[18px]">
                        <div>
                            <p className="m-0 text-[11px] font-medium">
                                에디션 공개
                            </p>

                            <p className="mt-[6px] mb-0 text-[9px] text-ink/45">
                                이 에디션을
                                커뮤니티에
                                공개합니다.
                            </p>
                        </div>

                        <div className="flex items-center gap-[10px]">
                            <span className="text-[8px] text-ink/40">
                                {isPublic
                                    ? 'ON'
                                    : 'OFF'}
                            </span>

                            <button
                                type="button"
                                onClick={
                                    handleToggleRequest
                                }
                                disabled={
                                    visibilityLoading
                                }
                                aria-label="에디션 공개 설정"
                                aria-pressed={
                                    isPublic
                                }
                                className={`relative h-[23px] w-[44px] cursor-pointer rounded-full border-0 transition-colors duration-500 disabled:cursor-default disabled:opacity-50 ${isPublic
                                        ? 'bg-ink'
                                        : 'bg-[#d6cec4]'
                                    }`}
                            >
                                <span
                                    className={`absolute top-[3px] size-[17px] rounded-full bg-white transition-all duration-500 ${isPublic
                                            ? 'left-[24px]'
                                            : 'left-[3px]'
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    {visibilityError && (
                        <p
                            className="mt-[8px] mb-0 text-[10px] text-[#8c3b33]"
                            role="alert"
                        >
                            {visibilityError}
                        </p>
                    )}
                </div>

                {/* 오른쪽 */}
                <div>
                    <div className="flex items-start justify-between gap-[20px]">
                        <h2 className="m-0 font-brand text-[24px] font-normal">
                            Edition No.{' '}
                            {
                                certificate.editionNumber
                            }
                        </h2>

                        <Button
                            variant="secondary"
                            href={`/edition/${numericConceptId}/certificate`}
                            className="h-[38px] px-[15px] text-[10px]"
                        >
                            보증서 보기
                        </Button>
                    </div>

                    <div className="mt-[24px]">
                        <p className="m-0 text-[10px] font-medium">
                            생성 날짜
                        </p>

                        <p className="mt-[5px] mb-0 text-[10px] text-ink/50">
                            {formatDate(
                                certificate.issuedAt,
                            )}
                        </p>
                    </div>

                    <div className="mt-[22px]">
                        <p className="m-0 text-[10px] font-medium">
                            추억 스토리
                        </p>

                        <p className="mt-[8px] mb-0 text-[11.5px] leading-[1.8] text-ink/65">
                            {certificate.story ||
                                '-'}
                        </p>
                    </div>

                    {/* 원본 의류 / 보증서 번호 */}
                    <div className="mt-[25px] border border-frame bg-white px-[18px] py-[16px]">
                        <div className="flex items-start justify-between gap-[24px] border-b border-[#eee7de] pb-[10px]">
                            <span className="shrink-0 text-[10px] text-ink/45">
                                원본 의류
                            </span>

                            <span className="text-right text-[10px]">
                                {[
                                    originalItem.categoryMain,
                                    originalItem.categorySub,
                                    originalItem.material,
                                ]
                                    .filter(
                                        Boolean,
                                    )
                                    .join(' · ') ||
                                    '-'}
                            </span>
                        </div>

                        {originalItem.condition
                            ?.length > 0 && (
                                <div className="flex items-start justify-between gap-[24px] border-b border-[#eee7de] py-[10px]">
                                    <span className="shrink-0 text-[10px] text-ink/45">
                                        의류 상태
                                    </span>

                                    <span className="text-right text-[10px]">
                                        {originalItem.condition.join(
                                            ' · ',
                                        )}
                                    </span>
                                </div>
                            )}

                        <div className="flex items-center justify-between pt-[10px]">
                            <span className="text-[10px] text-ink/45">
                                보증서 번호
                            </span>

                            <span className="text-[10px]">
                                {certificate.editionNumber ||
                                    '-'}
                            </span>
                        </div>
                    </div>

                    <Button
                        href="/order"
                        className="mt-[24px] w-full"
                    >
                        실물 제품 구매하기
                    </Button>

                    <p className="mt-[14px] mb-0 text-center text-[9px] text-ink/35">
                        제작 상담 후 4~6주 내
                        배송됩니다.
                    </p>
                </div>
            </div>
        </section>
    )

    // =========================
    // 큐레이션
    // =========================
    const renderCuration = () => (
        <section className="mt-[28px]">
            <div className="grid grid-cols-[360px_minmax(0,1fr)] gap-[42px] max-[900px]:grid-cols-1">
                {/* 왼쪽 에디션 이미지 */}
                <div className="border border-frame bg-white p-[14px]">
                    <div className="flex h-[390px] items-center justify-center bg-[#d4c2a6]">
                        {edition.imageUrl ? (
                            <img
                                src={
                                    edition.imageUrl
                                }
                                alt={
                                    certificate.editionName
                                }
                                className="h-[90%] w-[90%] object-contain"
                            />
                        ) : (
                            <span className="text-[8px] tracking-[.12em] text-ink/35">
                                EDITION IMAGE
                            </span>
                        )}
                    </div>
                </div>

                {/* 오른쪽 */}
                <div className="min-w-0">
                    <div className="flex items-center gap-[14px]">
                        <p className="m-0 text-[8px] tracking-[.18em] text-clay">
                            AI CURATION
                        </p>

                        <span className="h-px flex-1 bg-[#ddd2c4]" />
                    </div>

                    <h2 className="mt-[16px] mb-0 text-[22px] font-semibold">
                        AI 큐레이션
                    </h2>

                    <p className="mt-[10px] mb-0 text-[11px] leading-[1.8] text-ink/50">
                        당신의 에디션과
                        어울리는 제품을
                        추천해드려요.
                    </p>

                    <h3 className="mt-[28px] mb-0 text-[12px] font-medium">
                        어울리는 제품
                    </h3>

                    {recommendationLoading ? (
                        <div className="mt-[14px] flex min-h-[240px] items-center justify-center border border-frame bg-white">
                            <p className="m-0 text-[10px] text-ink/40">
                                추천 상품을
                                불러오는 중입니다.
                            </p>
                        </div>
                    ) : recommendationError ? (
                        <div className="mt-[14px] flex min-h-[240px] items-center justify-center border border-frame bg-white px-[20px] text-center">
                            <p className="m-0 text-[10px] text-[#8c3b33]">
                                {
                                    recommendationError
                                }
                            </p>
                        </div>
                    ) : recommendations.length >
                        0 ? (
                        <div
                            className={`mt-[14px] grid gap-[16px] ${recommendations.length ===
                                    2
                                    ? 'grid-cols-2'
                                    : 'grid-cols-3'
                                } max-[1100px]:grid-cols-2 max-[650px]:grid-cols-1`}
                        >
                            {recommendations.map(
                                (product) => (
                                    <CurationCard
                                        key={
                                            product.productId
                                        }
                                        product={
                                            product
                                        }
                                    />
                                ),
                            )}
                        </div>
                    ) : (
                        <div className="mt-[14px] flex min-h-[240px] items-center justify-center border border-frame bg-white">
                            <p className="m-0 text-[10px] text-ink/40">
                                추천 상품을
                                준비하고 있습니다.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )

    return (
        <>
            <Header />

            <main className="min-h-[calc(100dvh-56px)] w-full">
                <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[58px] pb-[48px] max-[860px]:px-[22px] max-[860px]:pt-[36px]">
                    <Panel>
                        <div className="flex items-end gap-[28px] border-b border-[#ded4c7] pb-[14px]">
                            {/* 나의 에디션 → 실제 editionName */}
                            <h1 className="m-0 text-[30px] font-semibold tracking-[-.04em]">
                                {certificate.editionName}
                            </h1>

                            <button
                                type="button"
                                onClick={() =>
                                    setTab('info')
                                }
                                className={`relative cursor-pointer border-0 bg-transparent px-0 pb-[4px] text-[11px] ${tab === 'info'
                                        ? 'text-ink'
                                        : 'text-ink/40'
                                    }`}
                            >
                                기본 정보

                                {tab === 'info' && (
                                    <span className="absolute right-0 bottom-[-15px] left-0 h-[2px] bg-clay" />
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setTab(
                                        'curation',
                                    )
                                }
                                className={`relative cursor-pointer border-0 bg-transparent px-0 pb-[4px] text-[11px] ${tab ===
                                        'curation'
                                        ? 'text-ink'
                                        : 'text-ink/40'
                                    }`}
                            >
                                큐레이션

                                {tab ===
                                    'curation' && (
                                        <span className="absolute right-0 bottom-[-15px] left-0 h-[2px] bg-clay" />
                                    )}
                            </button>
                        </div>

                        {tab === 'info'
                            ? renderInfo()
                            : renderCuration()}
                    </Panel>
                </div>
            </main>

            {/* 공개 여부 변경 확인 */}
            {pendingPublicState !== null && (
                <dialog
                    open
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-[20px]"
                    aria-modal="true"
                >
                    <div className="w-full max-w-[390px] border border-frame bg-paper p-[26px] shadow-[0_18px_50px_rgba(24,19,15,.18)]">
                        <p className="m-0 text-[8px] tracking-[.18em] text-clay">
                            EDITION VISIBILITY
                        </p>

                        <h2 className="mt-[12px] mb-0 text-[18px] font-semibold">
                            {pendingPublicState
                                ? '에디션을 공개로 전환하시겠습니까?'
                                : '에디션을 비공개로 전환하시겠습니까?'}
                        </h2>

                        <p className="mt-[12px] mb-0 text-[10px] leading-[1.8] text-ink/50">
                            {pendingPublicState
                                ? '공개된 에디션은 커뮤니티에서 다른 사용자에게 노출됩니다.'
                                : '비공개로 변경하면 커뮤니티에서 더 이상 이 에디션이 노출되지 않습니다.'}
                        </p>

                        {visibilityError && (
                            <p
                                className="mt-[10px] mb-0 text-[9px] text-[#8c3b33]"
                                role="alert"
                            >
                                {visibilityError}
                            </p>
                        )}

                        <div className="mt-[24px] grid grid-cols-2 gap-[10px]">
                            <Button
                                variant="secondary"
                                onClick={
                                    handleCancelVisibility
                                }
                                disabled={
                                    visibilityPending
                                }
                            >
                                취소
                            </Button>

                            <Button
                                onClick={
                                    handleConfirmVisibility
                                }
                                disabled={
                                    visibilityPending
                                }
                            >
                                {visibilityPending
                                    ? '변경 중'
                                    : '변경'}
                            </Button>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    )
}