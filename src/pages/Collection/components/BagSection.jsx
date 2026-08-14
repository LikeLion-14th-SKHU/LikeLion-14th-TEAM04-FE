import { useState } from 'react'
import { Link } from 'react-router'

const PAGE_SIZE = 4

export default function BagSection({
    items = [],
}) {
    const [page, setPage] = useState(0)

    const totalPages = Math.max(
        1,
        Math.ceil(items.length / PAGE_SIZE),
    )

    const start = page * PAGE_SIZE

    const pageItems = items.slice(
        start,
        start + PAGE_SIZE,
    )

    const visibleItems = [
        ...pageItems,
        ...Array(PAGE_SIZE - pageItems.length).fill(null),
    ]

    return (
        <section
            className="relative border border-frame bg-[#f2e8d8] p-[9px]"
            aria-labelledby="bag-heading"
        >
            <h2
                id="bag-heading"
                className="m-0 mb-[9px] text-[8px] font-normal tracking-[.18em] text-clay"
            >
                BAG
            </h2>

            <div className="relative">
                {page > 0 && (
                    <button
                        type="button"
                        onClick={() =>
                            setPage((prev) => prev - 1)
                        }
                        className="absolute top-1/2 left-[-7px] z-10 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-[3px] text-[16px] text-ink/45 hover:text-ink"
                        aria-label="이전 가방 보기"
                    >
                        ◀
                    </button>
                )}

                <div className="grid grid-cols-4 gap-[9px]">
                    {visibleItems.map((item, index) =>
                        item ? (
                            <Link
                                key={item.id}
                                to={`/edition/${item.id}`}
                                className="group relative flex h-[125px] cursor-pointer items-center justify-center overflow-hidden border border-[#d7c8b5] bg-[#e8ddcb] p-[4px] no-underline transition-colors duration-700 ease-film hover:bg-white"
                                aria-label={`${item.name} 보기`}
                            >
                                {item.images?.transparent ? (
                                    <img
                                        src={item.images.transparent}
                                        alt={item.name}
                                        className="h-full w-full object-contain transition-transform duration-700 ease-film group-hover:scale-[1.05]"
                                        onError={(event) => {
                                            event.currentTarget.style.display = 'none'
                                            event.currentTarget.nextElementSibling?.classList.remove(
                                                'hidden',
                                            )
                                        }}
                                    />
                                ) : null}

                                <div
                                    className={`absolute inset-0 flex items-center justify-center text-[8px] tracking-[.08em] text-ink/35 ${item.images?.transparent
                                            ? 'hidden'
                                            : ''
                                        }`}
                                >
                                    BAG IMAGE
                                </div>
                            </Link>
                        ) : (
                            <div
                                key={`empty-${index}`}
                                className="h-[125px] border border-[#d7c8b5] bg-[#e8ddcb]"
                                aria-hidden="true"
                            />
                        ),
                    )}
                </div>

                {page < totalPages - 1 && (
                    <button
                        type="button"
                        onClick={() =>
                            setPage((prev) => prev + 1)
                        }
                        className="absolute top-1/2 right-[-7px] z-10 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-[3px] text-[16px] text-ink/45 hover:text-ink"
                        aria-label="다음 가방 보기"
                    >
                        ▶
                    </button>
                )}
            </div>
        </section>
    )
}