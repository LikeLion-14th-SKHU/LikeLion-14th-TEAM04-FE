export default function CurationCard({ product }) {
    return (
        <article className="border border-frame bg-white p-[10px]">
            <div className="relative flex h-[170px] items-center justify-center overflow-hidden bg-[#dfd2bd]">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-contain p-[6px]"
                        onError={(event) => {
                            event.currentTarget.style.display = 'none'
                            event.currentTarget.nextElementSibling?.classList.remove(
                                'hidden',
                            )
                        }}
                    />
                ) : null}

                <div
                    className={`absolute inset-0 flex items-center justify-center text-[8px] tracking-[.08em] text-ink/35 ${product.image ? 'hidden' : ''
                        }`}
                >
                    MCM PRODUCT
                </div>
            </div>

            <h4 className="mt-[11px] mb-0 truncate text-[11px] font-medium">
                {product.name}
            </h4>

            <p className="mt-[5px] mb-0 text-[9.5px] text-ink/45">
                {product.price}
            </p>
        </article>
    )
}