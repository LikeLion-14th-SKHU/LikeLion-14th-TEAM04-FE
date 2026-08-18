import { Link } from 'react-router'

export default function EditionCard({ id, title, subtitle, likes, image }) {
  return (
    <article className="flex h-full flex-col bg-white">
      {/* 제품 사진마다 비율이 달라 contain 으로 넣는다 — 잘리면 무슨 물건인지 안 보인다.
          바로 아래 제목·부제가 무엇인지 읽어주므로 사진은 장식 취급 (alt="") */}
      {image ? (
        <img
          // 배경은 톤 우드(--color-wood) 로 통일 — 사진마다 제각각인 스튜디오 배경 대신 카드가 다 같은 톤으로 보이게
          // 원본이 1024×1024 라 카드 폭에 맞춰 정사각으로 따라간다 (고정 높이 대신 aspect-square)
          className="aspect-square w-full shrink-0 bg-wood object-contain"
          src={image}
          alt=""
          loading="lazy"
        />
      ) : <div className="aspect-square w-full shrink-0 bg-wood" aria-hidden="true" />}

      <div className="flex flex-1 flex-col px-[14px] pt-[13px] pb-[13px]">
        <h3 className="m-0 text-[14px] font-medium tracking-[-.01em]">{title}</h3>
        <p className="mt-[7px] mb-0 text-[11.5px] leading-[1.5] break-keep text-ink/58">{subtitle}</p>

        <div className="mt-auto flex items-center justify-between gap-[10px] border-t border-[#f0e8dc] pt-[10px]">
          {/* <a> 라 새 탭·주소 복사가 그대로 되면서 이동은 새로고침 없이 간다 */}
          <Link
            className="text-left text-[11.5px] text-[#5b4130] no-underline transition-colors duration-700 ease-film hover:text-ink"
            to={`/community/edition/${id}`}
            aria-label={`${title} 에디션 보기`}
          >
            에디션 보기 →
          </Link>
          <p className="m-0 shrink-0 text-[11.5px] text-clay">
            <span aria-hidden="true">♥</span> {likes}
            <span className="sr-only">개의 좋아요</span>
          </p>
        </div>
      </div>
    </article>
  )
}
