import { useState } from 'react'

const CLOTHES = [
    { id: 1, image: '/assets/collection/clothing-01.png' },
    { id: 2, image: '/assets/collection/clothing-02.png' },
    { id: 3, image: '/assets/collection/clothing-03.png' },
    { id: 4, image: '/assets/collection/clothing-04.png' },
    { id: 5, image: '/assets/collection/clothing-05.png' },

    // 다음 페이지 테스트용
    { id: 6, image: '/assets/collection/clothing-06.png' },
    { id: 7, image: '/assets/collection/clothing-07.png' },
]

const PAGE_SIZE = 5

export default function ClothingSection() {
    const [page, setPage] = useState(0)

    const totalPages = Math.ceil(CLOTHES.length / PAGE_SIZE)

    const start = page * PAGE_SIZE
    const pageItems = CLOTHES.slice(start, start + PAGE_SIZE)

    // 마지막 페이지에서도 항상 5칸 유지
    const visibleItems = [
        ...pageItems,
        ...Array(PAGE_SIZE - pageItems.length).fill(null),
    ]

    const handlePrev = () => {
        setPage((prev) => Math.max(prev - 1, 0))
    }

    const handleNext = () => {
        setPage((prev) => Math.min(prev + 1, totalPages - 1))
    }

    return (
        <section
            className="relative mt-[14px] border border-[#ddd0bf] bg-[#f3eadc] p-[12px]"
            aria-labelledby="clothing-heading"
        >
            {/* 제목 */}
            <h2
                id="clothing-heading"
                className="m-0 mb-[10px] text-[8px] font-normal tracking-[.18em] text-clay"
            >
                CLOTHING
            </h2>

            {/* 의류 진열 영역 */}
            <div className="relative pt-[18px]">
                {/* 옷걸이 봉 */}
                <div className="absolute top-[4px] left-0 h-px w-full bg-[#b89b77]" />

                {/* 이전 페이지 */}
                {page > 0 && (
                    <button
                        type="button"
                        onClick={handlePrev}
                        className="absolute top-1/2 left-[-8px] z-10 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-[4px] text-[17px] text-ink/45 transition-colors duration-700 ease-film hover:text-ink"
                        aria-label="이전 의류 보기"
                    >
                        ◀
                    </button>
                )}

                {/* 의류 5칸 */}
                <div className="grid grid-cols-5 gap-[10px]">
                    {visibleItems.map((item, index) =>
                        item ? (
                            <button
                                key={item.id}
                                type="button"
                                className="group relative flex h-[300px] cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                                aria-label={`의류 에디션 ${item.id} 보기`}
                            >
                                {/* 옷걸이 세로 연결 부분 */}
                                <span className="absolute top-[-14px] left-1/2 h-[11px] w-[2px] -translate-x-1/2 bg-[#b48d65]" />

                                {/* 옷걸이 가로 부분 */}
                                <span className="absolute top-[-4px] left-1/2 h-[3px] w-[24px] -translate-x-1/2 rounded-full bg-[#b48d65]" />

                                {/* 에디션 칸 */}
                                <div className="flex h-full w-full items-center justify-center bg-[#e4d9c7] p-[7px] shadow-[0_4px_8px_rgba(63,46,33,.10)] transition-transform duration-700 ease-film group-hover:-translate-y-[3px]">
                                    <img
                                        src={item.image}
                                        alt=""
                                        className="h-[94%] w-[94%] object-contain"
                                    />
                                </div>
                            </button>
                        ) : (
                            // 에디션이 없는 경우에도 빈 옷장 칸 유지
                            <div
                                key={`empty-${index}`}
                                className="relative h-[300px]"
                                aria-hidden="true"
                            >
                                {/* 빈 칸 옷걸이 */}
                                <span className="absolute top-[-14px] left-1/2 h-[11px] w-[2px] -translate-x-1/2 bg-[#b48d65]" />

                                <span className="absolute top-[-4px] left-1/2 h-[3px] w-[24px] -translate-x-1/2 rounded-full bg-[#b48d65]" />

                                {/* 빈 진열 공간 */}
                                <div className="h-full w-full bg-[#e4d9c7]" />
                            </div>
                        ),
                    )}
                </div>

                {/* 다음 페이지 */}
                {page < totalPages - 1 && (
                    <button
                        type="button"
                        onClick={handleNext}
                        className="absolute top-1/2 right-[-8px] z-10 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-[4px] text-[17px] text-ink/45 transition-colors duration-700 ease-film hover:text-ink"
                        aria-label="다음 의류 보기"
                    >
                        ▶
                    </button>
                )}
            </div>
        </section>
    )
}