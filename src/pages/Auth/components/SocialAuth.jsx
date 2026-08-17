import { useState } from 'react'
import { startOAuth } from '../../../api/auth'

const BASE =
  'flex min-h-[56px] w-full cursor-pointer items-center justify-center gap-[10px] rounded-[12px] px-[22px] text-[14px] transition-[transform,background-color] duration-700 ease-film active:scale-[.98]'

function KakaoIcon() {
  return (
    <svg className="size-[20px]" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 3C6.477 3 2 6.463 2 10.734c0 2.74 1.85 5.147 4.63 6.507-.153.55-.985 3.53-1.016 3.766 0 0-.02.17.09.235.11.065.24.015.24.015.32-.045 3.71-2.42 4.29-2.83.57.08 1.16.122 1.766.122 5.523 0 10-3.463 10-7.735C22 6.463 17.523 3 12 3Z"
      />
    </svg>
  )
}

function NaverIcon() {
  return (
    <svg className="size-[14px]" viewBox="0 0 20 20" aria-hidden="true">
      <path fill="currentColor" d="M13.56 10.7 6.24 0H0v20h6.44V9.3L13.76 20H20V0h-6.44v10.7Z" />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg className="size-[18px]" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17Z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46Z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7Z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07Z"
      />
    </svg>
  )
}

export default function SocialAuth({ remember }) {
  // client_id 가 비어 있으면 인가 화면으로 못 보낸다 — 그 사유를 버튼 아래 한 줄로 알린다
  const [error, setError] = useState('')

  const start = (provider) => {
    try {
      startOAuth(provider, remember)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="mt-[28px]">
      <div className="mb-[20px] flex items-center gap-[14px] text-[10px] tracking-[.14em] text-muted uppercase">
        <span className="h-px flex-1 bg-line" />
        또는
        <span className="h-px flex-1 bg-line" />
      </div>

      {/* 카카오 브랜드 컬러 #FEE500, 라벨은 검정 85% (카카오 로그인 버튼 가이드) */}
      <button
        className={`${BASE} border-0 bg-[#FEE500] text-black/85 hover:bg-[#f2da00]`}
        type="button"
        onClick={() => start('kakao')}
      >
        <KakaoIcon />
        카카오로 시작
      </button>

      {/* 네이버 브랜드 컬러 #03C75A, 라벨은 흰색 (네이버 로그인 버튼 가이드) */}
      <button
        className={`${BASE} mt-[10px] border-0 bg-[#03C75A] text-white hover:bg-[#02b351]`}
        type="button"
        onClick={() => start('naver')}
      >
        <NaverIcon />
        네이버로 시작
      </button>

      <button
        className={`${BASE} mt-[10px] border border-[#747775] bg-white text-[#1f1f1f] hover:bg-[#f7f7f7]`}
        type="button"
        onClick={() => start('google')}
      >
        <GoogleIcon />
        Google로 시작
      </button>

      {error && (
        <p className="mt-[10px] mb-0 text-[11px] leading-[1.7] break-keep text-cognac" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
