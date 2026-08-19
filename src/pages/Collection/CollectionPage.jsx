import {
    useEffect,
    useState,
} from 'react'

import {
    useNavigate,
    useParams,
} from 'react-router'

import Header from '../../components/Header'
import Button from '../../components/Button'
import ConfirmModal from '../../components/ConfirmModal'

import AccessorySection from './components/AccessorySection'
import BagSection from './components/BagSection'
import ClothingSection from './components/ClothingSection'
import { bucketOf } from './categoryBucket'

import { editions } from '../../data/editions'

import {
    colorOf,
    DEFAULT_THEME,
} from '../../data/collectionTheme'

import {
    getSharedView,
} from '../../api/community'

import {
    getMyCollection,
} from '../../api/collection'

import {
    getMe,
    useMe,
} from '../../api/user'

import {
    DEMO_PERSON,
} from '../../data/demoCommunity'

// 백엔드 테마 enum → 프론트 컬러 value
const API_THEME_VALUES = {
    WHITE: 'white',
    IVORY: 'ivory',
    BUTTER: 'butter',
    OLIVE_CREAM: 'olive',
    DUSTY_ROSE: 'rose',
    LIGHT_MOCHA: 'mocha',
}

export default function CollectionPage() {
    const navigate = useNavigate()

    const {
        shareToken,
        userId,
    } = useParams()

    const me = useMe()

    const isMine =
        !shareToken && !userId

    const isMock =
        shareToken ===
        DEMO_PERSON.shareToken ||
        !!userId

    // =========================
    // 내 정보
    // =========================

    useEffect(() => {
        if (!isMine) return

        let cancelled = false

        const fetchMe = async () => {
            try {
                await getMe()
            } catch (error) {
                if (cancelled) return

                console.error(
                    '내 정보 조회 실패:',
                    error,
                )
            }
        }

        fetchMe()

        return () => {
            cancelled = true
        }
    }, [isMine])

    // =========================
    // 내 컬렉션
    // =========================

    const [
        myEditions,
        setMyEditions,
    ] = useState([])

    const [
        myEditionTotal,
        setMyEditionTotal,
    ] = useState(0)

    const [
        collectionLoading,
        setCollectionLoading,
    ] = useState(false)

    const [
        collectionError,
        setCollectionError,
    ] = useState('')

    const [
        unauthorized,
        setUnauthorized,
    ] = useState(false)

    useEffect(() => {
        if (!isMine) return

        let cancelled = false

        const fetchMyCollection =
            async () => {
                try {
                    setCollectionLoading(
                        true,
                    )

                    setCollectionError('')
                    setUnauthorized(false)

                    const data =
                        await getMyCollection({
                            page: 0,
                            size: 100,
                        })

                    if (cancelled) return

                    const mapped = (
                        data?.content ?? []
                    ).map((card) => ({
                        id:
                            card.conceptId,

                        number:
                            card
                                .certificate
                                ?.editionNumber ??
                            '',

                        name:
                            card
                                .certificate
                                ?.editionName ??
                            '',

                        issuedAt:
                            card
                                .certificate
                                ?.issuedAt ??
                            null,

                        createdAt:
                            card.certificate
                                ?.issuedAt
                                ?.slice(
                                    0,
                                    10,
                                )
                                .replaceAll(
                                    '-',
                                    '.',
                                ) ??
                            '',

                        images: {
                            transparent:
                                card.gridImageUrl ||
                                card.imageUrl,
                        },

                        mainCategory:
                            bucketOf(
                                card
                                    .certificate
                                    ?.category,
                            ),

                        href: `/edition/${card.conceptId}`,
                    }))

                    setMyEditions(
                        mapped,
                    )

                    setMyEditionTotal(
                        data?.totalElements ??
                        mapped.length,
                    )
                } catch (error) {
                    if (cancelled)
                        return

                    console.error(
                        '컬렉션 조회 실패:',
                        error,
                    )

                    if (
                        error.status ===
                        401
                    ) {
                        setUnauthorized(
                            true,
                        )

                        setMyEditions(
                            [],
                        )

                        setMyEditionTotal(
                            0,
                        )

                        setCollectionError(
                            '',
                        )

                        return
                    }

                    setCollectionError(
                        error.message ??
                        '컬렉션을 불러오지 못했습니다.',
                    )
                } finally {
                    if (!cancelled) {
                        setCollectionLoading(
                            false,
                        )
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

    const [
        shared,
        setShared,
    ] = useState(null)

    const [
        sharedLoading,
        setSharedLoading,
    ] = useState(false)

    const [
        sharedError,
        setSharedError,
    ] = useState('')

    useEffect(() => {
        if (
            !shareToken ||
            isMock
        ) {
            return
        }

        let cancelled = false

        const fetchSharedCollection =
            async () => {
                try {
                    setSharedLoading(
                        true,
                    )

                    setSharedError('')

                    const data =
                        await getSharedView(
                            shareToken,
                            {
                                page: 0,
                                size: 100,
                            },
                        )

                    if (cancelled) return

                    setShared(data)
                } catch (error) {
                    if (cancelled)
                        return

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
                        setSharedLoading(
                            false,
                        )
                    }
                }
            }

        fetchSharedCollection()

        return () => {
            cancelled = true
        }
    }, [
        shareToken,
        isMock,
    ])

    // =========================
    // 공유 기능
    // =========================

    const [
        shareOpen,
        setShareOpen,
    ] = useState(false)

    // =========================
    // 컬렉션 이름 + 테마
    // =========================

    const theme = isMine
        ? {
            title:
                me?.collectionName ||
                DEFAULT_THEME.title,

            color:
                API_THEME_VALUES[
                me?.collectionTheme
                ] ||
                DEFAULT_THEME.color,
        }
        : DEFAULT_THEME

    const collectionColor =
        colorOf(theme.color)

    // =========================
    // 공유 컬렉션 사용자
    // =========================

    const owner = {
        nickname:
            shared?.ownerNickname ??
            (isMock
                ? DEMO_PERSON.nickname
                : ''),
    }

    // =========================
    // 공유 컬렉션 데이터
    // =========================

    const sharedEditions = (
        shared?.cards?.content ?? []
    ).map((card) => ({
        id: card.conceptId,

        number:
            card.certificate
                ?.editionNumber ?? '',

        name:
            card.certificate
                ?.editionName ?? '',

        issuedAt:
            card.certificate
                ?.issuedAt ?? null,

        createdAt:
            card.certificate
                ?.issuedAt
                ?.slice(0, 10)
                .replaceAll(
                    '-',
                    '.',
                ) ?? '',

        images: {
            transparent:
                card.gridImageUrl ||
                card.imageUrl,
        },

        mainCategory: bucketOf(
            card.certificate?.category,
        ),

        href: `/community/edition/${card.conceptId}`,
    }))

    const items = isMine
        ? myEditions
        : isMock
            ? editions
            : sharedEditions

    const accessoryEditions =
        items.filter(
            (edition) =>
                edition.mainCategory ===
                'accessory',
        )

    const bagEditions =
        items.filter(
            (edition) =>
                edition.mainCategory ===
                'bag',
        )

    const clothingEditions =
        items.filter(
            (edition) =>
                edition.mainCategory ===
                'clothing',
        )

    const latestEdition = [
        ...items,
    ].sort(
        (a, b) =>
            new Date(
                b.issuedAt ?? 0,
            ) -
            new Date(
                a.issuedAt ?? 0,
            ),
    )[0]

    const loading =
        (isMine &&
            collectionLoading) ||
        (!isMine &&
            !isMock &&
            sharedLoading)

    return (
        <>
            <Header />

            <main className="min-h-[100dvh] w-full">
                <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[48px] pb-[42px] max-[860px]:px-[22px] max-[860px]:pt-[28px]">

                    {loading && (
                        <p className="m-0 py-[56px] text-center text-[12px] text-muted">
                            컬렉션을
                            불러오는
                            중입니다.
                        </p>
                    )}

                    {/* 비로그인 */}
                    {isMine &&
                        !collectionLoading &&
                        unauthorized && (
                            <>
                                <div className="mb-[24px]">
                                    <h1 className="m-0 text-[30px] leading-[1.2] font-semibold tracking-[-.04em] break-keep">
                                        {
                                            theme.title
                                        }
                                    </h1>

                                    <p className="mt-[12px] mb-0 text-[13px] leading-[1.7] text-ink/60">
                                        추억을
                                        담은
                                        에디션을
                                        나만의
                                        컬렉션에서
                                        확인하세요.
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
                                        로그인이
                                        필요한
                                        페이지입니다.
                                    </h2>

                                    <p className="mt-[10px] mb-0 text-[12.5px] leading-[20px] break-keep text-ink/55">
                                        로그인하거나
                                        회원가입 후
                                        <br />
                                        컬렉션을
                                        이용해보세요.
                                    </p>

                                    <div className="mt-[24px]">
                                        <Button
                                            onClick={() =>
                                                navigate(
                                                    '/',
                                                )
                                            }
                                        >
                                            로그인
                                            /
                                            회원가입
                                            하러가기
                                        </Button>
                                    </div>
                                </section>
                            </>
                        )}

                    {/* 내 컬렉션 오류 */}
                    {isMine &&
                        !collectionLoading &&
                        !unauthorized &&
                        collectionError && (
                            <div
                                className="flex min-h-[220px] flex-col items-center justify-center border border-frame bg-white px-[24px] text-center"
                                role="alert"
                            >
                                <p className="m-0 text-[13px] text-cognac">
                                    {
                                        collectionError
                                    }
                                </p>

                                <button
                                    className="mt-[14px] cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#5b4130] underline"
                                    type="button"
                                    onClick={() =>
                                        window.location.reload()
                                    }
                                >
                                    다시
                                    시도
                                </button>
                            </div>
                        )}

                    {/* 공유 컬렉션 오류 */}
                    {!isMine &&
                        !isMock &&
                        !sharedLoading &&
                        sharedError && (
                            <div
                                className="flex min-h-[220px] flex-col items-center justify-center border border-frame bg-white px-[24px] text-center"
                                role="alert"
                            >
                                <p className="m-0 text-[13px] text-cognac">
                                    {
                                        sharedError
                                    }
                                </p>

                                <button
                                    className="mt-[14px] cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#5b4130] underline"
                                    type="button"
                                    onClick={() =>
                                        window.location.reload()
                                    }
                                >
                                    다시
                                    시도
                                </button>
                            </div>
                        )}

                    {/* 정상 컬렉션 */}
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

                                    {isMine && (
                                        <div className="flex gap-[10px] max-[540px]:flex-col">
                                            <Button href="/edition/create">
                                                +
                                                새
                                                에디션
                                                만들기
                                            </Button>

                                            <Button
                                                href="/collection/theme"
                                                variant="secondary"
                                            >
                                                테마
                                                변경
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <section
                                    className="mt-[24px] border p-[20px] shadow-[0_14px_30px_rgba(44,26,15,.12)]"
                                    style={{
                                        backgroundColor:
                                            collectionColor.cabinet,
                                        borderColor:
                                            collectionColor.border,
                                    }}
                                >
                                    <div className="grid grid-cols-[200px_minmax(0,1fr)_165px] items-stretch gap-[14px] max-[1050px]:grid-cols-[180px_minmax(0,1fr)] max-[760px]:grid-cols-1">

                                        <AccessorySection
                                            items={
                                                accessoryEditions
                                            }
                                            theme={
                                                collectionColor
                                            }
                                        />

                                        <div className="flex min-w-0 flex-col">
                                            <BagSection
                                                items={
                                                    bagEditions
                                                }
                                                theme={
                                                    collectionColor
                                                }
                                            />

                                            <ClothingSection
                                                items={
                                                    clothingEditions
                                                }
                                                theme={
                                                    collectionColor
                                                }
                                            />
                                        </div>

                                        <aside
                                            className="border p-[14px] max-[1050px]:col-span-2 max-[760px]:col-span-1"
                                            style={{
                                                backgroundColor:
                                                    collectionColor.side,
                                                borderColor:
                                                    collectionColor.border,
                                            }}
                                        >
                                            <div
                                                className="flex flex-col items-center border-b pb-[14px] text-center"
                                                style={{
                                                    borderColor:
                                                        collectionColor.border,
                                                }}
                                            >
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

                                            <div
                                                className="border-b py-[15px]"
                                                style={{
                                                    borderColor:
                                                        collectionColor.border,
                                                }}
                                            >
                                                <p className="m-0 text-[7px] tracking-[.16em] text-ink/45">
                                                    TOTAL
                                                    EDITIONS
                                                </p>

                                                <p className="mt-[5px] mb-0 font-brand text-[25px]">
                                                    {isMine
                                                        ? myEditionTotal
                                                        : shared
                                                            ?.cards
                                                            ?.totalElements ??
                                                        items.length}
                                                </p>
                                            </div>

                                            <div
                                                className="border-b py-[15px]"
                                                style={{
                                                    borderColor:
                                                        collectionColor.border,
                                                }}
                                            >
                                                <p className="m-0 text-[7px] tracking-[.16em] text-ink/45">
                                                    LATEST
                                                    EDITION
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
                                                    >
                                                        <div
                                                            className="flex h-[90px] items-center justify-center transition-opacity duration-700 ease-film group-hover:opacity-80"
                                                            style={{
                                                                backgroundColor:
                                                                    collectionColor.slot,
                                                            }}
                                                        >
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

                                                        <p className="mt-[9px] mb-0 text-[11px] font-medium">
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
                                                        <div
                                                            className="flex h-[90px] items-center justify-center"
                                                            style={{
                                                                backgroundColor:
                                                                    collectionColor.slot,
                                                            }}
                                                        >
                                                            <span className="text-[7px] text-ink/35">
                                                                IMAGE
                                                            </span>
                                                        </div>

                                                        <p className="mt-[9px] mb-0 text-[8px] text-ink/35">
                                                            아직
                                                            생성된
                                                            에디션이
                                                            없습니다.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            {isMine && (
                                                <button
                                                    type="button"
                                                    className="mt-[13px] flex h-[46px] w-full cursor-pointer items-center justify-center border bg-transparent px-[4px] text-center text-[6.5px] leading-[1.7] tracking-[.15em] text-ink/55 transition-opacity duration-700 ease-film hover:opacity-70"
                                                    style={{
                                                        backgroundColor:
                                                            collectionColor.drawer,
                                                        borderColor:
                                                            collectionColor.border,
                                                    }}
                                                    onClick={() =>
                                                        setShareOpen(
                                                            true,
                                                        )
                                                    }
                                                >
                                                    SHARE
                                                    YOUR
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
                                        MEMORY
                                        ATELIER
                                    </span>
                                </div>
                            </>
                        )}
                </div>
            </main>

            <ConfirmModal
                open={shareOpen}
                title="컬렉션 공유"
                description="컬렉션 링크 공유 기능은 추후 연동 예정입니다."
                confirmText="확인"
                cancelText={null}
                onConfirm={() =>
                    setShareOpen(false)
                }
                onClose={() =>
                    setShareOpen(false)
                }
            />
        </>
    )
}
