export default function CurationCard({ product }) {
    return (
        <article className="border border-frame bg-white p-[10px]">
            <div className="flex h-[150px] items-center justify-center bg-[#dfd2bd]">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-[90%] w-[90%] object-contain"
                    />
                ) : (
                    <span className="text-[8px] text-ink/35">
                        제품 컷
                    </span>
                )}
            </div>

            <h4 className="mt-[11px] mb-0 text-[10.5px] font-medium">
                {product.name}
            </h4>

            <p className="mt-[5px] mb-0 text-[9px] text-ink/45">
                {product.price}
            </p>
        </article>
    )
}