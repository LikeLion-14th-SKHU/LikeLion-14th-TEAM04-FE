export default function EditionCard({ title, subtitle, likes, image }) {
  return (
    <article className="flex h-full flex-col border border-frame bg-white">
      {/* 제품 사진마다 비율이 달라 contain 으로 넣는다 — 잘리면 무슨 물건인지 안 보인다.
          바로 아래 제목·부제가 무엇인지 읽어주므로 사진은 장식 취급 (alt="") */}
      <img
        // 배경색은 사진에 구워진 배경과 같은 톤 — 다르면 레터박스 자리에 흰 띠가 보인다
        className="h-[172px] w-full shrink-0 bg-[#f7f7f7] object-contain"
        src={image}
        alt=""
        loading="lazy"
      />

      <div className="flex flex-1 flex-col px-[17px] pt-[16px] pb-[16px]">
        <h3 className="m-0 text-[15px] font-medium tracking-[-.01em]">{title}</h3>
        <p className="mt-[9px] mb-0 text-[12px] leading-[1.5] break-keep text-ink/58">{subtitle}</p>

        <div className="mt-auto flex items-center justify-between gap-[10px] border-t border-[#f0e8dc] pt-[11px]">
          {/* 상세 화면이 아직 없어 동작은 비워둔다. TODO: 에디션 상세 라우트 연결 */}
          <button
            className="cursor-pointer border-0 bg-transparent p-0 text-left text-[12px] text-[#5b4130] transition-colors duration-700 ease-film hover:text-ink"
            type="button"
            aria-label={`${title} 추억 상품 미리보기`}
          >
            에디션 미리보기 →
          </button>
          <p className="m-0 shrink-0 text-[11.5px] text-clay">
            <span aria-hidden="true">♥</span> {likes}
            <span className="sr-only">개의 좋아요</span>
          </p>
        </div>
      </div>
    </article>
  )
}
