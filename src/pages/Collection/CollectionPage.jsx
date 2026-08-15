import Header from '../../components/Header'
import Button from '../../components/Button'

import AccessorySection from './components/AccessorySection'
import BagSection from './components/BagSection'
import ClothingSection from './components/ClothingSection'

import { editions } from '../../data/editions'
import { colorOf, loadTheme } from '../../data/collectionTheme'

export default function CollectionPage() {
    // 테마 화면에서 저장한 값 — 화면을 옮겨 올 때마다 다시 읽는다
    const theme = loadTheme()
    const accessoryEditions = editions.filter(
        (edition) => edition.mainCategory === 'accessory',
    )

    const bagEditions = editions.filter(
        (edition) => edition.mainCategory === 'bag',
    )

    const clothingEditions = editions.filter(
        (edition) => edition.mainCategory === 'clothing',
    )

    const latestEdition = [...editions].sort(
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
                                {theme.title}
                            </h1>

                            <p className="mt-[12px] mb-0 text-[13px] leading-[1.7] text-ink/60">
                                추억을 담은 에디션을 나만의 컬렉션에서 확인하세요.
                            </p>
                        </div>

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
                    </div>

                    {/* 진열장 바탕이 테마 색이다 — 선반·사이드 카드는 저마다 배경이 있어
                        어떤 색을 골라도 그 위의 글자가 묻히지 않는다 */}
                    <section
                        className="mt-[24px] border border-[rgba(24,19,15,.12)] p-[20px] shadow-[0_14px_30px_rgba(44,26,15,.12)]"
                        style={{ backgroundColor: colorOf(theme.color).hex }}
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
                                        MY COLLECTION
                                    </p>
                                </div>

                                <div className="border-b border-[#d9c9b7] py-[15px]">
                                    <p className="m-0 text-[7px] tracking-[.16em] text-ink/45">
                                        TOTAL EDITIONS
                                    </p>

                                    <p className="mt-[5px] mb-0 font-brand text-[25px]">
                                        {editions.length}
                                    </p>

                                    <p className="mt-[13px] mb-0 text-[7px] tracking-[.16em] text-ink/45">
                                        보유 크레딧
                                    </p>

                                    <p className="mt-[5px] mb-0 font-brand text-[25px]">
                                        127
                                    </p>
                                </div>

                                <div className="border-b border-[#d9c9b7] py-[15px]">
                                    <p className="m-0 text-[7px] tracking-[.16em] text-ink/45">
                                        LATEST EDITION
                                    </p>

                                    <div className="mt-[10px] flex h-[90px] items-center justify-center bg-[#cdbb9f]">
                                        {latestEdition?.images?.transparent ? (
                                            <img
                                                src={latestEdition.images.transparent}
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

                                <button
                                    type="button"
                                    className="mt-[13px] flex h-[46px] w-full cursor-pointer items-center justify-center border border-[#d9c9b7] bg-[#efe4d2] px-[4px] text-center text-[6.5px] leading-[1.7] tracking-[.15em] text-ink/55 transition-colors duration-700 ease-film hover:bg-white"
                                >
                                    SHARE YOUR
                                    <br />
                                    COLLECTION
                                </button>
                            </aside>
                        </div>
                    </section>

                    <div className="mt-[18px] flex items-center justify-between gap-[20px] text-[8px] tracking-[.16em] text-ink/45">
                        <span>
                            추억을 연결한 나만의 에디션 컬렉션
                        </span>

                        <span>MEMORY ATELIER</span>
                    </div>
                </div>
            </main>
        </>
    )
}