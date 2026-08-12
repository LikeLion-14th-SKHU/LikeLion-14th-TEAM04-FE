import { useState } from 'react'
import Header from '../../components/Header'
import FilmPane from './components/FilmPane'
import AuthForm from './components/AuthForm'

export default function AuthPage() {
  const [mode, setMode] = useState('login')

  return (
    // Header 를 main 밖에 둔다 — main 안의 <header> 는 banner 랜드마크로 안 잡힌다
    <>
      <Header />
      <main className="min-h-[100dvh] w-full bg-paper">
        <section
          className="grid min-h-[calc(100dvh-78px)] grid-cols-[minmax(0,1.5fr)_minmax(390px,.75fr)] max-[860px]:min-h-[auto] max-[860px]:grid-cols-1"
          aria-label="계정 인증"
        >
          <FilmPane />
          <AuthForm mode={mode} onModeChange={setMode} />
        </section>
      </main>
    </>
  )
}
