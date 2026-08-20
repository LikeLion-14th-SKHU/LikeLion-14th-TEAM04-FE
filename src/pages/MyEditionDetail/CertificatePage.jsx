import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'
import { domToBlob } from 'modern-screenshot'

import Header from '../../components/Header'
import Button from '../../components/Button'

import { getCertificate } from '../../api/certificate'
import { getMyCollectionEdition } from '../../api/collection'

const formatDate = (value) => {
    if (!value) return '-'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
        return value
    }

    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date)
}

export default function CertificatePage() {
    const { conceptId } = useParams()

    const certificateRef = useRef(null)

    const [certificate, setCertificate] =
        useState(null)

    const [editionImage, setEditionImage] =
        useState('')

    const [loading, setLoading] =
        useState(true)

    const [error, setError] = useState('')

    // =========================
    // 보증서 + 에디션 이미지 조회
    // =========================
    useEffect(() => {
        if (!conceptId) return

        let cancelled = false

        const loadCertificate = async () => {
            setLoading(true)
            setError('')

            try {
                const [
                    certificateData,
                    editionData,
                ] = await Promise.all([
                    getCertificate(conceptId),
                    getMyCollectionEdition(
                        conceptId,
                    ),
                ])

                if (cancelled) return

                setCertificate(
                    certificateData
                        ?.certificate ?? null,
                )

                setEditionImage(
                    editionData?.imageUrl ?? '',
                )
            } catch (loadError) {
                if (cancelled) return

                console.error(
                    '보증서 조회 실패:',
                    loadError,
                )

                setError(
                    loadError.message ??
                    '보증서를 불러오지 못했습니다.',
                )
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
            }
        }

        loadCertificate()

        return () => {
            cancelled = true
        }
    }, [conceptId])

    // =========================
    // 이미지 로딩 대기
    // =========================
    const waitForImages = async (node) => {
        const images = [
            ...node.querySelectorAll('img'),
        ]

        await Promise.all(
            images.map((img) => {
                if (
                    img.complete &&
                    img.naturalWidth > 0
                ) {
                    return Promise.resolve()
                }

                return new Promise((resolve) => {
                    img.onload = resolve
                    img.onerror = resolve
                })
            }),
        )
    }

    // =========================
    // 보증서 PNG 생성
    // =========================
    const createCertificateImage =
        async () => {
            if (!certificateRef.current) {
                return null
            }

            const node = certificateRef.current

            await document.fonts?.ready
            await waitForImages(node)

            return domToBlob(node, {
                scale: 2,
                backgroundColor: '#f6f0e6',
            })
        }

    const certificateFileName = `memory-atelier-${certificate?.editionNumber || conceptId || 'certificate'}.png`

    // =========================
    // 저장
    // =========================
    const handleSave = async () => {
        try {
            const blob =
                await createCertificateImage()

            if (!blob) return

            const url =
                URL.createObjectURL(blob)

            const link =
                document.createElement('a')

            link.download =
                certificateFileName

            link.href = url

            document.body.appendChild(link)

            link.click()
            link.remove()

            setTimeout(
                () => URL.revokeObjectURL(url),
                1000,
            )
        } catch (saveError) {
            console.error(
                '보증서 이미지 저장 실패:',
                saveError,
            )

            alert(
                '보증서 이미지를 저장하지 못했습니다.',
            )
        }
    }

    // =========================
    // 공유
    // =========================
    const handleShare = async () => {
        try {
            const blob =
                await createCertificateImage()

            if (!blob) return

            const file = new File(
                [blob],
                certificateFileName,
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
                    files: [file],
                })

                return
            }

            if (navigator.share) {
                await navigator.share({
                    title:
                        'Memory Atelier Digital Certificate',
                    text: `${certificate.editionName} 디지털 보증서`,
                    url: window.location.href,
                })

                return
            }

            await navigator.clipboard.writeText(
                window.location.href,
            )

            alert(
                '보증서 링크가 복사되었습니다.',
            )
        } catch (shareError) {
            if (
                shareError.name ===
                'AbortError'
            ) {
                return
            }

            console.error(
                '보증서 공유 실패:',
                shareError,
            )

            alert(
                '보증서를 공유하지 못했습니다.',
            )
        }
    }

    // =========================
    // 로딩
    // =========================
    if (loading) {
        return (
            <>
                <Header />

                <main className="flex min-h-[calc(100dvh-56px)] items-center justify-center px-[24px]">
                    <div className="w-full max-w-[520px] bg-[#f6f0e6] py-[56px] text-center">
                        <p className="m-0 text-[13px] text-ink/50">
                            보증서를 불러오는
                            중입니다.
                        </p>
                    </div>
                </main>
            </>
        )
    }

    // =========================
    // 오류
    // =========================
    if (error || !certificate) {
        return (
            <>
                <Header />

                <main className="flex min-h-[calc(100dvh-56px)] items-center justify-center px-[24px]">
                    <div className="w-full max-w-[520px] bg-[#f6f0e6] py-[56px] text-center">
                        <p className="m-0 text-[13px] text-[#7d4526]">
                            {error ||
                                '보증서를 찾을 수 없습니다.'}
                        </p>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <Header />

            <main className="min-h-[calc(100dvh-56px)] px-[24px] pt-[36px] pb-[48px]">
                {/* 상단 타이틀 */}
                <p className="m-0 text-center text-[8px] tracking-[.24em] text-ink/40">
                    DIGITAL CERTIFICATE
                </p>

                {/* 보증서 */}
                <div
                    ref={certificateRef}
                    className="mx-auto mt-[26px] w-full max-w-[455px] bg-[#f6f0e6] p-[28px]"
                >
                    <div className="border border-[#d6c6b3] p-[20px]">
                        {/* 로고 */}
                        <div className="text-center">
                            <img
                                src="/assets/logo.png"
                                alt="Memory Atelier"
                                className="mx-auto h-[44px] w-auto"
                            />

                            <p className="mt-[10px] mb-0 text-[7px] tracking-[.25em] text-clay">
                                CERTIFICATE OF
                                AUTHENTICITY
                            </p>
                        </div>

                        {/* 에디션 이미지 */}
                        <div className="mt-[20px] flex aspect-square w-full items-center justify-center overflow-hidden bg-[#ded0ba]">
                            {editionImage ? (
                                <img
                                    src={
                                        editionImage
                                    }
                                    alt={
                                        certificate.editionName
                                    }
                                    className="h-full w-full object-contain p-[18px]"
                                    onError={(
                                        event,
                                    ) => {
                                        event.currentTarget.style.display =
                                            'none'
                                    }}
                                />
                            ) : (
                                <span className="text-[8px] tracking-[.12em] text-ink/35">
                                    EDITION IMAGE
                                </span>
                            )}
                        </div>

                        {/* 에디션 이름 */}
                        <h1 className="mt-[18px] mb-0 text-[22px] font-normal">
                            {certificate.editionName}
                        </h1>

                        {/* 에디션 번호 */}
                        <p className="mt-[5px] mb-0 text-[11px] text-ink/55">
                            Edition No. {certificate.editionNumber}
                        </p>

                        {/* 카테고리 */}
                        {certificate.category && (
                            <p className="mt-[6px] mb-0 text-[8px] tracking-[.1em] text-ink/40">
                                {
                                    certificate.category
                                }
                            </p>
                        )}

                        {/* 생성 날짜 */}
                        <div className="mt-[18px]">
                            <p className="m-0 text-[9px] font-medium">
                                생성 날짜
                            </p>

                            <p className="mt-[5px] mb-0 text-[9px] text-ink/50">
                                {formatDate(
                                    certificate.issuedAt,
                                )}
                            </p>
                        </div>

                        {/* 추억 스토리 */}
                        <div className="mt-[15px]">
                            <p className="m-0 text-[9px] font-medium">
                                추억 스토리
                            </p>

                            <p className="mt-[6px] mb-0 text-[9.5px] leading-[1.8] text-ink/60">
                                {certificate.story ||
                                    '-'}
                            </p>
                        </div>

                        {/* 보증서 번호 */}
                        <div className="mt-[18px] flex items-end justify-between border-t border-[#d8cbbb] pt-[14px]">
                            <div>

                                <p className="mt-[4px] mb-0 text-[8px] text-ink/55">
                                    {certificate.certificateText ||
                                        '-'}
                                </p>
                            </div>

                        </div>
                    </div>
                </div>

                {/* 저장 / 공유 */}
                <div className="mx-auto mt-[18px] grid w-full max-w-[455px] grid-cols-2 gap-[10px]">
                    <Button
                        variant="secondary"
                        onClick={handleSave}
                    >
                        ↓ 저장
                    </Button>

                    <Button
                        onClick={handleShare}
                    >
                        ↗ 공유
                    </Button>
                </div>

                <p className="mt-[26px] mb-0 text-center text-[8px] tracking-[.08em] text-ink/35">
                    보증서에는 에디션 번호와 생성
                    기록이 함께 저장됩니다.
                </p>
            </main>
        </>
    )
}
