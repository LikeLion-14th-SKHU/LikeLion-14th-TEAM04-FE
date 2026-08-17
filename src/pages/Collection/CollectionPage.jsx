import { useNavigate, useParams } from 'react-router'
import { useEffect, useState } from 'react'

import Header from '../../components/Header'
import Button from '../../components/Button'
import ConfirmModal from '../../components/ConfirmModal'

import AccessorySection from './components/AccessorySection'
import BagSection from './components/BagSection'
import ClothingSection from './components/ClothingSection'

import { editions } from '../../data/editions'
import {
    colorOf,
    loadTheme,
    DEFAULT_THEME,
} from '../../data/collectionTheme'

import { getSharedView } from '../../api/community'
import { getMyCollection } from '../../api/collection'

import { DEMO_PERSON } from '../../data/demoCommunity'

// API에서 내려오는 category를
// 실제 옷장 위치에 맞는 값으로 변환
const bucketOf = (category = '') => {
    if (category.includes('가방')) {
        return 'bag'
    }

    if (
        category.includes('악세') ||
        category.includes('액세')
    ) {
        return 'accessory'
    }

    return 'clothing'
}

export default function CollectionPage() {
    const navigate = useNavigate()
    const { shareToken, userId } = useParams()

    // shareToken, userId 둘 다 없으면 내 컬렉션
    const isMine = !shareToken && !userId

    // demo 공유 컬렉션과
    // /users/:userId/collection 은 아직 목업
    const isMock =
        shareToken === DEMO_PERSON.shareToken || !!userId

    // =========================
    // 내 컬렉션
    // =========================

    const [myEditions, setMyEditions] = useState([])
    const [collectionLoading, setCollectionLoading] =
        useState(false)
    const [collectionError, setCollectionError] =
        useState('')
    const [unauthorized, setUnauthorized] =
        useState(false)

    useEffect(() => {
        if (!isMine) return

        let cancelled = false

        const fetchMyCollection = async () => {
            try {
                setCollectionLoading(true)
                setCollectionError('')
                setUnauthorized(false)

                const data = await getMyCollection({
                    page: 0,
                    size: 100,
                })

                if (cancelled) return

                const mapped = (data?.content ?? []).map(
                    (card) => ({
                        id: card.conceptId,

                        number:
                            card.certificate?.editionNumber ?? '',

                        name:
                            card.certificate?.editionName ?? '',

                        // 최신 에디션 정렬용
                        issuedAt:
                            card.certificate?.issuedAt ?? null,

                        // 화면 표시용
                        createdAt:
                            card.certificate?.issuedAt
                                ?.slice(0, 10)
                                .replaceAll('-', '.') ?? '',

                        // 컬렉션 옷장에서는 grid 이미지 사용
                        images: {
                            transparent: card.gridImageUrl,
                        },

                        // category에 따라
                        // 가방 / 악세사리 / 의류 위치 결정
                        mainCategory: bucketOf(
                            card.certificate?.category,
                        ),

                        // 내 에디션 상세
                        href: `/edition/${card.conceptId}`,
                    }),
                )

                setMyEditions(mapped)
            } catch (error) {
                if (cancelled) return

                console.error(
                    '컬렉션 조회 실패:',
                    error,
                )

                if (error.status === 401) {
                    setUnauthorized(true)
                    setMyEditions([])
                    setCollectionError('')
                    return
                }

                setCollectionError(
                    error.message ??
                    '컬렉션을 불러오지 못했습니다.',
                )
            } finally {
                if (!cancelled) {
                    setCollectionLoading(false)
                }
            }
        }

        fetchMyCollection()

        return () => {
            cancelled = true
        }
    }, [isMine])

    // =========================
    // 다른 사람 공유 컬렉션
    // =========================

    const [shared, setShared] = useState(null)
    const [sharedLoading, setSharedLoading] =
        useState(false)
    const [sharedError, setSharedError] =
        useState('')

    useEffect(() => {
        // shareToken이 없거나 demo 데이터면
        // 실제 API 조회하지 않음
        if (!shareToken || isMock) return

        let cancelled = false

        const fetchSharedCollection = async () => {
            try {
                setSharedLoading(true)
                setSharedError('')

                const data = await getSharedView(
                    shareToken,
                    {
                        page: 0,
                        size: 100,
                    },
                )

                if (cancelled) return

                setShared(data)
            } catch (error) {
                if (cancelled) return

                console.error(
                    '공유 컬렉션 조회 실패:',
                    error,
                )

                setSharedError(
                    error.message ??
                    '컬렉션을 불러오지 못했습니다.',
                )
            } finally {
                if (!cancelled) {
                    setSharedLoading(false)
                }
            }
        }

        fetchSharedCollection()

        return () => {
            cancelled = true
        }
    }, [shareToken, isMock])

    // =========================
    // 공유 버튼
    // 실제 공유 링크 API는 추후 연동
    // =========================

    const [shareOpen, setShareOpen] =
        useState(false)

    // =========================
    // 테마
    // =========================

    const theme = isMine
        ? loadTheme()
        : DEFAULT_THEME

    // =========================
    // 공유 컬렉션 소유자
    // =========================

    const owner = {
        nickname:
            shared?.ownerNickname ??
            (isMock ? DEMO_PERSON.nickname : ''),
    }

    // =========================
    // 공유 컬렉션 데이터 변환
    // =========================

    const sharedEditions = (
        shared?.cards?.content ?? []
    ).map((card) => ({
        id: card.conceptId,

        number:
            card.certificate?.editionNumber ?? '',

        name:
            card.certificate?.editionName ?? '',

        issuedAt:
            card.certificate?.issuedAt ?? null,

        createdAt:
            card.certificate?.issuedAt
                ?.slice(0, 10)
                .replaceAll('-', '.') ?? '',

        images: {
            transparent:
                card.gridImageUrl || card.imageUrl,
        },

        mainCategory: bucketOf(
            card.certificate?.category,
        ),

        // 다른 사람의 에디션은
        // 커뮤니티 상세 페이지로 이동
        href: `/community/edition/${card.conceptId}`,
    }))

    // =========================
    // 실제 화면에서 사용할 데이터
    // =========================

    const items = isMine
        ? myEditions
        : isMock
            ? editions
            : sharedEditions

    // =========================
    // 카테고리별 분류
    // =========================

    const accessoryEditions = items.filter(
        (edition) =>
            edition.mainCategory === 'accessory',
    )

    const bagEditions = items.filter(
        (edition) =>
            edition.mainCategory === 'bag',
    )

    const clothingEditions = items.filter(
        (edition) =>
            edition.mainCategory === 'clothing',
    )

    // =========================
    // 가장 최근 에디션
    // =========================

    const latestEdition = [...items].sort(
        (a, b) =>
            new Date(b.issuedAt ?? 0) -
            new Date(a.issuedAt ?? 0),
    )[0]

    const loading =
        (isMine && collectionLoading) ||
        (!isMine && !isMock && sharedLoading)

    return (
        <>
            <Header />

            <main className="min-h-[100dvh] w-full">
                <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[48px] pb-[42px] max-[860px]:px-[22px] max-[860px]:pt-[28px]">

                    {/* =========================
                        로딩
                    ========================= */}
                    {loading && (
                        <p className="m-0 py-[56px] text-center text-[12px] text-muted">
                            컬렉션을 불러오는 중입니다.
                        </p>
                    )}

                    {/* =========================
                        비로그인
                        내 컬렉션 접근 시에만 표시
                    ========================= */}
                    {isMine &&
                        !collectionLoading &&
                        unauthorized && (
                            <>
                                <div className="mb-[24px]">
                                    <h1 className="m-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em] break-keep">
                                        {theme.title}
                                    </h1>

                                    <p className="mt-[12px] mb-0 text-[13px] leading-[1.7] text-ink/60">
                                        추억을 담은 에디션을 나만의 컬렉션에서 확인하세요.
                                    </p>
                                </div>

                                <section
                                    className="flex min-h-[300px] flex-col items-center justify-center border border-frame bg-white px-[24px] py-[56px] text-center"
                                    aria-labelledby="login-required-heading"
                                >
                                    <div className="flex size-[54px] items-center justify-center rounded-full bg-[#f4ede2]">
                                        <svg
                                            className="size-[22px] text-ink/60"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.4"
                                            aria-hidden="true"
                                        >
                                            <circle
                                                cx="12"
                                                cy="8"
                                                r="4"
                                            />

                                            <path
                                                d="M4.5 21c.7-4.3 3.2-6.5 7.5-6.5s6.8 2.2 7.5 6.5"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </div>

                                    <h2
                                        className="mt-[18px] mb-0 text-[18px] font-semibold"
                                        id="login-required-heading"
                                    >
                                        로그인이 필요한 페이지입니다.
                                    </h2>

                                    <p className="mt-[10px] mb-0 text-[12.5px] leading-[20px] break-keep text-ink/55">
                                        로그인하거나 회원가입 후
                                        <br />
                                        컬렉션을 이용해보세요.
                                    </p>

                                    <div className="mt-[24px]">
                                        <Button
                                            onClick={() =>
                                                navigate('/login')
                                            }
                                        >
                                            로그인 / 회원가입 하러가기
                                        </Button>
                                    </div>
                                </section>
                            </>
                        )}

                    {/* =========================
                        내 컬렉션 서버 오류
                    ========================= */}
                    {isMine &&
                        !collectionLoading &&
                        !unauthorized &&
                        collectionError && (
                            <>
                                <div className="mb-[24px]">
                                    <h1 className="m-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em] break-keep">
                                        {theme.title}
                                    </h1>

                                    <p className="mt-[12px] mb-0 text-[13px] leading-[1.7] text-ink/60">
                                        추억을 담은 에디션을 나만의 컬렉션에서 확인하세요.
                                    </p>
                                </div>

                                <div
                                    className="flex min-h-[220px] flex-col items-center justify-center border border-frame bg-white px-[24px] text-center"
                                    role="alert"
                                >
                                    <p className="m-0 text-[13px] text-cognac">
                                        {collectionError}
                                    </p>

                                    <button
                                        className="mt-[14px] cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#5b4130] underline"
                                        type="button"
                                        onClick={() =>
                                            window.location.reload()
                                        }
                                    >
                                        다시 시도
                                    </button>
                                </div>
                            </>
                        )}

                    {/* =========================
                        공유 컬렉션 서버 오류
                    ========================= */}
                    {!isMine &&
                        !isMock &&
                        !sharedLoading &&
                        sharedError && (
                            <div
                                className="flex min-h-[220px] flex-col items-center justify-center border border-frame bg-white px-[24px] text-center"
                                role="alert"
                            >
                                <p className="m-0 text-[13px] text-cognac">
                                    {sharedError}
                                </p>

                                <button
                                    className="mt-[14px] cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#5b4130] underline"
                                    type="button"
                                    onClick={() =>
                                        window.location.reload()
                                    }
                                >
                                    다시 시도
                                </button>
                            </div>
                        )}

                    {/* =========================
                        정상 컬렉션
                    ========================= */}
                    {!loading &&
                        !unauthorized &&
                        !collectionError &&
                        !sharedError && (
                            <>
                                <div className="flex items-end justify-between gap-[24px] max-[860px]:flex-col max-[860px]:items-stretch">
                                    <div>
                                        <h1 className="m-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em] break-keep">
                                            {isMine
                                                ? theme.title
                                                : `${owner.nickname}의 컬렉션`}
                                        </h1>

                                        <p className="mt-[12px] mb-0 text-[13px] leading-[1.7] text-ink/60">
                                            {isMine
                                                ? '추억을 담은 에디션을 나만의 컬렉션에서 확인하세요.'
                                                : `${owner.nickname}님의 추억이 담긴 에디션을 확인해보세요.`}
                                        </p>
                                    </div>

                                    {/* 내 컬렉션에서만 생성 / 테마 변경 */}
                                    {isMine && (
                                        <div className="flex gap-[10px] max-[540px]:flex-col">
                                            <Button href="/edition/create">
                                                + 새 에디션 만들기
                                            </Button>

                                            <Button
                                                href="/collection/theme"
                                                variant="secondary"
                                            >
                                                테마 변경
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <section
                                    className="mt-[24px] border border-[rgba(24,19,15,.12)] p-[20px] shadow-[0_14px_30px_rgba(44,26,15,.12)]"
                                    style={{
                                        backgroundColor:
                                            colorOf(theme.color).hex,
                                    }}
                                >
                                    <div className="grid grid-cols-[200px_minmax(0,1fr)_165px] items-stretch gap-[14px] max-[1050px]:grid-cols-[180px_minmax(0,1fr)] max-[760px]:grid-cols-1">

                                        {/* 악세사리 */}
                                        <AccessorySection
                                            items={accessoryEditions}
                                        />

                                        <div className="flex min-w-0 flex-col">

                                            {/* 가방 */}
                                            <BagSection
                                                items={bagEditions}
                                            />

                                            {/* 의류 */}
                                            <ClothingSection
                                                items={clothingEditions}
                                            />
                                        </div>

                                        {/* 오른쪽 정보 영역 */}
                                        <aside className="border border-frame bg-[#f8f1e5] p-[14px] max-[1050px]:col-span-2 max-[760px]:col-span-1">

                                            <div className="flex flex-col items-center border-b border-[#d9c9b7] pb-[14px] text-center">
                                                <img
                                                    src="/assets/logo.png"
                                                    alt=""
                                                    className="h-[36px] w-auto"
                                                />

                                                <p className="mt-[8px] mb-0 text-[7px] tracking-[.26em] text-ink/50">
                                                    {isMine
                                                        ? 'MY COLLECTION'
                                                        : 'COLLECTION'}
                                                </p>
                                            </div>

                                            {/* 전체 에디션 수 */}
                                            <div className="border-b border-[#d9c9b7] py-[15px]">
                                                <p className="m-0 text-[7px] tracking-[.16em] text-ink/45">
                                                    TOTAL EDITIONS
                                                </p>

                                                <p className="mt-[5px] mb-0 font-brand text-[25px]">
                                                    {isMine
                                                        ? myEditions.length
                                                        : shared?.cards
                                                            ?.totalElements ??
                                                        items.length}
                                                </p>
                                            </div>

                                            {/* 가장 최근 에디션 */}
                                            <div className="border-b border-[#d9c9b7] py-[15px]">
                                                <p className="m-0 text-[7px] tracking-[.16em] text-ink/45">
                                                    LATEST EDITION
                                                </p>

                                                {latestEdition ? (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            navigate(
                                                                latestEdition.href,
                                                            )
                                                        }
                                                        className="group mt-[10px] block w-full cursor-pointer border-0 bg-transparent p-0 text-left"
                                                        aria-label={`${latestEdition.name} 상세 보기`}
                                                    >
                                                        <div className="flex h-[90px] items-center justify-center bg-[#cdbb9f] transition-colors duration-700 ease-film group-hover:bg-white">
                                                            {latestEdition
                                                                .images
                                                                ?.transparent ? (
                                                                <img
                                                                    src={
                                                                        latestEdition
                                                                            .images
                                                                            .transparent
                                                                    }
                                                                    alt={
                                                                        latestEdition.name
                                                                    }
                                                                    className="h-[90%] w-[90%] object-contain transition-transform duration-700 ease-film group-hover:scale-[1.04]"
                                                                />
                                                            ) : (
                                                                <span className="text-[7px] text-ink/35">
                                                                    IMAGE
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="mt-[9px] mb-0 text-[11px] font-medium text-ink">
                                                            No.{' '}
                                                            {
                                                                latestEdition.number
                                                            }
                                                        </p>

                                                        <p className="mt-[3px] mb-0 truncate text-[8px] text-ink/45">
                                                            {
                                                                latestEdition.name
                                                            }
                                                        </p>

                                                        <p className="mt-[3px] mb-0 text-[7px] text-ink/35">
                                                            {
                                                                latestEdition.createdAt
                                                            }
                                                        </p>
                                                    </button>
                                                ) : (
                                                    <div className="mt-[10px]">
                                                        <div className="flex h-[90px] items-center justify-center bg-[#cdbb9f]">
                                                            <span className="text-[7px] text-ink/35">
                                                                IMAGE
                                                            </span>
                                                        </div>

                                                        <p className="mt-[9px] mb-0 text-[8px] leading-[1.5] text-ink/35">
                                                            아직 생성된 에디션이 없습니다.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* 공유 기능 - 추후 API 연동 */}
                                            {isMine && (
                                                <button
                                                    type="button"
                                                    className="mt-[13px] flex h-[46px] w-full cursor-pointer items-center justify-center border border-[#d9c9b7] bg-[#efe4d2] px-[4px] text-center text-[6.5px] leading-[1.7] tracking-[.15em] text-ink/55 transition-colors duration-700 ease-film hover:bg-white hover:text-ink"
                                                    onClick={() =>
                                                        setShareOpen(true)
                                                    }
                                                >
                                                    SHARE YOUR
                                                    <br />
                                                    COLLECTION
                                                </button>
                                            )}
                                        </aside>
                                    </div>
                                </section>

                                <div className="mt-[18px] flex items-center justify-between gap-[20px] text-[8px] tracking-[.16em] text-ink/45">
                                    <span>
                                        {isMine
                                            ? '추억을 연결한 나만의 에디션 컬렉션'
                                            : `${owner.nickname}님의 에디션 컬렉션`}
                                    </span>

                                    <span>
                                        MEMORY ATELIER
                                    </span>
                                </div>
                            </>
                        )}
                </div>
            </main>

            {/* 컬렉션 공유 기능 - 추후 API 연동 */}
            <ConfirmModal
                open={shareOpen}
                title="컬렉션 공유"
                description="컬렉션 링크 공유 기능은 추후 연동 예정입니다."
                confirmText="확인"
                cancelText={null}
                onConfirm={() => setShareOpen(false)}
                onClose={() => setShareOpen(false)}
            />
        </>
    )
}