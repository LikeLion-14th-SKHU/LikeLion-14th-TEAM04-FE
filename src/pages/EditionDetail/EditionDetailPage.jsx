import { useState } from 'react'
import { useParams } from 'react-router'

import Header from '../../components/Header'
import Button from '../../components/Button'
import CurationCard from './components/CurationCard'

import { editions } from '../../data/editions'

export default function EditionDetailPage() {
    const { editionId } = useParams()

    const edition = editions.find(
        (item) => item.id === Number(editionId),
    )

    const [tab, setTab] = useState('info')

    const [isPublic, setIsPublic] = useState(
        edition?.isPublic ?? false,
    )

    const [likes, setLikes] = useState(
        edition?.likes ?? 0,
    )

    const [liked, setLiked] = useState(false)

    const [pendingPublicState, setPendingPublicState] =
        useState(null)

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

    const handleLike = () => {
        setLiked((prev) => !prev)

        setLikes((prev) =>
            liked ? prev - 1 : prev + 1,
        )
    }

    const handleToggleRequest = () => {
        setPendingPublicState(!isPublic)
    }

    const handleConfirmVisibility = () => {
        setIsPublic(pendingPublicState)

        // TODO: 공개/비공개 변경 API 연결

        setPendingPublicState(null)
    }

    const handleCancelVisibility = () => {
        setPendingPublicState(null)
    }

    return (
        <>
            <Header />

            <main className="min-h-[calc(100dvh-78px)] w-full bg-paper">
                <div className="mx-auto w-full max-w-[1280px] px-[48px] pt-[58px] pb-[48px] max-[860px]:px-[22px] max-[860px]:pt-[36px]">
                    <div className="flex items-end gap-[28px] border-b border-[#ded4c7] pb-[14px]">
                        <h1 className="m-0 text-[30px] font-semibold tracking-[-.04em]">
                            나의 에디션
                        </h1>

                        <button
                            type="button"
                            onClick={() => setTab('info')}
                            className={`relative cursor-pointer border-0 bg-transparent px-0 pb-[4px] text-[11px] ${tab === 'info'
                                ? 'text-ink'
                                : 'text-ink/40'
                                }`}
                        >
                            기본 정보

                            {tab === 'info' && (
                                <span className="absolute right-0 bottom-[-15px] left-0 h-[2px] bg-clay" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => setTab('curation')}
                            className={`relative cursor-pointer border-0 bg-transparent px-0 pb-[4px] text-[11px] ${tab === 'curation'
                                ? 'text-ink'
                                : 'text-ink/40'
                                }`}
                        >
                            큐레이션

                            {tab === 'curation' && (
                                <span className="absolute right-0 bottom-[-15px] left-0 h-[2px] bg-clay" />
                            )}
                        </button>
                    </div>

                    {tab === 'info' ? (
                        <section className="mt-[28px]">
                            <div className="grid grid-cols-[420px_minmax(0,1fr)] gap-[42px] max-[900px]:grid-cols-1">
                                <div>
                                    <div className="border border-frame bg-white p-[14px]">
                                        <div className="flex h-[390px] items-center justify-center bg-[#d4c2a6]">
                                            {edition.images?.image2d ? (
                                                <img
                                                    src={edition.images.image2d}
                                                    alt={edition.name}
                                                    className="h-[90%] w-[90%] object-contain"
                                                />
                                            ) : (
                                                <span className="text-[8px] tracking-[.12em] text-ink/35">
                                                    3D 굿즈 렌더
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleLike}
                                        className="mt-[12px] flex cursor-pointer items-center gap-[7px] border-0 bg-transparent p-0 text-[10px] text-ink/55"
                                    >
                                        <span>{liked ? '♥' : '♡'}</span>
                                        좋아요 {likes}개
                                    </button>

                                    <div className="mt-[20px] flex items-center justify-between border border-frame bg-white px-[18px] py-[18px]">
                                        <div>
                                            <p className="m-0 text-[11px] font-medium">
                                                에디션 공개
                                            </p>

                                            <p className="mt-[6px] mb-0 text-[9px] text-ink/45">
                                                이 에디션을 커뮤니티에 공개합니다.
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-[10px]">
                                            <span className="text-[8px] text-ink/40">
                                                {isPublic ? 'ON' : 'OFF'}
                                            </span>

                                            <button
                                                type="button"
                                                onClick={handleToggleRequest}
                                                className={`relative h-[23px] w-[44px] cursor-pointer rounded-full border-0 transition-colors duration-500 ${isPublic
                                                    ? 'bg-ink'
                                                    : 'bg-[#d6cec4]'
                                                    }`}
                                            >
                                                <span
                                                    className={`absolute top-[3px] size-[17px] rounded-full bg-white transition-all duration-500 ${isPublic
                                                        ? 'left-[24px]'
                                                        : 'left-[3px]'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-start justify-between gap-[20px]">
                                        <h2 className="m-0 font-brand text-[24px] font-normal">
                                            Edition No. {edition.number} ·{' '}
                                            {edition.name}
                                        </h2>

                                        <Button
                                            variant="secondary"
                                            href={`/edition/${edition.id}/certificate`}
                                            className="h-[38px] px-[15px] text-[10px]"
                                        >
                                            보증서 보기
                                        </Button>
                                    </div>

                                    <div className="mt-[24px]">
                                        <p className="m-0 text-[10px] font-medium">
                                            생성 날짜
                                        </p>

                                        <p className="mt-[5px] mb-0 text-[10px] text-ink/50">
                                            {edition.createdAt}
                                        </p>
                                    </div>

                                    <div className="mt-[22px]">
                                        <p className="m-0 text-[10px] font-medium">
                                            추억 스토리
                                        </p>

                                        <p className="mt-[8px] mb-0 text-[11.5px] leading-[1.8] text-ink/65">
                                            {edition.story}
                                        </p>
                                    </div>

                                    <div className="mt-[25px] border border-frame bg-white px-[18px] py-[16px]">
                                        <div className="flex items-center justify-between border-b border-[#eee7de] pb-[10px]">
                                            <span className="text-[10px] text-ink/45">
                                                콘셉트
                                            </span>

                                            <span className="text-[10px]">
                                                {edition.concept.name}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between border-b border-[#eee7de] py-[10px]">
                                            <span className="text-[10px] text-ink/45">
                                                원본 의류
                                            </span>

                                            <span className="text-[10px]">
                                                {edition.originalClothingType} ·{' '}
                                                {edition.material}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-[10px]">
                                            <span className="text-[10px] text-ink/45">
                                                보증서 번호
                                            </span>

                                            <span className="text-[10px]">
                                                {edition.certificate.number}
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        href="/order"
                                        className="mt-[24px] w-full"
                                    >
                                        실물 제품 구매하기
                                    </Button>

                                    <p className="mt-[14px] mb-0 text-center text-[9px] text-ink/35">
                                        제작 상담 후 4~6주 내 배송됩니다.
                                    </p>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <section className="mt-[28px]">
                            <div className="grid grid-cols-[420px_minmax(0,1fr)] gap-[42px] max-[900px]:grid-cols-1">
                                <div className="border border-frame bg-white p-[14px]">
                                    <div className="flex h-[390px] items-center justify-center bg-[#d4c2a6]">
                                        {edition.images?.image2d ? (
                                            <img
                                                src={edition.images.image2d}
                                                alt={edition.name}
                                                className="h-[90%] w-[90%] object-contain"
                                            />
                                        ) : (
                                            <span className="text-[8px] tracking-[.12em] text-ink/35">
                                                2D 굿즈 이미지
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center gap-[14px]">
                                        <p className="m-0 text-[8px] tracking-[.18em] text-clay">
                                            AI CURATION
                                        </p>

                                        <span className="h-px flex-1 bg-[#ddd2c4]" />
                                    </div>

                                    <h2 className="mt-[16px] mb-0 text-[22px] font-semibold">
                                        AI 큐레이션
                                    </h2>

                                    <p className="mt-[12px] mb-0 text-[11.5px] leading-[1.9] text-ink/60">
                                        {edition.curation.description}
                                    </p>

                                    <div className="mt-[14px] flex flex-wrap gap-[8px]">
                                        {edition.curation.keywords.map(
                                            (keyword) => (
                                                <span
                                                    key={keyword}
                                                    className="border border-[#ddd1c1] bg-white px-[11px] py-[7px] text-[9px] text-ink/60"
                                                >
                                                    {keyword}
                                                </span>
                                            ),
                                        )}
                                    </div>

                                    <h3 className="mt-[28px] mb-0 text-[12px] font-medium">
                                        어울리는 MCM 제품
                                    </h3>

                                    <div className="mt-[14px] grid grid-cols-3 gap-[14px] max-[650px]:grid-cols-1">
                                        {edition.curation.products.map(
                                            (product) => (
                                                <CurationCard
                                                    key={product.id}
                                                    product={product}
                                                />
                                            ),
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}
                </div>
            </main>

            {pendingPublicState !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-[20px]"
                    role="dialog"
                    aria-modal="true"
                >
                    <div className="w-full max-w-[390px] border border-frame bg-paper p-[26px] shadow-[0_18px_50px_rgba(24,19,15,.18)]">
                        <p className="m-0 text-[8px] tracking-[.18em] text-clay">
                            EDITION VISIBILITY
                        </p>

                        <h2 className="mt-[12px] mb-0 text-[18px] font-semibold">
                            {pendingPublicState
                                ? '에디션을 공개로 전환하시겠습니까?'
                                : '에디션을 비공개로 전환하시겠습니까?'}
                        </h2>

                        <p className="mt-[12px] mb-0 text-[10px] leading-[1.8] text-ink/50">
                            {pendingPublicState
                                ? '공개된 에디션은 커뮤니티에서 다른 사용자에게 노출됩니다.'
                                : '비공개로 변경하면 커뮤니티에서 더 이상 이 에디션이 노출되지 않습니다.'}
                        </p>

                        <div className="mt-[24px] grid grid-cols-2 gap-[10px]">
                            <Button
                                variant="secondary"
                                onClick={handleCancelVisibility}
                            >
                                취소
                            </Button>

                            <Button
                                onClick={handleConfirmVisibility}
                            >
                                변경
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}