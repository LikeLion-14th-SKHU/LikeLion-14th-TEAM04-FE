import { useState } from 'react'

const BAGS = [
    { id: 1, image: '/assets/collection/bag-01.png' },
    { id: 2, image: '/assets/collection/bag-02.png' },
    { id: 3, image: '/assets/collection/bag-03.png' },
    { id: 4, image: '/assets/collection/bag-04.png' },

    // 다음 페이지 테스트용
    { id: 5, image: '/assets/collection/bag-05.png' },
    { id: 6, image: '/assets/collection/bag-06.png' },
]

const PAGE_SIZE = 4

export default function BagSection() {
    const [page, setPage] = useState(0)

    const totalPages = Math.ceil(BAGS.length / PAGE_SIZE)
    const start = page * PAGE_SIZE
    const pageItems = BAGS.slice(start, start + PAGE_SIZE)

    // 마지막 페이지에서도 항상 4칸 유지
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
                        onClick={() => setPage((prev) => prev - 1)}
                        className="absolute top-1/2 left-[-7px] z-10 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-[3px] text-[16px] text-ink/45 transition-colors duration-700 ease-film hover:text-ink"
                        aria-label="이전 가방 보기"
                    >
                        ◀
                    </button>
                )}

                <div className="grid grid-cols-4 gap-[9px]">
                    {visibleItems.map((item, index) =>
                        item ? (
                            <button
                                key={item.id}
                                type="button"
                                className="group flex h-[105px] cursor-pointer items-center justify-center border border-[#d7c8b5] bg-[#e8ddcb] p-[5px] transition-colors duration-700 ease-film hover:bg-white"
                                aria-label={`가방 에디션 ${item.id} 보기`}
                            >
                                <img
                                    src={item.image}
                                    alt=""
                                    className="h-[94%] w-[94%] object-contain transition-transform duration-700 ease-film group-hover:scale-[1.04]"
                                />
                            </button>
                        ) : (
                            <div
                                key={`empty-${index}`}
                                className="h-[105px] border border-[#d7c8b5] bg-[#e8ddcb]"
                                aria-hidden="true"
                            />
                        ),
                    )}
                </div>

                {page < totalPages - 1 && (
                    <button
                        type="button"
                        onClick={() => setPage((prev) => prev + 1)}
                        className="absolute top-1/2 right-[-7px] z-10 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-[3px] text-[16px] text-ink/45 transition-colors duration-700 ease-film hover:text-ink"
                        aria-label="다음 가방 보기"
                    >
                        ▶
                    </button>
                )}
            </div>
        </section>
    )
}