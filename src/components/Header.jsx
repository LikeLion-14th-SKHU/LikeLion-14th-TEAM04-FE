import currentPath from '../currentPath'

const NAV = [
  ['/', '홈'],
  ['/community', '커뮤니티'],
]

export default function Header() {
  // 이동이 전체 새로고침이라 렌더 중에 값이 바뀌지 않는다 — 상태로 들고 있을 이유가 없다
  const path = currentPath()

  return (
    <header className="flex h-[78px] items-center justify-between border-b border-line bg-white px-[clamp(24px,3vw,56px)] max-[860px]:h-[70px] max-[860px]:px-[22px]">
      <a
        // 로고 좌우 간격을 헤더 좌우 여백과 같은 식으로 맞춘다
        className="inline-flex items-center gap-[clamp(24px,3vw,56px)] text-inherit no-underline max-[860px]:gap-[22px]"
        href="/"
        aria-label="Memory Atelier 홈"
      >
        {/* 옆의 서비스명이 이름을 읽어주므로 로고는 장식 취급 (alt="") */}
        {/* 로고 위쪽 걸이 때문에 M 이 이미지 박스 중앙보다 아래에 있다.
            서비스명과 시각적으로 같은 높이가 되게 4px 올린다 (레이아웃은 그대로) */}
        <img
          className="h-[38px] w-auto -translate-y-[4px] max-[430px]:h-[26px] max-[430px]:-translate-y-[3px]"
          src="/assets/logo.png"
          alt=""
          width="116"
          height="120"
        />
        {/* 서비스명만 Cormorant Garamond. 그 외 텍스트는 body 기본(Roboto Mono) */}
        <span className="font-brand text-[24px] tracking-[.22em] uppercase max-[430px]:text-[13px] max-[430px]:tracking-[.08em]">
          Memory Atelier
        </span>
      </a>

      <nav className="flex items-center gap-[34px] max-[430px]:gap-[14px]" aria-label="주요 메뉴">
        {NAV.map(([href, label]) => (
          <a
            key={href}
            // 현재 페이지만 진하게, 나머지는 잉크 50%
            className={`text-[13px] tracking-[.04em] no-underline transition-colors duration-700 ease-film hover:text-cognac max-[430px]:text-[12px] ${path === href ? 'text-ink' : 'text-ink/50'}`}
            href={href}
            aria-current={path === href ? 'page' : undefined}
          >
            {label}
          </a>
        ))}
        <a
          className="block size-[38px] rounded-full bg-[#d4d0cb] transition-colors duration-700 ease-film hover:bg-[#c2bdb7] max-[430px]:size-[28px]"
          href="/mypage"
          aria-label="내 계정"
        />
      </nav>
    </header>
  )
}
