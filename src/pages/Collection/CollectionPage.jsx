import { useParams } from 'react-router'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Button from '../../components/Button'

import AccessorySection from './components/AccessorySection'
import BagSection from './components/BagSection'
import ClothingSection from './components/ClothingSection'

import { editions } from '../../data/editions'
import { colorOf, loadTheme, DEFAULT_THEME } from '../../data/collectionTheme'
import { getMyPublicSettings, updateCollectionVisibility } from '../../api/publicSettings'
import { getSharedView } from '../../api/community'
import { DEMO_PERSON } from '../../data/demoCommunity'

// 공유 카드에는 대분류가 따로 안 오고 보증서의 카테고리 문자열만 온다.
// ponytail: 모르는 값은 의류 칸으로 보낸다 — 카드가 사라지는 쪽이 더 나쁘다
const bucketOf = (category = '') =>
    category.includes('가방')
        ? 'bag'
        : category.includes('악세')
            ? 'accessory'
            : 'clothing'

export default function CollectionPage() {
    const { shareToken, userId } = useParams()

    // 둘 다 없으면 내 컬렉션
    const isMine = !shareToken && !userId

    // 가상 진열장(demo)과 /users/:userId/collection 은 아직 목업을 그대로 보여준다
    const isMock = shareToken === DEMO_PERSON.shareToken || !!userId

    const [shared, setShared] = useState(null)

    const [collectionPublic, setCollectionPublic] =
        useState(false)

    const [visibilityPending, setVisibilityPending] =
        useState(false)

    const [visibilityError, setVisibilityError] =
        useState('')

    // 내 공유 토큰 — 라우트 파라미터(shareToken)와 헷갈리지 않게 이름을 따로 둔다
    const [myShareToken, setMyShareToken] = useState('')

    const [linkCopied, setLinkCopied] = useState(false)

    useEffect(() => {
        // 내 컬렉션일 때만 공개 설정 조회
        if (!isMine) return

        getMyPublicSettings()
            .then(({ collection }) => {
                setCollectionPublic(collection.isPublic)
                setMyShareToken(collection.shareToken)
            })
            .catch((error) =>
                setVisibilityError(error.message),
            )
    }, [isMine])

    const [sharedError, setSharedError] = useState('')

    useEffect(() => {
        if (!shareToken || isMock) return

        // 비공개로 돌리면 여기서 404가 떨어진다 — 그대로 메시지를 보여준다
        getSharedView(shareToken)
            .then(setShared)
            .catch((error) => setSharedError(error.message))
    }, [shareToken])

    const handleCollectionVisibility = async () => {
        const next = !collectionPublic

        const message = next
            ? '컬렉션 전체를 커뮤니티에 공개하시겠습니까?'
            : '컬렉션 전체를 비공개로 전환하시겠습니까?'

        if (!window.confirm(message)) return

        setVisibilityPending(true)
        setVisibilityError('')

        try {
            const setting =
                await updateCollectionVisibility(next)

            setCollectionPublic(setting.isPublic)
            setMyShareToken(setting.shareToken)
        } catch (error) {
            setVisibilityError(error.message)
        } finally {
            setVisibilityPending(false)
        }
    }

    // 공개한 진열장을 남이 보는 주소 — 커뮤니티 검색에서 들어오는 곳과 같다
    const handleCopyShareLink = async () => {
        setVisibilityError('')

        try {
            await navigator.clipboard.writeText(
                `${window.location.origin}/community/collection/${myShareToken}`,
            )

            setLinkCopied(true)
        } catch {
            setVisibilityError('링크를 복사하지 못했습니다.')
        }
    }

    // 남의 옷장에 내 테마를 입히면 안 된다 — 테마는 아직 localStorage 에만 있다
    const theme = isMine ? loadTheme() : DEFAULT_THEME

    const owner = {
        nickname: shared?.ownerNickname ?? (isMock ? DEMO_PERSON.nickname : ''),
    }

    const sharedEditions = (shared?.cards?.content ?? []).map((card) => ({
        id: card.conceptId,
        number: card.certificate?.editionNumber ?? '',
        name: card.certificate?.editionName ?? '',
        createdAt: card.certificate?.issuedAt?.slice(0, 10).replaceAll('-', '.') ?? '',
        images: { transparent: card.gridImageUrl || card.imageUrl },
        mainCategory: bucketOf(card.certificate?.category),
        // 남의 카드는 내 에디션 상세가 아니라 커뮤니티 상세로 간다
        href: `/community/edition/${card.conceptId}`,
    }))

    const items = isMine || isMock ? editions : sharedEditions

    const accessoryEditions = items.filter(
        (edition) => edition.mainCategory === 'accessory',
    )

    const bagEditions = items.filter(
        (edition) => edition.mainCategory === 'bag',
    )

    const clothingEditions = items.filter(
        (edition) => edition.mainCategory === 'clothing',
    )

    const latestEdition = [...items].sort(
        (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt),
    )[0]

    return (
        <>
            <Header />

            <main className="min-h-[100dvh] w-full">
                <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[48px] pb-[42px] max-[860px]:px-[22px] max-[860px]:pt-[28px]">
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

                        {/* 내 컬렉션에서만 생성 / 테마 변경 가능 */}
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
                            backgroundColor: colorOf(theme.color).hex,
                        }}
                    >
                        <div className="grid grid-cols-[200px_minmax(0,1fr)_165px] items-stretch gap-[14px] max-[1050px]:grid-cols-[180px_minmax(0,1fr)] max-[760px]:grid-cols-1">
                            <AccessorySection
                                items={accessoryEditions}
                            />

                            <div className="flex min-w-0 flex-col">
                                <BagSection items={bagEditions} />

                                <ClothingSection
                                    items={clothingEditions}
                                />
                            </div>

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

                                <div className="border-b border-[#d9c9b7] py-[15px]">
                                    <p className="m-0 text-[7px] tracking-[.16em] text-ink/45">
                                        TOTAL EDITIONS
                                    </p>

                                    <p className="mt-[5px] mb-0 font-brand text-[25px]">
                                        {shared?.cards?.totalElements ?? items.length}
                                    </p>

                                    {/* 크레딧은 내 컬렉션에서만 */}
                                    {isMine && (
                                        <>
                                            <p className="mt-[13px] mb-0 text-[7px] tracking-[.16em] text-ink/45">
                                                보유 크레딧
                                            </p>

                                            <p className="mt-[5px] mb-0 font-brand text-[25px]">
                                                127
                                            </p>
                                        </>
                                    )}
                                </div>

                                <div className="border-b border-[#d9c9b7] py-[15px]">
                                    <p className="m-0 text-[7px] tracking-[.16em] text-ink/45">
                                        LATEST EDITION
                                    </p>

                                    <div className="mt-[10px] flex h-[90px] items-center justify-center bg-[#cdbb9f]">
                                        {latestEdition?.images?.transparent ? (
                                            <img
                                                src={
                                                    latestEdition.images
                                                        .transparent
                                                }
                                                alt=""
                                                className="h-[90%] w-[90%] object-contain"
                                            />
                                        ) : (
                                            <span className="text-[7px] text-ink/35">
                                                IMAGE
                                            </span>
                                        )}
                                    </div>

                                    {latestEdition && (
                                        <>
                                            <p className="mt-[9px] mb-0 text-[11px] font-medium">
                                                No. {latestEdition.number}
                                            </p>

                                            <p className="mt-[3px] mb-0 truncate text-[8px] text-ink/45">
                                                {latestEdition.name}
                                            </p>

                                            <p className="mt-[3px] mb-0 text-[7px] text-ink/35">
                                                {latestEdition.createdAt}
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* 공개 전환은 주인만 한다 */}
                                {isMine && (
                                    <button
                                        type="button"
                                        className="mt-[13px] flex h-[46px] w-full cursor-pointer items-center justify-center border border-[#d9c9b7] bg-[#efe4d2] px-[4px] text-center text-[6.5px] leading-[1.7] tracking-[.15em] text-ink/55 transition-colors duration-700 ease-film hover:bg-white disabled:cursor-default disabled:opacity-50"
                                        aria-pressed={collectionPublic}
                                        disabled={visibilityPending}
                                        onClick={handleCollectionVisibility}
                                    >
                                        {collectionPublic ? 'COLLECTION IS' : 'SHARE YOUR'}
                                        < br />
                                        {collectionPublic ? 'PUBLIC' : 'COLLECTION'}
                                    </button >
                                )}
                                {/* 공개 상태에서만 공유 링크가 의미가 있다 — 비공개면 그 주소는 404 다 */}
                                {isMine && collectionPublic && myShareToken && (
                                    <button
                                        type="button"
                                        className="mt-[7px] w-full cursor-pointer border border-[#d9c9b7] bg-transparent px-[4px] py-[9px] text-center text-[6.5px] tracking-[.15em] text-ink/45 transition-colors duration-700 ease-film hover:bg-white"
                                        onClick={handleCopyShareLink}
                                    >
                                        {linkCopied ? 'LINK COPIED' : 'COPY SHARE LINK'}
                                    </button>
                                )}
                                {sharedError && (
                                    <p className="mt-[8px] mb-0 text-[8px] leading-[1.5] text-[#8c3b33]" role="alert">
                                        {sharedError}
                                    </p>
                                )}
                                {visibilityError && (
                                    <p className="mt-[8px] mb-0 text-[8px] leading-[1.5] text-[#8c3b33]" role="alert">
                                        {visibilityError}
                                    </p>
                                )
                                }
                            </aside >
                        </div >
                    </section >

                    <div className="mt-[18px] flex items-center justify-between gap-[20px] text-[8px] tracking-[.16em] text-ink/45">
                        <span>
                            {isMine
                                ? '추억을 연결한 나만의 에디션 컬렉션'
                                : `${owner.nickname}님의 에디션 컬렉션`}
                        </span>

                        <span>MEMORY ATELIER</span>
                    </div>
                </div >
            </main >
        </>
    )
}
