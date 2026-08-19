export default function CurationCard({ product }) {
    return (
        <article className="flex h-full flex-col bg-[#f6f0e6] p-[14px]">
            <div className="relative aspect-square w-full overflow-hidden bg-[#ded0ba]">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.nameKr}
                        className="h-full w-full object-contain p-[12px]"
                        onError={(event) => {
                            event.currentTarget.style.display =
                                'none'

                            event.currentTarget.nextElementSibling?.classList.remove(
                                'hidden',
                            )
                        }}
                    />
                ) : null}

                <div
                    className={`absolute inset-0 flex items-center justify-center text-[8px] tracking-[.12em] text-ink/35 ${product.imageUrl
                            ? 'hidden'
                            : ''
                        }`}
                >
                    RECOMMENDED PRODUCT
                </div>
            </div>

            <div className="flex flex-1 flex-col px-[2px] pt-[16px] pb-[4px]">
                <p className="m-0 text-[7px] tracking-[.16em] text-clay">
                    RECOMMENDED FOR THIS EDITION
                </p>

                <h3 className="mt-[8px] mb-0 text-[14px] font-semibold">
                    {product.nameKr}
                </h3>

                {product.tagline && (
                    <p className="mt-[6px] mb-0 text-[10px] leading-[1.6] text-ink/50">
                        {product.tagline}
                    </p>
                )}

                {product.reason && (
                    <div className="mt-[16px] border-t border-line pt-[13px]">
                        <p className="m-0 text-[8px] font-medium text-ink/65">
                            추천 이유
                        </p>

                        <p className="mt-[6px] mb-0 text-[10px] leading-[1.75] text-ink/60">
                            {product.reason}
                        </p>
                    </div>
                )}
            </div>
        </article>
    )
}