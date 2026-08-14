import { useState } from 'react'
import { useParams } from 'react-router'
import Header from '../../components/Header'
import Button from '../../components/Button'
import CurationCard from './components/CurationCard'

const EDITION = {
    id: 1,
    name: 'Edition No. 001',
    date: '2026.08.04',
    story:
        '할머니께서 생일 선물로 사주신 원피스예요. 함께 여행 갔던 날의 추억이 가장 많이 담겨 있습니다.',
    concept: '아카이브 파우치',
    material: '원피스 · 면',
    certificate: 'MA-2026-0804-001',
    likes: 20,
    public: true,
    image: '/assets/collection/clothing-01.png',
}

const CURATION = {
    description:
        '할머니와 함께한 여행의 따뜻한 기억이 담긴 원피스입니다. 은은한 플로럴 패턴과 베이지 톤은 브랜드의 클래식한 헤리티지와 자연스럽게 어우러집니다. 소중한 추억을 오래 간직할 수 있도록 빈티지 감성을 살린 컬렉션을 큐레이션했습니다.',

    keywords: ['플로럴 패턴', '베이지 톤', '빈티지 감성'],

    products: [
        {
            id: 1,
            name: '헤리티지 토트백',
            price: '₩ 1,000,000',
            image: '/assets/curation/product-01.png',
        },
        {
            id: 2,
            name: '클래식 파우치',
            price: '₩ 1,000,000',
            image: '/assets/curation/product-02.png',
        },
        {
            id: 3,
            name: '빈티지 카드지갑',
            price: '₩ 1,000,000',
            image: '/assets/curation/product-03.png',
        },
    ],
}

export default function EditionDetailPage() {
    const { editionId } = useParams()

    const [tab, setTab] = useState('info')
    const [isPublic, setIsPublic] = useState(EDITION.public)

    const [likes, setLikes] = useState(EDITION.likes)
    const [liked, setLiked] = useState(false)

    // null이면 모달 닫힘
    // true면 공개 전환 확인
    // false면 비공개 전환 확인
    const [pendingPublicState, setPendingPublicState] =
        useState(null)

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
                    {/* 제목 + 탭 */}
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
                        /* 기본 정보 */
                        <section className="mt-[28px]">
                            <div className="grid grid-cols-[420px_minmax(0,1fr)] gap-[42px] max-[900px]:grid-cols-1">
                                {/* 왼쪽 */}
                                <div>
                                    <div className="border border-frame bg-white p-[14px]">
                                        <div className="flex h-[390px] items-center justify-center bg-[#d4c2a6]">
                                            {EDITION.image ? (
                                                <img
                                                    src={EDITION.image}
                                                    alt="에디션"
                                                    className="h-[90%] w-[90%] object-contain"
                                                />
                                            ) : (
                                                <span className="text-[8px] tracking-[.12em] text-ink/35">
                                                    3D 굿즈 렌더
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* 좋아요 */}
                                    <button
                                        type="button"
                                        onClick={handleLike}
                                        className="mt-[12px] flex cursor-pointer items-center gap-[7px] border-0 bg-transparent p-0 text-[10px] text-ink/55"
                                    >
                                        <span>
                                            {liked ? '♥' : '♡'}
                                        </span>

                                        좋아요 {likes}개
                                    </button>

                                    {/* 공개 설정 */}
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
                                                aria-label={
                                                    isPublic
                                                        ? '에디션 비공개로 변경'
                                                        : '에디션 공개로 변경'
                                                }
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

                                {/* 오른쪽 */}
                                <div>
                                    <div className="flex items-start justify-between gap-[20px]">
                                        <h2 className="m-0 font-brand text-[24px] font-normal">
                                            {EDITION.name}
                                        </h2>

                                        <Button
                                            variant="secondary"
                                            href={`/edition/${editionId}/certificate`}
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
                                            {EDITION.date}
                                        </p>
                                    </div>

                                    <div className="mt-[22px]">
                                        <p className="m-0 text-[10px] font-medium">
                                            추억 스토리
                                        </p>

                                        <p className="mt-[8px] mb-0 text-[11.5px] leading-[1.8] text-ink/65">
                                            {EDITION.story}
                                        </p>
                                    </div>

                                    <div className="mt-[25px] border border-frame bg-white px-[18px] py-[16px]">
                                        <div className="flex items-center justify-between border-b border-[#eee7de] pb-[10px]">
                                            <span className="text-[10px] text-ink/45">
                                                콘셉트
                                            </span>

                                            <span className="text-[10px]">
                                                {EDITION.concept}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between border-b border-[#eee7de] py-[10px]">
                                            <span className="text-[10px] text-ink/45">
                                                원본 의류
                                            </span>

                                            <span className="text-[10px]">
                                                {EDITION.material}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between pt-[10px]">
                                            <span className="text-[10px] text-ink/45">
                                                보증서 번호
                                            </span>

                                            <span className="text-[10px]">
                                                {EDITION.certificate}
                                            </span>
                                        </div>
                                    </div>

                                    {/* 주문 페이지 이동 */}
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
                        /* 큐레이션 */
                        <section className="mt-[28px]">
                            <div className="grid grid-cols-[420px_minmax(0,1fr)] gap-[42px] max-[900px]:grid-cols-1">
                                {/* 기본 정보 탭과 완전히 동일한 크기 */}
                                <div className="border border-frame bg-white p-[14px]">
                                    <div className="flex h-[390px] items-center justify-center bg-[#d4c2a6]">
                                        {EDITION.image ? (
                                            <img
                                                src={EDITION.image}
                                                alt="에디션"
                                                className="h-[90%] w-[90%] object-contain"
                                            />
                                        ) : (
                                            <span className="text-[8px] tracking-[.12em] text-ink/35">
                                                3D 굿즈 렌더
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
                                        {CURATION.description}
                                    </p>

                                    <div className="mt-[14px] flex flex-wrap gap-[8px]">
                                        {CURATION.keywords.map(
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
                                        {CURATION.products.map(
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

            {/* 공개 / 비공개 변경 확인 모달 */}
            {pendingPublicState !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-[20px]"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="visibility-modal-title"
                >
                    <div className="w-full max-w-[390px] border border-frame bg-paper p-[26px] shadow-[0_18px_50px_rgba(24,19,15,.18)]">
                        <p className="m-0 text-[8px] tracking-[.18em] text-clay">
                            EDITION VISIBILITY
                        </p>

                        <h2
                            id="visibility-modal-title"
                            className="mt-[12px] mb-0 text-[18px] font-semibold"
                        >
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