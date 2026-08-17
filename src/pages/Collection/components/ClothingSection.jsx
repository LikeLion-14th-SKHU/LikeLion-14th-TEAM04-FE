import { useState } from 'react'
import { Link } from 'react-router'

const PAGE_SIZE = 5

export default function ClothingSection({
    items = [],
    theme,
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
        ...Array(
            PAGE_SIZE - pageItems.length,
        ).fill(null),
    ]

    const handlePrev = () => {
        setPage((prev) =>
            Math.max(prev - 1, 0),
        )
    }

    const handleNext = () => {
        setPage((prev) =>
            Math.min(
                prev + 1,
                totalPages - 1,
            ),
        )
    }

    return (
        <section
            className="relative mt-[14px] border p-[12px]"
            style={{
                backgroundColor: theme.section,
                borderColor: theme.border,
            }}
            aria-labelledby="clothing-heading"
        >
            <h2
                id="clothing-heading"
                className="m-0 mb-[10px] text-[8px] font-normal tracking-[.18em]"
                style={{
                    color: theme.accent,
                }}
            >
                CLOTHING
            </h2>

            <div className="relative pt-[18px]">
                <div
                    className="absolute top-[4px] left-0 h-px w-full"
                    style={{
                        backgroundColor:
                            theme.accent,
                    }}
                />

                {page > 0 && (
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute top-1/2 left-[-8px] z-10 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-[4px] text-[17px] text-ink/45 hover:text-ink"
                        aria-label="이전 의류 보기"
                    >
                        ◀
                    </button>
                )}

                <div className="grid grid-cols-5 gap-[10px]">
                    {visibleItems.map(
                        (item, index) =>
                            item ? (
                                <Link
                                    key={item.id}
                                    to={
                                        item.href ??
                                        `/edition/${item.id}`
                                    }
                                    className="group relative flex h-[300px] cursor-pointer items-center justify-center border-0 bg-transparent p-0 no-underline"
                                    aria-label={`${item.name} 보기`}
                                >
                                    <span
                                        className="absolute top-[-14px] left-1/2 h-[11px] w-[2px] -translate-x-1/2"
                                        style={{
                                            backgroundColor:
                                                theme.accent,
                                        }}
                                    />

                                    <span
                                        className="absolute top-[-4px] left-1/2 h-[3px] w-[24px] -translate-x-1/2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                theme.accent,
                                        }}
                                    />

                                    <div
                                        className="flex h-full w-full items-center justify-center p-[7px] shadow-[0_4px_8px_rgba(63,46,33,.10)] transition-transform duration-700 ease-film group-hover:-translate-y-[3px]"
                                        style={{
                                            backgroundColor:
                                                theme.slot,
                                        }}
                                    >
                                        <img
                                            src={
                                                item
                                                    .images
                                                    .transparent
                                            }
                                            alt=""
                                            className="h-[94%] w-[94%] object-contain"
                                        />
                                    </div>
                                </Link>
                            ) : (
                                <div
                                    key={`empty-${index}`}
                                    className="relative h-[300px]"
                                    aria-hidden="true"
                                >
                                    <span
                                        className="absolute top-[-14px] left-1/2 h-[11px] w-[2px] -translate-x-1/2"
                                        style={{
                                            backgroundColor:
                                                theme.accent,
                                        }}
                                    />

                                    <span
                                        className="absolute top-[-4px] left-1/2 h-[3px] w-[24px] -translate-x-1/2 rounded-full"
                                        style={{
                                            backgroundColor:
                                                theme.accent,
                                        }}
                                    />

                                    <div
                                        className="h-full w-full"
                                        style={{
                                            backgroundColor:
                                                theme.slot,
                                        }}
                                    />
                                </div>
                            ),
                    )}
                </div>

                {page < totalPages - 1 && (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="absolute top-1/2 right-[-8px] z-10 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-[4px] text-[17px] text-ink/45 hover:text-ink"
                        aria-label="다음 의류 보기"
                    >
                        ▶
                    </button>
                )}
            </div>
        </section>
    )
}