import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../components/Header'
import Panel from '../../components/Panel'
import Button from '../../components/Button'
import {
    analyzeMemory,
    createMemory,
    pollEditionGeneration,
    requestEditionGeneration,
} from '../../api/edition'

export default function EditionGeneratingPage() {
    const navigate = useNavigate()

    const [error, setError] = useState('')
    const [attempt, setAttempt] = useState(0)

    // 추억 등록과 생성 요청은 크레딧이 걸린 일이다 — 어떤 이유로든 두 번 돌지 않게 막는다
    const started = useRef(false)

    useEffect(() => {
        if (started.current) return
        started.current = true

        let cancelled = false

        const run = async () => {
            const form = JSON.parse(
                sessionStorage.getItem('edition-form') || 'null',
            )

            const request = JSON.parse(
                sessionStorage.getItem('edition-request') || 'null',
            )

            if (!form || !request) {
                navigate('/edition/create', { replace: true })
                return
            }

            // 접수된 회차가 있으면 요청하지 않고 그 회차를 이어서 지켜본다 —
            // 재시도·새로고침이 회차를 한 번 더 결제하게 두면 안 된다
            let generationId = sessionStorage.getItem('edition-generation-id')

            if (!generationId) {
                // 콘셉트를 더 뽑으러 들어온 회차면 추억은 이미 있다 — 사진·사연을 또 올리지 않는다
                let memoryId = sessionStorage.getItem('edition-memory-id')

                if (!memoryId) {
                    const memory = await createMemory({
                        image: form.image,
                        story: request.story,
                        categoryMain: request.categoryMain,
                        categorySub: request.categorySub,
                        materialUser: request.materialUser,
                        editionCategory: request.editionCategoryMain,
                    })

                    memoryId = memory.memoryId

                    // 분석을 거치지 않은 추억은 에디션을 생성할 수 없다.
                    // 분석까지 끝난 뒤에 기억해둔다 — 중간에 실패한 추억을 재시도가 그대로 쓰면 또 막힌다
                    await analyzeMemory(memoryId)

                    sessionStorage.setItem('edition-memory-id', memoryId)
                }

                const accepted = await requestEditionGeneration(memoryId, {
                    categoryMain: request.editionCategoryMain,
                    categorySub: request.editionCategorySub,
                })

                generationId = accepted.generationId

                sessionStorage.setItem('edition-generation-id', generationId)
            }

            const generation = await pollEditionGeneration(
                generationId,
                () => cancelled,
            )

            if (!generation) return

            // 이 회차는 받아냈다 — 다음에 들어오면 새 회차를 돌려야 한다.
            // 콘셉트는 여기서 들고 가지 않는다 — 콘셉트 화면이 회차 이력을 서버에서 읽는다
            sessionStorage.removeItem('edition-generation-id')

            navigate('/edition/create/concepts', { replace: true })
        }

        run().catch((caught) => {
            // 없는 회차(404)나 전량 실패한 회차를 들고 있으면 재시도도, 회차 추가도
            // 같은 에러로 되돌아온다 — 죽은 id 는 버려야 다음 회차를 돌릴 수 있다
            if (caught.status === 404 || caught.generationDead) {
                sessionStorage.removeItem('edition-generation-id')
            }

            if (!cancelled) {
                setError(caught.message)
            }
        })

        return () => {
            cancelled = true
        }
    }, [navigate, attempt])

    const handleRetry = () => {
        started.current = false
        setError('')
        setAttempt((prev) => prev + 1)
    }

    return (
        <>
            <Header />

            <main className="flex min-h-[calc(100dvh-56px)] w-full items-center justify-center px-[24px]">
                <div className="w-full max-w-[430px] text-center">
                    <Panel>
                        <img
                            src="/assets/logo.png"
                            alt=""
                            className="mx-auto h-[50px] w-auto"
                        />

                        {error ? (
                            <>
                                <h1 className="mt-[28px] mb-0 text-[24px] font-semibold tracking-[-.03em]">
                                    생성하지 못했습니다
                                </h1>

                                <p className="mt-[12px] mb-0 text-[11px] leading-[1.8] text-ink/50">
                                    {error}
                                </p>

                                <div className="mt-[24px] flex justify-center gap-[10px]">
                                    <Button
                                        variant="secondary"
                                        href="/edition/create"
                                    >
                                        입력 화면으로
                                    </Button>

                                    <Button onClick={handleRetry}>
                                        다시 시도
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
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
                            </>
                        )}
                    </Panel>
                </div>
            </main>
        </>
    )
}
