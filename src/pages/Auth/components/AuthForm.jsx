import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { login, signup } from '../../../api/auth'
import { saveTokens } from '../../../api/client'

// 서버와 같은 규칙: 영문·숫자·특수문자 각 1개 이상.
// HTML pattern 은 v 플래그로 컴파일돼서 문자 클래스 안 괄호는 이스케이프해야 한다 —
// 컴파일에 실패하면 브라우저가 pattern 을 통째로 무시한다
const PASSWORD_PATTERN = '^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*\\(\\)_+]).*$'

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
  const navigate = useNavigate()
  const isSignup = mode === 'signup'
  const [heading, description, submitLabel] = COPY[mode]
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  // 로그인·회원가입이 전부 이 값 하나로 저장 위치를 정한다
  const [remember, setRemember] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { nickname, email, password, passwordConfirm } = event.currentTarget.elements
    if (passwordConfirm && password.value !== passwordConfirm.value) {
      passwordConfirm.setCustomValidity('비밀번호가 일치하지 않습니다.')
      passwordConfirm.reportValidity()
      return
    }
    // 여기 검증(minLength 8·비밀번호 일치·약관 required)은 전부 UX 편의용이다.
    // 신뢰 경계는 서버다 — 서버에서 같은 규칙을 다시 검증하고,
    // 약관 동의는 (동의 여부·동의 시각·약관 버전)을 레코드로 남겨야 한다.
    const credentials = { email: email.value, password: password.value }
    setError('')
    setSubmitting(true)
    try {
      if (isSignup) await signup({ nickname: nickname.value, ...credentials })
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
      return
    }
    try {
      // 가입 응답에는 토큰이 없다 — 방금 친 값으로 바로 로그인해 재입력을 시키지 않는다
      saveTokens(await login(credentials), remember)
      navigate('/collection')
    } catch (err) {
      // 계정은 이미 만들어졌다 — 가입 탭에 그대로 두면 재시도가 "이미 가입된 이메일" 로 막힌다
      if (isSignup) onModeChange('login')
      setError(isSignup ? '가입은 완료됐어요. 로그인해주세요.' : err.message)
      setSubmitting(false)
    }
  }

  // 두 비밀번호 중 어느 쪽을 고쳐도 불일치·형식 안내가 풀리게 폼 레벨에서 해제한다
  const clearMismatch = (event) => {
    const { password, passwordConfirm } = event.currentTarget.elements
    password.setCustomValidity('')
    passwordConfirm?.setCustomValidity('')
  }

  // 로그인·회원가입 두 탭에 같은 체크박스를 둔다 — 저장 위치 규칙이 하나여야 예외가 안 생긴다.
  // key 는 필수다 — 없으면 탭을 바꿀 때 React 가 약관 체크박스와 같은 DOM 을 재사용해서
  // "로그인 유지" 를 켠 사람에게 약관이 이미 동의된 것처럼 보인다
  const rememberBox = (
    <label
      key="remember"
      className="inline-flex shrink-0 cursor-pointer items-center gap-[8px] whitespace-nowrap"
    >
      <input
        className="accent-ink"
        type="checkbox"
        checked={remember}
        onChange={(event) => setRemember(event.target.checked)}
      />
      로그인 유지
    </label>
  )

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
              // 로그인 실패 문구가 가입 탭까지 따라오지 않게 탭을 바꿀 때 지운다
              onClick={() => {
                setError('')
                onModeChange(value)
              }}
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
            label="닉네임"
            name="nickname"
            type="text"
            autoComplete="nickname"
            placeholder="닉네임을 입력해주세요 (10자 이내)"
            maxLength={10}
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
          placeholder={isSignup ? '영문·숫자·특수문자 포함 8~20자' : '8자 이상 입력해주세요'}
          minLength={8}
          required
          // 기존 회원 비밀번호는 새 규칙과 다를 수 있다 — 로그인 쪽엔 pattern 을 걸지 않는다.
          // 브라우저 기본 문구가 불친절해서 onInvalid 로 한글 안내를 준다(입력하면 clearMismatch 가 해제)
          {...(isSignup && {
            maxLength: 20,
            pattern: PASSWORD_PATTERN,
            onInvalid: (event) =>
              event.currentTarget.setCustomValidity(
                '영문·숫자·특수문자(!@#$%^&*()_+)를 각각 하나 이상 넣어 8~20자로 입력해주세요.',
              ),
          })}
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

        {/* 가입 탭은 약관 문구 + 로그인 유지가 한 줄에 들어가 좁아지면 넘친다 — 접히게 둔다 */}
        <div className="m-0 mb-[20px] flex min-h-[32px] flex-wrap items-center justify-between gap-[16px] text-[11px] text-muted max-[430px]:flex-col max-[430px]:items-start">
          {isSignup ? (
            <>
              <label
                key="terms"
                className="inline-flex min-w-0 cursor-pointer items-center gap-[8px] break-keep"
              >
                <input
                  className="accent-ink shrink-0"
                  type="checkbox"
                  name="terms"
                  required
                />
                이용약관 및 개인정보 처리방침에 동의합니다.
              </label>
              {rememberBox}
            </>
          ) : (
            <>
              {rememberBox}
              {/* 비밀번호 찾기 화면이 아직 없어 폴백(로그인 화면)으로 떨어진다.
                  TODO: 비밀번호 찾기 라우트 연결 */}
              <Link
                key="forgot"
                className="text-inherit underline decoration-[rgba(117,107,97,.42)] underline-offset-4"
                to="/forgot-password"
              >
                비밀번호를 잊으셨나요?
              </Link>
            </>
          )}
        </div>

        {error && (
          <p className="mt-0 mb-[14px] text-[11px] leading-[1.7] break-keep text-cognac" role="alert">
            {error}
          </p>
        )}

        <button
          className="flex min-h-[56px] w-full cursor-pointer items-center justify-center rounded-none border-0 bg-ink px-[22px] text-[12px] tracking-[.08em] text-cream transition-[transform,background-color] duration-700 ease-film hover:bg-ink-hover active:scale-[.98] disabled:cursor-default disabled:bg-muted"
          type="submit"
          disabled={submitting}
        >
          <span>{submitting ? '보내는 중' : submitLabel}</span>
        </button>
      </form>

      <p className="mt-auto mb-0 pt-[38px] text-[9px] tracking-[.1em] text-[#9a9086] uppercase">
        Memory Atelier · Seoul · Est. 2026
      </p>
    </div>
  )
}
