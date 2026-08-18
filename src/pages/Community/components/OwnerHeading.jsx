import { Link } from 'react-router'

// 닉네임 검색 결과의 사람 머리글 — 프로필 이미지·닉네임·진열장 링크.
// id 는 바깥 section 의 aria-labelledby 가 가리킨다
export default function OwnerHeading({ id, nickname, profileImageUrl, href }) {
  return (
    <div className="flex items-center gap-[13px]">
      {/* 프로필을 안 올린 사람이 많다 — 없으면 닉네임 첫 글자로 채운다 */}
      {profileImageUrl ? (
        <img
          className="size-[42px] shrink-0 rounded-full bg-[#d4d0cb] object-cover"
          src={profileImageUrl}
          alt=""
        />
      ) : (
        <span
          className="flex size-[42px] shrink-0 items-center justify-center rounded-full bg-[#d4d0cb] text-[15px] text-white"
          aria-hidden="true"
        >
          {nickname.slice(0, 1)}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="m-0 text-[9px] tracking-[.2em] text-ink">COLLECTION</p>

        <div className="mt-[3px] flex items-center gap-[11px]">
          <h2 id={id} className="m-0 truncate text-[18px] font-semibold tracking-[-.02em]">
            {nickname}의 컬렉션
          </h2>
          <span className="h-px flex-1 bg-ink/20" aria-hidden="true" />
        </div>
      </div>

      <Link
        className="shrink-0 text-[12px] text-ink no-underline transition-colors duration-700 ease-film hover:text-ink-hover"
        to={href}
      >
        진열장 전체 보기 →
      </Link>
    </div>
  )
}
