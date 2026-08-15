import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../components/Header'
import Panel from '../../components/Panel'

export default function EditionGeneratingPage() {
    const navigate = useNavigate()

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/edition/create/concepts')
        }, 2500)

        return () => clearTimeout(timer)
    }, [navigate])

    return (
        <>
            <Header />

            <main className="flex min-h-[calc(100dvh-68px)] w-full items-center justify-center px-[24px]">
                <div className="w-full max-w-[430px] text-center">
                    <Panel>
                        <img
                            src="/assets/logo.png"
                            alt=""
                            className="mx-auto h-[50px] w-auto"
                        />

                        <h1 className="mt-[28px] mb-0 text-[24px] font-semibold tracking-[-.03em]">
                            에디션 생성 중
                        </h1>

                        <p className="mt-[12px] mb-0 text-[11px] leading-[1.8] text-ink/50">
                            옷의 색감 · 패턴 · 질감과 추억 사연을 분석하고 있어요.
                        </p>

                        <div className="mt-[18px] flex justify-center gap-[5px]">
                            <span className="size-[5px] rounded-full bg-clay" />
                            <span className="size-[5px] rounded-full bg-[#d5c8b8]" />
                            <span className="size-[5px] rounded-full bg-[#d5c8b8]" />
                        </div>

                        <div className="mt-[22px] h-[2px] w-full overflow-hidden bg-[#ddd2c4]">
                            <div className="h-full w-[62%] bg-[#a77e60]" />
                        </div>

                        <p className="mt-[18px] mb-0 text-[8px] tracking-[.14em] text-ink/35">
                            약 40초 소요 · 창을 닫아도 진행됩니다
                        </p>
                    </Panel>
                </div>
            </main>
        </>
    )
}