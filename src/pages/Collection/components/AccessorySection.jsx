import { useState } from 'react'
import { Link } from 'react-router'

const PAGE_SIZE = 8

export default function AccessorySection({
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
            className="relative flex h-full flex-col border border-frame bg-[#f2e8d8] p-[9px]"
            aria-labelledby="accessory-heading"
        >
            <h2
                id="accessory-heading"
                className="m-0 mb-[9px] text-[8px] font-normal tracking-[.18em] text-clay"
            >
                ACCESSORY
            </h2>

            <div className="relative">
                {page > 0 && (
                    <button
                        type="button"
                        onClick={() =>
                            setPage((prev) => prev - 1)
                        }
                        className="absolute top-1/2 left-[-7px] z-10 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-[2px] text-[14px] text-ink/45 hover:text-ink"
                        aria-label="이전 악세사리 보기"
                    >
                        ◀
                    </button>
                )}

                <div className="grid grid-cols-2 gap-[7px]">
                    {visibleItems.map((item, index) =>
                        item ? (
                            <Link
                                key={item.id}
                                to={item.href ?? `/edition/${item.id}`}
                                className="group flex aspect-square cursor-pointer items-center justify-center border border-[#d7c8b5] bg-[#e7dbc8] p-[4px] no-underline transition-colors duration-700 ease-film hover:bg-white"
                                aria-label={`${item.name} 보기`}
                            >
                                <img
                                    src={item.images.transparent}
                                    alt=""
                                    className="h-[92%] w-[92%] object-contain transition-transform duration-700 ease-film group-hover:scale-[1.04]"
                                />
                            </Link>
                        ) : (
                            <div
                                key={`empty-${index}`}
                                className="aspect-square border border-[#d7c8b5] bg-[#e7dbc8]"
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
                        className="absolute top-1/2 right-[-7px] z-10 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-[2px] text-[14px] text-ink/45 hover:text-ink"
                        aria-label="다음 악세사리 보기"
                    >
                        ▶
                    </button>
                )}
            </div>

            <div className="flex-1" />

            {/* 장식용 서랍 */}
            <div className="mt-[10px] border-t border-[#cbb99f] pt-[7px]">
                {[1, 2].map((drawer) => (
                    <div
                        key={drawer}
                        className="relative mb-[6px] h-[40px] border border-[#cdbca4] bg-[#e4d6c1] last:mb-0"
                    >
                        <div className="absolute inset-[3px] border border-[#d4c4ad]" />

                        <div className="absolute top-1/2 left-1/2 h-[2px] w-[24px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ae916d]" />
                    </div>
                ))}
            </div>
        </section>
    )
}