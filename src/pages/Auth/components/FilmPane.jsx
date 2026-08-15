import { useRef, useState } from 'react'

export default function FilmPane() {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)

  const toggleSound = async () => {
    const video = videoRef.current
    video.muted = !video.muted
    setMuted(video.muted)
    if (video.paused) {
      // 자동재생이 막혀 정지 상태면 재생도 같이 시도한다 (실패해도 음소거 토글은 유지)
      try {
        await video.play()
      } catch {
        /* 브라우저 자동재생 정책 거부 */
      }
    }
  }

  return (
    <div className="relative isolate h-full min-h-[calc(100dvh-56px)] overflow-hidden bg-[#6d4934] bg-[url(/assets/auth-film-poster.png)] bg-cover bg-center bg-no-repeat max-[860px]:min-h-[43dvh]">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-center motion-reduce:hidden"
        autoPlay
        loop
        playsInline
        muted={muted}
        preload="metadata"
        poster="/assets/auth-film-poster.png"
        aria-hidden="true"
      >
        <source src="/assets/auth-film.mp4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(25,14,8,.18)_0%,transparent_40%,rgba(25,14,8,.56)_100%),linear-gradient(90deg,rgba(33,18,10,.25),transparent_58%)]"
        aria-hidden="true"
      />

      <div className="absolute inset-0 z-[2] flex flex-col justify-between p-[clamp(34px,5vw,72px)] text-cream max-[860px]:p-[26px_24px]">
        <p className="m-0 w-max p-0 text-[9px] tracking-[.24em] uppercase">
          Private collection · Edition 001
        </p>
        <h1 className="mx-0 mt-auto mb-[24px] max-w-[610px] text-[clamp(44px,5vw,76px)] leading-[1.08] font-medium tracking-[-.045em] text-balance max-[860px]:mb-[18px] max-[860px]:max-w-[420px] max-[860px]:text-[clamp(40px,11vw,58px)] max-[430px]:text-[40px]">
          기억을 간직하는
          <br />
          가장 아름다운 방식
        </h1>
        <div className="flex items-end justify-end gap-[32px] text-[10px] tracking-[.14em] uppercase">
          <p className="m-0 max-w-[270px] text-right leading-[1.7] tracking-[.05em] normal-case max-[860px]:hidden">
            당신의 사진과 이야기가 하나뿐인 오브제로 완성됩니다.
          </p>
        </div>
      </div>

      <button
        // 영상이 숨겨지는 reduced-motion 에서는 버튼도 숨긴다 (안 보이는 곳에서 소리가 나는 걸 막는다)
        className="absolute top-[clamp(28px,4vw,52px)] right-[clamp(28px,4vw,52px)] z-[3] h-[40px] w-[40px] motion-reduce:hidden cursor-pointer rounded-none border-0 bg-[rgba(24,16,11,.42)] p-0 text-[17px] text-cream transition-[background-color,transform] duration-700 ease-film hover:bg-[rgba(24,16,11,.68)] active:scale-[.97] max-[860px]:top-[24px] max-[860px]:right-[24px]"
        type="button"
        onClick={toggleSound}
        aria-label={muted ? '소리 켜기' : '소리 끄기'}
        aria-pressed={!muted}
      >
        <svg
          className="mx-auto h-[22px] w-[22px] fill-none stroke-current stroke-[1.6]"
          viewBox="0 0 24 24"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 10v4h3l4 3V7L8 10H5Z" />
          {muted ? (
            <path d="m16 10 4 4m0-4-4 4" />
          ) : (
            <path d="M15 9.5c1.35 1.35 1.35 3.65 0 5M17.5 7c2.75 2.75 2.75 7.25 0 10" />
          )}
        </svg>
      </button>
    </div>
  )
}
