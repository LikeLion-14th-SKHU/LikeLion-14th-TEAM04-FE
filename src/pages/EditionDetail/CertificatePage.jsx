import { useRef } from 'react'
import { useNavigate } from 'react-router'
import { toPng } from 'html-to-image'
import Header from '../../components/Header'
import Button from '../../components/Button'

const CERTIFICATE = {
    editionName: 'Edition No. 001',
    date: '2026.08.04',
    story:
        '할머니께서 생일 선물로 사주신 원피스예요. 함께 여행 갔던 날의 추억이 가장 많이 담겨 있습니다.',
    certificateNumber: 'MA-2026-0804-001',
    image: '/assets/collection/clothing-01.png',
}

export default function CertificatePage() {
    const navigate = useNavigate()
    const certificateRef = useRef(null)

    const handleSave = async () => {
        if (!certificateRef.current) return

        try {
            const dataUrl = await toPng(
                certificateRef.current,
                {
                    cacheBust: true,
                    pixelRatio: 2,
                    backgroundColor: '#ffffff',
                },
            )

            const link = document.createElement('a')

            link.download = `${CERTIFICATE.certificateNumber}.png`
            link.href = dataUrl

            link.click()
        } catch (error) {
            console.error(
                '보증서 이미지 저장에 실패했습니다.',
                error,
            )
        }
    }

    const handleShare = async () => {
        if (!certificateRef.current) return

        try {
            // 보증서 영역만 이미지로 만든다.
            const dataUrl = await toPng(
                certificateRef.current,
                {
                    cacheBust: true,
                    pixelRatio: 2,
                    backgroundColor: '#ffffff',
                },
            )

            const response = await fetch(dataUrl)
            const blob = await response.blob()

            const file = new File(
                [blob],
                `${CERTIFICATE.certificateNumber}.png`,
                {
                    type: 'image/png',
                },
            )

            // 이미지 파일 공유를 지원하는 브라우저
            if (
                navigator.share &&
                navigator.canShare?.({
                    files: [file],
                })
            ) {
                await navigator.share({
                    title: 'Memory Atelier Digital Certificate',
                    text: `${CERTIFICATE.editionName} 디지털 보증서`,
                    files: [file],
                })

                return
            }

            // 파일 공유 미지원 시 URL 공유
            if (navigator.share) {
                await navigator.share({
                    title: 'Memory Atelier Digital Certificate',
                    text: `${CERTIFICATE.editionName} 디지털 보증서`,
                    url: window.location.href,
                })

                return
            }

            await navigator.clipboard.writeText(
                window.location.href,
            )

            alert('보증서 링크가 복사되었습니다.')
        } catch (error) {
            // 사용자가 공유창을 닫는 경우도 있으므로 콘솔만 표시
            console.error(
                '보증서 공유에 실패했습니다.',
                error,
            )
        }
    }

    return (
        <>
            <Header />

            <main className="min-h-[calc(100dvh-78px)] bg-[#b88b6c] px-[24px] pt-[36px] pb-[48px]">
                <p className="m-0 text-center text-[8px] tracking-[.24em] text-ink/40">
                    DIGITAL CERTIFICATE
                </p>

                {/* 
          저장되는 영역 시작.
          certificateRef가 붙은 이 div만 PNG가 된다.
        */}
                <div
                    ref={certificateRef}
                    className="mx-auto mt-[26px] w-full max-w-[455px] bg-white p-[28px]"
                >
                    <div className="border border-[#d6c6b3] p-[20px]">
                        <div className="text-center">
                            <img
                                src="/assets/logo.png"
                                alt=""
                                className="mx-auto h-[44px] w-auto"
                            />

                            <p className="mt-[10px] mb-0 text-[7px] tracking-[.25em] text-clay">
                                CERTIFICATE OF AUTHENTICITY
                            </p>
                        </div>

                        <div className="mt-[20px] flex h-[240px] items-center justify-center bg-[#d7c5a8]">
                            {CERTIFICATE.image ? (
                                <img
                                    src={CERTIFICATE.image}
                                    alt="에디션"
                                    className="h-[90%] w-[90%] object-contain"
                                />
                            ) : (
                                <span className="text-[8px] text-ink/35">
                                    3D 굿즈 렌더
                                </span>
                            )}
                        </div>

                        <h1 className="mt-[18px] mb-0 font-brand text-[22px] font-normal">
                            {CERTIFICATE.editionName}
                        </h1>

                        <div className="mt-[18px]">
                            <p className="m-0 text-[9px] font-medium">
                                생성 날짜
                            </p>

                            <p className="mt-[5px] mb-0 text-[9px] text-ink/50">
                                {CERTIFICATE.date}
                            </p>
                        </div>

                        <div className="mt-[15px]">
                            <p className="m-0 text-[9px] font-medium">
                                추억 스토리
                            </p>

                            <p className="mt-[6px] mb-0 text-[9.5px] leading-[1.8] text-ink/60">
                                {CERTIFICATE.story}
                            </p>
                        </div>

                        <div className="mt-[18px] flex items-end justify-between border-t border-[#e4dacf] pt-[14px]">
                            <p className="m-0 text-[8px] text-ink/40">
                                {CERTIFICATE.certificateNumber}
                            </p>

                            <span
                                className="size-[34px] bg-[#dfd2bd]"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </div>
                {/* 저장되는 영역 끝 */}

                <div className="mx-auto mt-[18px] grid w-full max-w-[455px] grid-cols-2 gap-[10px]">
                    <Button
                        variant="secondary"
                        onClick={handleSave}
                    >
                        ↓ 저장
                    </Button>

                    <Button onClick={handleShare}>
                        ↗ 공유
                    </Button>
                </div>

                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="mx-auto mt-[18px] block cursor-pointer border-0 bg-transparent p-0 text-[9px] text-ink/45 hover:text-ink"
                >
                    에디션으로 돌아가기
                </button>

                <p className="mt-[26px] mb-0 text-center text-[8px] tracking-[.08em] text-ink/35">
                    보증서에는 에디션 번호와 생성 기록이 함께 저장됩니다.
                </p>
            </main>
        </>
    )
}