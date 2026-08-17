import { useState } from 'react'
import { Link } from 'react-router'

const PAGE_SIZE = 8

export default function AccessorySection({
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

    return (
        <section
            className="relative flex h-full flex-col border p-[9px]"
            style={{
                backgroundColor: theme.section,
                borderColor: theme.border,
            }}
            aria-labelledby="accessory-heading"
        >
            <h2
                id="accessory-heading"
                className="m-0 mb-[9px] text-[8px] font-normal tracking-[.18em]"
                style={{
                    color: theme.accent,
                }}
            >
                ACCESSORY
            </h2>

            <div className="relative">
                {page > 0 && (
                    <button
                        type="button"
                        onClick={() =>
                            setPage(
                                (prev) => prev - 1,
                            )
                        }
                        className="absolute top-1/2 left-[-7px] z-10 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-[2px] text-[14px] text-ink/45 hover:text-ink"
                        aria-label="이전 악세사리 보기"
                    >
                        ◀
                    </button>
                )}

                <div className="grid grid-cols-2 gap-[7px]">
                    {visibleItems.map(
                        (item, index) =>
                            item ? (
                                <Link
                                    key={item.id}
                                    to={
                                        item.href ??
                                        `/edition/${item.id}`
                                    }
                                    className="group flex aspect-square cursor-pointer items-center justify-center border p-[4px] no-underline transition-opacity duration-700 ease-film hover:opacity-80"
                                    style={{
                                        backgroundColor:
                                            theme.slot,
                                        borderColor:
                                            theme.border,
                                    }}
                                    aria-label={`${item.name} 보기`}
                                >
                                    <img
                                        src={
                                            item.images
                                                .transparent
                                        }
                                        alt=""
                                        className="h-[92%] w-[92%] object-contain transition-transform duration-700 ease-film group-hover:scale-[1.04]"
                                    />
                                </Link>
                            ) : (
                                <div
                                    key={`empty-${index}`}
                                    className="aspect-square border"
                                    style={{
                                        backgroundColor:
                                            theme.slot,
                                        borderColor:
                                            theme.border,
                                    }}
                                    aria-hidden="true"
                                />
                            ),
                    )}
                </div>

                {page < totalPages - 1 && (
                    <button
                        type="button"
                        onClick={() =>
                            setPage(
                                (prev) => prev + 1,
                            )
                        }
                        className="absolute top-1/2 right-[-7px] z-10 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-[2px] text-[14px] text-ink/45 hover:text-ink"
                        aria-label="다음 악세사리 보기"
                    >
                        ▶
                    </button>
                )}
            </div>

            <div className="flex-1" />

            <div
                className="mt-[10px] border-t pt-[7px]"
                style={{
                    borderColor: theme.border,
                }}
            >
                {[1, 2].map((drawer) => (
                    <div
                        key={drawer}
                        className="relative mb-[6px] h-[40px] border last:mb-0"
                        style={{
                            backgroundColor:
                                theme.drawer,
                            borderColor: theme.border,
                        }}
                    >
                        <div
                            className="absolute inset-[3px] border opacity-50"
                            style={{
                                borderColor:
                                    theme.border,
                            }}
                        />

                        <div
                            className="absolute top-1/2 left-1/2 h-[2px] w-[24px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                            style={{
                                backgroundColor:
                                    theme.accent,
                            }}
                        />
                    </div>
                ))}
            </div>
        </section>
    )
}