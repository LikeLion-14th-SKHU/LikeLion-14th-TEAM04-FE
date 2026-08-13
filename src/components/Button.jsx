import { Link } from 'react-router'

const VARIANT = {
  primary: 'border-0 bg-[#12100e] text-[#f7f1e8] hover:bg-ink-hover',
  secondary:
    'border border-[rgba(23,18,14,.34)] bg-[rgba(255,255,255,.42)] text-ink hover:bg-white',
}

// 폭은 호출부가 정한다 — 세로로 쌓는 곳은 w-full, 헤더에 나란히 두는 곳은 내용 폭
// type 기본값을 button 으로 둔다 — 폼 안에 들어가도 의도치 않게 제출되지 않게
// href 를 주면 라우터 링크로 나간다 — <a> 라 새 탭·주소 복사는 그대로 되면서 이동은 새로고침 없이 간다
// aria-disabled 도 disabled 와 같은 모양으로 죽인다 — 포커스는 살려두고 못 누르는 것만 알릴 때 쓴다
export default function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  href,
  children,
  ...props
}) {
  const classes = `flex h-[45px] cursor-pointer items-center justify-center rounded-none px-[18px] text-[14px] font-medium tracking-[.01em] transition-[transform,background-color] duration-700 ease-film active:scale-[.985] disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100 aria-disabled:cursor-not-allowed aria-disabled:opacity-45 aria-disabled:active:scale-100 ${VARIANT[variant]} ${className}`

  if (href)
    return (
      <Link {...props} className={`${classes} no-underline`} to={href}>
        {children}
      </Link>
    )
  return (
    <button {...props} className={classes} type={type}>
      {children}
    </button>
  )
}
