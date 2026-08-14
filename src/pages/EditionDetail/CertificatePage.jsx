import { useRef } from 'react'
import { useParams } from 'react-router'
import { toPng } from 'html-to-image'

import Header from '../../components/Header'
import Button from '../../components/Button'

import { editions } from '../../data/editions'

export default function CertificatePage() {
    const { editionId } = useParams()

    const certificateRef = useRef(null)

    const edition = editions.find(
        (item) => item.id === Number(editionId),
    )

    if (!edition) {
        return (
            <>
                <Header />

                <main className="flex min-h-[calc(100dvh-78px)] items-center justify-center bg-paper">
                    <p className="text-[13px] text-ink/50">
                        에디션을 찾을 수 없습니다.
                    </p>
                </main>
            </>
        )
    }

    const waitForImages = async (node) => {
        const images = [...node.querySelectorAll('img')]

        await Promise.all(
            images.map((img) => {
                if (img.complete && img.naturalWidth > 0) {
                    return Promise.resolve()
                }

                return new Promise((resolve) => {
                    img.onload = resolve

                    // 이미지가 깨져도 보증서 캡처 자체는 계속
                    img.onerror = resolve
                })
            }),
        )
    }

    const createCertificateImage = async () => {
        if (!certificateRef.current) return null

        await waitForImages(certificateRef.current)

        return toPng(certificateRef.current, {
            pixelRatio: 2,
            cacheBust: false,
            backgroundColor: '#ffffff',
        })
    }

    const handleSave = async () => {
        try {
            const dataUrl =
                await createCertificateImage()

            if (!dataUrl) return

            const link = document.createElement('a')

            link.download = `${edition.certificate.number}.png`
            link.href = dataUrl

            document.body.appendChild(link)

            link.click()
            link.remove()
        } catch (error) {
            console.error(
                '보증서 이미지 저장에 실패했습니다.',
                error,
            )
        }
    }

    const handleShare = async () => {
        try {
            const dataUrl =
                await createCertificateImage()

            if (!dataUrl) return

            const response = await fetch(dataUrl)
            const blob = await response.blob()

            const file = new File(
                [blob],
                `${edition.certificate.number}.png`,
                {
                    type: 'image/png',
                },
            )

            if (
                navigator.share &&
                navigator.canShare?.({
                    files: [file],
                })
            ) {
                await navigator.share({
                    title:
                        'Memory Atelier Digital Certificate',
                    text: `${edition.name} 디지털 보증서`,
                    files: [file],
                })

                return
            }

            if (navigator.share) {
                await navigator.share({
                    title:
                        'Memory Atelier Digital Certificate',
                    text: `${edition.name} 디지털 보증서`,
                    url: window.location.href,
                })

                return
            }

            await navigator.clipboard.writeText(
                window.location.href,
            )

            alert('보증서 링크가 복사되었습니다.')
        } catch (error) {
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

                {/* 이 부분만 이미지로 저장 */}
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
                            {edition.images?.image2d ? (
                                <img
                                    src={edition.images.image2d}
                                    alt={edition.name}
                                    className="h-[90%] w-[90%] object-contain"
                                    onError={(event) => {
                                        event.currentTarget.style.display = 'none'
                                    }}
                                />
                            ) : (
                                <span className="text-[8px] text-ink/35">
                                    2D EDITION IMAGE
                                </span>
                            )}
                        </div>

                        <h1 className="mt-[18px] mb-0 font-brand text-[22px] font-normal">
                            Edition No. {edition.number} ·{' '}
                            {edition.name}
                        </h1>

                        <div className="mt-[18px]">
                            <p className="m-0 text-[9px] font-medium">
                                생성 날짜
                            </p>

                            <p className="mt-[5px] mb-0 text-[9px] text-ink/50">
                                {edition.createdAt}
                            </p>
                        </div>

                        <div className="mt-[15px]">
                            <p className="m-0 text-[9px] font-medium">
                                추억 스토리
                            </p>

                            <p className="mt-[6px] mb-0 text-[9.5px] leading-[1.8] text-ink/60">
                                {edition.story}
                            </p>
                        </div>

                        <div className="mt-[18px] flex items-end justify-between border-t border-[#e4dacf] pt-[14px]">
                            <p className="m-0 text-[8px] text-ink/40">
                                {edition.certificate.number}
                            </p>

                            <span
                                className="size-[34px] bg-[#dfd2bd]"
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </div>

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

                <p className="mt-[26px] mb-0 text-center text-[8px] tracking-[.08em] text-ink/35">
                    보증서에는 에디션 번호와 생성 기록이 함께 저장됩니다.
                </p>
            </main>
        </>
    )
}