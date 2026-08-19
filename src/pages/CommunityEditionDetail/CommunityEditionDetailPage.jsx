import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import Header from '../../components/Header'
import Button from '../../components/Button'
import EditionViewer from '../../components/EditionViewer'

import {
    getCommunityEdition,
    getPublicCollections,
    getLikeStatus,
    likeEdition,
    unlikeEdition,
} from '../../api/community'

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

export default function CommunityEditionDetailPage() {
    const navigate = useNavigate()
    const { conceptId } = useParams()

    const numericConceptId = Number(conceptId)

    const [edition, setEdition] = useState(null)

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    // 좋아요
    const [likes, setLikes] = useState(0)
    const [liked, setLiked] = useState(false)
    const [likeLoading, setLikeLoading] = useState(true)
    const [likePending, setLikePending] = useState(false)
    const [collectionPending, setCollectionPending] = useState(false)

    // =========================
    // 공개 에디션 상세 조회
    // =========================
    useEffect(() => {
        if (!numericConceptId) {
            setLoading(false)
            setError('잘못된 에디션입니다.')
            return
        }

        let cancelled = false

        const loadEdition = async () => {
            setLoading(true)
            setError('')

            try {
                const data = await getCommunityEdition(
                    numericConceptId,
                )

                if (cancelled) return

                setEdition(data)
                setLikes(data?.likeCount ?? 0)
            } catch (error) {
                if (cancelled) return

                console.error(
                    '공개 에디션 상세 조회 실패:',
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
    // 좋아요 상태 조회
    // =========================
    useEffect(() => {
        if (!numericConceptId) {
            setLikeLoading(false)
            return
        }

        let cancelled = false

        const loadLikeStatus = async () => {
            setLikeLoading(true)

            try {
                const data = await getLikeStatus(
                    numericConceptId,
                )

                if (cancelled) return

                setLikes(data?.likeCount ?? 0)
                setLiked(data?.likedByMe ?? false)
            } catch (error) {
                if (cancelled) return

                console.error(
                    '좋아요 상태 조회 실패:',
                    error,
                )

                // 좋아요 조회 API는 비로그인 상태에서도
                // likeCount는 내려오고 likedByMe는 false지만,
                // 혹시 요청 자체가 실패하더라도
                // 공개 상세 API에서 받은 likeCount는 유지한다.
            } finally {
                if (!cancelled) {
                    setLikeLoading(false)
                }
            }
        }

        loadLikeStatus()

        return () => {
            cancelled = true
        }
    }, [numericConceptId])

    // =========================
    // 좋아요 등록 / 취소
    // =========================
    const handleLike = async () => {
        if (
            !numericConceptId ||
            likeLoading ||
            likePending
        ) {
            return
        }

        setLikePending(true)

        try {
            if (liked) {
                await unlikeEdition(
                    numericConceptId,
                )
            } else {
                await likeEdition(
                    numericConceptId,
                )
            }

            // 변경 후 서버 값 다시 조회
            const data = await getLikeStatus(
                numericConceptId,
            )

            setLikes(data?.likeCount ?? 0)
            setLiked(data?.likedByMe ?? false)
        } catch (error) {
            console.error(
                '좋아요 변경 실패:',
                error,
            )

            alert(
                error.message ??
                '좋아요 처리에 실패했습니다.',
            )
        } finally {
            setLikePending(false)
        }
    }

    // =========================
    // 공유
    // =========================
    const handleShare = async () => {
        const shareData = {
            title:
                edition?.certificate?.editionName ??
                'Memory Atelier Edition',

            text: `${edition?.ownerNickname ?? '사용자'
                }의 에디션`,

            url: window.location.href,
        }

        try {
            if (navigator.share) {
                await navigator.share(shareData)
                return
            }

            await navigator.clipboard.writeText(
                window.location.href,
            )

            alert(
                '에디션 링크가 복사되었습니다.',
            )
        } catch (error) {
            // 공유창을 사용자가 닫은 경우는
            // 별도 오류 메시지를 표시하지 않음
            if (error?.name !== 'AbortError') {
                console.error(
                    '에디션 공유 실패:',
                    error,
                )
            }
        }
    }

    const handleViewCollection = async () => {
        if (collectionPending) return

        setCollectionPending(true)

        try {
            const data = await getPublicCollections({
                nickname: edition.ownerNickname,
                size: 100,
            })
            const owner = data?.content?.find(
                ({ userId }) => Number(userId) === Number(edition.ownerId),
            )

            if (!owner?.shareToken) {
                throw new Error('공개된 컬렉션을 찾을 수 없습니다.')
            }

            navigate(`/community/collection/${owner.shareToken}`)
        } catch (caught) {
            alert(caught.message ?? '컬렉션을 불러오지 못했습니다.')
        } finally {
            setCollectionPending(false)
        }
    }

    // =========================
    // 로딩
    // =========================
    if (loading) {
        return (
            <>
                <Header />

                <main className="min-h-[100dvh] w-full">
                    <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[40px] pb-[48px] max-[860px]:px-[22px] max-[860px]:pt-[28px]">
                        <div className="flex min-h-[320px] items-center justify-center bg-[#f6f0e6]">
                            <p className="m-0 text-[12px] text-ink/55">
                                에디션을 불러오는 중입니다.
                            </p>
                        </div>
                    </div>
                </main>
            </>
        )
    }

    // =========================
    // 에러
    // =========================
    if (error || !edition) {
        return (
            <>
                <Header />

                <main className="min-h-[100dvh] w-full">
                    <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[40px] pb-[48px] max-[860px]:px-[22px] max-[860px]:pt-[28px]">
                        <div className="flex min-h-[320px] items-center justify-center bg-[#f6f0e6] px-[24px] text-center">
                            <p className="m-0 text-[13px] text-[#7d4526]">
                                {error ||
                                    '에디션을 찾을 수 없습니다.'}
                            </p>
                        </div>
                    </div>
                </main>
            </>
        )
    }

    const certificate =
        edition.certificate ?? {}

    const ownerNickname =
        edition.ownerNickname || '사용자'

    return (
        <>
            <Header />

            <main className="min-h-[100dvh] w-full">
                <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[40px] pb-[48px] max-[860px]:px-[22px] max-[860px]:pt-[28px]">

                    {/* =========================
                        페이지 제목
                    ========================= */}
                    <div className="border-b border-[rgba(23,18,14,.22)] pb-[14px]">
                        <h1 className="m-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em] break-keep">
                            {ownerNickname}의 에디션
                        </h1>
                    </div>

                    {/* =========================
                        에디션 상세
                    ========================= */}
                    <section className="mt-[28px]">
                        <div className="grid grid-cols-[400px_minmax(0,1fr)] gap-[36px] max-[900px]:grid-cols-1">

                            {/* =====================
                                왼쪽
                            ====================== */}
                            <div>

                                {/* 에디션 3D / 2D 대체 */}
                                <EditionViewer
                                    modelUrl={edition.modelUrl}
                                    imageUrl={edition.gridImageUrl || edition.imageUrl}
                                    alt={certificate.editionName || '에디션'}
                                />

                                {/* 좋아요 수 */}
                                <div className="mt-[12px] flex items-center gap-[6px] text-[10px] text-ink/55">
                                    <span
                                        className={
                                            liked
                                                ? 'text-[14px]'
                                                : 'text-[14px]'
                                        }
                                    >
                                        {liked
                                            ? '♥'
                                            : '♡'}
                                    </span>

                                    <span>
                                        좋아요 {likes}개
                                    </span>
                                </div>

                                {/* 사용자 프로필 */}
                                <div className="mt-[18px] flex items-center justify-between gap-[16px] bg-[#f6f0e6] px-[20px] py-[18px]">
                                    <div className="flex min-w-0 items-center gap-[14px]">
                                        {edition.ownerProfileImageUrl ? (
                                            <img
                                                src={edition.ownerProfileImageUrl}
                                                alt={`${ownerNickname} 프로필`}
                                                className="size-[44px] shrink-0 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex size-[44px] shrink-0 items-center justify-center rounded-full bg-[#d6cec4] text-[13px] font-semibold text-ink/55">
                                                {ownerNickname
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </div>
                                        )}

                                        <p className="m-0 truncate text-[12px] font-medium">
                                            {ownerNickname}
                                        </p>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="h-[28px] shrink-0 px-[9px] text-[8px]"
                                        disabled={collectionPending}
                                        onClick={handleViewCollection}
                                    >
                                        {collectionPending
                                            ? '불러오는 중...'
                                            : '컬렉션 보러가기'}
                                    </Button>
                                </div>
                            </div>

                            {/* =====================
                                오른쪽
                            ====================== */}
                            <div>

                                {/* 에디션 이름 */}
                                <div>
                                    <p className="m-0 text-[8px] tracking-[.18em] text-ink/45">
                                        MEMORY EDITION
                                    </p>

                                    <h2 className="mt-[8px] mb-0 text-[28px] leading-[1.2] font-semibold tracking-[-.02em] break-keep">
                                        {certificate.editionName ||
                                            '-'}
                                    </h2>

                                    <p className="mt-[6px] mb-0 text-[11px] text-ink/55">
                                        Edition No.{' '}
                                        {certificate.editionNumber ||
                                            '-'}
                                    </p>
                                </div>

                                {/* =====================
                                    기본 정보
                                ====================== */}
                                <div className="mt-[24px] bg-[#f6f0e6] p-[22px]">

                                    {/* 생성 날짜 */}
                                    <div>
                                        <p className="m-0 text-[10px] font-medium">
                                            생성 날짜
                                        </p>

                                        <p className="mt-[6px] mb-0 text-[10.5px] text-ink/55">
                                            {formatDate(
                                                certificate.issuedAt,
                                            )}
                                        </p>
                                    </div>

                                    {/* 추억 스토리 */}
                                    <div className="mt-[20px] border-t border-line pt-[18px]">
                                        <p className="m-0 text-[10px] font-medium">
                                            추억 스토리
                                        </p>

                                        <p className="mt-[8px] mb-0 text-[11.5px] leading-[1.85] text-ink/65 break-keep">
                                            {certificate.story ||
                                                '-'}
                                        </p>
                                    </div>

                                    {/* 카테고리 */}
                                    {certificate.category && (
                                        <div className="mt-[20px] border-t border-line pt-[18px]">
                                            <p className="m-0 text-[10px] font-medium">
                                                카테고리
                                            </p>

                                            <p className="mt-[6px] mb-0 text-[10.5px] text-ink/55">
                                                {
                                                    certificate.category
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* =====================
                                    좋아요 / 공유
                                ====================== */}
                                <div className="mt-[20px] grid grid-cols-2 gap-[10px]">

                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={
                                            handleLike
                                        }
                                        disabled={
                                            likeLoading ||
                                            likePending
                                        }
                                        className="w-full"
                                    >
                                        {likePending
                                            ? '처리 중'
                                            : liked
                                                ? `♥ 좋아요 ${likes}`
                                                : `♡ 좋아요 ${likes}`}
                                    </Button>

                                    <Button
                                        type="button"
                                        onClick={
                                            handleShare
                                        }
                                        className="w-full"
                                    >
                                        ↗ 공유하기
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </>
    )
}
