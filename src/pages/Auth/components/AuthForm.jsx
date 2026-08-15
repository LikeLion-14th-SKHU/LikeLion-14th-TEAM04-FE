import { Link } from 'react-router'
import SocialAuth from './SocialAuth'

const COPY = {
  login: [
    '다시 만나 반가워요.',
    '당신의 컬렉션을 이어서 완성해보세요.',
    '컬렉션으로 들어가기',
  ],
  signup: [
    '첫 번째 기억을 시작해요.',
    '계정을 만들고 소중한 순간을 천천히 모아보세요.',
    '나의 컬렉션 만들기',
  ],
}

const TABS = [
  ['login', '로그인'],
  ['signup', '회원가입'],
]

function Field({ label, ...input }) {
  return (
    <label className="mb-[22px] block">
      <span className="mb-[10px] block text-[10px] tracking-[.14em] text-[#4f463e] uppercase">
        {label}
      </span>
      <input
        className="h-[47px] w-full rounded-none border-0 border-b border-line bg-transparent p-0 text-[14px] text-ink outline-0 transition-[border-color] duration-150 ease-film placeholder:text-[#a69c92] focus:border-cognac"
        {...input}
      />
    </label>
  )
}

export default function AuthForm({ mode, onModeChange }) {
  const isSignup = mode === 'signup'
  const [heading, description, submitLabel] = COPY[mode]

  const handleSubmit = (event) => {
    event.preventDefault()
    const { password, passwordConfirm } = event.currentTarget.elements
    if (passwordConfirm && password.value !== passwordConfirm.value) {
      passwordConfirm.setCustomValidity('비밀번호가 일치하지 않습니다.')
      passwordConfirm.reportValidity()
      return
    }
    // 여기 검증(minLength 8·비밀번호 일치·약관 required)은 전부 UX 편의용이다.
    // 신뢰 경계는 서버다 — 서버에서 같은 규칙을 다시 검증하고,
    // 약관 동의는 (동의 여부·동의 시각·약관 버전)을 레코드로 남겨야 한다.
    // TODO: 인증 API 연동
  }

  // 두 비밀번호 중 어느 쪽을 고쳐도 불일치 표시가 풀리게 폼 레벨에서 해제한다
  const clearMismatch = (event) =>
    event.currentTarget.elements.passwordConfirm?.setCustomValidity('')

  return (
    <div className="flex min-w-0 flex-col bg-paper px-[clamp(38px,5vw,76px)] pt-[clamp(56px,6vw,94px)] pb-[42px] max-[860px]:min-h-[57dvh] max-[860px]:px-[24px] max-[860px]:pt-[42px] max-[860px]:pb-[30px]">
      <p className="mt-0 mb-[50px] text-[11px] font-medium tracking-[.12em] text-cognac max-[860px]:mb-[30px]">
        No. 001
      </p>
      <h2 className="mt-0 mb-[13px] text-[clamp(34px,2.5vw,42px)] leading-[1.18] font-semibold tracking-[-.045em] break-keep text-balance max-[860px]:text-[40px]">
        {heading}
      </h2>
      <p className="mt-0 mb-[38px] text-[13px] leading-[1.8] break-keep text-muted">
        {description}
      </p>

      <div className="mb-[34px] flex gap-[30px] border-b border-line">
        {TABS.map(([value, label]) => {
          const selected = mode === value
          return (
            <button
              key={value}
              className={`relative cursor-pointer border-0 bg-transparent pb-[13px] text-[12px] tracking-[.08em] ${selected ? 'text-ink' : 'text-muted'}`}
              type="button"
              aria-pressed={selected}
              onClick={() => onModeChange(value)}
            >
              {label}
              <span
                className={`absolute right-0 -bottom-px left-0 h-px bg-ink transition-transform duration-700 ease-film ${selected ? 'origin-left scale-x-100' : 'origin-right scale-x-0'}`}
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>

      {/* method="post": 전송은 JS가 하지만, 기본 동작이 살아나도 비밀번호가 URL 쿼리에 실리지 않게 */}
      <form method="post" onSubmit={handleSubmit} onInput={clearMismatch}>
        {isSignup && (
          <Field
            label="이름"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="이름을 입력해주세요"
            required
          />
        )}
        <Field
          label="이메일"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="atelier@example.com"
          required
        />
        <Field
          // 탭이 바뀌면 새 입력으로 마운트한다. 같은 자리를 재사용하면
          // 로그인용으로 친 비밀번호가 가입용 필드에 그대로 남는다
          key={`password-${mode}`}
          label="비밀번호"
          name="password"
          type="password"
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          placeholder="8자 이상 입력해주세요"
          minLength={8}
          required
        />
        {isSignup && (
          <Field
            label="비밀번호 확인"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 한 번 더 입력해주세요"
            required
          />
        )}

        <div className="m-0 mb-[20px] flex min-h-[32px] items-center justify-between gap-[16px] text-[11px] text-muted max-[430px]:flex-col max-[430px]:items-start">
          {isSignup ? (
            <label className="inline-flex cursor-pointer items-center gap-[8px]">
              <input className="accent-ink" type="checkbox" name="terms" required />
              이용약관 및 개인정보 처리방침에 동의합니다.
            </label>
          ) : (
            <>
              <label className="inline-flex cursor-pointer items-center gap-[8px]">
                <input className="accent-ink" type="checkbox" name="remember" />
                로그인 유지
              </label>
              {/* 비밀번호 찾기 화면이 아직 없어 폴백(로그인 화면)으로 떨어진다.
                  TODO: 비밀번호 찾기 라우트 연결 */}
              <Link
                className="text-inherit underline decoration-[rgba(117,107,97,.42)] underline-offset-4"
                to="/forgot-password"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </>
          )}
        </div>

        <button
          className="flex min-h-[56px] w-full cursor-pointer items-center justify-center rounded-none border-0 bg-ink px-[22px] text-[12px] tracking-[.08em] text-cream transition-[transform,background-color] duration-700 ease-film hover:bg-ink-hover active:scale-[.98]"
          type="submit"
        >
          <span>{submitLabel}</span>
        </button>
      </form>

      <SocialAuth />

      <p className="mt-auto mb-0 pt-[38px] text-[9px] tracking-[.1em] text-[#9a9086] uppercase">
        Memory Atelier · Seoul · Est. 2026
      </p>
    </div>
  )
}
