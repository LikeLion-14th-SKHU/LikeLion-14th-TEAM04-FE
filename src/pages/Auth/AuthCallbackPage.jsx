import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import Header from '../../components/Header'
import Panel from '../../components/Panel'
import { PROVIDERS, socialLogin } from '../../api/auth'
import { saveTokens } from '../../api/client'

export default function AuthCallbackPage() {
  const { provider } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  // 인가 코드는 1회용이다 — effect 가 두 번 돌면 두 번째 교환은 반드시 실패한다
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const denied = searchParams.get('error')
    const savedState = sessionStorage.getItem('oauth-state')
    const remember = sessionStorage.getItem('oauth-remember') === 'true'
    sessionStorage.removeItem('oauth-state')
    sessionStorage.removeItem('oauth-remember')
    // 파라미터를 다 읽은 뒤 주소창을 비운다 — 실패해도 인가 코드가 히스토리에 남지 않게.
    // history.replaceState 를 직접 부르면 라우터가 들고 있는 인덱스가 깨져 뒤로가기가 어긋난다
    navigate(window.location.pathname, { replace: true })

    const problem = !PROVIDERS.includes(provider)
      ? '지원하지 않는 로그인 방식입니다.'
      : denied
        ? '로그인이 취소되었습니다.'
        : !code
          ? '인가 코드를 받지 못했습니다.'
          : !state || state !== savedState
            ? '로그인 요청을 확인하지 못했습니다. 다시 시도해주세요.'
            : ''
    if (problem) {
      setError(problem)
      return
    }

    // 카카오·구글 콜백은 code 만 받는다
    socialLogin(provider, provider === 'naver' ? { code, state } : { code })
      .then((tokens) => {
        saveTokens(tokens, remember)
        navigate('/collection', { replace: true })
      })
      .catch((err) => setError(err.message))
  }, [provider, searchParams, navigate])

  return (
    <>
      <Header />

      <main className="flex min-h-[calc(100dvh-56px)] w-full items-center justify-center px-[24px]">
        <div className="w-full max-w-[430px] text-center">
          <Panel>
            <p className="mt-0 mb-[14px] text-[10px] tracking-[.14em] text-cognac uppercase">
              Social Sign In
            </p>
            {error ? (
              <>
                <h1 className="mt-0 mb-[12px] text-[20px] font-semibold tracking-[-.03em]">
                  로그인하지 못했어요
                </h1>
                <p className="mt-0 mb-[18px] text-[12px] leading-[1.8] break-keep text-muted" role="alert">
                  {error}
                </p>
                <Link
                  className="text-[12px] text-ink underline decoration-line underline-offset-4"
                  to="/"
                >
                  로그인 화면으로 돌아가기
                </Link>
              </>
            ) : (
              <>
                <h1 className="mt-0 mb-[12px] text-[20px] font-semibold tracking-[-.03em]">
                  로그인 중입니다
                </h1>
                <p className="mt-0 mb-0 text-[11px] leading-[1.8] text-ink/50">
                  잠시만 기다려주세요.
                </p>
              </>
            )}
          </Panel>
        </div>
      </main>
    </>
  )
}
