export default function ConceptCard({
    concept,
    selected,
    locked,
    onSelect,
}) {
    return (
        <article
            className={`relative bg-white p-[10px] ${selected
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
                {/* 사진 영역만 블러 */}
                <div
                    className={`flex h-full w-full items-center justify-center transition duration-700 ${locked ? 'scale-[1.06] blur-[13px]' : ''
                        }`}
                    style={{
                        backgroundColor: concept.color,
                    }}
                >
                    <span className="text-[8px] tracking-[.16em] text-ink/35">
                        3D CONCEPT
                    </span>
                </div>

                {locked && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white/10">
                        <span className="text-[8px] tracking-[.16em] text-ink/50">
                            BLURRED
                        </span>
                    </div>
                )}
            </div>

            {/* 이름은 블러하지 않음 */}
            <h3 className="mt-[13px] mb-0 text-[13px] font-medium">
                {concept.title}
            </h3>

            <button
                type="button"
                disabled={locked}
                onClick={onSelect}
                className={`mt-[14px] h-[38px] w-full border text-[9.5px] transition-colors duration-700 ease-film ${selected
                        ? 'border-ink bg-ink text-cream'
                        : locked
                            ? 'cursor-not-allowed border-frame bg-[#f6f2eb] text-ink/25'
                            : 'cursor-pointer border-[#d6cabb] bg-white text-ink hover:border-ink'
                    }`}
            >
                {selected
                    ? '선택됨'
                    : locked
                        ? '블러 콘셉트'
                        : '선택'}
            </button>
        </article>
    )
}