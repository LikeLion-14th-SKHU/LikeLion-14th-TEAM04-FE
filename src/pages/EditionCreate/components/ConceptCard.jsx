export default function ConceptCard({
    concept,
    selected,
    locked,
    onSelect,
}) {
    const failed = concept.status === 'FAILED'

    // 아직 만들어지는 중인 카드다 — 돈 내면 열리는 잠금과 다르게 보여야 한다
    const pending = concept.status === 'PENDING'

    return (
        <article
            className={`relative bg-[#f6f0e6] p-[10px] ${selected
                    ? 'border-2 border-ink'
                    : 'border border-frame'
                }`}
        >
            {selected && (
                <span className="absolute top-[-10px] left-[10px] z-20 bg-ink px-[8px] py-[4px] text-[7px] tracking-[.12em] text-cream">
                    SELECTED
                </span>
            )}

            <div className="relative h-[215px] overflow-hidden bg-[#d8c7ae]">
                {/* 잠긴 콘셉트는 이미지를 그리지 않는다 — CSS 블러는 URL 이 DOM 에 남아 우회된다.
                    서버도 잠긴 동안 imageUrl 을 null 로 주지만, 그 계약에만 기대지 않는다 */}
                {concept.imageUrl && !locked ? (
                    <img
                        src={concept.imageUrl}
                        alt={concept.conceptName ?? ''}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div
                        className={`flex h-full w-full items-center justify-center bg-[#cdb99b] transition duration-700 ${locked && !failed && !pending
                            ? 'scale-[1.06] blur-[13px]'
                            : ''
                            }`}
                    >
                        <span className="text-[8px] tracking-[.16em] text-ink/35">
                            {failed
                                ? '생성 실패'
                                : pending
                                    ? '생성 중'
                                    : '3D CONCEPT'}
                        </span>
                    </div>
                )}

                {locked && !failed && !pending && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/10">
                        <span className="text-[8px] tracking-[.16em] text-ink/50">
                            BLURRED
                        </span>
                    </div>
                )}
            </div>

            <h3 className="mt-[13px] mb-0 text-[13px] font-medium">
                {concept.conceptName ??
                    (failed
                        ? '생성 실패'
                        : pending
                            ? '만드는 중입니다'
                            : '잠긴 콘셉트')}
            </h3>

            <button
                type="button"
                disabled={locked || failed || pending}
                onClick={onSelect}
                className={`mt-[14px] h-[38px] w-full border text-[9.5px] transition-colors duration-700 ease-film ${selected
                    ? 'border-ink bg-ink text-cream'
                    : locked || failed || pending
                        ? 'cursor-not-allowed border-frame bg-[#f6f2eb] text-ink/25'
                        : 'cursor-pointer border-[#d6cabb] bg-white text-ink hover:border-ink'
                    }`}
            >
                {selected
                    ? '선택됨'
                    : failed
                        ? '생성 실패'
                        : pending
                            ? '잠시만 기다려주세요'
                            : locked
                                ? '블러 콘셉트'
                                : '선택'}
            </button>
        </article>
    )
}
